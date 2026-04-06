import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { EffectComposer, Bloom, ChromaticAberration } from '@react-three/drei';
import * as THREE from 'three';

const WireframeGlobe = () => {
  const globeRef = useRef();
  const innerGlobeRef = useRef();
  const particlesRef = useRef();
  const ringsRef = useRef();
  const coreRef = useRef();

  useFrame((state) => {
    const time = state.clock.elapsedTime;
    
    if (globeRef.current) {
      globeRef.current.rotation.y = time * 0.1;
      globeRef.current.rotation.x = Math.sin(time * 0.12) * 0.2;
    }

    if (innerGlobeRef.current) {
      innerGlobeRef.current.rotation.y = -time * 0.15;
      innerGlobeRef.current.rotation.z = Math.cos(time * 0.08) * 0.15;
    }
    
    if (particlesRef.current) {
      particlesRef.current.rotation.y = -time * 0.12;
      particlesRef.current.rotation.x = Math.sin(time * 0.18) * 0.12;
    }

    if (ringsRef.current) {
      ringsRef.current.rotation.z = time * 0.08;
      ringsRef.current.rotation.x = Math.sin(time * 0.1) * 0.1;
    }

    if (coreRef.current) {
      coreRef.current.scale.setScalar(1 + Math.sin(time * 2) * 0.05);
    }
  });

  // Enhanced particles
  const particleCount = 200;
  const [particlePositions, particleSizes, particleColors] = useMemo(() => {
    const positions = new Float32Array(particleCount * 3);
    const sizes = new Float32Array(particleCount);
    const colors = new Float32Array(particleCount * 3);
    
    for (let i = 0; i < particleCount; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(Math.random() * 2 - 1);
      const radius = 3.5 + Math.random() * 1.2;
      
      positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = radius * Math.cos(phi);

      sizes[i] = Math.random() * 0.2 + 0.08;

      // Color gradient
      const colorMix = Math.random();
      if (colorMix > 0.6) {
        colors[i * 3] = 1.0; colors[i * 3 + 1] = 0.75; colors[i * 3 + 2] = 0.3; // amber
      } else if (colorMix > 0.3) {
        colors[i * 3] = 1.0; colors[i * 3 + 1] = 0.57; colors[i * 3 + 2] = 0.24; // orange
      } else {
        colors[i * 3] = 0.94; colors[i * 3 + 1] = 0.27; colors[i * 3 + 2] = 0.27; // red
      }
    }

    return [positions, sizes, colors];
  }, []);

  return (
    <>
      <ambientLight intensity={0.2} />
      <pointLight position={[10, 10, 10]} intensity={2} color="#ef4444" />
      <pointLight position={[-8, -8, 8]} intensity={1.5} color="#fb923c" />
      <pointLight position={[0, 0, 15]} intensity={1} color="#fbbf24" />

      {/* Pulsing core */}
      <mesh ref={coreRef}>
        <sphereGeometry args={[2, 32, 32]} />
        <meshBasicMaterial
          color="#ef4444"
          transparent
          opacity={0.15}
        />
      </mesh>

      {/* Inner glow layers */}
      <mesh>
        <sphereGeometry args={[2.3, 32, 32]} />
        <meshBasicMaterial
          color="#fb923c"
          transparent
          opacity={0.08}
          side={THREE.BackSide}
        />
      </mesh>

      {/* Inner Wireframe Globe */}
      <mesh ref={innerGlobeRef}>
        <sphereGeometry args={[2.8, 48, 48]} />
        <meshBasicMaterial
          color="#fb923c"
          wireframe
          transparent
          opacity={0.35}
        />
      </mesh>

      {/* Outer Wireframe Globe */}
      <mesh ref={globeRef}>
        <sphereGeometry args={[3.2, 56, 56]} />
        <meshBasicMaterial
          color="#ef4444"
          wireframe
          transparent
          opacity={0.5}
        />
      </mesh>

      {/* Orbital rings with glow */}
      <group ref={ringsRef}>
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[3.8, 0.03, 16, 120]} />
          <meshBasicMaterial color="#fbbf24" transparent opacity={0.4} />
        </mesh>
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[3.75, 0.015, 16, 120]} />
          <meshBasicMaterial color="#fbbf24" transparent opacity={0.6} />
        </mesh>
        <mesh rotation={[Math.PI / 3, Math.PI / 4, 0]}>
          <torusGeometry args={[3.6, 0.025, 16, 120]} />
          <meshBasicMaterial color="#fb923c" transparent opacity={0.35} />
        </mesh>
        <mesh rotation={[Math.PI / 4, -Math.PI / 3, Math.PI / 6]}>
          <torusGeometry args={[3.5, 0.02, 16, 120]} />
          <meshBasicMaterial color="#ef4444" transparent opacity={0.3} />
        </mesh>
      </group>

      {/* Enhanced particles */}
      <points ref={particlesRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" count={particleCount} array={particlePositions} itemSize={3} />
          <bufferAttribute attach="attributes-size" count={particleCount} array={particleSizes} itemSize={1} />
          <bufferAttribute attach="attributes-color" count={particleCount} array={particleColors} itemSize={3} />
        </bufferGeometry>
        <pointsMaterial
          size={0.15}
          vertexColors
          transparent
          opacity={0.8}
          sizeAttenuation
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </points>
    </>
  );
};

const GlobeScene = () => {
  return (
    <div className="absolute inset-0 pointer-events-none opacity-60">
      <Canvas
        camera={{ position: [0, 0, 12], fov: 50 }}
        dpr={[1, 2]}
        gl={{ antialias: true, alpha: true }}
      >
        <WireframeGlobe />
        <EffectComposer>
          <Bloom luminanceThreshold={0.2} luminanceSmoothing={0.9} intensity={1.2} />
          <ChromaticAberration offset={[0.001, 0.001]} />
        </EffectComposer>
      </Canvas>
    </div>
  );
};

export default GlobeScene;
