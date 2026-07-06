export class FireSystem {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d', { alpha: true });
    this.particles = [];
    this.isEmitting = false;
    this.animationFrame = null;
    
    // Bind methods
    this.render = this.render.bind(this);
    this.resize = this.resize.bind(this);
    
    // Handle resize
    window.addEventListener('resize', this.resize);
    this.resize();
  }

  resize() {
    // Match the canvas display size
    const rect = this.canvas.getBoundingClientRect();
    this.canvas.width = rect.width;
    this.canvas.height = rect.height;
  }

  start() {
    if (!this.isEmitting) {
      this.isEmitting = true;
      if (!this.animationFrame) {
        this.render();
      }
    }
  }

  stop() {
    this.isEmitting = false;
  }

  destroy() {
    this.isEmitting = false;
    if (this.animationFrame) {
      cancelAnimationFrame(this.animationFrame);
      this.animationFrame = null;
    }
    window.removeEventListener('resize', this.resize);
  }

  emitParticles() {
    // Number of particles per frame
    const count = 5;
    const originX = this.canvas.width / 2;
    const originY = this.canvas.height + 20; // Slightly below bottom

    for (let i = 0; i < count; i++) {
      this.particles.push({
        x: originX + (Math.random() - 0.5) * 40, // Spread at source
        y: originY,
        vx: (Math.random() - 0.5) * 2, // Slight horizontal spread
        vy: -(Math.random() * 4 + 3), // Move up quickly
        life: 1.0, // 1.0 down to 0.0
        decay: Math.random() * 0.015 + 0.01, // How fast it dies
        size: Math.random() * 20 + 20, // Base size
        growth: Math.random() * 0.5 + 0.1, // How much it grows over time
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: (Math.random() - 0.5) * 0.1,
        // Fire colors: Yellow/White core -> Orange -> Red -> Dark Smoke
        hue: Math.random() * 20 + 10 // 10 to 30 (orange to yellow)
      });
    }
  }

  render() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    if (this.isEmitting) {
      this.emitParticles();
    }

    // Use global composite operation for the bright fire effect (additive blending)
    this.ctx.globalCompositeOperation = 'lighter';

    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];
      
      // Update physics
      p.x += p.vx;
      p.y += p.vy;
      p.life -= p.decay;
      p.size += p.growth;
      p.rotation += p.rotationSpeed;
      
      // Add slight turbulence
      p.vx += (Math.random() - 0.5) * 0.5;

      if (p.life <= 0) {
        this.particles.splice(i, 1);
        continue;
      }

      // Color mapping based on life
      // 1.0 to 0.7: Core fire (Yellow/White)
      // 0.7 to 0.4: Mid fire (Orange/Red)
      // 0.4 to 0.0: Smoke (Dark grey, fade out)
      
      let r, g, b, a;
      
      if (p.life > 0.7) {
        // Bright yellow/white
        const t = (p.life - 0.7) / 0.3; // 0 to 1
        r = 255;
        g = Math.floor(150 + 105 * t);
        b = Math.floor(255 * t);
        a = 1.0;
      } else if (p.life > 0.4) {
        // Orange/Red
        const t = (p.life - 0.4) / 0.3; // 0 to 1
        r = Math.floor(200 + 55 * t);
        g = Math.floor(50 + 100 * t);
        b = 0;
        a = t; // Fade slightly
      } else {
        // Smoke
        // Switch to normal blending for smoke
        this.ctx.globalCompositeOperation = 'source-over';
        const t = p.life / 0.4; // 0 to 1
        const shade = Math.floor(50 * t); // Darker as it dies
        r = shade;
        g = shade;
        b = shade;
        a = t * 0.5; // Transparent smoke
      }

      // Draw particle
      this.ctx.save();
      this.ctx.translate(p.x, p.y);
      this.ctx.rotate(p.rotation);
      
      // Create radial gradient for soft particle
      const grad = this.ctx.createRadialGradient(0, 0, 0, 0, 0, p.size / 2);
      grad.addColorStop(0, `rgba(${r},${g},${b},${a})`);
      grad.addColorStop(1, `rgba(${r},${g},${b},0)`);
      
      this.ctx.fillStyle = grad;
      this.ctx.beginPath();
      this.ctx.arc(0, 0, p.size / 2, 0, Math.PI * 2);
      this.ctx.fill();
      
      this.ctx.restore();
      
      // Reset back to lighter if we changed to source-over
      if (p.life <= 0.4) {
         this.ctx.globalCompositeOperation = 'lighter';
      }
    }

    // Loop
    if (this.particles.length > 0 || this.isEmitting) {
      this.animationFrame = requestAnimationFrame(this.render);
    } else {
      this.animationFrame = null;
    }
  }
}
