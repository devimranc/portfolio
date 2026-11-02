import * as THREE from "three";
import { DRACOLoader, GLTF, GLTFLoader } from "three-stdlib";
import { decryptFile } from "./decrypt";

const PASSWORD = "MyCharacter12";

const THEME_GRADE = `
{
  float luma = dot(outgoingLight, vec3(0.2126, 0.7152, 0.0722));
  vec3 theme = mix(vec3(0.42, 0.50, 0.60), vec3(0.78, 0.84, 0.91), clamp(luma, 0.0, 1.0));
  outgoingLight = vec3(luma) * theme;
}
#include <opaque_fragment>
`;

const ORIGINAL_MESHES = new Set([
  "Face.002",
  "EYEs.001",
  "Eyebrow",
  "Teeth.001",
  "Ear.001",
  "Neck",
]);

const ORIGINAL_MATERIALS = new Set([
  "EyesMaterial",
  "Teeth_Material",
  "Material.003",
  "Material",
]);

function keepsOriginalColor(meshName: string, material: THREE.Material) {
  return ORIGINAL_MESHES.has(meshName) || ORIGINAL_MATERIALS.has(material.name);
}

function gradeToTheme(material: THREE.Material) {
  const standard = material as THREE.MeshStandardMaterial;
  if (!standard.isMeshStandardMaterial) return;
  if (standard.name === "Material.018") return;
  standard.onBeforeCompile = (shader) => {
    shader.fragmentShader = shader.fragmentShader.replace(
      "#include <opaque_fragment>",
      THEME_GRADE
    );
  };
  standard.customProgramCacheKey = () => "theme-grade";
  standard.needsUpdate = true;
}

const setCharacter = (
  renderer: THREE.WebGLRenderer,
  scene: THREE.Scene,
  camera: THREE.PerspectiveCamera,
  assetBase: string
) => {
  const loader = new GLTFLoader();
  const dracoLoader = new DRACOLoader();
  dracoLoader.setDecoderPath(`${assetBase}/draco/`);
  loader.setDRACOLoader(dracoLoader);

  const loadCharacter = () => {
    return new Promise<GLTF | null>(async (resolve, reject) => {
      try {
        const encryptedBlob = await decryptFile(
          `${assetBase}/models/character.enc?v=2`,
          PASSWORD
        );
        const blobUrl = URL.createObjectURL(new Blob([encryptedBlob]));

        loader.load(
          blobUrl,
          async (gltf) => {
            const character = gltf.scene;
            await renderer.compileAsync(character, camera, scene);
            character.traverse((child: THREE.Object3D) => {
              const mesh = child as THREE.Mesh;
              if (!mesh.isMesh) return;

              if (
                mesh.material &&
                mesh.name !== "screenlight" &&
                !keepsOriginalColor(mesh.name, mesh.material as THREE.Material)
              ) {
                const source = mesh.material as THREE.Material;
                if (mesh.name === "BODY.SHIRT" || mesh.name === "Pant") {
                  const newMat = source.clone() as THREE.MeshStandardMaterial;
                  newMat.color = new THREE.Color(
                    mesh.name === "BODY.SHIRT" ? "#243246" : "#151d2b"
                  );
                  mesh.material = newMat;
                  gradeToTheme(newMat);
                } else {
                  gradeToTheme(source);
                }
              }

              mesh.castShadow = true;
              mesh.receiveShadow = true;
              mesh.frustumCulled = true;
            });
            character.getObjectByName("footR")!.position.y = 3.36;
            character.getObjectByName("footL")!.position.y = 3.36;
            resolve(gltf);
            dracoLoader.dispose();
            URL.revokeObjectURL(blobUrl);
          },
          undefined,
          (error) => {
            console.error("Error loading GLTF model:", error);
            reject(error);
          }
        );
      } catch (err) {
        reject(err);
        console.error(err);
      }
    });
  };

  return { loadCharacter };
};

export default setCharacter;
