import { Float, Sparkles, OrbitControls, Environment, Cloud } from "@react-three/drei";
import { useThree } from "@react-three/fiber";
import { useEffect } from "react";
import * as THREE from "three";

export const ForestScene = () => {
  const { scene, gl } = useThree();

  useEffect(() => {
    scene.fog = new THREE.Fog("#022c22", 5, 18); 
    gl.setClearColor(new THREE.Color("#022c22")); 
  }, [scene, gl]);

  return (
    <>
      <color attach="background" args={["#022c22"]} />
      <ambientLight intensity={0.4} color="#4ade80" />
      <directionalLight position={[3, 6, 5]} intensity={1} color="#bbf7d0" />

    
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[100, 100]} />
        <meshStandardMaterial color="#14532d" />
      </mesh>

      
      <Float floatIntensity={1.5} speed={2}>
        <mesh position={[0, 1, 0]}>
          <sphereGeometry args={[0.5, 32, 32]} />
          <meshStandardMaterial color="#4ade80" emissive="#22c55e" emissiveIntensity={0.6} />
        </mesh>
      </Float>

     
      <Sparkles
        size={1.5}
        count={80}
        speed={0.3}
        scale={[10, 4, 10]}
        color="#bbf7d0"
        position={[0, 2, 0]}
      />

      
      {Array.from({ length: 20 }).map((_, i) => (
        <mesh
          key={i}
          position={[
            Math.random() * 20 - 10,
            1,
            Math.random() * 20 - 10
          ]}
        >
          <cylinderGeometry args={[0.2, 0.4, 4, 6]} />
          <meshStandardMaterial color="#065f46" />
        </mesh>
      ))}

      
      <Cloud position={[5, 10, -10]} scale={5} opacity={0.2} />
      <Cloud position={[-5, 12, -8]} scale={4} opacity={0.25} />

      
      <Environment preset="forest" />

    
      <OrbitControls enableZoom={false} autoRotate autoRotateSpeed={0.5} />
    </>
  );
};
