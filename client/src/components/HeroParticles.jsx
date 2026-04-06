import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { EffectComposer, Bloom } from '@react-three/drei';
import * as THREE from 'three';

const ParticleField = () => {
  const pointsRef = useRef();
  const count = 1500;

  const [positions, colors, sizes, velocities] = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const sizes = new Float32Array(count);
    const velocities = new Float32Array(count * 3);

    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      
      // Spread particles in 3D space
      positions[i3] = (Math.random() - 0.5) * 60;
      positions[i3 + 1] = (Math.random() - 0.5) * 40;
      positions[i3 + 2] = (Math.random() - 0.5) * 30;

      // Realistic color temperature gradient
      const temp = Math.random();
      if (temp > 0.8) {
        // Hot red
        colors[i3] = 1.0;
        colors[i3 + 1] = 0.2;
        colors[i3 + 2] = 0.1;
      } else if (temp > 0.6) {
        // Warm orange
        colors[i3] = 1.0;
        colors[i3 + 1] = 0.5;
        colors[i3 + 2] = 0.2;
      } else if (temp > 0.35) {
        // Amber glow
        colors[i3] = 1.0;
        colors[i3 + 1] = 0.75;
        colors[i3 + 2] = 0.3;
      } else {
        // Cool gray
        colors[i3] = 0.7;
        colors[i3 + 1] = 0.7;
        colors[i3 + 2] = 0.75;
      }

      // Varied particle sizes with depth
      const depth = Math.abs(positions[i3 + 2]);
      sizes[i] = (Math.random() * 0.4 + 0.2) * (1 - depth / 40);

      // Random velocities for organic motion
      velocities[i3] = (Math.random() - 0.5) * 0.02;
      velocities[i3 + 1] = (Math.random() - 0.5) * 0.02;
      velocities[i3 + 2] = (Math.random() - 0.5) * 0.01;
    }

    return [positions, colors, sizes, velocities];
  }, [count]);

  useFrame((state) => {
    if (!pointsRef.current) return;
    const time = state.clock.elapsedTime;
    
    // Slow global rotation
    pointsRef.current.rotation.y = time * 0.02;
    pointsRef.current.rotation.x = Math.sin(time * 0.05) * 0.1;

    // Organic particle motion
    const positions = pointsRef.current.geometry.attributes.position.array;
    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      const x = positions[i3];
      const y = positions[i3 + 1];
      const z = positions[i3 + 2];
      
      // Turbulent flow field
      positions[i3] += velocities[i3] + Math.sin(time * 0.3 + y * 0.02) * 0.005;
      positions[i3 + 1] += velocities[i3 + 1] + Math.cos(time * 0.4 + x * 0.02) * 0.005;
      positions[i3 + 2] += velocities[i3 + 2] + Math.sin(time * 0.2 + x * 0.01 + y * 0.01) * 0.003;

      // Boundary wrapping
      if (Math.abs(positions[i3]) > 30) positions[i3] *= -0.95;
      if (Math.abs(positions[i3 + 1]) > 20) positions[i3 + 1] *= -0.95;
      if (Math.abs(positions[i3 + 2]) > 15) positions[i3 + 2] *= -0.95;
    }
    pointsRef.current.geometry.attributes.position.needsUpdate = true;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={count} array={positions} itemSize={3} />
        <bufferAttribute attach="attributes-color" count={count} array={colors} itemSize={3} />
        <bufferAttribute attach="attributes-size" count={count} array={sizes} itemSize={1} />
      </bufferGeometry>
      <pointsMaterial
        size={0.25}
        vertexColors
        transparent
        opacity={0.85}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
};

const HeroParticles = () => {
  return (
    <div className="absolute inset-0 pointer-events-none">
      <Canvas
        camera={{ position: [0, 0, 20], fov: 70 }}
        style={{ background: 'transparent' }}
        dpr={[1, 2]}
        gl={{ antialias: true, alpha: true }}
      >
        <ParticleField />
        <EffectComposer>
          <Bloom luminanceThreshold={0.3} luminanceSmoothing={0.9} intensity={0.5} />
        </EffectComposer>
      </Canvas>
    </div>
  );
};

export default HeroParticles;
