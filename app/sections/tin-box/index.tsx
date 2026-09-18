"use client";

import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { EXRLoader } from "three/examples/jsm/loaders/EXRLoader.js";
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader.js";
import gsap from "gsap";

const MODEL_DIR = "/models/caixa-baralho-nerdcast";
const OBJ_FILE = "caixa-baralho-nerdcast.obj";
const ENVIRONMENT_FILE = "forest.exr";
const BLENDER_POINT_LIGHT_POSITION = new THREE.Vector3(
  4.076245,
  5.903862,
  -1.005454,
);

// Texture filenames inside MODEL_DIR
const TEX_FILES = {
  bodyDiffuse: "texture_diffuse.png",
  bodyRoughness: "texture_roughness.png",
  bodyNormal: "texture_normal.png",
  lidArtwork: "caixa2-transp.png",
} as const;

// Base colors mirror the active Blender material nodes in linear color space.
const BODY_KD = new THREE.Color(0.85, 0.87, 0.92);
const LID_TOP_KD = new THREE.Color(0.626889, 0.641639, 0.678515);
const FRONT_CLEAN_KD = new THREE.Color(0.52, 0.54, 0.58);
const LID_INTERIOR_KD = new THREE.Color(0.627, 0.642, 0.679);

/**
 * TinBox section
 *
 * Mounts a Three.js scene that loads the caixa-baralho-nerdcast OBJ+MTL
 * model (lid + box) and shows it with simple idle rotation. The scene
 * is intentionally minimal so we can layer additional ThreeJS animations
 * and a PixiJS 2D overlay on top of it later.
 */
type TinBoxProps = {
  embedded?: boolean;
  autoRotate?: boolean;
  draggable?: boolean;
  interactiveLid?: boolean;
  lidBounce?: boolean;
  interactionLabel?: string;
  groundShadow?: boolean;
  loadingLabel?: string;
  modelScale?: number;
  mobileModelScale?: number;
  overscanPercent?: number;
  spinEaseDuration?: number;
  spinStartDelay?: number;
  antialias?: boolean;
  maxFPS?: number;
  pixelRatioCap?: number;
  cameraView?: "default" | "front";
  rotationX?: number;
  rotationY?: number;
  rotationZ?: number;
  lightingPreset?: "default" | "cavern";
  treasureEffect?: "none" | "radial";
  lidOpenOnly?: boolean;
  closeSignal?: number;
  onLidOpen?: () => void;
  onReady?: (firstFrame: string | null) => void;
  className?: string;
};

