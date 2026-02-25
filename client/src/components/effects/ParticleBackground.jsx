import React, { useEffect, useRef, useCallback } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { useParticles } from '../../context/ParticleContext';

const ParticleBackground = () => {
  const canvasRef = useRef(null);
  const animationRef = useRef(null);
  const { theme } = useTheme();
  const { enabled } = useParticles();
  const particlesRef = useRef([]);
  const mouseRef = useRef({ x: 0, y: 0 });

  const initParticles = useCallback((width, height) => {
    const isDark = theme === 'dark';
    const particleCount = isDark ? 100 : 80;
    const particles = [];

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * (isDark ? 2 : 1.5),
        vy: (Math.random() - 0.5) * (isDark ? 2 : 1.5),
        radius: Math.random() * (isDark ? 3 : 4) + 1,
        color: isDark
          ? `hsl(${Math.random() * 60 + 170}, 100%, ${Math.random() * 30 + 50}%)`
          : `hsl(${Math.random() * 40 + 200}, 70%, ${Math.random() * 20 + 40}%)`,
        pulse: Math.random() * Math.PI * 2,
      });
    }

    return particles;
  }, [theme]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !enabled) return;

    const ctx = canvas.getContext('2d');
    let width = window.innerWidth;
    let height = window.innerHeight;

    const resize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
      particlesRef.current = initParticles(width, height);
    };

    resize();
    window.addEventListener('resize', resize);

    const handleMouseMove = (e) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };
    };
    window.addEventListener('mousemove', handleMouseMove);

    const isDark = theme === 'dark';

    const animate = () => {
      ctx.fillStyle = isDark
        ? 'rgba(10, 10, 15, 0.12)'
        : 'rgba(240, 245, 250, 0.12)';
      ctx.fillRect(0, 0, width, height);

      particlesRef.current.forEach((particle, i) => {
        particle.x += particle.vx;
        particle.y += particle.vy;
        particle.pulse += 0.02;

        if (particle.x < 0 || particle.x > width) particle.vx *= -1;
        if (particle.y < 0 || particle.y > height) particle.vy *= -1;

        const dx = mouseRef.current.x - particle.x;
        const dy = mouseRef.current.y - particle.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 150) {
          particle.vx += dx * 0.0001;
          particle.vy += dy * 0.0001;
        }

        const pulseRadius = particle.radius + Math.sin(particle.pulse) * 1;
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, pulseRadius, 0, Math.PI * 2);
        ctx.fillStyle = particle.color;
        ctx.shadowBlur = isDark ? 15 : 10;
        ctx.shadowColor = particle.color;
        ctx.fill();
        ctx.shadowBlur = 0;

        particlesRef.current.slice(i + 1).forEach((other) => {
          const dx2 = particle.x - other.x;
          const dy2 = particle.y - other.y;
          const distance = Math.sqrt(dx2 * dx2 + dy2 * dy2);

          if (distance < (isDark ? 120 : 100)) {
            ctx.beginPath();
            ctx.moveTo(particle.x, particle.y);
            ctx.lineTo(other.x, other.y);
            const opacity =
              (1 - distance / (isDark ? 120 : 100)) *
              (isDark ? 0.5 : 0.3);
            ctx.strokeStyle = isDark
              ? `rgba(0, 243, 255, ${opacity})`
              : `rgba(100, 150, 255, ${opacity})`;
            ctx.lineWidth = isDark ? 1 : 0.5;
            ctx.stroke();
          }
        });
      });

      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animationRef.current);
    };
  }, [theme, enabled, initParticles]);

  if (!enabled) return null;

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        inset: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: -1,
      }}
    />
  );
};

export default ParticleBackground;