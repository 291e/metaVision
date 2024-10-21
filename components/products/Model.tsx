// Model.tsx

import { useEffect, useState } from "react";
import * as THREE from "three";
import { OBJLoader } from "three-stdlib";

interface ModelProps {
  objUrl: string;
  textureUrls: {
    diffuse?: string;
    ao?: string;
    normal?: string;
    roughness?: string;
  };
}

const Model: React.FC<ModelProps> = ({ objUrl, textureUrls }) => {
  const [model, setModel] = useState<THREE.Object3D | null>(null);

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
        object.scale.set(5, 5, 5);

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
              : Promise.resolve(null),
            textureUrlsWithProxy.ao
              ? textureLoader.loadAsync(textureUrlsWithProxy.ao)
              : Promise.resolve(null),
            textureUrlsWithProxy.normal
              ? textureLoader.loadAsync(textureUrlsWithProxy.normal)
              : Promise.resolve(null),
            textureUrlsWithProxy.roughness
              ? textureLoader.loadAsync(textureUrlsWithProxy.roughness)
              : Promise.resolve(null),
          ]);

        // 재질 생성
        const material = new THREE.MeshStandardMaterial({
          map: diffuseTexture || undefined,
          aoMap: aoTexture || undefined,
          normalMap: normalTexture || undefined,
          roughnessMap: roughnessTexture || undefined,
        });

        // 오브젝트에 재질 적용
        object.traverse((child) => {
          if ((child as THREE.Mesh).isMesh) {
            const mesh = child as THREE.Mesh;
            mesh.material = material;
          }
        });

        // 상태 업데이트
        setModel(object);
      } catch (error) {
        console.error("OBJ 파일 로드 중 오류 발생: ", error);
      }
    };

    loadModel();
  }, [objUrl, textureUrls]);

  return model ? <primitive object={model} /> : null;
};

export default Model;