export default function TinBox({
  embedded = false,
  autoRotate = false,
  draggable = false,
  interactiveLid = true,
  lidBounce = false,
  interactionLabel = "Interact with the deck box",
  groundShadow = true,
  loadingLabel = "Carregando caixa…",
  modelScale = 1,
  mobileModelScale,
  overscanPercent = 0,
  spinEaseDuration = 0,
  spinStartDelay = 0,
  antialias = true,
  maxFPS = 60,
  pixelRatioCap = 2,
  cameraView = "default",
  rotationX = 0,
  rotationY = 0,
  rotationZ = 0,
  lightingPreset = "default",
  treasureEffect = "none",
  lidOpenOnly = false,
  closeSignal = 0,
  onLidOpen,
  onReady,
  className = "",
}: TinBoxProps) {
  const mountRef = useRef<HTMLDivElement>(null);
  const closeLidRef = useRef<(() => void) | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    // Guards against work that completes after the component unmounts (React strict
    // mode mounts → cleans up → mounts again in dev; long-running texture/OBJ loads
    // could otherwise mutate a torn-down renderer).
    let disposed = false;
    let assetsLoaded = false;
    const effectiveModelScale =
      mobileModelScale && window.matchMedia("(max-width: 47.999rem)").matches
        ? mobileModelScale
        : modelScale;
    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    let shouldRotate = autoRotate && !motionQuery.matches;
    const handleMotionChange = () => {
      shouldRotate = autoRotate && !motionQuery.matches;
    };
    motionQuery.addEventListener("change", handleMotionChange);

    // ---- Renderer ----
    const renderer = new THREE.WebGLRenderer({
      antialias,
      alpha: true,
      powerPreference: "high-performance",
    });
    // Cap DPR at 2. On 3x retina screens the env-map PMREM pass + lots of metallic
    // surfaces with antialias can stall the GPU on remount, which manifests as the
    // canvas freezing and clicks appearing to stop working.
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, pixelRatioCap));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.AgXToneMapping;
    renderer.toneMappingExposure = lightingPreset === "cavern" ? 0.62 : 1;
    renderer.shadowMap.enabled = groundShadow;
    renderer.shadowMap.type = THREE.PCFShadowMap;
    // Explicit CSS so the canvas always fills the absolutely-positioned mount
    // regardless of what setSize does — canvas is inline-replaced by default which
    // was making it render at its intrinsic buffer size instead of scaling with the
    // parent container on some viewports.
    renderer.domElement.style.display = "block";
    renderer.domElement.style.width = "100%";
    renderer.domElement.style.height = "100%";
    mount.appendChild(renderer.domElement);

    // ---- Scene & camera ----
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(35, 1, 0.01, 100);
    if (cameraView === "front") {
      camera.up.set(0, 1, 0);
      camera.position.set(0, 2.65, 4.8);
      camera.lookAt(0, 0, 0);
      camera.rotation.z = 0;
    } else {
      camera.position.set(
        embedded ? 3.35 : 2.5,
        embedded ? 2.8 : 1.8,
        embedded ? 4.3 : 3.2,
      );
      camera.lookAt(0, embedded ? 0 : 0.2, 0);
    }

    // ---- Environment (so metallic surfaces have something to reflect) ----
    const pmrem =
      lightingPreset === "cavern" ? null : new THREE.PMREMGenerator(renderer);
    let environmentSource: THREE.DataTexture | null = null;
    let environmentTexture: THREE.Texture | null = null;

    // ---- Lights ----
    const key = new THREE.PointLight(0xffffff, 1, 0, 2);
    key.power = lightingPreset === "cavern" ? 220 : embedded ? 550 : 1000;
    key.castShadow = groundShadow;
    key.shadow.mapSize.set(512, 512);
    key.shadow.camera.near = 0.1;
    key.shadow.camera.far = 30;
    key.shadow.bias = -0.0005;
    key.shadow.radius = 2;
    scene.add(key);

    const redReflection = new THREE.PointLight(0xff6338, 1, 0, 2);
    redReflection.power =
      lightingPreset === "cavern" ? 200 : embedded ? 850 : 0;
    scene.add(redReflection);

    const blueReflection = new THREE.PointLight(0x4388e8, 1, 0, 2);
    blueReflection.power =
      lightingPreset === "cavern" ? 100 : embedded ? 750 : 0;
    scene.add(blueReflection);

    if (lightingPreset === "cavern") {
      const coolFill = new THREE.DirectionalLight(0xa8c2d2, 0.85);
      coolFill.position.set(0, 2.4, 4);
      scene.add(coolFill);
      const fireFill = new THREE.DirectionalLight(0xff8c52, 0.14);
      fireFill.position.set(2.4, 0.8, 2.2);
      scene.add(fireFill);
    }

    const shadowPlane = groundShadow
      ? new THREE.Mesh(
          new THREE.PlaneGeometry(10, 10),
          new THREE.ShadowMaterial({ color: 0x070b18, opacity: 0.34 }),
        )
      : null;
    if (shadowPlane) {
      shadowPlane.rotation.x = -Math.PI / 2;
      shadowPlane.receiveShadow = true;
      scene.add(shadowPlane);
    }

    // Root group so we can animate box + lid together
    const root = new THREE.Group();
    root.rotation.set(
      (autoRotate ? 0.12 : 0) + rotationX,
      rotationY,
      rotationZ,
    );
    scene.add(root);

    const treasureLight = new THREE.PointLight(0xffefad, 1, 0, 2);
    treasureLight.power = 0;
    root.add(treasureLight);
    const treasureBeamGroup = new THREE.Group();
    treasureBeamGroup.scale.setScalar(0.12);
    root.add(treasureBeamGroup);
    const treasureBeamMaterials = [
      new THREE.MeshBasicMaterial({
        color: 0xffe66d,
        transparent: true,
        opacity: 0,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
        side: THREE.DoubleSide,
      }),
      new THREE.MeshBasicMaterial({
        color: 0xffffe8,
        transparent: true,
        opacity: 0,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
        side: THREE.DoubleSide,
      }),
    ];

    // ---- Texture loading ----
    const loadingManager = new THREE.LoadingManager();
    loadingManager.onLoad = () => {
      if (!disposed) assetsLoaded = true;
    };
    if (lightingPreset === "cavern") {
      scene.add(new THREE.AmbientLight(0x416176, 0.16));
    } else {
      new EXRLoader(loadingManager)
        .setPath(`${MODEL_DIR}/`)
        .load(ENVIRONMENT_FILE, (source) => {
          if (disposed) {
            source.dispose();
            return;
          }
          environmentSource = source;
          environmentTexture =
            pmrem?.fromEquirectangular(source).texture ?? null;
          scene.environment = environmentTexture;
          scene.environmentIntensity = embedded ? 0.62 : 1;
        });
    }
    const texLoader = new THREE.TextureLoader(loadingManager).setPath(
      `${MODEL_DIR}/`,
    );
    const loadTex = (file: string, srgb: boolean): THREE.Texture => {
      const t = texLoader.load(file);
      t.colorSpace = srgb ? THREE.SRGBColorSpace : THREE.NoColorSpace;
      t.flipY = true; // OBJ exporter writes UVs assuming flipped Y (default for image loaders)
      return t;
    };

    const bodyDiffuseTex = loadTex(TEX_FILES.bodyDiffuse, true);
    const bodyRoughTex = loadTex(TEX_FILES.bodyRoughness, false);
    const bodyNormalTex = loadTex(TEX_FILES.bodyNormal, false);
    const lidArtworkTex = loadTex(TEX_FILES.lidArtwork, true);

    // Clamp WebGL sampling safely; the lid shader masks UVs outside [0,1] to match Blender CLIP.
    lidArtworkTex.wrapS = THREE.ClampToEdgeWrapping;
    lidArtworkTex.wrapT = THREE.ClampToEdgeWrapping;

    // --- Build per-name PBR materials ---
    // Body sides (CaixaBaralho_PBR): mirrors the MTL Kd=0.8 + map_Ns + map_Bump entries.
    // - MTL `map_Ns` (specular exponent map) ↔ Three.js `roughnessMap`
    // - MTL `map_Bump`                       ↔ Three.js `normalMap`
    // Blender leaves its metallic texture node disconnected, so metalness remains constant.
    const bodyMat = new THREE.MeshStandardMaterial({
      color: BODY_KD,
      map: bodyDiffuseTex,
      roughnessMap: bodyRoughTex,
      normalMap: bodyNormalTex,
      metalness: lightingPreset === "cavern" ? 0.72 : 1,
      roughness: 1.0,
    });
    bodyMat.onBeforeCompile = (shader) => {
      shader.fragmentShader = shader.fragmentShader.replace(
        "#include <map_fragment>",
        `
        #ifdef USE_MAP
          vec4 sampledDiffuse = texture2D( map, vMapUv );
          float grayscale = dot(sampledDiffuse.rgb, vec3(0.2126, 0.7152, 0.0722));
          diffuseColor.rgb *= vec3(grayscale * 1.4);
          diffuseColor.a *= sampledDiffuse.a;
        #endif
        `,
      );
    };

    // Front "clean" face: uniform silver matching MTL Kd, polished.
    const frontCleanMat = new THREE.MeshStandardMaterial({
      color: FRONT_CLEAN_KD,
      metalness: lightingPreset === "cavern" ? 0.72 : 1,
      roughness: 0.55,
    });

    // Lid top mirrors Blender's cool silver base, normal map, CLIP extension, and alpha mix.
    const lidTopMat = new THREE.MeshStandardMaterial({
      color: LID_TOP_KD,
      map: lidArtworkTex,
      normalMap: bodyNormalTex,
      metalness: lightingPreset === "cavern" ? 0.78 : 1,
      roughness: 0.180392,
    });
    lidTopMat.onBeforeCompile = (shader) => {
      shader.fragmentShader = shader.fragmentShader.replace(
        "#include <map_fragment>",
        `
        #ifdef USE_MAP
          vec2 artworkUv = vMapUv;
          float inBounds =
            step(0.0, artworkUv.x) * step(artworkUv.x, 1.0) *
            step(0.0, artworkUv.y) * step(artworkUv.y, 1.0);
          vec4 sampledOverlay = texture2D(
            map,
            clamp(artworkUv, vec2(0.0), vec2(1.0))
          );
          float overlayA = sampledOverlay.a * inBounds;
          diffuseColor.rgb = mix(diffuseColor.rgb, sampledOverlay.rgb, overlayA);
        #endif
        `,
      );
    };

    // Lid interior (under-side of the lid): metallic silver (MTL Lid_Interior Kd).
    const lidInteriorMat = new THREE.MeshStandardMaterial({
      color: LID_INTERIOR_KD,
      metalness: lightingPreset === "cavern" ? 0.78 : 1,
      roughness: 0.35,
    });

    // Box interior: matte black at rest, with emissive treasure light during lid jumps.
    const boxInteriorMat = new THREE.MeshStandardMaterial({
      color: 0x000000,
      emissive: 0xffefad,
      emissiveIntensity: 0,
      metalness: 0,
      roughness: 0.92,
      side: THREE.DoubleSide,
    });
    const glowCanvas = document.createElement("canvas");
    glowCanvas.width = 256;
    glowCanvas.height = 256;
    const glowContext = glowCanvas.getContext("2d");
    if (glowContext) {
      const gradient = glowContext.createRadialGradient(
        128,
        128,
        0,
        128,
        128,
        128,
      );
      gradient.addColorStop(0, "rgba(255, 231, 139, 1)");
      gradient.addColorStop(0.24, "rgba(255, 188, 70, 0.95)");
      gradient.addColorStop(0.58, "rgba(255, 154, 42, 0.42)");
      gradient.addColorStop(1, "rgba(255, 105, 30, 0)");
      glowContext.fillStyle = gradient;
      glowContext.fillRect(0, 0, 256, 256);
    }
    const treasureGlowTexture = new THREE.CanvasTexture(glowCanvas);
    const treasureGlowMat = new THREE.MeshBasicMaterial({
      color: 0xffcf6c,
      map: treasureGlowTexture,
      transparent: true,
      opacity: 0,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      side: THREE.DoubleSide,
    });

    const matByName: Record<string, THREE.Material> = {
      CaixaBaralho_PBR: bodyMat,
      CaixaBaralho_FrontClean: frontCleanMat,
      CaixaBaralho_Top: lidTopMat,
      Lid_Interior: lidInteriorMat,
      Box_Interior: boxInteriorMat,
    };

    // ---- Model loading ----
    let lidObject: THREE.Object3D | null = null;
    let boxObject: THREE.Object3D | null = null;
    let modelLoaded = false;
    let readyNotified = false;
    // Pivot group that hinges the lid around its back edge. Once assigned, the
    // animation loop drives its rotation.x on a sine cycle to open/close the lid.
    let lidPivot: THREE.Group | null = null;
    let lidRestX = 0;
    let lidRestY = 0;

    const objLoader = new OBJLoader(loadingManager);
    objLoader.setPath(`${MODEL_DIR}/`);
    objLoader.load(OBJ_FILE, (object) => {
      // Bail if the component has unmounted while the OBJ was downloading.
      if (disposed) return;
      object.traverse((child) => {
        if ((child as THREE.Mesh).isMesh) {
          const mesh = child as THREE.Mesh;
          mesh.castShadow = true;
          mesh.receiveShadow = true;

          // OBJLoader assigns a default material per group (named after the MTL material).
          // Replace it with our PBR equivalent based on the material name.
          const replace = (mat: THREE.Material): THREE.Material =>
            matByName[mat.name] ?? mat;

          if (Array.isArray(mesh.material)) {
            mesh.material = mesh.material.map(replace);
          } else if (mesh.material) {
            mesh.material = replace(mesh.material);
          }
        }
        if (child.name === "lid") lidObject = child;
        if (child.name === "box") boxObject = child;
      });

      // Re-center the model on origin
      const bbox = new THREE.Box3().setFromObject(object);
      const center = bbox.getCenter(new THREE.Vector3());
      const size = bbox.getSize(new THREE.Vector3());
      object.position.sub(center);

      // Scale so the longest dimension is ~1.2 units (0.6x of the previous 2.0)
      const maxDim = Math.max(size.x, size.y, size.z);
      const targetSize = 1.2;
      const scale = (targetSize / maxDim) * effectiveModelScale;
      object.scale.setScalar(scale);
      key.position
        .copy(BLENDER_POINT_LIGHT_POSITION)
        .sub(center)
        .multiplyScalar(scale);
      const finalSize = targetSize * effectiveModelScale;
      redReflection.position.set(1.4, 0.8, 1.2).multiplyScalar(finalSize);
      blueReflection.position.set(-1.2, 1.1, -1).multiplyScalar(finalSize);
      for (let index = 0; index < 24; index++) {
        const angle = (index / 24) * Math.PI * 2;
        const rise = finalSize * (0.012 + (index % 3) * 0.006);
        const outward = finalSize * (0.16 + (index % 3) * 0.026);
        const width = finalSize * (0.032 + (index % 4) * 0.006);
        const directionX = Math.cos(angle);
        const directionZ = Math.sin(angle);
        const edgeX = directionX * size.x * scale * 0.4;
        const edgeZ = directionZ * size.z * scale * 0.4;
        const endX = edgeX + directionX * outward;
        const endZ = edgeZ + directionZ * outward;
        const tangentX = -directionZ * width;
        const tangentZ = directionX * width;
        const geometry = new THREE.BufferGeometry();
        geometry.setAttribute(
          "position",
          new THREE.Float32BufferAttribute(
            [
              edgeX,
              0,
              edgeZ,
              endX + tangentX,
              rise,
              endZ + tangentZ,
              endX - tangentX,
              rise,
              endZ - tangentZ,
            ],
            3,
          ),
        );
        const beam = new THREE.Mesh(
          geometry,
          treasureBeamMaterials[index % treasureBeamMaterials.length],
        );
        treasureBeamGroup.add(beam);
      }

      root.add(object);
      const treasureGlow = new THREE.Mesh(
        new THREE.PlaneGeometry(size.x * scale * 0.78, size.z * scale * 0.76),
        treasureGlowMat,
      );
      treasureGlow.rotation.x = -Math.PI / 2;
      treasureGlow.position.y = size.y * scale * 0.17 + 0.012;
      root.add(treasureGlow);
      root.updateMatrixWorld(true);
      const modelBounds = new THREE.Box3().setFromObject(root);
      const glowPosition = modelBounds.getCenter(new THREE.Vector3());
      glowPosition.y =
        modelBounds.min.y + (modelBounds.max.y - modelBounds.min.y) * 0.62;
      const localGlowPosition = root.worldToLocal(glowPosition);
      treasureLight.position.copy(localGlowPosition);
      treasureBeamGroup.position.copy(localGlowPosition);
      if (shadowPlane) {
        shadowPlane.position.y = modelBounds.min.y - 0.08;
      }

      // --- Reparent the lid under a hinge pivot ---
      // The lid currently sits as a direct child of `object`. To make it open
      // like a chest we wrap it in a group whose origin is on the lid's back
      // edge, then animate that group's rotation.x.
      if (lidObject && boxObject) {
        // Bring world matrices up to date so getWorldPosition / Box3 are correct.
        object.updateMatrixWorld(true);

        const lidWorldBbox = new THREE.Box3().setFromObject(lidObject);
        // Hinge axis: along X (long side of the tin), positioned at the lid's
        // back edge (min Z) and at its bottom Y (where lid meets box).
        const hingeWorld = new THREE.Vector3(
          (lidWorldBbox.min.x + lidWorldBbox.max.x) / 2,
          lidWorldBbox.min.y,
          lidWorldBbox.min.z,
        );
        // Express that hinge in `object`'s local frame so we can drop the pivot
        // group there as a sibling of the lid.
        const hingeLocal = object.worldToLocal(hingeWorld.clone());

        lidPivot = new THREE.Group();
        lidPivot.position.copy(hingeLocal);
        lidRestX = lidPivot.position.x;
        lidRestY = lidPivot.position.y;
        object.add(lidPivot);

        // Reparent the lid: its mesh data must stay where it visually is, so we
        // offset its local position by -hingeLocal to compensate for the pivot's
        // new origin.
        object.remove(lidObject);
        lidObject.position.set(-hingeLocal.x, -hingeLocal.y, -hingeLocal.z);
        lidPivot.add(lidObject);
      }

      if (!disposed) modelLoaded = true;
    });

    // ---- Resize handling ----
    const resize = () => {
      const w = mount.clientWidth;
      const h = mount.clientHeight;
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(mount);
    let isInViewport = true;
    const visibilityObserver = new IntersectionObserver(([entry]) => {
      isInViewport = entry.isIntersecting;
    });
    visibilityObserver.observe(mount);

    // ---- Pointer interactions ----
    const MAX_OPEN_ANGLE = Math.PI / 2.6;
    const OPEN_DURATION = motionQuery.matches ? 0 : 0.7;
    const interactionEnabled = interactiveLid || draggable;
    let isOpen = false;
    let lidBounceDirection = 1;
    let dragActive = false;
    let dragPointerId = -1;
    let dragStartX = 0;
    let dragStartY = 0;
    let dragLastX = 0;
    let dragLastTime = 0;
    let dragVelocity = 0;
    let inertiaVelocity = 0;

    const raycaster = new THREE.Raycaster();
    const ndc = new THREE.Vector2();

    const hitsTin = (clientX: number, clientY: number): boolean => {
      const rect = renderer.domElement.getBoundingClientRect();
      ndc.x = ((clientX - rect.left) / rect.width) * 2 - 1;
      ndc.y = -((clientY - rect.top) / rect.height) * 2 + 1;
      raycaster.setFromCamera(ndc, camera);
      return raycaster.intersectObject(root, true).length > 0;
    };

    const activateLid = () => {
      const pivot = lidPivot;
      if (!pivot || !interactiveLid) return;

      gsap.killTweensOf([
        pivot.position,
        pivot.rotation,
        boxInteriorMat,
        treasureGlowMat,
        treasureBeamGroup.scale,
        treasureBeamGroup.rotation,
        ...treasureBeamMaterials,
        treasureLight,
      ]);
      if (lidBounce) {
        const direction = lidBounceDirection;
        lidBounceDirection *= -1;
        treasureLight.power = 0;
        boxInteriorMat.emissiveIntensity = 0;
        treasureGlowMat.opacity = 0;
        treasureBeamGroup.scale.setScalar(0.12);
        treasureBeamGroup.rotation.y = 0;
        treasureBeamMaterials.forEach((material) => {
          material.opacity = 0;
        });
        gsap
          .timeline()
          .to(
            pivot.position,
            {
              x: lidRestX + direction * 0.065,
              y: lidRestY + 0.04,
              duration: 0.12,
              ease: "power3.out",
            },
            0,
          )
          .to(
            pivot.rotation,
            {
              x: -0.16,
              z: direction * 0.07,
              duration: 0.12,
              ease: "power3.out",
            },
            0,
          )
          .to(
            boxInteriorMat,
            { emissiveIntensity: 15, duration: 0.15, ease: "power3.out" },
            0.02,
          )
          .to(
            treasureGlowMat,
            { opacity: 1, duration: 0.15, ease: "power3.out" },
            0.02,
          )
          .to(
            treasureLight,
            { power: 2200, duration: 0.15, ease: "power3.out" },
            0.02,
          )
          .to(
            treasureBeamGroup.scale,
            { x: 1, y: 1, z: 1, duration: 0.16, ease: "back.out(1.8)" },
            0.02,
          )
          .to(
            treasureBeamGroup.rotation,
            { y: direction * 0.18, duration: 0.4, ease: "power2.out" },
            0,
          )
          .to(
            treasureBeamMaterials,
            { opacity: 0.82, duration: 0.12, ease: "power3.out" },
            0.02,
          )
          .to(
            pivot.position,
            {
              x: lidRestX,
              y: lidRestY,
              duration: 0.26,
              ease: "bounce.out",
            },
            0.2,
          )
          .to(
            pivot.rotation,
            { x: 0, z: 0, duration: 0.26, ease: "back.out(2)" },
            0.2,
          )
          .to(
            boxInteriorMat,
            { emissiveIntensity: 0, duration: 0.28, ease: "power2.out" },
            0.16,
          )
          .to(
            treasureGlowMat,
            { opacity: 0, duration: 0.28, ease: "power2.out" },
            0.16,
          )
          .to(
            treasureLight,
            { power: 0, duration: 0.28, ease: "power2.out" },
            0.16,
          )
          .to(
            treasureBeamMaterials,
            { opacity: 0, duration: 0.28, ease: "power2.out" },
            0.15,
          )
          .to(
            treasureBeamGroup.scale,
            { x: 0.12, y: 0.12, z: 0.12, duration: 0.3, ease: "power2.in" },
            0.16,
          );
        return;
      }

      if (lidOpenOnly && isOpen) {
        onLidOpen?.();
        return;
      }

      const opening = lidOpenOnly || !isOpen;
      isOpen = opening;
      const showTreasure = opening && treasureEffect === "radial";
      gsap
        .timeline({
          onComplete: () => {
            if (opening) onLidOpen?.();
          },
        })
        .to(
          pivot.rotation,
          {
            x: opening ? -MAX_OPEN_ANGLE : 0,
            duration: OPEN_DURATION,
            ease: "power2.inOut",
            overwrite: true,
          },
          0,
        )
        .to(
          boxInteriorMat,
          {
            emissiveIntensity: showTreasure ? 5 : 0,
            duration: OPEN_DURATION * 0.72,
            ease: "power2.out",
          },
          OPEN_DURATION * 0.28,
        )
        .to(
          treasureGlowMat,
          {
            opacity: showTreasure ? 0.9 : 0,
            duration: OPEN_DURATION * 0.72,
            ease: "power2.out",
          },
          OPEN_DURATION * 0.28,
        )
        .to(
          treasureLight,
          {
            power: showTreasure ? 500 : 0,
            duration: OPEN_DURATION * 0.72,
            ease: "power2.out",
          },
          OPEN_DURATION * 0.28,
        )
        .to(
          treasureBeamGroup.scale,
          {
            x: showTreasure ? 1 : 0.12,
            y: showTreasure ? 1 : 0.12,
            z: showTreasure ? 1 : 0.12,
            duration: OPEN_DURATION * 0.72,
            ease: "power2.out",
          },
          OPEN_DURATION * 0.28,
        )
        .to(
          treasureBeamMaterials,
          {
            opacity: showTreasure ? 0.72 : 0,
            duration: OPEN_DURATION * 0.72,
            ease: "power2.out",
          },
          OPEN_DURATION * 0.28,
        );
    };

    const closeLid = () => {
      const pivot = lidPivot;
      if (!pivot || !isOpen) return;
      isOpen = false;
      gsap.killTweensOf([
        pivot.rotation,
        boxInteriorMat,
        treasureGlowMat,
        treasureBeamGroup.scale,
        ...treasureBeamMaterials,
        treasureLight,
      ]);
      gsap
        .timeline()
        .to(pivot.rotation, {
          x: 0,
          duration: OPEN_DURATION,
          ease: "power2.inOut",
          overwrite: true,
        })
        .to(
          boxInteriorMat,
          {
            emissiveIntensity: 0,
            duration: OPEN_DURATION * 0.72,
            ease: "power2.out",
          },
          0,
        )
        .to(
          treasureGlowMat,
          {
            opacity: 0,
            duration: OPEN_DURATION * 0.72,
            ease: "power2.out",
          },
          0,
        )
        .to(
          treasureLight,
          {
            power: 0,
            duration: OPEN_DURATION * 0.72,
            ease: "power2.out",
          },
          0,
        )
        .to(
          treasureBeamGroup.scale,
          {
            x: 0.12,
            y: 0.12,
            z: 0.12,
            duration: OPEN_DURATION * 0.72,
            ease: "power2.out",
          },
          0,
        )
        .to(
          treasureBeamMaterials,
          {
            opacity: 0,
            duration: OPEN_DURATION * 0.72,
            ease: "power2.out",
          },
          0,
        );
    };
    closeLidRef.current = closeLid;

    const onPointerDown = (event: PointerEvent) => {
      if (!hitsTin(event.clientX, event.clientY)) return;
      if (!draggable) {
        activateLid();
        return;
      }

      dragActive = true;
      dragPointerId = event.pointerId;
      dragStartX = event.clientX;
      dragStartY = event.clientY;
      dragLastX = event.clientX;
      dragLastTime = performance.now();
      dragVelocity = 0;
      inertiaVelocity = 0;
      renderer.domElement.setPointerCapture(event.pointerId);
      renderer.domElement.style.cursor = "grabbing";
    };

    let hoverScheduled = false;
    let lastHoverX = 0;
    let lastHoverY = 0;
    const onPointerMove = (event: PointerEvent) => {
      if (dragActive && event.pointerId === dragPointerId) {
        const now = performance.now();
        const deltaX = event.clientX - dragLastX;
        const elapsed = Math.max(now - dragLastTime, 8) / 1000;
        root.rotation.y += deltaX * 0.008;
        dragVelocity = (deltaX * 0.008) / elapsed;
        dragLastX = event.clientX;
        dragLastTime = now;
        if (
          Math.abs(event.clientX - dragStartX) >
          Math.abs(event.clientY - dragStartY)
        )
          event.preventDefault();
        return;
      }

      lastHoverX = event.clientX;
      lastHoverY = event.clientY;
      if (hoverScheduled) return;
      hoverScheduled = true;
      requestAnimationFrame(() => {
        hoverScheduled = false;
        if (disposed) return;
        renderer.domElement.style.cursor = hitsTin(lastHoverX, lastHoverY)
          ? draggable
            ? "grab"
            : "pointer"
          : "default";
      });
    };

    const finishDrag = (event: PointerEvent, cancelled = false) => {
      if (!dragActive || event.pointerId !== dragPointerId) return;
      const movement = Math.hypot(
        event.clientX - dragStartX,
        event.clientY - dragStartY,
      );
      dragActive = false;
      if (renderer.domElement.hasPointerCapture(event.pointerId))
        renderer.domElement.releasePointerCapture(event.pointerId);
      renderer.domElement.style.cursor = "grab";

      if (!cancelled && movement < 7) activateLid();
      else if (!cancelled)
        inertiaVelocity = Math.max(-2.6, Math.min(2.6, dragVelocity));
    };
    const onPointerUp = (event: PointerEvent) => finishDrag(event);
    const onPointerCancel = (event: PointerEvent) => finishDrag(event, true);
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Enter" && event.key !== " ") return;
      event.preventDefault();
      activateLid();
    };

    if (interactionEnabled) {
      renderer.domElement.tabIndex = 0;
      renderer.domElement.setAttribute("role", "button");
      renderer.domElement.setAttribute("aria-label", interactionLabel);
      renderer.domElement.style.touchAction = draggable ? "pan-y" : "auto";
      renderer.domElement.style.cursor = draggable ? "grab" : "pointer";
      renderer.domElement.addEventListener("pointerdown", onPointerDown);
      renderer.domElement.addEventListener("pointermove", onPointerMove);
      renderer.domElement.addEventListener("pointerup", onPointerUp);
      renderer.domElement.addEventListener("pointercancel", onPointerCancel);
      renderer.domElement.addEventListener("keydown", onKeyDown);
    }

    // ---- Animation loop (renders only; lid tween is owned by GSAP) ----
    let rafId = 0;
    let previousFrameTime = performance.now();
    let spinStartsAt = Number.POSITIVE_INFINITY;
    const minimumFrameTime = 1000 / maxFPS;
    const animate = (frameTime: number) => {
      void boxObject;
      void lidObject;
      if (!isInViewport || document.visibilityState !== "visible") {
        previousFrameTime = frameTime;
        rafId = requestAnimationFrame(animate);
        return;
      }
      if (frameTime - previousFrameTime < minimumFrameTime - 1) {
        rafId = requestAnimationFrame(animate);
        return;
      }
      const frameElapsed = Math.min(
        Math.max((frameTime - previousFrameTime) / 1000, 0),
        0.05,
      );
      if (shouldRotate && frameTime >= spinStartsAt) {
        const elapsed =
          (frameTime - Math.max(previousFrameTime, spinStartsAt)) / 1000;
        const easeProgress = Math.min(
          1,
          (frameTime - spinStartsAt) / Math.max(spinEaseDuration * 1000, 1),
        );
        const easedSpeed = 1 - Math.pow(1 - easeProgress, 3);
        root.rotation.y =
          (root.rotation.y + elapsed * 0.14 * easedSpeed) % (Math.PI * 2);
      }
      if (!dragActive && Math.abs(inertiaVelocity) > 0.001) {
        root.rotation.y += inertiaVelocity * frameElapsed;
        inertiaVelocity *= Math.exp(-2.4 * frameElapsed);
      }
      previousFrameTime = frameTime;
      renderer.render(scene, camera);
      if (modelLoaded && assetsLoaded && !readyNotified && !disposed) {
        readyNotified = true;
        spinStartsAt = frameTime + spinStartDelay * 1000;
        let firstFrame: string | null = null;
        try {
          firstFrame = renderer.domElement.toDataURL("image/webp", 0.68);
        } catch {
          firstFrame = null;
        }
        setLoaded(true);
        onReady?.(firstFrame);
      }
      rafId = requestAnimationFrame(animate);
    };
    rafId = requestAnimationFrame(animate);

    // ---- Cleanup ----
    return () => {
      disposed = true;
      closeLidRef.current = null;
      motionQuery.removeEventListener("change", handleMotionChange);
      cancelAnimationFrame(rafId);
      ro.disconnect();
      visibilityObserver.disconnect();
      renderer.domElement.removeEventListener("pointerdown", onPointerDown);
      renderer.domElement.removeEventListener("pointermove", onPointerMove);
      renderer.domElement.removeEventListener("pointerup", onPointerUp);
      renderer.domElement.removeEventListener("pointercancel", onPointerCancel);
      renderer.domElement.removeEventListener("keydown", onKeyDown);
      if (lidPivot) gsap.killTweensOf([lidPivot.position, lidPivot.rotation]);
      gsap.killTweensOf([
        boxInteriorMat,
        treasureGlowMat,
        treasureBeamGroup.scale,
        treasureBeamGroup.rotation,
        ...treasureBeamMaterials,
        treasureLight,
      ]);
      pmrem?.dispose();
      environmentTexture?.dispose();
      environmentSource?.dispose();
      renderer.dispose();
      if (renderer.domElement.parentNode) {
        renderer.domElement.parentNode.removeChild(renderer.domElement);
      }
      [
        bodyDiffuseTex,
        bodyRoughTex,
        bodyNormalTex,
        lidArtworkTex,
        treasureGlowTexture,
      ].forEach((t) => t.dispose());
      scene.traverse((obj) => {
        const mesh = obj as THREE.Mesh;
        if (mesh.geometry) mesh.geometry.dispose();
        if (mesh.material) {
          const mats = Array.isArray(mesh.material)
            ? mesh.material
            : [mesh.material];
          mats.forEach((m) => m.dispose());
        }
      });
    };
  }, [
    antialias,
    autoRotate,
    cameraView,
    draggable,
    embedded,
    groundShadow,
    interactionLabel,
    interactiveLid,
    lidBounce,
    lidOpenOnly,
    lightingPreset,
    maxFPS,
    mobileModelScale,
    modelScale,
    onLidOpen,
    onReady,
    pixelRatioCap,
    rotationX,
    rotationY,
    rotationZ,
    spinEaseDuration,
    spinStartDelay,
    treasureEffect,
  ]);

  useEffect(() => {
    if (closeSignal > 0) closeLidRef.current?.();
  }, [closeSignal]);

  return (
    <section
      id={embedded ? undefined : "tinBox"}
      className={
        embedded
          ? `relative h-full w-full ${className}`
          : `segment relative flex h-screen w-full items-center justify-center bg-neutral-900 ${className}`
      }
    >
      <div
        ref={mountRef}
        className="absolute inset-0"
        style={
          embedded && overscanPercent > 0
            ? { inset: `-${overscanPercent}%` }
            : undefined
        }
      />
      {!loaded && loadingLabel ? (
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center text-white/60">
          {loadingLabel}
        </div>
      ) : null}
    </section>
  );
}
