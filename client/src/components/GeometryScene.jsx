import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { MeshTransmissionMaterial, Environment } from '@react-three/drei';
import * as THREE from 'three';

const FloatingGeometry = () => {
  const torusRef = useRef();
  const sphereRef = useRef();
  const boxRef = useRef();
  const octahedronRef = useRef();

  useFrame((state) => {
    const time = state.clock.elapsedTime;
    
    if (torusRef.current) {
      torusRef.current.rotation.x = time * 0.35;
      torusRef.current.rotation.y = time * 0.22;
      torusRef.current.position.y = Math.sin(time * 0.5) * 0.6;
      torusRef.current.position.x = Math.cos(time * 0.25) * 0.4;
      torusRef.current.position.z = Math.sin(time * 0.3) * 0.3;
    }
    
    if (sphereRef.current) {
      sphereRef.current.rotation.y = time * 0.4;
      sphereRef.current.rotation.z = time * 0.18;
      sphereRef.current.position.y = Math.cos(time * 0.6) * 0.7;
      sphereRef.current.position.x = Math.sin(time * 0.35) * 0.5;
      sphereRef.current.position.z = Math.cos(time * 0.4) * 0.4;
    }
    
    if (boxRef.current) {
      boxRef.current.rotation.x = time * 0.3;
      boxRef.current.rotation.z = time * 0.25;
      boxRef.current.position.y = Math.sin(time * 0.7 + 1) * 0.65;
      boxRef.current.position.x = Math.cos(time * 0.45) * 0.45;
      boxRef.current.position.z = Math.sin(time * 0.5) * 0.35;
    }

    if (octahedronRef.current) {
      octahedronRef.current.rotation.x = time * 0.28;
      octahedronRef.current.rotation.y = time * 0.38;
      octahedronRef.current.position.y = Math.cos(time * 0.45 + 2) * 0.6;
      octahedronRef.current.position.x = Math.sin(time * 0.55) * 0.5;
      octahedronRef.current.position.z = Math.cos(time * 0.35) * 0.4;
    }
  });

  return (
    <>
      <ambientLight intensity={0.3} />
      <directionalLight position={[10, 10, 5]} intensity={1.5} color="#ffffff" castShadow />
      <pointLight position={[-8, 5, -5]} intensity={2} color="#ef4444" />
      <pointLight position={[8, -5, 5]} intensity={1.5} color="#fb923c" />
      <spotLight position={[0, 10, 0]} angle={0.3} penumbra={1} intensity={1} color="#fbbf24" />

      <Environment preset="sunset" />

      {/* Glass Torus */}
      <mesh ref={torusRef} position={[-4.5, 0, -2]} scale={1.3} castShadow receiveShadow>
        <torusGeometry args={[1, 0.4, 32, 64]} />
        <MeshTransmissionMaterial
          color="#ef4444"
          transmission={0.95}
          thickness={0.5}
          roughness={0.1}
          chromaticAberration={0.5}
          anisotropy={0.3}
          distortion={0.2}
          distortionScale={0.5}
          temporalDistortion={0.1}
        />
      </mesh>

      {/* Glass Sphere */}
      <mesh ref={sphereRef} position={[0, 0, 0]} scale={1.4} castShadow receiveShadow>
        <sphereGeometry args={[1, 64, 64]} />
        <MeshTransmissionMaterial
          color="#f97316"
          transmission={0.9}
          thickness={0.8}
          roughness={0.15}
          chromaticAberration={0.6}
          anisotropy={0.4}
          distortion={0.3}
          distortionScale={0.4}
          temporalDistortion={0.15}
        />
      </mesh>

      {/* Metallic Box */}
      <mesh ref={boxRef} position={[4.5, 0, -1]} scale={1.2} castShadow receiveShadow>
        <boxGeometry args={[1.5, 1.5, 1.5]} />
        <meshStandardMaterial
          color="#fb923c"
          metalness={0.9}
          roughness={0.2}
          envMapIntensity={1.5}
        />
      </mesh>

      {/* Crystal Octahedron */}
      <mesh ref={octahedronRef} position={[-2, 0, 2.5]} scale={1.25} castShadow receiveShadow>
        <octahedronGeometry args={[1.3, 0]} />
        <MeshTransmissionMaterial
          color="#fbbf24"
          transmission={0.85}
          thickness={0.6}
          roughness={0.05}
          chromaticAberration={0.7}
          anisotropy={0.5}
          distortion={0.15}
          distortionScale={0.3}
          temporalDistortion={0.2}
        />
      </mesh>

      {/* Ground plane for reflections */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -2, 0]} receiveShadow>
        <planeGeometry args={[20, 20]} />
        <meshStandardMaterial
          color="#fafafa"
          metalness={0.1}
          roughness={0.8}
          transparent
          opacity={0.3}
        />
      </mesh>
    </>
  );
};

const GeometryScene = () => {
  return (
    <div className="w-full h-96 pointer-events-none">
      <Canvas
        camera={{ position: [0, 0, 12], fov: 50 }}
        dpr={[1, 2]}
        shadows
        gl={{ antialias: true, alpha: true, toneMapping: THREE.ACESFilmicToneMapping }}
      >
        <FloatingGeometry />
      </Canvas>
    </div>
  );
};

export default GeometryScene;
