// Basado en el tipo recibido, crea diferentes partículas y animaciones
function startParticles() {
    const canvas = document.getElementById("particles-canvas");
    const ctx = canvas.getContext("2d");
    let W = window.innerWidth;
    let H = window.innerHeight;
    let time = 0;

    function resize() {
        W = window.innerWidth;
        H = window.innerHeight;
        canvas.width = W;
        canvas.height = H;
    }
    resize();
    window.addEventListener("resize", resize);

    const particleSettings = {
        count: 80, // Número de partículas
        colors: ["rgba(255, 183, 3, 0.7)", "rgba(251, 220, 157, 0.6)", "rgba(132, 228, 232, 0.5)"],
        speed: 0.3,
        minRadius: 0.5,
        maxRadius: 2.5
    };

    let particles = Array.from({ length: particleSettings.count }, () => ({
        x: Math.random() * W,
        y: Math.random() * H,
        vx: (Math.random() - 0.5) * 0.2,
        vy: (Math.random() * -particleSettings.speed) - 0.1,
        radius: Math.random() * (particleSettings.maxRadius - particleSettings.minRadius) + particleSettings.minRadius,
        color: particleSettings.colors[Math.floor(Math.random() * particleSettings.colors.length)],
        floatPhase: Math.random() * Math.PI * 2, // Para el movimiento sinuoso
        glowIntensity: Math.random() * 0.5 + 0.5
    }));

    function animate() {
        time += 0.01;
        ctx.clearRect(0, 0, W, H);

        particles.forEach(p => {
            // Movimiento vertical y reseteo
            p.y += p.vy;
            if (p.y < -10) {
                p.y = H + 10;
                p.x = Math.random() * W;
            }

            // Movimiento lateral sinuoso
            const floatX = Math.sin(time + p.floatPhase) * 0.5;
            p.x += p.vx + floatX;

            // Efecto de brillo (glow)
            const glowRadius = p.radius * 4 * p.glowIntensity;
            const glow = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, glowRadius);
            glow.addColorStop(0, p.color.replace(/, [0-9\.]+\)/, ', 0.3)'));
            glow.addColorStop(0.5, p.color.replace(/, [0-9\.]+\)/, ', 0.1)'));
            glow.addColorStop(1, p.color.replace(/, [0-9\.]+\)/, ', 0)'));
            
            ctx.fillStyle = glow;
            ctx.beginPath();
            ctx.arc(p.x, p.y, glowRadius, 0, Math.PI * 2);
            ctx.fill();

            // Partícula central
            ctx.fillStyle = p.color;
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
            ctx.fill();
        });

        requestAnimationFrame(animate);
    }
    animate();
}

// Asegúrate de llamar a esta función cuando se cargue la página
window.addEventListener('load', () => startParticles());
