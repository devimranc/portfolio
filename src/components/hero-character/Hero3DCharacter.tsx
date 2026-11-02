"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import setCharacter from "./utils/character";
import setLighting from "./utils/lighting";
import {
  handleMouseMove,
  handleTouchEnd,
  handleHeadRotation,
  handleTouchMove,
} from "./utils/mouseUtils";
import setAnimations from "./utils/animationUtils";
import { setProgress } from "./utils/progress";
import { setupScreenEffects } from "./utils/screenEffects";
import "./Hero3DCharacter.css";

export type Hero3DCharacterProps = {
  /** Prefix for /models and /draco. Leave empty when those folders are in Next.js `public/`. */
  assetBase?: string;
  className?: string;
  onProgress?: (percent: number) => void;
};

const Hero3DCharacter = ({
  assetBase = "",
  className,
  onProgress,
}: Hero3DCharacterProps) => {
  const canvasDiv = useRef<HTMLDivElement | null>(null);
  const hoverDivRef = useRef<HTMLDivElement>(null);
  const rimRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef(new THREE.Scene());
  const onProgressRef = useRef(onProgress);
  onProgressRef.current = onProgress;

  useEffect(() => {
    const host = canvasDiv.current;
    const hoverEl = hoverDivRef.current;
    if (!host) return;

    const rect = host.getBoundingClientRect();
    const width = rect.width || host.clientWidth || window.innerWidth;
    const height = rect.height || host.clientHeight || window.innerHeight;
    const aspect = width / height;
    const scene = sceneRef.current;

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1;
    host.appendChild(renderer.domElement);

    const camera = new THREE.PerspectiveCamera(14.5, aspect, 0.1, 1000);
    camera.position.set(0, 13.1, 24.7);
    camera.zoom = 1.1;
    camera.updateProjectionMatrix();

    let headBone: THREE.Object3D | null = null;
    let screenLight: THREE.Mesh | null = null;
    let mixer: THREE.AnimationMixer | undefined;
    let disposed = false;
    let frame = 0;
    let removeHover: (() => void) | undefined;
    let removeScreen: (() => void) | undefined;

    const clock = new THREE.Clock();
    const light = setLighting(scene, rimRef.current, assetBase);
    const progress = setProgress((value) => onProgressRef.current?.(value));
    const { loadCharacter } = setCharacter(renderer, scene, camera, assetBase);

    const onResize = () => {
      const box = host.getBoundingClientRect();
      const nextWidth = box.width || host.clientWidth;
      const nextHeight = box.height || host.clientHeight;
      if (!nextWidth || !nextHeight) return;
      renderer.setSize(nextWidth, nextHeight);
      camera.aspect = nextWidth / nextHeight;
      camera.updateProjectionMatrix();
    };

    let mouse = { x: 0, y: 0 };
    let interpolation = { x: 0.1, y: 0.2 };
    let touchDebounce: number | undefined;
    let touchMoveListener: ((e: TouchEvent) => void) | undefined;

    const onMouseMove = (event: MouseEvent) => {
      handleMouseMove(event, (x, y) => (mouse = { x, y }));
    };
    const onTouchStart = (event: TouchEvent) => {
      const element = event.target as HTMLElement;
      touchDebounce = window.setTimeout(() => {
        touchMoveListener = (e: TouchEvent) =>
          handleTouchMove(e, (x, y) => (mouse = { x, y }));
        element?.addEventListener("touchmove", touchMoveListener);
      }, 200);
    };
    const onTouchEnd = () => {
      handleTouchEnd((x, y, interpolationX, interpolationY) => {
        mouse = { x, y };
        interpolation = { x: interpolationX, y: interpolationY };
      });
    };

    document.addEventListener("mousemove", onMouseMove);
    host.addEventListener("touchstart", onTouchStart);
    host.addEventListener("touchend", onTouchEnd);
    window.addEventListener("resize", onResize);

    loadCharacter()
      .then((gltf) => {
        if (!gltf || disposed) return;
        const animations = setAnimations(gltf);
        if (hoverEl) removeHover = animations.hover(gltf, hoverEl);
        mixer = animations.mixer;
        const character = gltf.scene;
        removeScreen = setupScreenEffects(character);
        scene.add(character);
        headBone = character.getObjectByName("spine006") || null;
        screenLight =
          (character.getObjectByName("screenlight") as THREE.Mesh) || null;
        progress.loaded().then(() => {
          window.setTimeout(() => {
            if (disposed) return;
            light.turnOnLights();
            animations.startIntro();
          }, 2500);
        });
      })
      .catch((error) => {
        console.error(error);
      });

    const animate = () => {
      frame = requestAnimationFrame(animate);
      if (headBone) {
        handleHeadRotation(
          headBone,
          mouse.x,
          mouse.y,
          interpolation.x,
          interpolation.y,
          THREE.MathUtils.lerp
        );
        light.setPointLight(screenLight);
      }
      if (mixer) mixer.update(clock.getDelta());
      renderer.render(scene, camera);
    };
    animate();

    return () => {
      disposed = true;
      cancelAnimationFrame(frame);
      window.clearTimeout(touchDebounce);
      progress.clear();
      removeHover?.();
      removeScreen?.();
      scene.clear();
      renderer.dispose();
      renderer.forceContextLoss();
      window.removeEventListener("resize", onResize);
      document.removeEventListener("mousemove", onMouseMove);
      host.removeEventListener("touchstart", onTouchStart);
      host.removeEventListener("touchend", onTouchEnd);
      if (touchMoveListener) {
        host.removeEventListener("touchmove", touchMoveListener);
      }
      if (renderer.domElement.parentElement === host) {
        host.removeChild(renderer.domElement);
      }
    };
  }, [assetBase]);

  return (
    <div className={className ? `hero-character ${className}` : "hero-character"}>
      <div className="character-model" ref={canvasDiv}>
        <div className="character-rim" ref={rimRef}></div>
        <div className="character-hover" ref={hoverDivRef}></div>
      </div>
    </div>
  );
};

export default Hero3DCharacter;
