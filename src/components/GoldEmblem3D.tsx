import { Suspense, useMemo, useRef, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float } from '@react-three/drei';
import * as THREE from 'three';

const GOLD = '#ff960b';
const GOLD_SOFT = '#ffcf8a';

function Rig({ children }: { children: React.ReactNode }) {
  const group = useRef<THREE.Group>(null);
  const target = useRef({ x: 0, y: 0 });
  const reduceMotion = useMemo(
    () => typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches,
    []
  );

  useEffect(() => {
    if (reduceMotion) return;
    const onMove = (e: PointerEvent) => {
      target.current.x = (e.clientX / window.innerWidth - 0.5) * 2;
      target.current.y = (e.clientY / window.innerHeight - 0.5) * 2;
    };
    window.addEventListener('pointermove', onMove);
    return () => window.removeEventListener('pointermove', onMove);
  }, [reduceMotion]);

  useFrame((state, delta) => {
    if (!group.current) return;
    if (!reduceMotion) {
      group.current.rotation.y += delta * 0.25;
      group.current.rotation.x = THREE.MathUtils.damp(
        group.current.rotation.x,
        target.current.y * 0.25,
        4,
        delta
      );
      group.current.rotation.z = THREE.MathUtils.damp(
        group.current.rotation.z,
        -target.current.x * 0.12,
        4,
        delta
      );
    }
  });

  return <group ref={group}>{children}</group>;
}

function Gem() {
  return (
    <mesh castShadow receiveShadow rotation={[0.3, 0.4, 0]}>
      <icosahedronGeometry args={[1.35, 1]} />
      <meshPhysicalMaterial
        color={GOLD}
        metalness={0.9}
        roughness={0.18}
        clearcoat={1}
        clearcoatRoughness={0.15}
        reflectivity={1}
        emissive={GOLD}
        emissiveIntensity={0.08}
      />
    </mesh>
  );
}

function HaloRing() {
  const ring = useRef<THREE.Mesh>(null);
  useFrame((_, delta) => {
    if (ring.current) ring.current.rotation.z -= delta * 0.15;
  });
  return (
    <mesh ref={ring} rotation={[Math.PI / 2.4, 0, 0]}>
      <torusGeometry args={[2.05, 0.02, 16, 100]} />
      <meshStandardMaterial color={GOLD_SOFT} metalness={1} roughness={0.3} emissive={GOLD} emissiveIntensity={0.4} />
    </mesh>
  );
}

function Scene() {
  return (
    <>
      <ambientLight intensity={0.35} />
      <pointLight position={[4, 3, 4]} intensity={45} color={GOLD_SOFT} />
      <pointLight position={[-4, -2, -3]} intensity={18} color={GOLD} />
      <directionalLight position={[0, 5, 2]} intensity={1.1} color="#fff4e0" />
      <Float speed={1.4} rotationIntensity={0.3} floatIntensity={0.8}>
        <Rig>
          <Gem />
          <HaloRing />
        </Rig>
      </Float>
    </>
  );
}

function hasWebGL(): boolean {
  try {
    const canvas = document.createElement('canvas');
    return !!(canvas.getContext('webgl2') || canvas.getContext('webgl'));
  } catch {
    return false;
  }
}

/** A floating, mouse-reactive 3D gold emblem — the hero's centerpiece. Desktop only, and only where WebGL actually works. */
export default function GoldEmblem3D({ className = '' }: { className?: string }) {
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const check = () => setEnabled(window.innerWidth >= 768 && hasWebGL());
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  if (!enabled) return null;

  return (
    <div className={className} aria-hidden>
      <Canvas
        dpr={[1, 2]}
        gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
        camera={{ position: [0, 0, 6], fov: 40 }}
      >
        <Suspense fallback={null}>
          <Scene />
        </Suspense>
      </Canvas>
    </div>
  );
}
