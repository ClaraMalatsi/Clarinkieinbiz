import React, { Component, useRef, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, MeshDistortMaterial, Sparkles } from "@react-three/drei";
import { Color } from "three";

const PINK       = "#FF1493";
const PINK_LIGHT = "#ff4db0";

const easeInOut = (t) => (t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2);

/* progressRef.current = { p, after, dark }
   p     — 0→1 through the pinned hero
   after — 0→1 from the hero release to the bottom of the page
   dark  — 1 while the dark veil is up (hero), 0 over the light sections */
const readProgress = (progressRef) => {
  const { p = 0, after = 0, dark = 1 } = progressRef.current || {};
  return { p, after, dark };
};

/* Floating satellite shapes — abstract stand-ins for products
   (toruses = keyrings, cylinders = tumblers, boxes = cards…).
   `dark` variants keep white shapes visible once the page turns light. */
const SATELLITES = [
  { geo: "icosa", pos: [-4.2,  1.8, -2.0], scale: 0.55, color: "#ffffff",  wire: true,  float: 1.4 },
  { geo: "torus", pos: [ 4.6,  2.4, -3.5], scale: 0.70, color: PINK,       wire: false, float: 0.9 },
  { geo: "box",   pos: [-3.4, -2.2, -1.0], scale: 0.50, color: PINK_LIGHT, wire: false, float: 1.1 },
  { geo: "octa",  pos: [ 3.2, -2.6,  0.5], scale: 0.45, color: "#ffffff",  wire: false, float: 1.6 },
  { geo: "cyl",   pos: [-5.4,  0.2, -4.5], scale: 0.60, color: "#2e2e33",  wire: false, float: 0.7 },
  { geo: "torus", pos: [-2.2,  3.1, -5.0], scale: 0.50, color: "#ffffff",  wire: true,  float: 1.2 },
  { geo: "icosa", pos: [ 5.6, -0.6, -6.0], scale: 0.80, color: PINK,       wire: true,  float: 0.8 },
  { geo: "box",   pos: [ 2.4,  3.4,  1.5], scale: 0.35, color: "#ffffff",  wire: false, float: 1.8 },
  { geo: "cyl",   pos: [ 4.8,  1.2,  3.0], scale: 0.42, color: PINK_LIGHT, wire: false, float: 1.3 },
  { geo: "octa",  pos: [-4.6, -3.0,  2.5], scale: 0.50, color: PINK,       wire: false, float: 1.0 },
  { geo: "torus", pos: [ 0.8, -3.4, -2.5], scale: 0.55, color: "#2e2e33",  wire: false, float: 0.9 },
  { geo: "icosa", pos: [-1.6,  2.6,  3.5], scale: 0.30, color: "#ffffff",  wire: false, float: 2.0 },
].map((s) => ({
  ...s,
  cLight: new Color(s.color),
  cDark:  new Color(s.color === "#ffffff" ? "#23232b" : s.color === "#2e2e33" ? "#2b2b31" : s.color),
}));

function ShapeGeometry({ type }) {
  switch (type) {
    case "icosa": return <icosahedronGeometry args={[1, 0]} />;
    case "torus": return <torusGeometry args={[0.8, 0.3, 16, 48]} />;
    case "box":   return <boxGeometry args={[1.1, 1.1, 1.1]} />;
    case "octa":  return <octahedronGeometry args={[1, 0]} />;
    case "cyl":   return <cylinderGeometry args={[0.5, 0.65, 1.6, 24]} />;
    default:      return <icosahedronGeometry args={[1, 0]} />;
  }
}

/* Camera rig — dollies through the field during the hero, eases back
   out over the rest of the page. Mouse parallax comes from a window
   listener because the fixed canvas is pointer-events: none. */
