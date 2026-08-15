import React, { useRef, useState, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Stars, Html } from "@react-three/drei";
import * as THREE from "three";
import { Orbit, Sparkles, Plus } from "lucide-react";

// Helper function to project N nodes evenly on sphere surface
function getSpherePosition(index, total, radius = 3.25) {
  if (total <= 1) return [0, 0, radius];
  // Fibonacci sphere layout algorithm
  const phi = Math.acos(-1 + (2 * index + 1) / total);
  const theta = Math.sqrt(total * Math.PI) * phi;
  const x = radius * Math.cos(theta) * Math.sin(phi);
  const y = radius * Math.sin(theta) * Math.sin(phi);
  const z = radius * Math.cos(phi);
  return [x, y, z];
}

// Single Club Node on 3D Globe
function DynamicClubNode({ club, position, onSelect }) {
  const [hovered, setHovered] = useState(false);

  return (
    <group position={position}>
      {/* Outer Pulse Glow Ring */}
      <mesh>
        <sphereGeometry args={[hovered ? 0.18 : 0.12, 24, 24]} />
        <meshBasicMaterial
          color={hovered ? "#ffffff" : "#a1a1aa"}
          wireframe={!hovered}
          transparent
          opacity={hovered ? 0.6 : 0.3}
        />
      </mesh>

      {/* Inner Node Core */}
      <mesh>
        <sphereGeometry args={[0.06, 16, 16]} />
        <meshBasicMaterial color={hovered ? "#ffffff" : "#e4e4e7"} />
      </mesh>

      {/* Raycast Invisible Trigger Sphere */}
      <mesh
        onPointerOver={(e) => {
          e.stopPropagation();
          setHovered(true);
          document.body.style.cursor = "pointer";
        }}
        onPointerOut={() => {
          setHovered(false);
          document.body.style.cursor = "default";
        }}
        onClick={(e) => {
          e.stopPropagation();
          onSelect(club);
        }}
      >
        <sphereGeometry args={[0.35, 16, 16]} />
        <meshBasicMaterial transparent opacity={0} />
      </mesh>

      {/* Sleek Monochromatic Badge HTML Label */}
      <Html
        position={[0.2, 0.2, 0]}
        center
        distanceFactor={8}
        zIndexRange={[10, 0]}
      >
        <div
          onClick={(e) => {
            e.stopPropagation();
            onSelect(club);
          }}
          className={`cursor-pointer transition-all duration-300 px-3 py-1.5 rounded-full border backdrop-blur-md flex items-center gap-2 select-none shadow-xl ${
            hovered
              ? "bg-white text-black border-white scale-110 font-bold"
              : "bg-black/80 text-zinc-300 border-white/20 hover:border-white/60 text-xs"
          }`}
        >
          <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
          <span className="whitespace-nowrap font-medium tracking-wide">
            {club.name}
          </span>
        </div>
      </Html>
    </group>
  );
}

// 3D Rotating Globe Mesh Group
function GlobeGroup({ clubs, onSelect }) {
  const groupRef = useRef();

  useFrame((state, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.06;
    }
  });

  // Calculate coordinates for clubs dynamically
  const clubPositions = useMemo(() => {
    return clubs.map((club, idx) => ({
      club,
      position: getSpherePosition(idx, clubs.length, 3.25),
    }));
  }, [clubs]);

  return (
    <group ref={groupRef}>
      {/* Outer Monochromatic Sphere Grid */}
      <mesh>
        <sphereGeometry args={[3.2, 72, 72]} />
        <meshBasicMaterial
          color="#ffffff"
          wireframe
          transparent
          opacity={0.12}
        />
      </mesh>

      {/* Inner Subtle Atmosphere */}
      <mesh>
        <sphereGeometry args={[3.12, 48, 48]} />
        <meshBasicMaterial color="#ffffff" transparent opacity={0.02} />
      </mesh>

      {/* Equator Ring */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[3.2, 0.008, 12, 120]} />
        <meshBasicMaterial color="#ffffff" transparent opacity={0.25} />
      </mesh>

      {/* Polar Meridian Ring */}
      <mesh rotation={[0, Math.PI / 4, 0]}>
        <torusGeometry args={[3.2, 0.008, 12, 120]} />
        <meshBasicMaterial color="#ffffff" transparent opacity={0.18} />
      </mesh>

      {/* Render Dynamic Floating Unjoined Nodes */}
      {clubPositions.map(({ club, position }) => (
        <DynamicClubNode
          key={club._id || club.id || club.name}
          club={club}
          position={position}
          onSelect={onSelect}
        />
      ))}
    </group>
  );
}

