import { Stars, Float, Sparkles, OrbitControls, Environment } from "@react-three/drei";
import { useThree, useFrame } from "@react-three/fiber";
import { useEffect, useRef } from "react";
import * as THREE from "three";

export const MountainScene = () => {
  const { scene, gl } = useThree();
  const floatRef = useRef();

  useEffect(() => {
    scene.fog = new THREE.Fog("#1a1740", 8, 30);
    gl.setClearColor(new THREE.Color("#1a1740"));
  }, [scene, gl]);

  useFrame(({ clock }) => {
    if (floatRef.current) {
      floatRef.current.rotation.y = clock.getElapsedTime() * 0.25;
      floatRef.current.position.y = Math.sin(clock.getElapsedTime() * 1.7) * 0.3;
    }
  });

  return (
    <>
      <color attach="background" args={["#1a1740"]} />
      <ambientLight intensity={0.35} color="#a78bfa" />
      <pointLight position={[0, 6, 3]} intensity={1.3} color="#c4b5fd" />
      <Stars radius={65} depth={35} count={6000} fade speed={1.7} />
      <Sparkles size={2} count={100} speed={0.4} color="#c084fc" />
      <Float ref={floatRef} floatIntensity={1.8} speed={2.5}>
        <mesh>
          <octahedronGeometry args={[1.6, 0]} />
          <meshStandardMaterial color="#7c3aed" roughness={0.25} metalness={0.7} />
        </mesh>
      </Float>
      <Environment preset="night" />
      <OrbitControls enableZoom={false} autoRotate autoRotateSpeed={0.75} />
    </>
  );
};