function Rig({ progressRef }) {
  const mouse = useRef({ x: 0, y: 0 });
  useEffect(() => {
    const onMove = (e) => {
      mouse.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouse.current.y = (e.clientY / window.innerHeight) * 2 - 1;
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, []);

  useFrame(({ camera }) => {
    const { p, after } = readProgress(progressRef);
    const hp = easeInOut(p);
    const targetZ = 11 - hp * 5.5 + after * 3.5; // fly in over the hero, drift back out down the page
    camera.position.z += (targetZ - camera.position.z) * 0.08;
    camera.position.x += (mouse.current.x * 0.7 - camera.position.x) * 0.05;
    camera.position.y += (-mouse.current.y * 0.5 - camera.position.y) * 0.05;
    camera.lookAt(0, 0, 0);
  });
  return null;
}

/* The satellite field keeps revolving for the whole page scroll,
   and its colors adapt when the veil lifts over light sections. */
function SatelliteField({ progressRef }) {
  const group = useRef(null);
  const mats = useRef([]);
  useFrame(({ clock }) => {
    const { p, after, dark } = readProgress(progressRef);
    const hp = easeInOut(p);
    if (group.current) {
      group.current.rotation.y = clock.elapsedTime * 0.03 + hp * Math.PI * 0.85 + after * Math.PI * 1.1;
      group.current.rotation.x = hp * 0.1;
    }
    const t = 1 - dark;
    mats.current.forEach((m, i) => {
      if (m) m.color.copy(SATELLITES[i].cLight).lerp(SATELLITES[i].cDark, t);
    });
  });
  return (
    <group ref={group}>
      {SATELLITES.map((s, i) => (
        <Float key={i} speed={s.float * 1.6} rotationIntensity={1.2} floatIntensity={1.4}>
          <mesh position={s.pos} scale={s.scale}>
            <ShapeGeometry type={s.geo} />
            <meshStandardMaterial
              ref={(el) => { mats.current[i] = el; }}
              color={s.color}
              wireframe={s.wire}
              roughness={0.35}
              metalness={0.45}
            />
          </mesh>
        </Float>
      ))}
    </group>
  );
}

/* Centrepiece: pink torus knot — travels to centre stage during the
   hero, then drifts to the right edge and shrinks so it decorates the
   light sections without sitting behind their text. */
function HeroKnot({ progressRef }) {
  const mesh = useRef(null);
  useFrame(({ clock }) => {
    if (!mesh.current) return;
    const t = clock.elapsedTime;
    const { p, after } = readProgress(progressRef);
    const hp = easeInOut(p);
    const a = easeInOut(Math.min(1, after / 0.35));
    mesh.current.rotation.x = t * 0.18 + hp * 3.5 + after * 1.5;
    mesh.current.rotation.y = t * 0.12 + hp * 2.0;
    mesh.current.position.x = 2.3 - hp * 2.3 + a * 3.2;
    mesh.current.position.y = -a * 0.7;
    const s = 1 + hp * 0.4 - a * 0.55;
    mesh.current.scale.set(s, s, s);
  });
  return (
    <mesh ref={mesh} position={[2.3, 0, 0]}>
      <torusKnotGeometry args={[1.1, 0.38, 200, 32]} />
      <meshStandardMaterial color={PINK} roughness={0.22} metalness={0.65} />
    </mesh>
  );
}

/* Dark organic blob — drifts out to the left over the light sections */
function Blob({ progressRef }) {
  const group = useRef(null);
  useFrame(() => {
    if (!group.current) return;
    const { after } = readProgress(progressRef);
    group.current.position.x = -easeInOut(Math.min(1, after / 0.4)) * 1.6;
  });
  return (
    <group ref={group}>
      <Float speed={1.2} rotationIntensity={0.4} floatIntensity={0.8}>
        <mesh position={[-3.2, -1.6, -2.8]} scale={1.25}>
          <sphereGeometry args={[1, 48, 48]} />
          <MeshDistortMaterial color="#17171a" distort={0.45} speed={1.8} roughness={0.3} metalness={0.5} />
        </mesh>
      </Float>
    </group>
  );
}

/* If WebGL is unavailable the canvas throws — fail to the CSS glow
   instead of taking down the whole page. */
class CanvasBoundary extends Component {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  render() { return this.state.failed ? null : this.props.children; }
}

/* Fixed, full-viewport 3D layer behind the whole home page.
   pointer-events: none — the page scrolls and clicks straight through. */
export default function HeroScene({ progressRef }) {
  return (
    <CanvasBoundary>
      <Canvas
        style={{ position: "fixed", inset: 0, zIndex: 0, pointerEvents: "none" }}
        camera={{ fov: 50, position: [0, 0, 11] }}
        dpr={[1, 1.75]}
        gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      >
        <ambientLight intensity={0.4} />
        <directionalLight position={[-4, 6, 8]} intensity={1.1} />
        <pointLight position={[5, 3, 5]} intensity={60} distance={25} color={PINK} />
        <pointLight position={[-6, -2, 4]} intensity={25} distance={20} color="#ffffff" />

        <Rig progressRef={progressRef} />
        <HeroKnot progressRef={progressRef} />
        <Blob progressRef={progressRef} />
        <SatelliteField progressRef={progressRef} />
        <Sparkles count={120} scale={[18, 12, 12]} size={2} speed={0.35} color={PINK} opacity={0.6} />
      </Canvas>
    </CanvasBoundary>
  );
}
