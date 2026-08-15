import React, { useEffect, useRef } from "react";

const SpaceBackground = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", handleResize);

    // Create Stars - Monochromatic White/Grey palette only
    const starCount = Math.floor((width * height) / 3500);
    const stars = Array.from({ length: starCount }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      size: Math.random() * 1.5 + 0.3,
      alpha: Math.random(),
      speed: Math.random() * 0.015 + 0.005,
      twinkleDir: Math.random() > 0.5 ? 1 : -1,
      color:
        Math.random() > 0.8
          ? "#e4e4e7" // Light zinc/grey
          : Math.random() > 0.6
          ? "#d4d4d8" // Neutral zinc
          : "#ffffff", // Pure white
    }));

    // Shooting Stars system - Pure White Glow
    const shootingStars = [];
    const createShootingStar = () => {
      const startX = Math.random() * (width * 1.2) - width * 0.1;
      const startY = Math.random() * (height * 0.5);
      const length = Math.random() * 80 + 60;
      const speed = Math.random() * 6 + 4;
      const angle = Math.PI / 4 + (Math.random() * 0.2 - 0.1);

      shootingStars.push({
        x: startX,
        y: startY,
        length,
        speed,
        dx: Math.cos(angle) * speed,
        dy: Math.sin(angle) * speed,
        life: 0,
        maxLife: Math.random() * 40 + 30,
        size: Math.random() * 1.2 + 1,
      });
    };

    let spawnTimer = 0;

    const render = () => {
      // Clear with pitch black background
      ctx.fillStyle = "#09090b";
      ctx.fillRect(0, 0, width, height);

      // Subtle monochromatic radial glow
      const g1 = ctx.createRadialGradient(
        width * 0.5,
        height * 0.3,
        10,
        width * 0.5,
        height * 0.3,
        width * 0.6
      );
      g1.addColorStop(0, "rgba(255, 255, 255, 0.04)");
      g1.addColorStop(0.6, "rgba(24, 24, 27, 0.02)");
      g1.addColorStop(1, "rgba(9, 9, 11, 0)");
      ctx.fillStyle = g1;
      ctx.fillRect(0, 0, width, height);

      // Draw twinkling white stars
      stars.forEach((star) => {
        star.alpha += star.speed * star.twinkleDir;
        if (star.alpha >= 1) {
          star.alpha = 1;
          star.twinkleDir = -1;
        } else if (star.alpha <= 0.15) {
          star.alpha = 0.15;
          star.twinkleDir = 1;
        }

        ctx.beginPath();
        ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
        ctx.fillStyle = star.color;
        ctx.globalAlpha = star.alpha;
        ctx.fill();
        ctx.globalAlpha = 1;
      });

      // Spawn shooting star
      spawnTimer++;
      if (spawnTimer > 120 && Math.random() < 0.03) {
        createShootingStar();
        spawnTimer = 0;
      }

      // Draw shooting stars with pure white trailing tails
      for (let i = shootingStars.length - 1; i >= 0; i--) {
        const ss = shootingStars[i];
        ss.x += ss.dx;
        ss.y += ss.dy;
        ss.life++;

        const tailX = ss.x - Math.cos(Math.PI / 4) * ss.length;
        const tailY = ss.y - Math.sin(Math.PI / 4) * ss.length;

        const progress = ss.life / ss.maxLife;
        const alpha = Math.sin(progress * Math.PI);

        const grad = ctx.createLinearGradient(tailX, tailY, ss.x, ss.y);
        grad.addColorStop(0, "rgba(255, 255, 255, 0)");
        grad.addColorStop(0.7, `rgba(255, 255, 255, ${alpha * 0.4})`);
        grad.addColorStop(1, `rgba(255, 255, 255, ${alpha})`);

        ctx.beginPath();
        ctx.moveTo(tailX, tailY);
        ctx.lineTo(ss.x, ss.y);
        ctx.strokeStyle = grad;
        ctx.lineWidth = ss.size;
        ctx.lineCap = "round";
        ctx.stroke();

        ctx.beginPath();
        ctx.arc(ss.x, ss.y, ss.size * 1.2, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`;
        ctx.shadowColor = "#ffffff";
        ctx.shadowBlur = 6;
        ctx.fill();
        ctx.shadowBlur = 0;

        if (ss.life >= ss.maxLife || ss.x > width + 100 || ss.y > height + 100) {
          shootingStars.splice(i, 1);
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0 block w-full h-full"
    />
  );
};

export default SpaceBackground;
