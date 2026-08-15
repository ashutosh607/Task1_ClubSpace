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

    // Multi-depth Star layers
    const starCount = Math.min(Math.floor((width * height) / 2800), 450);
    const stars = Array.from({ length: starCount }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      size: Math.random() * 1.6 + 0.3,
      alpha: Math.random() * 0.8 + 0.2,
      speed: Math.random() * 0.012 + 0.004,
      twinkleDir: Math.random() > 0.5 ? 1 : -1,
      color:
        Math.random() > 0.85
          ? "#e4e4e7"
          : Math.random() > 0.65
          ? "#d4d4d8"
          : Math.random() > 0.4
          ? "#ffffff"
          : "#a1a1aa",
    }));

    // Floating subtle cosmic dust particles
    const dustCount = 35;
    const dustParticles = Array.from({ length: dustCount }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.25,
      vy: (Math.random() - 0.5) * 0.25,
      size: Math.random() * 2 + 1,
      alpha: Math.random() * 0.3 + 0.1,
    }));

    // Shooting Stars system
    const shootingStars = [];
    const createShootingStar = () => {
      const startX = Math.random() * (width * 1.3) - width * 0.15;
      const startY = Math.random() * (height * 0.4);
      const length = Math.random() * 110 + 70;
      const speed = Math.random() * 7 + 5;
      const angle = Math.PI / 4 + (Math.random() * 0.2 - 0.1);

      shootingStars.push({
        x: startX,
        y: startY,
        length,
        speed,
        dx: Math.cos(angle) * speed,
        dy: Math.sin(angle) * speed,
        life: 0,
        maxLife: Math.random() * 45 + 30,
        size: Math.random() * 1.4 + 1,
      });
    };

    let spawnTimer = 0;

    const render = () => {
      // Clear with pitch black deep cosmic tone
      ctx.fillStyle = "#050508";
      ctx.fillRect(0, 0, width, height);

      // Deep space nebula radial ambient glows
      const g1 = ctx.createRadialGradient(
        width * 0.5,
        height * 0.2,
        20,
        width * 0.5,
        height * 0.2,
        width * 0.7
      );
      g1.addColorStop(0, "rgba(255, 255, 255, 0.035)");
      g1.addColorStop(0.5, "rgba(39, 39, 42, 0.015)");
      g1.addColorStop(1, "rgba(5, 5, 8, 0)");
      ctx.fillStyle = g1;
      ctx.fillRect(0, 0, width, height);

      // Lower subtle nebula glow
      const g2 = ctx.createRadialGradient(
        width * 0.2,
        height * 0.75,
        10,
        width * 0.2,
        height * 0.75,
        width * 0.5
      );
      g2.addColorStop(0, "rgba(255, 255, 255, 0.02)");
      g2.addColorStop(1, "rgba(5, 5, 8, 0)");
      ctx.fillStyle = g2;
      ctx.fillRect(0, 0, width, height);

      // Render cosmic dust particles
      dustParticles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;
        if (p.y < 0) p.y = height;
        if (p.y > height) p.y = 0;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${p.alpha})`;
        ctx.fill();
      });

      // Render twinkling white stars
      stars.forEach((star) => {
        star.alpha += star.speed * star.twinkleDir;
        if (star.alpha >= 0.95) {
          star.alpha = 0.95;
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

      // Spawn shooting stars periodically
      spawnTimer++;
      if (spawnTimer > 100 && Math.random() < 0.035) {
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
        grad.addColorStop(0.7, `rgba(255, 255, 255, ${alpha * 0.45})`);
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
        ctx.shadowBlur = 8;
        ctx.fill();
        ctx.shadowBlur = 0;

        if (ss.life >= ss.maxLife || ss.x > width + 120 || ss.y > height + 120) {
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

