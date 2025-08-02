import { Float, Cloud, Sparkles, OrbitControls, Environment } from "@react-three/drei";
import { useThree, useFrame } from "@react-three/fiber";
import { useEffect, useRef } from "react";
import * as THREE from "three";

export const SkyScene = () => {
  const { scene, gl } = useThree();
  const floatRef = useRef();

  useEffect(() => {
    scene.fog = new THREE.Fog("#a7c7e7", 5, 25);
    gl.setClearColor(new THREE.Color("#a7c7e7"));
  }, [scene, gl]);

  useFrame(({ clock }) => {
    if (floatRef.current) {
      floatRef.current.rotation.y = clock.getElapsedTime() * 0.3;
      floatRef.current.position.y = 0.5 + Math.sin(clock.getElapsedTime() * 1.5) * 0.2;
    }
  });

  return (
    <>
      <color attach="background" args={["#a7c7e7"]} />
      <ambientLight intensity={0.7} color="#fcd34d" />
      <pointLight position={[0, 4, 3]} intensity={1.2} color="#fbbf24" />
      <Cloud position={[3, 5, -3]} scale={3} opacity={0.4} />
      <Cloud position={[-3, 6, -4]} scale={2.5} opacity={0.35} />
      <Sparkles size={1.5} count={60} speed={0.3} color="#fde68a" />
      <Float ref={floatRef} floatIntensity={1.5} speed={1.8}>
        <mesh>
          <sphereGeometry args={[1.3, 64, 64]} />
          <meshStandardMaterial color="#fcd34d" roughness={0.3} />
        </mesh>
      </Float>
      <Environment preset="sunset" />
      <OrbitControls enableZoom={false} autoRotate autoRotateSpeed={0.7} />
    </>
  );
};
