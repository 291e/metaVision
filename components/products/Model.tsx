// Model.tsx
import { useEffect, useState } from "react";
import * as THREE from "three";
import { OBJLoader } from "three-stdlib";
import { useControls, folder, button } from "leva";

interface ModelProps {
  objUrl: string;
  textureUrls: {
    diffuse?: string;
    ao?: string;
    normal?: string;
    roughness?: string;
  };
}

export default function Model({ objUrl, textureUrls }: ModelProps) {
  const [model, setModel] = useState<THREE.Object3D | null>(null);
  const [textures, setTextures] = useState<{
    diffuse?: THREE.Texture;
    ao?: THREE.Texture;
    normal?: THREE.Texture;
    roughness?: THREE.Texture;
  }>({});

  // Leva 컨트롤 추가
  const {
    scale,
    position,
    rotation,
    materialType,
    wireframe,
    useDiffuse,
    useAO,
    useNormal,
    useRoughness,
  } = useControls({
    "Model Properties": folder({
      scale: { value: 30, min: 1, max: 100, step: 1 },
      position: {
        value: { x: 0, y: 0, z: 0 },
        step: 0.1,
      },
      rotation: {
        value: { x: 0, y: 0, z: 0 },
        min: -Math.PI,
        max: Math.PI,
        step: 0.01,
      },
    }),
    Material: folder({
      materialType: {
        value: "Standard",
        options: ["Standard", "Phong", "Lambert"],
      },
      wireframe: false,
    }),
    Textures: folder({
      useDiffuse: { value: true, label: "Diffuse" },
      useAO: { value: true, label: "Ambient Occlusion" },
      useNormal: { value: true, label: "Normal Map" },
      useRoughness: { value: true, label: "Roughness Map" },
    }),
    Actions: folder({
      resetModel: button(() => {
        if (model) {
          model.position.set(0, 0, 0);
          model.rotation.set(0, 0, 0);
          model.scale.set(30, 30, 30);
        }
      }),
    }),
  });

  // 모델 및 텍스처 로드
  useEffect(() => {
    const loadModel = async () => {
      try {
        if (!objUrl) {
          console.error("OBJ URL이 없습니다.");
          return;
        }

        const proxyPrefix = "/api/proxy";

        // 프록시를 통한 OBJ 파일 URL
        const objUrlWithProxy = proxyPrefix + new URL(objUrl).pathname;

        // OBJ 파일 로드
        const response = await fetch(objUrlWithProxy);
        if (!response.ok) {
          throw new Error(`OBJ 파일 로드 실패: ${response.statusText}`);
        }
        const objText = await response.text();
        const objLoader = new OBJLoader();
        const object = objLoader.parse(objText);

        // 모델 설정
        setModel(object);

        // 텍스처 로드
        const textureLoader = new THREE.TextureLoader();

        const textureUrlsWithProxy = {
          diffuse: textureUrls.diffuse
            ? proxyPrefix + new URL(textureUrls.diffuse).pathname
            : undefined,
          ao: textureUrls.ao
            ? proxyPrefix + new URL(textureUrls.ao).pathname
            : undefined,
          normal: textureUrls.normal
            ? proxyPrefix + new URL(textureUrls.normal).pathname
            : undefined,
          roughness: textureUrls.roughness
            ? proxyPrefix + new URL(textureUrls.roughness).pathname
            : undefined,
        };

        const [diffuseTexture, aoTexture, normalTexture, roughnessTexture] =
          await Promise.all([
            textureUrlsWithProxy.diffuse
              ? textureLoader.loadAsync(textureUrlsWithProxy.diffuse)
              : Promise.resolve(undefined),
            textureUrlsWithProxy.ao
              ? textureLoader.loadAsync(textureUrlsWithProxy.ao)
              : Promise.resolve(undefined),
            textureUrlsWithProxy.normal
              ? textureLoader.loadAsync(textureUrlsWithProxy.normal)
              : Promise.resolve(undefined),
            textureUrlsWithProxy.roughness
              ? textureLoader.loadAsync(textureUrlsWithProxy.roughness)
              : Promise.resolve(undefined),
          ]);

        // 로드된 텍스처를 상태로 저장
        setTextures({
          diffuse: diffuseTexture,
          ao: aoTexture,
          normal: normalTexture,
          roughness: roughnessTexture,
        });
      } catch (error) {
        console.error("OBJ 파일 로드 중 오류 발생: ", error);
      }
    };

    loadModel();
  }, [objUrl, textureUrls]);

  // 모델의 위치, 회전, 스케일 업데이트
  useEffect(() => {
    if (model) {
      model.scale.set(scale, scale, scale);
      model.position.set(position.x, position.y, position.z);
      model.rotation.set(rotation.x, rotation.y, rotation.z);
    }
  }, [model, scale, position, rotation]);

  // 재질 업데이트
  useEffect(() => {
    if (model) {
      // 재질 파라미터 설정
      let materialParams: any = {
        wireframe,
      };

      // 텍스처 사용 여부에 따라 재질 파라미터에 텍스처 추가
      if (useDiffuse && textures.diffuse) materialParams.map = textures.diffuse;
      if (useAO && textures.ao) materialParams.aoMap = textures.ao;
      if (useNormal && textures.normal)
        materialParams.normalMap = textures.normal;
      if (useRoughness && textures.roughness)
        materialParams.roughnessMap = textures.roughness;

      // 재질 생성
      let material: THREE.Material;
      switch (materialType) {
        case "Phong":
          material = new THREE.MeshPhongMaterial(materialParams);
          break;
        case "Lambert":
          material = new THREE.MeshLambertMaterial(materialParams);
          break;
        default:
          material = new THREE.MeshStandardMaterial(materialParams);
      }

      // 오브젝트에 재질 적용
      model.traverse((child) => {
        if ((child as THREE.Mesh).isMesh) {
          const mesh = child as THREE.Mesh;
          mesh.material = material;
          // 재질 업데이트 필요 여부 설정
          if (
            mesh.material &&
            (mesh.material as any).needsUpdate !== undefined
          ) {
            (mesh.material as any).needsUpdate = true;
          }
        }
      });
    }
  }, [
    model,
    textures,
    useDiffuse,
    useAO,
    useNormal,
    useRoughness,
    materialType,
    wireframe,
  ]);

  return model ? <primitive object={model} /> : null;
}
