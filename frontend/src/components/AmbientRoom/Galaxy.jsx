import { Stars, Float, Sparkles, OrbitControls, Environment } from "@react-three/drei";
import { useThree, useFrame } from "@react-three/fiber";
import { useEffect, useRef } from "react";
import * as THREE from "three";

export const GalaxyScene = () => {
  const { scene, gl, camera } = useThree();
  const floatRef = useRef();

  useEffect(() => {
    scene.fog = new THREE.Fog("#0a0523", 10, 40);
    gl.setClearColor(new THREE.Color("#0a0523"));
  }, [scene, gl]);

  useFrame(({ clock }) => {
    if (floatRef.current) {
      floatRef.current.rotation.y = clock.getElapsedTime() * 0.2;
      floatRef.current.position.y = Math.sin(clock.getElapsedTime()) * 0.3;
    }
  });

  return (
    <>
      <color attach="background" args={["#0a0523"]} />
      <ambientLight intensity={0.3} color="#a78bfa" />
      <pointLight position={[3, 5, 3]} intensity={1.5} color="#c4b5fd" />
      <Stars radius={90} depth={50} count={9000} fade speed={2} />
      <Sparkles size={2.5} count={150} speed={0.5} color="#a78bfa" />
      <Float ref={floatRef} floatIntensity={3} speed={3}>
        <mesh>
          <icosahedronGeometry args={[1.6, 3]} />
          <meshStandardMaterial color="#7c3aed" roughness={0.15} metalness={0.8} />
        </mesh>
      </Float>
      <Environment preset="dawn" />
      <OrbitControls enableZoom={false} autoRotate autoRotateSpeed={0.8} />
    </>
  );
};
