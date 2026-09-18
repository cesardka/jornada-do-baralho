"use client";

import { type RefObject, useEffect, useRef } from "react";
import type { Ticker } from "pixi.js";

interface DeckRadialBackgroundProps {
  originRef: RefObject<HTMLElement | null>;
  contentRef: RefObject<HTMLElement | null>;
  maxFPS?: number;
  resolutionCap?: number;
  onReady?: () => void;
  className?: string;
}

export default function DeckRadialBackground({
  originRef,
  contentRef,
  maxFPS = 30,
  resolutionCap = 1.5,
  onReady,
  className = "",
}: DeckRadialBackgroundProps) {
  const hostRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;

    let destroyed = false;
    let cleanup: (() => void) | undefined;

    void (async () => {
      const { Application, Filter, Sprite, Texture, UniformGroup } =
        await import("pixi.js");
      if (destroyed) return;

      const app = new Application();
      await app.init({
        resizeTo: host,
        backgroundAlpha: 0,
        antialias: false,
        autoDensity: true,
        resolution: Math.min(window.devicePixelRatio || 1, resolutionCap),
        preference: "webgl",
      });
      if (destroyed) {
        app.destroy(true, {
          children: true,
          texture: false,
          textureSource: false,
        });
        return;
      }

      Object.assign(app.canvas.style, {
        position: "absolute",
        inset: "0",
        width: "100%",
        height: "100%",
        opacity: "0",
        pointerEvents: "none",
        transition: "opacity 700ms ease-out",
      } as CSSStyleDeclaration);
      host.appendChild(app.canvas);

      const uniforms = new UniformGroup({
        uTime: { value: 0, type: "f32" },
        uResolution: {
          value: new Float32Array([app.screen.width, app.screen.height]),
          type: "vec2<f32>",
        },
        uCenter: {
          value: new Float32Array([0.82, 0.5]),
          type: "vec2<f32>",
        },
        uStacked: { value: 0, type: "f32" },
        uTextBottom: { value: 0.5, type: "f32" },
        uPatternScale: { value: 2.3, type: "f32" },
        uSpeed: { value: 0.38, type: "f32" },
      });

      const vertex = /* glsl */ `
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

      const fragment = /* glsl */ `
        precision highp float;

        #define M_PI 3.141592

        varying vec2 vTextureCoord;

        uniform float uTime;
        uniform float uSpeed;
        uniform float uStacked;
        uniform float uTextBottom;
        uniform float uPatternScale;
        uniform vec2 uResolution;
        uniform vec2 uCenter;

        float radial(vec2 uv, float offset, float repeatCount) {
          float angle = mod(
            (atan(uv.y, uv.x) + M_PI + offset * 2.0 * M_PI) *
              repeatCount / M_PI,
            2.0
          );
          return min(angle, 2.0 - angle);
        }

        void main(void) {
          vec2 fragCoord = vTextureCoord * uResolution;
          vec2 centerCoord = uCenter * uResolution;
          vec2 uv = (fragCoord - centerCoord) / uResolution.y;
          uv *= uPatternScale;
          float time = uTime * uSpeed;
          float baseDistance = length(uv);
          float distanceField = baseDistance - 0.75;
          float offset = baseDistance;
          float angleField = radial(
            uv,
            sin(offset * 6.0 - time * 0.5) * 0.161,
            2.0
          ) - 0.9;

          distanceField = offset - distanceField * distanceField +
            distanceField + angleField * 0.32;
          float blend = clamp(distanceField, 0.0, 1.0);
          vec3 darkRed = vec3(0.12, 0.035, 0.012);
          vec3 cardRed = vec3(0.502, 0.188, 0.063);
          vec3 color = mix(darkRed, cardRed, blend);

          float wave = 0.5 + 0.5 * sin(-offset * 32.0 - time * 4.0);
          color *= wave * 0.66 + 1.66;
          color = color - offset * offset + distanceField + angleField;
          vec3 background = vec3(0.125, 0.314, 0.565);
          float colorMix = clamp(
            color.r + color.g + color.b * 0.3333,
            0.0,
            1.0
          );
          color = mix(background, color, colorMix);
          color = mix(color, mix(cardRed, background, wave), blend * 0.24);
          color *= max(baseDistance - 0.05, 0.0);

          float horizontalShade = smoothstep(0.18, 0.62, vTextureCoord.x);
          float verticalShade = smoothstep(
            uTextBottom + 0.02,
            uTextBottom + 0.16,
            vTextureCoord.y
          );
          float textShade = mix(horizontalShade, verticalShade, uStacked);
          color *= mix(0.1, 1.0, textShade);

          gl_FragColor = vec4(max(color, vec3(0.0)), 1.0);
        }
      `;

      const filter = Filter.from({
        gl: { vertex, fragment },
        resources: { uniforms },
      });
      const background = new Sprite(Texture.WHITE);
      background.width = app.screen.width;
      background.height = app.screen.height;
      background.filters = [filter];
      app.stage.addChild(background);
      app.ticker.maxFPS = maxFPS;

      const updateLayout = () => {
        const width = app.screen.width;
        const height = app.screen.height;
        if (width <= 0 || height <= 0) return;

        const desktop = window.matchMedia(
          "(min-width: 1200px) and (hover: hover) and (pointer: fine)",
        ).matches;
        background.width = width;
        background.height = height;
        uniforms.uniforms.uResolution = new Float32Array([width, height]);
        uniforms.uniforms.uStacked = desktop ? 0 : 1;
        uniforms.uniforms.uPatternScale = desktop
          ? 2.3
          : width < 48 * 16
            ? 3.2
            : 2.8;

        const hostBounds = host.getBoundingClientRect();
        const targetBounds = originRef.current?.getBoundingClientRect();
        const contentBounds = contentRef.current?.getBoundingClientRect();
        if (!targetBounds || hostBounds.width <= 0 || hostBounds.height <= 0)
          return;

        if (contentBounds) {
          uniforms.uniforms.uTextBottom = Math.min(
            1,
            Math.max(
              0,
              (contentBounds.bottom - hostBounds.top) / hostBounds.height,
            ),
          );
        }
        uniforms.uniforms.uCenter = new Float32Array([
          (targetBounds.left + targetBounds.width * 0.5 - hostBounds.left) /
            hostBounds.width,
          (targetBounds.top + targetBounds.height * 0.5 - hostBounds.top) /
            hostBounds.height,
        ]);
      };

      const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
      const tick = (ticker: Ticker) => {
        if (!motion.matches) {
          uniforms.uniforms.uTime =
            (uniforms.uniforms.uTime as number) + ticker.deltaMS / 1000;
        }
      };
      app.ticker.add(tick);
      app.ticker.addOnce(() => {
        if (destroyed) return;
        app.canvas.style.opacity = "1";
        onReady?.();
      });

      let resizeFrame = 0;
      const handleResize = () => {
        cancelAnimationFrame(resizeFrame);
        resizeFrame = requestAnimationFrame(updateLayout);
      };
      const resizeObserver = new ResizeObserver(handleResize);
      resizeObserver.observe(host);
      if (originRef.current) resizeObserver.observe(originRef.current);
      if (contentRef.current) resizeObserver.observe(contentRef.current);
      window.addEventListener("resize", handleResize, { passive: true });
      updateLayout();

      const visibilityObserver = new IntersectionObserver(
        ([entry]) => {
          if (
            entry.isIntersecting &&
            document.visibilityState === "visible" &&
            !motion.matches
          )
            app.start();
          else app.stop();
        },
        { rootMargin: "20% 0px" },
      );
      visibilityObserver.observe(host);
      const handleVisibility = () => {
        if (document.visibilityState === "visible" && !motion.matches)
          app.start();
        else app.stop();
      };
      document.addEventListener("visibilitychange", handleVisibility);
      motion.addEventListener("change", handleVisibility);

      cleanup = () => {
        cancelAnimationFrame(resizeFrame);
        document.removeEventListener("visibilitychange", handleVisibility);
        motion.removeEventListener("change", handleVisibility);
        window.removeEventListener("resize", handleResize);
        visibilityObserver.disconnect();
        resizeObserver.disconnect();
        app.ticker.remove(tick);
        app.destroy(true, {
          children: true,
          texture: false,
          textureSource: false,
        });
      };
    })();

    return () => {
      destroyed = true;
      cleanup?.();
    };
  }, [contentRef, maxFPS, onReady, originRef, resolutionCap]);

  return <div ref={hostRef} aria-hidden="true" className={className} />;
}
