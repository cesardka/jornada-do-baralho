"use client";

import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader.js";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";
import gsap from "gsap";

const MODEL_DIR = "/models/caixa-baralho-nerdcast";
const OBJ_FILE = "caixa-baralho-nerdcast.obj";

// Texture filenames inside MODEL_DIR
const TEX_FILES = {
  bodyRoughness: "texture_roughness.png",
  bodyNormal: "texture_normal.png",
  lidArtwork: "caixa2-transp.png",
  interior: "caixa-baralho-nerdcast-textura-interna.png",
} as const;

// Per-material base colors derived from the MTL Kd entries, then tinted slightly warm
// (a touch more red/green than blue) so the polished tin reads as champagne-silver
// rather than cold chrome.
const BODY_KD = new THREE.Color(0.78, 0.74, 0.68);
const LID_TOP_KD = new THREE.Color(0.78, 0.74, 0.68);
const FRONT_CLEAN_KD = new THREE.Color(0.55, 0.52, 0.48);
const LID_INTERIOR_KD = new THREE.Color(0.65, 0.62, 0.57);

/**
 * TinBox section
 *
 * Mounts a Three.js scene that loads the caixa-baralho-nerdcast OBJ+MTL
 * model (lid + box) and shows it with simple idle rotation. The scene
 * is intentionally minimal so we can layer additional ThreeJS animations
 * and a PixiJS 2D overlay on top of it later.
 */
