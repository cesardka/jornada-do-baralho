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
  interior: "caixa-baralho-nerdcast-textura-interna.png",
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
  interactiveLid?: boolean;
  loadingLabel?: string;
  modelScale?: number;
  overscanPercent?: number;
  spinEaseDuration?: number;
  spinStartDelay?: number;
  onReady?: (firstFrame: string | null) => void;
  className?: string;
};

export default function TinBox({
  embedded = false,
  autoRotate = false,
  interactiveLid = true,
  loadingLabel = "Carregando caixa…",
  modelScale = 1,
  overscanPercent = 0,
  spinEaseDuration = 0,
  spinStartDelay = 0,
  onReady,
  className = "",
}: TinBoxProps) {
  const mountRef = useRef<HTMLDivElement>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    // Guards against work that completes after the component unmounts (React strict
    // mode mounts → cleans up → mounts again in dev; long-running texture/OBJ loads
    // could otherwise mutate a torn-down renderer).
    let disposed = false;
    let assetsLoaded = false;
    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    let shouldRotate = autoRotate && !motionQuery.matches;
    const handleMotionChange = () => {
      shouldRotate = autoRotate && !motionQuery.matches;
    };
    motionQuery.addEventListener("change", handleMotionChange);

    // ---- Renderer ----
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: "high-performance",
    });
    // Cap DPR at 2. On 3x retina screens the env-map PMREM pass + lots of metallic
    // surfaces with antialias can stall the GPU on remount, which manifests as the
    // canvas freezing and clicks appearing to stop working.
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.AgXToneMapping;
    renderer.toneMappingExposure = 1;
    renderer.shadowMap.enabled = true;
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
    camera.position.set(
      embedded ? 3.35 : 2.5,
      embedded ? 2.8 : 1.8,
      embedded ? 4.3 : 3.2,
    );
    camera.lookAt(0, embedded ? 0 : 0.2, 0);

    // ---- Environment (so metallic surfaces have something to reflect) ----
    const pmrem = new THREE.PMREMGenerator(renderer);
    let environmentSource: THREE.DataTexture | null = null;
    let environmentTexture: THREE.Texture | null = null;

    // ---- Lights ----
    const key = new THREE.PointLight(0xffffff, 1, 0, 2);
    key.power = 1000;
    key.castShadow = true;
    key.shadow.mapSize.set(512, 512);
    key.shadow.camera.near = 0.1;
    key.shadow.camera.far = 30;
    key.shadow.bias = -0.0005;
    key.shadow.radius = 2;
    scene.add(key);

    const shadowPlane = new THREE.Mesh(
      new THREE.PlaneGeometry(10, 10),
      new THREE.ShadowMaterial({ color: 0x06261a, opacity: 0.34 }),
    );
    shadowPlane.rotation.x = -Math.PI / 2;
    shadowPlane.receiveShadow = true;
    scene.add(shadowPlane);

    // Root group so we can animate box + lid together
    const root = new THREE.Group();
    root.rotation.x = autoRotate ? 0.12 : 0;
    scene.add(root);

    // ---- Texture loading ----
    const loadingManager = new THREE.LoadingManager();
    loadingManager.onLoad = () => {
      if (!disposed) assetsLoaded = true;
    };
    new EXRLoader(loadingManager)
      .setPath(`${MODEL_DIR}/`)
      .load(ENVIRONMENT_FILE, (source) => {
        if (disposed) {
          source.dispose();
          return;
        }
        environmentSource = source;
        environmentTexture = pmrem.fromEquirectangular(source).texture;
        scene.environment = environmentTexture;
        scene.environmentIntensity = 1;
      });
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
    const interiorTex = loadTex(TEX_FILES.interior, true);

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
      metalness: 1.0,
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
      metalness: 1.0,
      roughness: 0.55,
    });

    // Lid top mirrors Blender's cool silver base, normal map, CLIP extension, and alpha mix.
    const lidTopMat = new THREE.MeshStandardMaterial({
      color: LID_TOP_KD,
      map: lidArtworkTex,
      normalMap: bodyNormalTex,
      metalness: 1.0,
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
      metalness: 1.0,
      roughness: 0.35,
    });

    // Box interior (foam insert): the reference photo, matte non-metallic.
    const boxInteriorMat = new THREE.MeshStandardMaterial({
      map: interiorTex,
      metalness: 0.0,
      roughness: 0.95,
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
      const scale = (targetSize / maxDim) * modelScale;
      object.scale.setScalar(scale);
      key.position
        .copy(BLENDER_POINT_LIGHT_POSITION)
        .sub(center)
        .multiplyScalar(scale);

      root.add(object);
      root.updateMatrixWorld(true);
      shadowPlane.position.y =
        new THREE.Box3().setFromObject(root).min.y - 0.08;

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

    // ---- Click-to-toggle lid (GSAP-driven) ----
    // Lid closed = rotation.x = 0, fully open = rotation.x = -MAX_OPEN_ANGLE.
    // (Hinge sits at the back edge; lifting the front requires a negative X rotation.)
    // `overwrite: true` guarantees a click mid-animation immediately reverses direction
    // instead of stacking tweens, so the lid can never get into an in-between deadlock.
    const MAX_OPEN_ANGLE = Math.PI / 2.6; // ~69°
    const OPEN_DURATION = 0.7; // seconds
    let isOpen = false;

    const raycaster = new THREE.Raycaster();
    const ndc = new THREE.Vector2();

    const hitsTin = (clientX: number, clientY: number): boolean => {
      const rect = renderer.domElement.getBoundingClientRect();
      ndc.x = ((clientX - rect.left) / rect.width) * 2 - 1;
      ndc.y = -((clientY - rect.top) / rect.height) * 2 + 1;
      raycaster.setFromCamera(ndc, camera);
      return raycaster.intersectObject(root, true).length > 0;
    };

    const onPointerDown = (event: PointerEvent) => {
      if (!lidPivot) return;
      if (!hitsTin(event.clientX, event.clientY)) return;

      isOpen = !isOpen;
      gsap.to(lidPivot.rotation, {
        x: isOpen ? -MAX_OPEN_ANGLE : 0,
        duration: OPEN_DURATION,
        ease: "power2.inOut",
        overwrite: true,
      });
    };
    if (interactiveLid) {
      renderer.domElement.addEventListener("pointerdown", onPointerDown);
    }

    // Throttle the hover raycast to the next animation frame so rapid mouse
    // movements don't trigger 100s of raycasts per second.
    let hoverScheduled = false;
    let lastHoverX = 0;
    let lastHoverY = 0;
    const onPointerMove = (event: PointerEvent) => {
      lastHoverX = event.clientX;
      lastHoverY = event.clientY;
      if (hoverScheduled) return;
      hoverScheduled = true;
      requestAnimationFrame(() => {
        hoverScheduled = false;
        if (disposed) return;
        renderer.domElement.style.cursor = hitsTin(lastHoverX, lastHoverY)
          ? "pointer"
          : "default";
      });
    };
    if (interactiveLid) {
      renderer.domElement.addEventListener("pointermove", onPointerMove);
    }

    // ---- Animation loop (renders only; lid tween is owned by GSAP) ----
    let rafId = 0;
    let previousFrameTime = performance.now();
    let spinStartsAt = Number.POSITIVE_INFINITY;
    const animate = (frameTime: number) => {
      void boxObject;
      void lidObject;
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
      motionQuery.removeEventListener("change", handleMotionChange);
      cancelAnimationFrame(rafId);
      ro.disconnect();
      renderer.domElement.removeEventListener("pointerdown", onPointerDown);
      renderer.domElement.removeEventListener("pointermove", onPointerMove);
      if (lidPivot) gsap.killTweensOf(lidPivot.rotation);
      pmrem.dispose();
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
        interiorTex,
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
    autoRotate,
    embedded,
    interactiveLid,
    modelScale,
    onReady,
    spinEaseDuration,
    spinStartDelay,
  ]);

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
