"use client";

import { useEffect, useRef, useState } from "react";
import type { Ticker } from "pixi.js";

interface GalacticBackgroundProps {
  /** Overall speed of the moving colours. Default 1. */
  speed?: number;
  /** Peak number of blinking stars on screen. Default 120. */
  starCount?: number;
  /** Radial glow intensity at the center (0–1). Default 0.6. */
  glowStrength?: number;
  className?: string;
}

/**
 * Balatro-inspired background: a dark green swirling cosmos with a soft
 * radial glow at the center and a layer of blinking gold/white stars on top.
 *
 * Runs entirely on the GPU (PixiJS + custom fragment shader). The pixi.js
 * bundle is dynamically imported so it only ships when this component mounts.
 */
export default function GalacticBackground({
  speed = 1,
  starCount = 120,
  glowStrength = 0.6,
  className = "",
}: GalacticBackgroundProps) {
  const hostRef = useRef<HTMLDivElement>(null);
  // Flips to true once the PixiJS ticker has run its first frame — used to
  // fade the shader canvas in on top of the CSS fallback. During SSR and the
  // brief window before pixi.js finishes dynamic-importing + initializing,
  // the fallback is the only thing rendered, so the section never shows as
  // a plain black rectangle.
  const [shaderReady, setShaderReady] = useState(false);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;

    let destroyed = false;
    let cleanup: (() => void) | null = null;

    (async () => {
      const pixi = await import("pixi.js");
      const {
        Application,
        Filter,
        Graphics,
        Particle,
        ParticleContainer,
        Rectangle,
        Sprite,
        Texture,
        UniformGroup,
      } = pixi;

      if (destroyed) return;

      const app = new Application();
      await app.init({
        resizeTo: host,
        backgroundAlpha: 0,
        antialias: false, // filter output is already smooth; skip AA to save fill
        autoDensity: true,
        resolution: Math.min(window.devicePixelRatio || 1, 1.5),
      });

      if (destroyed) {
        app.destroy(true, { children: true, texture: true });
        return;
      }

      Object.assign(app.canvas.style, {
        position: "absolute",
        inset: "0",
        width: "100%",
        height: "100%",
        pointerEvents: "none",
        // Start invisible so the CSS radial-gradient fallback shows through
        // until the shader has drawn its first real frame. The ticker's
        // addOnce callback below flips this to opacity: 1 with a 700ms
        // ease so the transition reads as a soft reveal.
        opacity: "0",
        transition: "opacity 700ms ease-out",
      } as CSSStyleDeclaration);
      host.appendChild(app.canvas);

      // -----------------------------------------------------------------
      // Background: full-screen white sprite + custom fragment filter
      // -----------------------------------------------------------------
      const bgUniforms = new UniformGroup({
        uTime: { value: 0, type: "f32" },
        uResolution: {
          value: new Float32Array([app.screen.width, app.screen.height]),
          type: "vec2<f32>",
        },
        // Normalized (0..1) position of the "aura center" within the canvas.
        // Updated on scroll so the glow follows the visible viewport center
        // even when the section is much taller than 100vh.
        uCenter: {
          value: new Float32Array([0.5, 0.5]),
          type: "vec2<f32>",
        },
        uSpeed: { value: speed, type: "f32" },
        uGlow: { value: glowStrength, type: "f32" },
      });

      // Standard filter vertex shader — passes UV through and outputs the
      // clip-space position PixiJS expects for a full filter pass.
      // Written in WebGL1-compatible GLSL so PixiJS can handle version /
      // precision injection uniformly across contexts.
      const filterVertex = /* glsl */ `
        attribute vec2 aPosition;
        varying vec2 vTextureCoord;

        uniform vec4 uInputSize;
        uniform vec4 uOutputFrame;
        uniform vec4 uOutputTexture;

        vec4 filterVertexPosition(void) {
          vec2 position = aPosition * uOutputFrame.zw + uOutputFrame.xy;
          position.x = position.x * (2.0 / uOutputTexture.x) - 1.0;
          position.y = position.y * (2.0 * uOutputTexture.z / uOutputTexture.y) - uOutputTexture.z;
          return vec4(position, 0.0, 1.0);
        }

        vec2 filterTextureCoord(void) {
          return aPosition * (uOutputFrame.zw * uInputSize.zw);
        }

        void main(void) {
          gl_Position = filterVertexPosition();
          vTextureCoord = filterTextureCoord();
        }
      `;

      const bgFilter = Filter.from({
        gl: {
          vertex: filterVertex,
          fragment: /* glsl */ `
            precision highp float;

            varying vec2 vTextureCoord;

            uniform float uTime;
            uniform vec2 uResolution;
            uniform vec2 uCenter;
            uniform float uSpeed;
            uniform float uGlow;

            float hash(vec2 p) {
              return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
            }

            float noise(vec2 p) {
              vec2 i = floor(p);
              vec2 f = fract(p);
              vec2 u = f * f * (3.0 - 2.0 * f);
              return mix(
                mix(hash(i + vec2(0.0, 0.0)), hash(i + vec2(1.0, 0.0)), u.x),
                mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x),
                u.y
              );
            }

            float fbm(vec2 p) {
              float v = 0.0;
              float a = 0.5;
              for (int i = 0; i < 5; i++) {
                v += a * noise(p);
                p *= 2.02;
                a *= 0.5;
              }
              return v;
            }

            void main() {
              vec2 uv = vTextureCoord;
              float aspect = uResolution.x / max(uResolution.y, 1.0);
              // Everything below is measured relative to uCenter, which the
              // JS side keeps aligned with the visible viewport center.
              vec2 p = (uv - uCenter) * vec2(aspect, 1.0);

              float t = uTime * 0.12 * uSpeed;
              float d = length(p);
              // Radial direction (guarded at origin) and its perpendicular.
              // We sample noise in CARTESIAN space offset along these vectors
              // — this preserves the "flowing outward" feel without the
              // atan(y, x) seam that would otherwise cut a line across the
              // negative x axis.
              vec2 dir  = p / max(d, 0.0001);
              vec2 perp = vec2(-dir.y, dir.x);

              // Radial emanation: shift the sample backward along "dir" over
              // time, so patterns look emitted from the center.
              vec2 flowP = p - dir * t * 0.35;
              float radial = fbm(flowP * 3.0);

              // Tangential swirl: drift along the perpendicular direction so
              // the aura also breathes sideways, keeping motion organic.
              vec2 swirlP = p + perp * t * 0.25;
              float swirl = fbm(swirlP * 4.0 + vec2(3.7, 1.2));

              float f = mix(radial, swirl, 0.55);

              // Deep green palette with a couple of accent shades.
              vec3 c0 = vec3(0.005, 0.020, 0.012); // near-black green
              vec3 c1 = vec3(0.020, 0.140, 0.075); // forest
              vec3 c2 = vec3(0.055, 0.500, 0.260); // vivid emerald
              vec3 c3 = vec3(0.180, 0.680, 0.420); // highlight

              vec3 col = mix(c0, c1, smoothstep(0.20, 0.55, f));
              col = mix(col, c2, smoothstep(0.55, 0.85, f) * 0.75);
              col += c3 * pow(clamp(f, 0.0, 1.0), 4.0) * 0.35;

              // Green aura emanating from center out to the corners.
              // Two-tier falloff: a bright core plus a broad, gentle halo that
              // reaches all the way to the edges of the container.
              float coreGlow = exp(-d * 3.5);                // tight, bright
              float haloGlow = exp(-d * 0.9);                // broad, soft
              col += vec3(0.35, 0.95, 0.60) * coreGlow * uGlow * 1.4;
              col += vec3(0.06, 0.42, 0.24) * haloGlow * uGlow * 0.6;

              // Radial streaks: subtle brightening along "spokes" that pulse
              // outward, reinforcing the emanation feel without dominating.
              // sin is 2π-periodic so multiplying angle by an integer wraps
              // cleanly across the atan seam.
              float angle = atan(p.y, p.x);
              float spokes = 0.5 + 0.5 * sin(angle * 6.0 + d * 8.0 - t * 1.5);
              // Fade spokes out as d grows. Note: smoothstep requires
              // edge0 < edge1, so we invert to get the "bright at center" curve.
              float spokeFade = 1.0 - smoothstep(0.1, 1.4, d);
              col += vec3(0.05, 0.30, 0.18) * pow(spokes, 3.0) * spokeFade * 0.4;

              // Very gentle vignette so aura keeps reaching to the corners.
              // Again: invert smoothstep so "less dim near center" is well-defined.
              float vig = 1.0 - smoothstep(0.35, 1.7, d);
              col *= mix(0.72, 1.0, vig);

              gl_FragColor = vec4(col, 1.0);
            }
          `,
        },
        resources: { uniforms: bgUniforms },
      });

      const bgSprite = new Sprite(Texture.WHITE);
      bgSprite.width = app.screen.width;
      bgSprite.height = app.screen.height;
      bgSprite.filters = [bgFilter];
      app.stage.addChild(bgSprite);

      // -----------------------------------------------------------------
      // Stars: 4-point sparkle texture in a ParticleContainer.
      // -----------------------------------------------------------------
      const starGraphic = new Graphics();
      const spikes = 4;
      const outerR = 10;
      const innerR = 2.6;
      for (let i = 0; i < spikes * 2; i++) {
        const rr = i % 2 === 0 ? outerR : innerR;
        const angle = (Math.PI / spikes) * i - Math.PI / 2;
        const x = Math.cos(angle) * rr;
        const y = Math.sin(angle) * rr;
        if (i === 0) starGraphic.moveTo(x, y);
        else starGraphic.lineTo(x, y);
      }
      starGraphic.closePath();
      starGraphic.fill({ color: 0xffffff, alpha: 1 });
      starGraphic.circle(0, 0, innerR * 1.6).fill({
        color: 0xffffff,
        alpha: 0.9,
      });
      const starTex = app.renderer.generateTexture({
        target: starGraphic,
        resolution: 2,
      });
      starGraphic.destroy();

      const stars = new ParticleContainer({
        texture: starTex,
        boundsArea: new Rectangle(0, 0, app.screen.width, app.screen.height),
        dynamicProperties: {
          position: false,
          rotation: false,
          color: true, // alpha animates
          vertex: true, // scale animates
        },
      });
      stars.blendMode = "add";
      app.stage.addChild(stars);

      type StarState = {
        p: InstanceType<typeof Particle>;
        phase: number;
        period: number;
        baseScale: number;
      };
      const starStates: StarState[] = [];
      const palette = [0xffffff, 0xfff4a0, 0xffe066, 0xffd700];

      const populateStars = () => {
        // Clear old
        for (const s of starStates) stars.removeParticle(s.p);
        starStates.length = 0;
        const w = app.screen.width;
        const h = app.screen.height;
        for (let i = 0; i < starCount; i++) {
          const baseScale = 0.15 + Math.random() * 0.35;
          const p = new Particle({
            texture: starTex,
            x: Math.random() * w,
            y: Math.random() * h,
            anchorX: 0.5,
            anchorY: 0.5,
            scaleX: baseScale,
            scaleY: baseScale,
            tint: palette[Math.floor(Math.random() * palette.length)],
            alpha: 0,
          });
          stars.addParticle(p);
          starStates.push({
            p,
            phase: Math.random() * Math.PI * 2,
            period: 1400 + Math.random() * 2200,
            baseScale,
          });
        }
      };
      populateStars();

      // -----------------------------------------------------------------
      // Radial burst particles: spawn at the glowing core and fly outward
      // toward the corners of the container. Same star texture, but with
      // dynamic position and a green tint so they read as embers shot from
      // the aura.
      // -----------------------------------------------------------------
      const bursts = new ParticleContainer({
        texture: starTex,
        boundsArea: new Rectangle(0, 0, app.screen.width, app.screen.height),
        dynamicProperties: {
          position: true, // moving each frame
          rotation: false,
          color: true, // alpha animates
          vertex: true, // scale animates
        },
      });
      bursts.blendMode = "add";
      app.stage.addChild(bursts);

      const burstPalette = [0xa0ffb0, 0x66ff99, 0x7fffb2, 0xffffff];

      type BurstState = {
        p: InstanceType<typeof Particle>;
        vx: number;
        vy: number;
        life: number;
        maxLife: number;
        baseScale: number;
      };
      const burstStates: BurstState[] = [];

      const spawnBurst = () => {
        const w = app.screen.width;
        const h = app.screen.height;
        // Spawn from wherever the shader's aura currently sits.
        const center = bgUniforms.uniforms.uCenter as Float32Array;
        const cx = w * center[0];
        const cy = h * center[1];
        // Random direction. Speed scaled so particles reach the corner in
        // roughly their lifetime — feels like they're emitted with intent.
        const angle = Math.random() * Math.PI * 2;
        const cornerDist = Math.hypot(w, h) * 0.55;
        const life = 1600 + Math.random() * 1400;
        const speed = cornerDist / life; // px per ms
        const baseScale = 0.25 + Math.random() * 0.4;
        const p = new Particle({
          texture: starTex,
          x: cx,
          y: cy,
          anchorX: 0.5,
          anchorY: 0.5,
          scaleX: baseScale,
          scaleY: baseScale,
          tint: burstPalette[Math.floor(Math.random() * burstPalette.length)],
          alpha: 0,
        });
        bursts.addParticle(p);
        burstStates.push({
          p,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          life: 0,
          maxLife: life,
          baseScale,
        });
      };

      let burstAcc = 0;
      const burstInterval = 90; // ms between spawns

      // -----------------------------------------------------------------
      // Ticker: update time uniform + star blink cycles + burst updates
      // -----------------------------------------------------------------
      const tick = (t: Ticker) => {
        // Advance the shader clock (in seconds).
        bgUniforms.uniforms.uTime =
          (bgUniforms.uniforms.uTime as number) + t.deltaMS / 1000;

        // Blink stars — smooth sine cycle per star, offset by its phase.
        for (const s of starStates) {
          s.phase += t.deltaMS / s.period;
          // 0 → 1 → 0 breath, biased so most of the cycle is dim.
          const v = Math.pow(Math.max(0, Math.sin(s.phase)), 2.2);
          s.p.alpha = v;
          const scale = s.baseScale * (0.6 + v * 0.9);
          s.p.scaleX = scale;
          s.p.scaleY = scale;
        }

        // Spawn radial bursts at a steady cadence.
        burstAcc += t.deltaMS;
        while (burstAcc >= burstInterval) {
          spawnBurst();
          burstAcc -= burstInterval;
        }

        // Update radial bursts.
        for (let i = burstStates.length - 1; i >= 0; i--) {
          const b = burstStates[i];
          b.life += t.deltaMS;
          const k = b.life / b.maxLife;
          if (k >= 1) {
            bursts.removeParticle(b.p);
            burstStates.splice(i, 1);
            continue;
          }
          b.p.x += b.vx * t.deltaMS;
          b.p.y += b.vy * t.deltaMS;
          // Alpha envelope: quick fade in, sustain, gentle fade out.
          let a = 1;
          if (k < 0.15) a = k / 0.15;
          else if (k > 0.7) a = (1 - k) / 0.3;
          b.p.alpha = a * 0.85;
          // Slight scale-up as they travel — feels like they're accelerating.
          const scale = b.baseScale * (0.7 + k * 0.6);
          b.p.scaleX = scale;
          b.p.scaleY = scale;
        }
      };
      app.ticker.add(tick);

      // After the very first frame renders, fade the canvas in on top of
      // the CSS fallback. Using addOnce guarantees a real GPU paint has
      // landed — not just app.init resolving. The React state is also
      // flipped so downstream consumers (if any) can react.
      app.ticker.addOnce(() => {
        if (destroyed) return;
        app.canvas.style.opacity = "1";
        setShaderReady(true);
      });

      // -----------------------------------------------------------------
      // Aura position: fixed at "one viewport-height / 2" from the top of
      // the canvas, so it sits at the visible viewport center when the user
      // is scrolled to the top of the section. It does NOT follow scroll —
      // scrolling down simply moves past the aura.
      // -----------------------------------------------------------------
      const updateCenter = () => {
        const h = app.screen.height;
        if (h <= 0) return;
        const cy = Math.min(1, window.innerHeight / 2 / h);
        bgUniforms.uniforms.uCenter = new Float32Array([0.5, cy]);
      };
      updateCenter();
      window.addEventListener("resize", updateCenter, { passive: true });

      // -----------------------------------------------------------------
      // Resize handling: sync sprite size + resolution uniform + re-scatter.
      // -----------------------------------------------------------------
      let resizeRaf = 0;
      const handleResize = () => {
        cancelAnimationFrame(resizeRaf);
        resizeRaf = requestAnimationFrame(() => {
          const w = app.screen.width;
          const h = app.screen.height;
          bgSprite.width = w;
          bgSprite.height = h;
          bgUniforms.uniforms.uResolution = new Float32Array([w, h]);
          stars.boundsArea = new Rectangle(0, 0, w, h);
          bursts.boundsArea = new Rectangle(0, 0, w, h);
          populateStars();
          updateCenter();
        });
      };
      const ro = new ResizeObserver(handleResize);
      ro.observe(host);

      cleanup = () => {
        cancelAnimationFrame(resizeRaf);
        window.removeEventListener("resize", updateCenter);
        ro.disconnect();
        app.ticker.remove(tick);
        app.destroy(true, { children: true, texture: true });
      };
    })();

    return () => {
      destroyed = true;
      cleanup?.();
    };
  }, [speed, starCount, glowStrength]);

  return (
    // Canvas fills the whole section so it covers every scroll position.
    // The visible-viewport center is tracked in JS and passed as the shader's
    // uCenter uniform, so the aura follows what the user is currently looking
    // at even in a section that is many viewports tall.
    <div
      ref={hostRef}
      aria-hidden="true"
      className={`absolute inset-0 pointer-events-none overflow-hidden ${className}`}
    >
      {/* CSS radial-gradient fallback. Painted immediately (first paint,
          before pixi.js finishes its dynamic import + init) so the section
          is never a black rectangle for first-time visitors. Colors mirror
          the shader's palette: deep-forest edges, emerald mid-halo,
          near-white core. Fades to zero opacity once the shader canvas has
          drawn its first real frame so we don't double-paint the aura. */}
      <div
        className={`absolute inset-0 transition-opacity duration-1000 ease-out ${
          shaderReady ? "opacity-0" : "opacity-100"
        }`}
        style={{
          background:
            "radial-gradient(ellipse at 50% 50%, #59f299 0%, #106b3d 22%, #05231f 55%, #010503 90%)",
        }}
      />
    </div>
  );
}
