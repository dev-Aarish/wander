import React, { useEffect, useRef } from 'react';

interface LeafParticle {
  x: number;
  y: number;
  size: number;
  angle: number;
  rotationSpeed: number;
  vx: number;
  vy: number;
  color: string;
  opacity: number;
  shapeType: 'maple' | 'aspen' | 'oak';
}

export const AmbientCanvas: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Check prefers-reduced-motion
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (mediaQuery.matches) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    // Warm, earthy autumn leaf color palette (Strictly NO purple, NO cyan, NO lime!)
    const autumnColors = [
      '#D97706', // Warm amber
      '#B45309', // Deep honey amber
      '#CA8A04', // Golden birch ochre
      '#C2410C', // Terracotta cinnabar
      '#9A3412', // Rust red
      '#43896F', // Forest emerald green
      '#225543', // Deep spruce
    ];

    const leafShapes: Array<'maple' | 'aspen' | 'oak'> = ['maple', 'aspen', 'oak'];

    // Generate lightweight leaf particles
    const particleCount = Math.min(24, Math.floor(width / 60));
    const particles: LeafParticle[] = Array.from({ length: particleCount }).map(() => ({
      x: Math.random() * width,
      y: Math.random() * height,
      size: 8 + Math.random() * 12,
      angle: Math.random() * Math.PI * 2,
      rotationSpeed: (Math.random() - 0.5) * 0.02,
      vx: 0.2 + Math.random() * 0.6,
      vy: 0.4 + Math.random() * 0.8,
      color: autumnColors[Math.floor(Math.random() * autumnColors.length)],
      opacity: 0.25 + Math.random() * 0.4,
      shapeType: leafShapes[Math.floor(Math.random() * leafShapes.length)],
    }));

    // Mouse influence physics (subtle wind deflection)
    let mouseX = width / 2;
    let mouseY = height / 2;
    let targetWindX = 0;

    const handleMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      targetWindX = (mouseX / width - 0.5) * 0.8;
    };
    window.addEventListener('mousemove', handleMouseMove);

    const drawLeaf = (p: LeafParticle) => {
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.angle);
      ctx.globalAlpha = p.opacity;
      ctx.fillStyle = p.color;

      ctx.beginPath();
      if (p.shapeType === 'aspen') {
        // Delicate teardrop heart
        ctx.moveTo(0, -p.size);
        ctx.bezierCurveTo(p.size * 0.8, -p.size * 0.5, p.size * 0.7, p.size * 0.7, 0, p.size);
        ctx.bezierCurveTo(-p.size * 0.7, p.size * 0.7, -p.size * 0.8, -p.size * 0.5, 0, -p.size);
      } else if (p.shapeType === 'maple') {
        // Star-lobed maple leaf
        ctx.moveTo(0, -p.size);
        ctx.lineTo(p.size * 0.35, -p.size * 0.35);
        ctx.lineTo(p.size * 0.9, -p.size * 0.2);
        ctx.lineTo(p.size * 0.45, p.size * 0.25);
        ctx.lineTo(p.size * 0.65, p.size * 0.8);
        ctx.lineTo(0, p.size * 0.5);
        ctx.lineTo(-p.size * 0.65, p.size * 0.8);
        ctx.lineTo(-p.size * 0.45, p.size * 0.25);
        ctx.lineTo(-p.size * 0.9, -p.size * 0.2);
        ctx.lineTo(-p.size * 0.35, -p.size * 0.35);
        ctx.closePath();
      } else {
        // Smooth rounded oak lobe
        ctx.ellipse(0, 0, p.size * 0.5, p.size * 0.9, 0, 0, Math.PI * 2);
      }
      ctx.fill();

      // Stem detail
      ctx.strokeStyle = p.color;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(0, p.size * 0.4);
      ctx.lineTo(0, p.size * 1.15);
      ctx.stroke();

      ctx.restore();
    };

    let wind = 0;
    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Smooth interpolation for wind
      wind += (targetWindX - wind) * 0.05;

      // Render floating particles
      for (const p of particles) {
        p.x += p.vx + wind;
        p.y += p.vy;
        p.angle += p.rotationSpeed;

        // Subtle flutter
        p.x += Math.sin(p.y * 0.015) * 0.5;

        // Wrap edges smoothly
        if (p.y > height + 20) {
          p.y = -20;
          p.x = Math.random() * width;
        }
        if (p.x > width + 20) p.x = -20;
        if (p.x < -20) p.x = width + 20;

        drawLeaf(p);
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="no-print print:hidden fixed inset-0 pointer-events-none z-0 opacity-40 mix-blend-multiply"
      aria-hidden="true"
    />
  );
};
