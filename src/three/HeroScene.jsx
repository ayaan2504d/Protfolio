import { Float, Sparkles } from "@react-three/drei";
import { Canvas, useFrame } from "@react-three/fiber";
import { Suspense, useRef } from "react";

function OrbitingCore() {
  const group = useRef(null);

  useFrame((state, delta) => {
    group.current.rotation.y += delta * 0.12;
    group.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.16) * 0.08;
  });

  return (
    <group ref={group} rotation={[0.26, 0, -0.32]}>
      <mesh>
        <icosahedronGeometry args={[1.18, 2]} />
        <meshStandardMaterial
          color="#122342"
          metalness={0.45}
          roughness={0.38}
          wireframe
          transparent
          opacity={0.58}
        />
      </mesh>
      <mesh scale={0.84}>
        <icosahedronGeometry args={[1.18, 3]} />
        <meshStandardMaterial
          color="#173b68"
          metalness={0.7}
          roughness={0.24}
          transparent
          opacity={0.38}
        />
      </mesh>
      <mesh rotation={[Math.PI / 2.5, 0.3, 0.4]}>
        <torusGeometry args={[1.58, 0.008, 8, 160]} />
        <meshBasicMaterial color="#679fff" transparent opacity={0.58} />
      </mesh>
    </group>
  );
}

export default function HeroScene() {
  return (
    <div className="hero-scene" aria-hidden="true">
      <Suspense fallback={null}>
        <Canvas
          dpr={[1, 1.25]}
          camera={{ position: [0, 0, 5.2], fov: 40 }}
          gl={{ alpha: true, antialias: false, powerPreference: "low-power" }}
          style={{ background: "transparent" }}
        >
          <ambientLight intensity={0.8} />
          <pointLight position={[3, 3, 3]} intensity={3} color="#79aaff" />
          <pointLight position={[-3, -2, 1]} intensity={1.4} color="#9777ef" />
          <Float speed={0.55} rotationIntensity={0.12} floatIntensity={0.18}>
            <OrbitingCore />
          </Float>
          <Sparkles
            count={24}
            scale={5}
            size={1.2}
            speed={0.12}
            opacity={0.42}
            color="#8bbcff"
          />
        </Canvas>
      </Suspense>
    </div>
  );
}
