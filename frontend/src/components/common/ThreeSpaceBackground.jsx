import React, { useEffect, useRef } from "react";
import * as THREE from "three";

const ThreeSpaceBackground = () => {
  const mountRef = useRef(null);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // Scene, Camera, Renderer
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      60,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.z = 400;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    // 1. Starfield Particles - Monochromatic Pure White/Grey Palette
    const starCount = 2500;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(starCount * 3);
    const colors = new Float32Array(starCount * 3);
    const sizes = new Float32Array(starCount);

    const monochromaticPalette = [
      new THREE.Color("#ffffff"), // Pure white
      new THREE.Color("#f4f4f5"), // Bright white-zinc
      new THREE.Color("#e4e4e7"), // Light grey
      new THREE.Color("#a1a1aa"), // Medium grey
    ];

    for (let i = 0; i < starCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 1200;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 1200;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 1200;

      const randomColor =
        monochromaticPalette[
          Math.floor(Math.random() * monochromaticPalette.length)
        ];
      colors[i * 3] = randomColor.r;
      colors[i * 3 + 1] = randomColor.g;
      colors[i * 3 + 2] = randomColor.b;

      sizes[i] = Math.random() * 2.5 + 0.5;
    }

    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));
    geometry.setAttribute("size", new THREE.BufferAttribute(sizes, 1));

    // Custom Shader / Texture material for soft circular white glowing stars
    const canvas = document.createElement("canvas");
    canvas.width = 16;
    canvas.height = 16;
    const ctx = canvas.getContext("2d");
    const grad = ctx.createRadialGradient(8, 8, 0, 8, 8, 8);
    grad.addColorStop(0, "rgba(255,255,255,1)");
    grad.addColorStop(0.4, "rgba(255,255,255,0.5)");
    grad.addColorStop(1, "rgba(255,255,255,0)");
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 16, 16);

    const texture = new THREE.CanvasTexture(canvas);

    const material = new THREE.PointsMaterial({
      size: 3,
      vertexColors: true,
      map: texture,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });

    const starParticles = new THREE.Points(geometry, material);
    scene.add(starParticles);

    // 2. Cosmic Dust Ring (Monochromatic Grey/White)
    const nebulaCount = 600;
    const nebulaGeo = new THREE.BufferGeometry();
    const nebulaPos = new Float32Array(nebulaCount * 3);
    const nebulaCols = new Float32Array(nebulaCount * 3);

    for (let i = 0; i < nebulaCount; i++) {
      const radius = 200 + Math.random() * 250;
      const angle = Math.random() * Math.PI * 2;
      const y = (Math.random() - 0.5) * 150;

      nebulaPos[i * 3] = Math.cos(angle) * radius;
      nebulaPos[i * 3 + 1] = y;
      nebulaPos[i * 3 + 2] = Math.sin(angle) * radius;

      const monoColor =
        Math.random() > 0.5
          ? new THREE.Color("#d4d4d8")
          : new THREE.Color("#71717a");
      nebulaCols[i * 3] = monoColor.r;
      nebulaCols[i * 3 + 1] = monoColor.g;
      nebulaCols[i * 3 + 2] = monoColor.b;
    }

    nebulaGeo.setAttribute(
      "position",
      new THREE.BufferAttribute(nebulaPos, 3)
    );
    nebulaGeo.setAttribute("color", new THREE.BufferAttribute(nebulaCols, 3));

    const nebulaMat = new THREE.PointsMaterial({
      size: 6,
      vertexColors: true,
      map: texture,
      transparent: true,
      opacity: 0.3,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });

    const nebulaRing = new THREE.Points(nebulaGeo, nebulaMat);
    scene.add(nebulaRing);

    // Mouse Interaction
    let mouseX = 0;
    let mouseY = 0;
    let targetX = 0;
    let targetY = 0;

    const handleMouseMove = (event) => {
      mouseX = (event.clientX - window.innerWidth / 2) * 0.04;
      mouseY = (event.clientY - window.innerHeight / 2) * 0.04;
    };
    window.addEventListener("mousemove", handleMouseMove);

    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener("resize", handleResize);

    // Animation Loop
    let animationFrameId;
    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      starParticles.rotation.y += 0.0003;
      starParticles.rotation.x += 0.0001;
      nebulaRing.rotation.y -= 0.0004;

      targetX += (mouseX - targetX) * 0.05;
      targetY += (-mouseY - targetY) * 0.05;
      camera.position.x = targetX;
      camera.position.y = targetY;
      camera.lookAt(scene.position);

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animationFrameId);
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      geometry.dispose();
      material.dispose();
      nebulaGeo.dispose();
      nebulaMat.dispose();
    };
  }, []);

  return (
    <div
      ref={mountRef}
      className="fixed inset-0 pointer-events-none z-0 block w-full h-full"
    />
  );
};

export default ThreeSpaceBackground;
