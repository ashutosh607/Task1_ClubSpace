import React, { useRef, useState, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Stars, Html } from "@react-three/drei";
import * as THREE from "three";
import { Orbit, Sparkles, Plus, Compass, Radio, ArrowUpRight } from "lucide-react";

// Helper function to project N nodes evenly on sphere surface using Fibonacci spiral
function getSpherePosition(index, total, radius = 3.35) {
  if (total <= 1) return [0, 0, radius];
  const phi = Math.acos(-1 + (2 * index + 1) / total);
  const theta = Math.sqrt(total * Math.PI) * phi;
  const x = radius * Math.cos(theta) * Math.sin(phi);
  const y = radius * Math.sin(theta) * Math.sin(phi);
  const z = radius * Math.cos(phi);
  return [x, y, z];
}

// Single Dynamic Club Node on 3D Globe
function DynamicClubNode({ club, position, onSelect, isSelected }) {
  const [hovered, setHovered] = useState(false);
  const nodeRef = useRef();

  useFrame((state) => {
    if (nodeRef.current && (hovered || isSelected)) {
      const t = state.clock.getElapsedTime();
      const scale = 1 + Math.sin(t * 4) * 0.15;
      nodeRef.current.scale.set(scale, scale, scale);
    }
  });

  return (
    <group position={position}>
      {/* Outer Pulse Glow Halo Ring */}
      <mesh ref={nodeRef}>
        <sphereGeometry args={[hovered || isSelected ? 0.2 : 0.13, 24, 24]} />
        <meshBasicMaterial
          color={hovered || isSelected ? "#ffffff" : "#a1a1aa"}
          wireframe={!hovered && !isSelected}
          transparent
          opacity={hovered || isSelected ? 0.75 : 0.35}
        />
      </mesh>

      {/* Inner Glowing Core */}
      <mesh>
        <sphereGeometry args={[0.07, 16, 16]} />
        <meshBasicMaterial color={hovered || isSelected ? "#ffffff" : "#e4e4e7"} />
      </mesh>

      {/* Click / Hover Raycast Hitbox */}
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
        <sphereGeometry args={[0.45, 16, 16]} />
        <meshBasicMaterial transparent opacity={0} />
      </mesh>

      {/* Futuristic Floating HUD Label */}
      <Html
        position={[0.25, 0.25, 0]}
        center
        distanceFactor={8}
        zIndexRange={[15, 0]}
      >
        <div
          onClick={(e) => {
            e.stopPropagation();
            onSelect(club);
          }}
          className={`group/node cursor-pointer transition-all duration-300 px-3.5 py-1.5 rounded-full border backdrop-blur-xl flex items-center gap-2 select-none shadow-2xl ${
            hovered || isSelected
              ? "bg-white text-black border-white scale-110 font-bold shadow-[0_0_20px_rgba(255,255,255,0.4)]"
              : "bg-black/85 text-zinc-300 border-white/20 hover:border-white/60 hover:text-white text-xs"
          }`}
        >
          <span
            className={`w-2 h-2 rounded-full ${
              hovered || isSelected ? "bg-black animate-ping" : "bg-white animate-pulse"
            }`}
          />
          <span className="whitespace-nowrap font-medium tracking-wide text-xs">
            {club.name}
          </span>
          <ArrowUpRight
            className={`w-3 h-3 opacity-0 group-hover/node:opacity-100 transition-opacity ${
              hovered || isSelected ? "opacity-100 text-black" : "text-zinc-400"
            }`}
          />
        </div>
      </Html>
    </group>
  );
}

// 3D Celestial Rotating Globe Scene
function GlobeMeshScene({ clubs, onSelect, selectedClubId }) {
  const groupRef = useRef();

  useFrame((state, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.05;
    }
  });

  const clubPositions = useMemo(() => {
    return clubs.map((club, idx) => ({
      club,
      position: getSpherePosition(idx, clubs.length, 3.35),
    }));
  }, [clubs]);

  return (
    <group ref={groupRef}>
      {/* Outer Wireframe Sphere Grid */}
      <mesh>
        <sphereGeometry args={[3.25, 64, 64]} />
        <meshBasicMaterial
          color="#ffffff"
          wireframe
          transparent
          opacity={0.14}
        />
      </mesh>

      {/* Planetary Atmosphere Glow */}
      <mesh>
        <sphereGeometry args={[3.18, 48, 48]} />
        <meshBasicMaterial color="#ffffff" transparent opacity={0.03} />
      </mesh>

      {/* Equatorial Orbit Ring 1 */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[3.3, 0.008, 12, 140]} />
        <meshBasicMaterial color="#ffffff" transparent opacity={0.3} />
      </mesh>

      {/* Polar Inclination Ring 2 */}
      <mesh rotation={[Math.PI / 4, Math.PI / 6, 0]}>
        <torusGeometry args={[3.45, 0.006, 12, 140]} />
        <meshBasicMaterial color="#ffffff" transparent opacity={0.2} />
      </mesh>

      {/* Outer Cosmic Celestial Horizon Ring */}
      <mesh rotation={[-Math.PI / 3, 0.2, 0]}>
        <torusGeometry args={[3.9, 0.005, 12, 160]} />
        <meshBasicMaterial color="#ffffff" transparent opacity={0.15} />
      </mesh>

      {/* Render Dynamic Floating Nodes */}
      {clubPositions.map(({ club, position }) => (
        <DynamicClubNode
          key={club._id || club.id || club.name}
          club={club}
          position={position}
          onSelect={onSelect}
          isSelected={selectedClubId === (club._id || club.id)}
        />
      ))}
    </group>
  );
}

