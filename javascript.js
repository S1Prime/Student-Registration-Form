const canvas = document.getElementById('particles-canvas');
const ctx    = canvas.getContext('2d');
let particles = [];
const PARTICLE_COUNT = 60;

function resize() {
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;
}
resize();
window.addEventListener('resize', resize);

function randomBetween(a, b) { return a + Math.random() * (b - a); }

function createParticle() {
    return {
        x:      Math.random() * canvas.width,
        y:      Math.random() * canvas.height,
        r:      randomBetween(1, 2.8),
        dx:     randomBetween(-0.3, 0.3),
        dy:     randomBetween(-0.4, -0.1),
        alpha:  randomBetween(0.2, 0.7),
        dAlpha: randomBetween(0.002, 0.006),
        color:  Math.random() < 0.5 ? '167,139,250' : '6,182,212'
    };
}

for (let i = 0; i < PARTICLE_COUNT; i++) particles.push(createParticle());

function drawParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle    = `rgba(${p.color}, ${p.alpha})`;
        ctx.shadowBlur   = 8;
        ctx.shadowColor  = `rgba(${p.color}, 0.6)`;
        ctx.fill();
        ctx.shadowBlur   = 0;

        p.x     += p.dx;
        p.y     += p.dy;
        p.alpha -= p.dAlpha;

        if (p.alpha <= 0 || p.y < -10) {
            Object.assign(p, createParticle(), {
                y:     canvas.height + 10,
                alpha: randomBetween(0.2, 0.7)
            });
        }
    });
    requestAnimationFrame(drawParticles);
}
drawParticles();
document.getElementById('regForm').addEventListener('submit', async function (e) {
    e.preventDefault();

    if (!this.checkValidity()) {
        this.reportValidity();
        return;
    }

    const btn          = document.getElementById('submitBtn');
    const btnSpan      = btn.querySelector('span');
    const successToast = document.getElementById('successToast');
    const errorToast   = document.getElementById('errorToast');

    btn.disabled   = true;
    btnSpan.textContent = '⏳ Sending...';

    // Collect form data
    const formData = new FormData(this);
    const data     = Object.fromEntries(formData.entries());

    try {
        const response = await fetch('/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });

        const result = await response.json();

        if (response.ok && result.success) {
            btnSpan.textContent = '✅ Registered!';
            successToast.style.display = 'flex';
            this.reset();
            
            // Clear live input glow
            document.querySelectorAll('input, select, textarea').forEach(el => {
                el.style.borderColor = '';
            });

            setTimeout(() => { successToast.style.display = 'none'; }, 5000);
        } else {
            throw new Error(result.message || 'Server returned an error');
        }

    } catch (error) {
        console.error('Server error:', error);
        btnSpan.textContent = '❌ Failed – Try Again';
        btn.disabled = false;

        errorToast.style.display = 'flex';
        setTimeout(() => {
            errorToast.style.display  = 'none';
            btnSpan.textContent = '🚀 Register Now';
        }, 4000);
    }
});
document.querySelectorAll('input, select, textarea').forEach(el => {
    el.addEventListener('input', () => {
        el.style.borderColor = el.value
            ? 'rgba(167,139,250,0.6)'
            : '';
    });
});