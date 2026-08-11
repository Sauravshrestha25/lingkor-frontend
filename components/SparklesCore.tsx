"use client";

import { useEffect, useRef } from "react";

type ParticlesProps = {
  id?: string;
  className?: string;
  background?: string;
  minSize?: number;
  maxSize?: number;
  speed?: number;
  particleColor?: string;
  particleDensity?: number;
};

export const SparklesCore = ({
  id,
  className,
  background = "transparent",
  minSize = 0.4,
  maxSize = 1,
  speed = 1,
  particleColor = "#FFFFFF",
  particleDensity = 120,
}: ParticlesProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let width = 0;
    let height = 0;
    let particles: Array<{
      x: number;
      y: number;
      vx: number;
      vy: number;
      radius: number;
      opacity: number;
      opacitySpeed: number;
    }> = [];

    const initParticles = (w: number, h: number) => {
      const area = w * h;
      const baseArea = 400 * 400;
      const count = Math.max(
        10,
        Math.min(150, Math.round((particleDensity * area) / baseArea)),
      );

      particles = Array.from({ length: count }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.3 * speed || 0.05,
        vy: (Math.random() - 0.5) * 0.3 * speed || 0.05,
        radius: Math.random() * (maxSize - minSize) + minSize,
        opacity: Math.random() * 0.9 + 0.1,
        opacitySpeed:
          (Math.random() * 0.01 + 0.005) *
          speed *
          (Math.random() > 0.5 ? 1 : -1),
      }));
    };

    const resizeCanvas = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      canvas.width = Math.round(rect.width * dpr);
      canvas.height = Math.round(rect.height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      width = rect.width;
      height = rect.height;
      initParticles(width, height);
    };

    const animate = () => {
      if (width === 0 || height === 0) {
        animationFrameId = requestAnimationFrame(animate);
        return;
      }

      ctx.save();
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      if (background !== "transparent") {
        ctx.fillStyle = background;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }
      ctx.restore();

      ctx.fillStyle = particleColor;

      particles.forEach((particle) => {
        particle.x += particle.vx;
        particle.y += particle.vy;

        if (particle.x < 0) particle.x = width;
        if (particle.x > width) particle.x = 0;
        if (particle.y < 0) particle.y = height;
        if (particle.y > height) particle.y = 0;

        particle.opacity += particle.opacitySpeed;
        if (particle.opacity > 1) {
          particle.opacity = 1;
          particle.opacitySpeed = -particle.opacitySpeed;
        } else if (particle.opacity < 0.1) {
          particle.opacity = 0.1;
          particle.opacitySpeed = -particle.opacitySpeed;
        }

        ctx.beginPath();
        ctx.arc(
          particle.x,
          particle.y,
          particle.radius,
          0,
          Math.PI * 2,
        );
        ctx.save();
        ctx.globalAlpha = particle.opacity;
        ctx.fill();
        ctx.restore();
      });

      animationFrameId = requestAnimationFrame(animate);
    };

    resizeCanvas();
    animate();
    window.addEventListener("resize", resizeCanvas);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", resizeCanvas);
    };
  }, [background, minSize, maxSize, speed, particleColor, particleDensity]);

  return (
    <canvas
      id={id}
      ref={canvasRef}
      aria-hidden="true"
      className={`block h-full w-full border-none outline-none ${className ?? ""}`}
      style={{ border: "none", outline: "none" }}
    />
  );
};