export default function TinBox() {
  const mountRef = useRef<HTMLDivElement>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    // Guards against work that completes after the component unmounts (React strict
    // mode mounts → cleans up → mounts again in dev; long-running texture/OBJ loads
    // could otherwise mutate a torn-down renderer).
    let disposed = false;

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
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 0.9;
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
    camera.position.set(2.5, 1.8, 3.2);
    camera.lookAt(0, 0.2, 0);

    // ---- Environment (so metallic surfaces have something to reflect) ----
    // Without an env map, metals appear nearly black because they only reflect.
    // RoomEnvironment gives a generic studio-cube with bright panels & dark walls,
    // which yields recognizable metal highlights/streaks on a curved surface.
    const pmrem = new THREE.PMREMGenerator(renderer);
    const envTex = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
    scene.environment = envTex;
    scene.environmentIntensity = 0.85;

    // ---- Lights ----
    // Warm hemisphere (sunset-ish sky / amber ground) gives the silver a warm cast.
    const hemi = new THREE.HemisphereLight(0xffe9c6, 0x2a1810, 0.35);
    scene.add(hemi);

    // Warm key light — main highlight streak across the tin.
    const key = new THREE.DirectionalLight(0xffd9a0, 0.7);
    key.position.set(3, 4, 2);
    scene.add(key);

    // Warm low-intensity fill to avoid a cold blue shadow side.
    const fill = new THREE.DirectionalLight(0xffcf99, 0.2);
    fill.position.set(-3, 2, -1);
    scene.add(fill);

    // Amber rim from behind for separation.
    const rim = new THREE.DirectionalLight(0xffb56b, 0.3);
    rim.position.set(0, 2, -4);
    scene.add(rim);

    // Root group so we can animate box + lid together
    const root = new THREE.Group();
    scene.add(root);

    // ---- Texture loading ----
    const texLoader = new THREE.TextureLoader().setPath(`${MODEL_DIR}/`);
    const loadTex = (file: string, srgb: boolean): THREE.Texture => {
      const t = texLoader.load(file);
      t.colorSpace = srgb ? THREE.SRGBColorSpace : THREE.NoColorSpace;
      t.flipY = true; // OBJ exporter writes UVs assuming flipped Y (default for image loaders)
      return t;
    };

    const bodyRoughTex = loadTex(TEX_FILES.bodyRoughness, false);
    const bodyNormalTex = loadTex(TEX_FILES.bodyNormal, false);
    const lidArtworkTex = loadTex(TEX_FILES.lidArtwork, true);
    const interiorTex = loadTex(TEX_FILES.interior, true);

    // Clamp the artwork to its transparent border so UVs slightly past [0,1]
    // (the lid's bevel faces, due to Blender's 70% planar UV scale) sample the
    // transparent edge of the PNG rather than wrapping the image back over the bevel.
    lidArtworkTex.wrapS = THREE.ClampToEdgeWrapping;
    lidArtworkTex.wrapT = THREE.ClampToEdgeWrapping;

    // --- Build per-name PBR materials ---
    // Body sides (CaixaBaralho_PBR): mirrors the MTL Kd=0.8 + map_Ns + map_Bump entries.
    // - MTL `map_Ns` (specular exponent map) ↔ Three.js `roughnessMap`
    // - MTL `map_Bump`                       ↔ Three.js `normalMap`
    // We intentionally skip `metalnessMap` and use a constant metalness=1.0; the metallic
    // texture marks worn (non-metallic) patches which kill the polished tin look.
    // The base `roughness` multiplier is lowered from 1.0 → 0.45 because the raw map values
    // average too high otherwise — the surface ends up looking like blurred fuzz.
    const bodyMat = new THREE.MeshStandardMaterial({
      color: BODY_KD,
      roughnessMap: bodyRoughTex,
      normalMap: bodyNormalTex,
      metalness: 1.0,
      roughness: 0.45,
    });

    // Front "clean" face: uniform silver matching MTL Kd, polished.
    const frontCleanMat = new THREE.MeshStandardMaterial({
      color: FRONT_CLEAN_KD,
      metalness: 1.0,
      roughness: 0.35,
    });

    // Lid top: silver base (MTL Kd=0.8) with the transparent Nerdcast artwork composited via
    // its own alpha. The Blender UV is a planar projection from above, which smears along
    // the lid's rounded bevels. We mask the overlay by the surface's local-up normal so
    // only the truly flat top portion shows the artwork; bevel/corner faces stay plain silver.
    const lidTopMat = new THREE.MeshStandardMaterial({
      color: LID_TOP_KD,
      map: lidArtworkTex,
      metalness: 1.0,
      roughness: 0.18,
    });
    lidTopMat.onBeforeCompile = (shader) => {
      // Add a varying carrying the object-space normal so we can test "is this face
      // pointing up in the model's local frame?" regardless of how root is rotated.
      shader.vertexShader = shader.vertexShader
        .replace(
          "#include <common>",
          "#include <common>\nvarying vec3 vObjectNormal;",
        )
        .replace(
          "#include <beginnormal_vertex>",
          "#include <beginnormal_vertex>\nvObjectNormal = objectNormal;",
        );

      shader.fragmentShader = shader.fragmentShader
        .replace(
          "#include <common>",
          "#include <common>\nvarying vec3 vObjectNormal;",
        )
        .replace(
          "#include <map_fragment>",
          `
          #ifdef USE_MAP
            vec4 sampledOverlay = texture2D( map, vMapUv );
            // Mask: only faces nearly parallel to the lid's local +Y get the artwork.
            // Tightened threshold (0.97..0.999) so even the gentle bevel curving away
            // from the top stays as plain silver — kills the smear into the rounded edge.
            float topness = smoothstep(0.97, 0.999, normalize(vObjectNormal).y);
            float overlayA = sampledOverlay.a * topness;
            diffuseColor.rgb = mix( diffuseColor.rgb, sampledOverlay.rgb, overlayA );
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
    // Pivot group that hinges the lid around its back edge. Once assigned, the
    // animation loop drives its rotation.x on a sine cycle to open/close the lid.
    let lidPivot: THREE.Group | null = null;

    const objLoader = new OBJLoader();
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
      const scale = targetSize / maxDim;
      object.scale.setScalar(scale);

      root.add(object);

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

      if (!disposed) setLoaded(true);
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
    renderer.domElement.addEventListener("pointerdown", onPointerDown);

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
    renderer.domElement.addEventListener("pointermove", onPointerMove);

    // ---- Animation loop (renders only; lid tween is owned by GSAP) ----
    let rafId = 0;
    const animate = () => {
      void boxObject;
      void lidObject;
      renderer.render(scene, camera);
      rafId = requestAnimationFrame(animate);
    };
    animate();

    // ---- Cleanup ----
    return () => {
      disposed = true;
      cancelAnimationFrame(rafId);
      ro.disconnect();
      renderer.domElement.removeEventListener("pointerdown", onPointerDown);
      renderer.domElement.removeEventListener("pointermove", onPointerMove);
      if (lidPivot) gsap.killTweensOf(lidPivot.rotation);
      pmrem.dispose();
      envTex.dispose();
      renderer.dispose();
      if (renderer.domElement.parentNode) {
        renderer.domElement.parentNode.removeChild(renderer.domElement);
      }
      [bodyRoughTex, bodyNormalTex, lidArtworkTex, interiorTex].forEach((t) =>
        t.dispose(),
      );
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
  }, []);

  return (
    <section
      id="tinBox"
      className="segment relative flex h-screen w-full items-center justify-center bg-neutral-900"
    >
      <div ref={mountRef} className="absolute inset-0" />
      {!loaded && (
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center text-white/60">
          Carregando caixa…
        </div>
      )}
    </section>
  );
}
