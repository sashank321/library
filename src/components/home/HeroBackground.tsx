"use client";

import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Points, PointMaterial } from '@react-three/drei';
// @ts-expect-error maath does not have built-in typescript declarations
import * as random from 'maath/random/dist/maath-random.esm';

function Starfield(props: any) {
  const ref = useRef<any>(null);
  
  // Use useMemo to generate the sphere points only once
  const sphere = useMemo(() => {
    // Generate a Float32Array of 3D coordinates on a sphere of radius 1.5
    return random.inSphere(new Float32Array(15000), { radius: 2.5 }) as Float32Array;
  }, []);

  useFrame((state, delta) => {
    if (ref.current) {
      ref.current.rotation.x -= delta / 10;
      ref.current.rotation.y -= delta / 15;
    }
  });

  return (
    <group rotation={[0, 0, Math.PI / 4]}>
      <Points ref={ref} positions={sphere} stride={3} frustumCulled={false} {...props}>
        <PointMaterial
          transparent
          color="#d4d4d8"
          size={0.003}
          sizeAttenuation={true}
          depthWrite={false}
          opacity={0.4}
        />
      </Points>
    </group>
  );
}

export function HeroBackground() {
  return (
    <div className="absolute inset-0 z-0 bg-[#000000]">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(214,179,106,0.05)_0%,rgba(0,0,0,0)_70%)]" />
      <Canvas camera={{ position: [0, 0, 1] }}>
        <Starfield />
      </Canvas>
    </div>
  );
}
