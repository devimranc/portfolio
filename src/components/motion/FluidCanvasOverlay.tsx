"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";
import * as THREE from "three";
import { useMotionCapability } from "@/hooks/use-motion-capability";
import {
  fluidFragmentShader,
  fluidVertexShader,
} from "@/lib/motion/fluid-shaders";
import {
  FLUID_RESYNC_EVENT,
  FLUID_RIPPLE_EVENT,
  requestFluidResync,
  type FluidRippleDetail,
} from "@/lib/motion/fluid-events";

type FluidTarget = {
  element: HTMLElement;
  mesh: THREE.Mesh<THREE.PlaneGeometry, THREE.ShaderMaterial>;
};

const MAX_TARGETS = 8;

function isFluidTargetVisible(el: HTMLElement) {
  const rect = el.getBoundingClientRect();
  if (rect.width < 8 || rect.height < 8) return false;
  if (rect.bottom < 0 || rect.top > window.innerHeight) return false;
  if (rect.right < 0 || rect.left > window.innerWidth) return false;

  const style = window.getComputedStyle(el);
  if (style.display === "none" || style.visibility === "hidden") return false;
  if (Number.parseFloat(style.opacity) < 0.04) return false;

  return true;
}

export function FluidCanvasOverlay() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { fluidWebGL } = useMotionCapability();
  const pathname = usePathname();

  useEffect(() => {
    if (!fluidWebGL) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    canvas.style.pointerEvents = "none";

    const renderer = new THREE.WebGLRenderer({
      canvas,
      alpha: true,
      antialias: true,
      powerPreference: "high-performance",
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.75));
    renderer.setClearColor(0x000000, 0);
    renderer.autoClear = false;

    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0.01, 10);
    camera.position.z = 1;

    const targets: FluidTarget[] = [];
    let targetHoverStrength = 0;
    let rippleStrength = 0;
    const rippleOrigin = new THREE.Vector2(0.5, 0.5);
    let raf = 0;
    let disposed = false;

    const makeMaterial = () =>
      new THREE.ShaderMaterial({
        transparent: true,
        depthWrite: false,
        uniforms: {
          uTime: { value: 0 },
          uMouse: { value: new THREE.Vector2(0, 0) },
          uResolution: { value: new THREE.Vector2(1, 1) },
          uHover: { value: 0 },
          uRipple: { value: 0 },
          uRippleOrigin: { value: rippleOrigin },
        },
        vertexShader: fluidVertexShader,
        fragmentShader: fluidFragmentShader,
      });

    const syncTargets = () => {
      targets.forEach(({ mesh }) => {
        scene.remove(mesh);
        mesh.geometry.dispose();
        mesh.material.dispose();
      });
      targets.length = 0;

      const nodes = Array.from(document.querySelectorAll<HTMLElement>("[data-fluid]"))
        .filter(isFluidTargetVisible)
        .slice(0, MAX_TARGETS);

      nodes.forEach((element) => {
        const material = makeMaterial();
        const mesh = new THREE.Mesh(new THREE.PlaneGeometry(1, 1), material);
        mesh.frustumCulled = false;
        scene.add(mesh);
        targets.push({ element, mesh });
      });
    };

    const layoutTarget = (
      target: FluidTarget,
      pointer: { x: number; y: number } | undefined,
      viewportHeight: number,
    ) => {
      const { element, mesh } = target;
      if (!isFluidTargetVisible(element)) {
        mesh.visible = false;
        return;
      }

      mesh.visible = true;
      const rect = element.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = viewportHeight - (rect.top + rect.height / 2);

      mesh.scale.set(rect.width, rect.height, 1);
      mesh.position.set(cx, cy, 0);

      const material = mesh.material;
      material.uniforms.uResolution.value.set(rect.width, rect.height);

      if (pointer) {
        const inside =
          pointer.x >= rect.left &&
          pointer.x <= rect.right &&
          pointer.y >= rect.top &&
          pointer.y <= rect.bottom;

        material.uniforms.uHover.value = inside ? targetHoverStrength : 0;
        material.uniforms.uMouse.value.set(
          pointer.x - rect.left,
          rect.height - (pointer.y - rect.top),
        );
      }
    };

    const layoutTargets = (pointer?: { x: number; y: number }) => {
      const height = window.innerHeight;
      targets.forEach((target) => layoutTarget(target, pointer, height));
    };

    const resize = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      renderer.setSize(width, height, false);
      camera.left = 0;
      camera.right = width;
      camera.top = height;
      camera.bottom = 0;
      camera.updateProjectionMatrix();
      layoutTargets();
    };

    let lastPointer = { x: 0, y: 0 };

    const onPointerMove = (event: PointerEvent) => {
      lastPointer = { x: event.clientX, y: event.clientY };

      targetHoverStrength = 0;
      for (const target of targets) {
        const rect = target.element.getBoundingClientRect();
        if (
          event.clientX >= rect.left &&
          event.clientX <= rect.right &&
          event.clientY >= rect.top &&
          event.clientY <= rect.bottom
        ) {
          targetHoverStrength = 1;
          break;
        }
      }
    };

    const fireRipple = (clientX: number, clientY: number, strength = 1) => {
      rippleOrigin.set(
        clientX / window.innerWidth,
        1 - clientY / window.innerHeight,
      );
      rippleStrength = strength;
    };

    const onPointerDown = (event: PointerEvent) => {
      fireRipple(event.clientX, event.clientY, 1);
    };

    const onRippleEvent = (event: Event) => {
      const detail = (event as CustomEvent<FluidRippleDetail>).detail;
      if (!detail) return;
      fireRipple(detail.x, detail.y, detail.strength ?? 1);
    };

    const onScroll = () => {
      layoutTargets(lastPointer);
    };

    const observer = new ResizeObserver(() => {
      syncTargets();
      layoutTargets(lastPointer);
    });

    syncTargets();
    resize();

    document.querySelectorAll("[data-fluid]").forEach((node) => observer.observe(node));
    window.addEventListener("resize", resize, { passive: true });
    window.addEventListener("scroll", onScroll, { passive: true, capture: true });
    window.addEventListener("pointermove", onPointerMove, { passive: true });
    window.addEventListener("pointerdown", onPointerDown, { passive: true });
    window.addEventListener(FLUID_RIPPLE_EVENT, onRippleEvent);

    const onResync = () => {
      syncTargets();
      layoutTargets(lastPointer);
    };
    window.addEventListener(FLUID_RESYNC_EVENT, onResync);

    const start = performance.now();
    const tick = (now: number) => {
      if (disposed) return;
      raf = requestAnimationFrame(tick);

      rippleStrength = THREE.MathUtils.lerp(rippleStrength, 0, 0.08);

      const t = (now - start) / 1000;
      const height = window.innerHeight;
      const dpr = renderer.getPixelRatio();

      targets.forEach(({ mesh }) => {
        mesh.material.uniforms.uTime.value = t;
        mesh.material.uniforms.uRipple.value = rippleStrength;
      });

      layoutTargets(lastPointer);

      renderer.setScissorTest(false);
      renderer.clear(true, true, true);

      targets.forEach((target) => {
        if (!target.mesh.visible) return;

        const rect = target.element.getBoundingClientRect();
        const scissorX = Math.max(0, Math.floor(rect.left * dpr));
        const scissorY = Math.max(0, Math.floor((height - rect.bottom) * dpr));
        const scissorW = Math.ceil(rect.width * dpr);
        const scissorH = Math.ceil(rect.height * dpr);

        if (scissorW < 1 || scissorH < 1) return;

        target.mesh.visible = true;
        targets.forEach((other) => {
          other.mesh.visible = other === target;
        });

        renderer.setScissorTest(true);
        renderer.setScissor(scissorX, scissorY, scissorW, scissorH);
        renderer.render(scene, camera);
      });

      targets.forEach((target) => {
        target.mesh.visible = true;
      });
      renderer.setScissorTest(false);
    };

    raf = requestAnimationFrame(tick);

    return () => {
      disposed = true;
      cancelAnimationFrame(raf);
      observer.disconnect();
      window.removeEventListener("resize", resize);
      window.removeEventListener("scroll", onScroll, true);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerdown", onPointerDown);
      window.removeEventListener(FLUID_RIPPLE_EVENT, onRippleEvent);
      window.removeEventListener(FLUID_RESYNC_EVENT, onResync);

      targets.forEach(({ mesh }) => {
        scene.remove(mesh);
        mesh.geometry.dispose();
        mesh.material.dispose();
      });

      renderer.dispose();
    };
  }, [fluidWebGL]);

  useEffect(() => {
    if (!fluidWebGL) return;
    requestFluidResync();
  }, [pathname, fluidWebGL]);

  if (!fluidWebGL) return null;

  return (
    <canvas
      ref={canvasRef}
      className="motion-fluid-canvas"
      aria-hidden
      style={{ pointerEvents: "none" }}
    />
  );
}
