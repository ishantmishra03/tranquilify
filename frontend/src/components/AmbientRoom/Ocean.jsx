import { Float, Cloud, OrbitControls, Sparkles, Environment } from "@react-three/drei";
import { useThree } from "@react-three/fiber";
import { useEffect } from "react";
import * as THREE from "three";

export const OceanScene = () => {
  const { scene, gl } = useThree();

  useEffect(() => {
    scene.fog = new THREE.Fog("#082f49", 6, 20); 
    gl.setClearColor(new THREE.Color("#082f49"));
  }, [scene, gl]);

  return (
    <>
      <color attach="background" args={["#082f49"]} />

     
      <ambientLight intensity={0.3} />
      <directionalLight position={[5, 6, 5]} intensity={0.7} color="#7dd3fc" />

     
      <Float floatIntensity={2} speed={2}>
        <mesh position={[0, 0.5, 0]}>
          <torusGeometry args={[1.2, 0.25, 16, 100]} />
          <meshStandardMaterial
            color="#38bdf8"
            transparent
            opacity={0.35}
            emissive="#0ea5e9"
            emissiveIntensity={0.7}
          />
        </mesh>
      </Float>

     
      <Sparkles
        size={2}
        count={60}
        speed={0.2}
        scale={[8, 3, 8]}
        color="#bae6fd"
        position={[0, 1.5, 0]}
      />

    
      <Cloud position={[3, 3, -6]} scale={2.5} opacity={0.35} />
      <Cloud position={[-3, 4, -4]} scale={2} opacity={0.4} />

     
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1, 0]} receiveShadow>
        <planeGeometry args={[50, 50]} />
        <meshStandardMaterial color="#0c4a6e" />
      </mesh>

      
      <Environment preset="sunset" />

      
      <OrbitControls enableZoom={false} autoRotate autoRotateSpeed={0.4} />
    </>
  );
};
