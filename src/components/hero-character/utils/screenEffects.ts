import * as THREE from "three";
import gsap from "gsap";

/** Monitor + screen-light setup from the landing scene, without scroll tweens. */
export function setupScreenEffects(character: THREE.Object3D) {
  let intensity = 0;
  const flicker = window.setInterval(() => {
    intensity = Math.random();
  }, 200);

  character.children.forEach((object: THREE.Object3D) => {
    if (object.name === "Plane004") {
      object.children.forEach((child) => {
        const mesh = child as THREE.Mesh;
        const material = mesh.material as THREE.MeshStandardMaterial;
        if (!material) return;
        material.transparent = true;
        material.opacity = 0;
        if (material.name === "Material.018") {
          material.color.set("#FFFFFF");
        }
      });
    }
    if (object.name === "screenlight") {
      const mesh = object as THREE.Mesh;
      const material = mesh.material as THREE.MeshStandardMaterial;
      material.transparent = true;
      material.opacity = 0;
      material.emissive.set("#B0F5EA");
      gsap.timeline({ repeat: -1, repeatRefresh: true }).to(material, {
        emissiveIntensity: () => intensity * 8,
        duration: () => Math.random() * 0.6,
        delay: () => Math.random() * 0.1,
      });
    }
  });

  return () => {
    window.clearInterval(flicker);
  };
}