// Main Seamless ClubGlobe Hero Component
export default function ClubGlobe({ clubs = [], onSelectClub, onAddClubClick, selectedClubId }) {
  return (
    <div className="relative w-full h-[580px] sm:h-[660px] lg:h-[720px] flex items-center justify-center overflow-visible">
      
      {/* Seamless Ambient Radial Backlight & Mask */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-white/[0.04] blur-[160px] rounded-full" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[380px] h-[380px] bg-cyan-500/[0.03] blur-[120px] rounded-full" />
      </div>

      {/* 3D WebGL Canvas Layer (Full Bleed Seamless) */}
      <div className="absolute inset-0 z-10">
        <Canvas camera={{ position: [0, 0, 8.8], fov: 42 }} dpr={[1, 2]}>
          <ambientLight intensity={0.9} />
          <pointLight position={[12, 12, 12]} intensity={1.2} color="#ffffff" />
          <pointLight position={[-12, -10, -10]} intensity={0.5} color="#d4d4d8" />
          <Stars
            radius={70}
            depth={50}
            count={1800}
            factor={3.2}
            saturation={0}
            fade
            speed={0.4}
          />
          <GlobeMeshScene
            clubs={clubs}
            onSelect={onSelectClub}
            selectedClubId={selectedClubId}
          />
          <OrbitControls
            enableZoom={true}
            enablePan={false}
            rotateSpeed={0.6}
            zoomSpeed={0.6}
            minDistance={6.2}
            maxDistance={12.5}
            enableDamping={true}
            dampingFactor={0.06}
            autoRotate={false}
          />
        </Canvas>
      </div>

      {/* Top Floating Telemetry Overlay Pill */}
      <div className="absolute top-4 left-6 right-6 z-20 pointer-events-none flex flex-wrap items-center justify-between gap-3">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-black/60 border border-white/15 backdrop-blur-md text-[11px] font-semibold text-zinc-300 shadow-xl">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <span className="tracking-wider uppercase text-[10px] text-zinc-400">Live Spatial Matrix</span>
          <span className="text-white font-bold ml-1">{clubs.length} Nodes Online</span>
        </div>

        <div className="hidden sm:inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-black/60 border border-white/15 backdrop-blur-md text-[11px] text-zinc-400 font-mono shadow-xl">
          <Radio className="w-3.5 h-3.5 text-zinc-300 animate-pulse" />
          <span>ORBIT COORDINATES: 37.7749° N, 122.4194° W</span>
        </div>
      </div>

      {/* Empty State Banner if 0 Clubs */}
      {clubs.length === 0 && (
        <div className="relative z-30 max-w-sm mx-auto text-center bg-black/80 border border-white/15 rounded-3xl p-6 backdrop-blur-2xl space-y-3 shadow-2xl">
          <div className="w-12 h-12 rounded-2xl bg-white/10 border border-white/20 text-white flex items-center justify-center mx-auto">
            <Orbit className="w-6 h-6 animate-pulse" />
          </div>
          <h3 className="text-base font-bold text-white uppercase tracking-wider">
            Cosmic Matrix Ready
          </h3>
          <p className="text-xs text-zinc-400 leading-relaxed">
            No campus clubs have been registered yet. Add your organization to launch its 3D orbital node.
          </p>
          {onAddClubClick && (
            <button
              onClick={onAddClubClick}
              className="w-full inline-flex items-center justify-center gap-2 bg-white hover:bg-zinc-200 text-black font-bold text-xs px-4 py-2.5 rounded-xl transition-all shadow-lg active:scale-95 cursor-pointer"
            >
              <Plus className="w-4 h-4" /> Register Campus Club
            </button>
          )}
        </div>
      )}

      {/* Bottom Orbital Control Hints Bar & Quick Node Chips */}
      <div className="absolute bottom-4 inset-x-6 z-20 pointer-events-none flex flex-col sm:flex-row items-center justify-between gap-3">
        {/* Interactive Controls Hint */}
        <div className="inline-flex items-center gap-2.5 text-[11px] text-zinc-300 font-medium bg-black/70 border border-white/15 backdrop-blur-md py-2 px-4 rounded-full shadow-xl">
          <Compass className="w-3.5 h-3.5 text-zinc-400" />
          <span>Drag orbit to rotate</span>
          <span className="text-zinc-600">•</span>
          <span>Scroll to zoom</span>
          <span className="text-zinc-600">•</span>
          <span>Click node to inspect</span>
        </div>

        {/* Quick Node Orbit Jumpers */}
        {clubs.length > 0 && (
          <div className="pointer-events-auto flex items-center gap-1.5 overflow-x-auto max-w-full sm:max-w-md py-1 scrollbar-none">
            {clubs.slice(0, 4).map((c) => (
              <button
                key={c._id || c.id || c.name}
                onClick={() => onSelectClub(c)}
                className="px-3 py-1 rounded-full text-[10px] font-semibold tracking-wide bg-white/5 hover:bg-white/15 border border-white/10 hover:border-white/30 text-zinc-300 hover:text-white transition-all whitespace-nowrap backdrop-blur-md cursor-pointer"
              >
                ✦ {c.name}
              </button>
            ))}
            {clubs.length > 4 && (
              <span className="text-[10px] text-zinc-500 font-mono px-1">
                +{clubs.length - 4} more
              </span>
            )}
          </div>
        )}
      </div>

      {/* Seamless Fade Gradient towards bottom content */}
      <div className="absolute bottom-0 inset-x-0 h-24 bg-gradient-to-t from-[#050508] via-[#050508]/60 to-transparent pointer-events-none z-15" />
    </div>
  );
}