// Main ClubGlobe Canvas Component
export default function ClubGlobe({ clubs = [], onSelectClub, onAddClubClick }) {
  return (
    <div className="relative w-full h-[520px] md:h-[620px] rounded-3xl overflow-hidden bg-[#000000] border border-white/10 shadow-2xl flex flex-col justify-between p-6">
      {/* Background Starfield Canvas */}
      <div className="absolute inset-0 z-0">
        <Canvas camera={{ position: [0, 0, 8.5], fov: 42 }} dpr={[1, 2]}>
          <ambientLight intensity={0.8} />
          <pointLight position={[10, 10, 10]} intensity={1} color="#ffffff" />
          <Stars
            radius={60}
            depth={40}
            count={1600}
            factor={3}
            saturation={0}
            fade
            speed={0.4}
          />
          <GlobeGroup clubs={clubs} onSelect={onSelectClub} />
          <OrbitControls
            enableZoom={true}
            enablePan={false}
            rotateSpeed={0.55}
            zoomSpeed={0.6}
            minDistance={6}
            maxDistance={12}
            enableDamping={true}
            dampingFactor={0.05}
          />
        </Canvas>
      </div>

      {/* Top Overlay Heading Info */}
      <div className="relative z-10 pointer-events-none flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 border border-white/20 text-[10px] font-bold tracking-[0.2em] uppercase text-zinc-300 backdrop-blur-md">
            <Sparkles className="w-3 h-3 text-white" /> 3D CAMPUS GLOBE
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white mt-2">
            Explore Campus <span className="text-zinc-400">Nodes.</span>
          </h2>
        </div>

        {/* Dynamic Nodes Count Indicator */}
        <div className="pointer-events-auto bg-black/70 border border-white/10 backdrop-blur-md px-4 py-2 rounded-2xl flex items-center gap-3 text-xs text-zinc-300">
          <Orbit className="w-4 h-4 text-white animate-spin-slow" />
          <span>
            <strong className="text-white font-bold">{clubs.length}</strong>{" "}
            {clubs.length === 1 ? "Active Club" : "Active Clubs"}
          </span>
        </div>
      </div>

      {/* Empty State Banner when 0 Clubs exist */}
      {clubs.length === 0 && (
        <div className="relative z-10 max-w-sm mx-auto my-auto text-center bg-black/80 border border-white/15 rounded-3xl p-6 backdrop-blur-xl space-y-3 pointer-events-auto">
          <div className="w-10 h-10 rounded-2xl bg-white/10 border border-white/20 text-white flex items-center justify-center mx-auto font-bold">
            <Orbit className="w-5 h-5 animate-pulse" />
          </div>
          <h3 className="text-sm font-bold text-white uppercase tracking-wider">
            No Clubs Added Yet
          </h3>
          <p className="text-xs text-zinc-400 leading-relaxed">
            The globe is ready! Add your campus club using the button below to see it float on the 3D grid.
          </p>
          {onAddClubClick && (
            <button
              onClick={onAddClubClick}
              className="w-full inline-flex items-center justify-center gap-2 bg-white hover:bg-zinc-200 text-black font-bold text-xs px-4 py-2.5 rounded-xl transition-all shadow-lg active:scale-95"
            >
              <Plus className="w-4 h-4" /> Add Campus Club
            </button>
          )}
        </div>
      )}

      {/* Bottom Controls Instruction Hint */}
      <div className="relative z-10 pointer-events-none flex items-center justify-center gap-2 text-[11px] text-zinc-400 font-medium bg-black/60 border border-white/10 backdrop-blur-md py-2 px-4 rounded-full max-w-xs mx-auto text-center">
        <span>↔</span> Drag to rotate
        <span>•</span>
        <span>🔍</span> Scroll to zoom
      </div>
    </div>
  );
}
