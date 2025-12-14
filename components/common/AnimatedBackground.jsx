import React, { useRef, useEffect } from 'react';

const AnimatedBackground = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId;
    let stars = [];
    let trailParticles = [];
    const starCount = 200;
    const galaxyColors = ['#22d3ee', '#ec4899', '#a855f7'];

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    class Star {
      constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 1.5 + 0.5;
        this.speedX = Math.random() * 0.2 - 0.1;
        this.speedY = Math.random() * 0.2 - 0.1;
        this.opacity = Math.random();
        this.twinkleSpeed = Math.random() * 0.03 + 0.01;
      }

      update() {
        if (this.x > canvas.width || this.x < 0) this.speedX *= -1;
        if (this.y > canvas.height || this.y < 0) this.speedY *= -1;
        this.x += this.speedX;
        this.y += this.speedY;

        this.opacity += this.twinkleSpeed;
        if (this.opacity > 1) {
          this.opacity = 1;
          this.twinkleSpeed *= -1;
        } else if (this.opacity < 0) {
          this.opacity = 0;
          this.twinkleSpeed *= -1;
        }
      }

      draw() {
        if (ctx) {
          ctx.save();
          ctx.globalAlpha = this.opacity;
          ctx.fillStyle = 'white';
          ctx.beginPath();
          ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();
        }
      }
    }

    class TrailParticle {
      constructor(x, y) {
        this.x = x;
        this.y = y;
        this.size = Math.random() * 3 + 1;
        this.speedX = Math.random() * 2 - 1;
        this.speedY = Math.random() * 2 - 1;
        this.maxLife = Math.random() * 60 + 50;
        this.life = this.maxLife;
        this.color = galaxyColors[Math.floor(Math.random() * galaxyColors.length)];
      }

      update() {
        this.x += this.speedX;
        this.y += this.speedY;
        this.life -= 1;
        if (this.size > 0.1) this.size -= 0.05;
      }

      draw() {
        if (ctx && this.life > 0 && this.size > 0) {
          ctx.save();
          ctx.globalAlpha = this.life / this.maxLife;
          ctx.fillStyle = this.color;
          ctx.beginPath();
          ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();
        }
      }
    }

    const handleMouseMove = (event) => {
      for (let i = 0; i < 2; i++) {
        trailParticles.push(new TrailParticle(event.clientX, event.clientY));
      }
    };

    const init = () => {
      stars = [];
      for (let i = 0; i < starCount; i++) {
        stars.push(new Star());
      }
    };

    const animate = () => {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.2)'; // fading effect
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      for (const star of stars) {
        star.update();
        star.draw();
      }

      for (let i = trailParticles.length - 1; i >= 0; i--) {
        const p = trailParticles[i];
        p.update();
        p.draw();
        if (p.life <= 0) {
          trailParticles.splice(i, 1);
        }
      }

      animationFrameId = requestAnimationFrame(animate);
    };

    resizeCanvas();
    init();
    animate();

    const handleResize = () => {
      resizeCanvas();
      init();
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return <canvas ref={canvasRef} style={{ position: 'fixed', top: 0, left: 0, zIndex: -1 }} />;
};

export default AnimatedBackground;
