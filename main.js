// ===================================================================================
// BAGIAN 1: LOGIKA INTERACTIVE PARTICLE CANVAS
// ===================================================================================

const canvas = document.getElementById('particle-canvas');
const ctx = canvas.getContext('2d');

// Setup ukuran canvas + skala HiDPI
function resizeCanvas() {
  const dpr = window.devicePixelRatio || 1;
  const width = window.innerWidth;
  const height = window.innerHeight;

  canvas.style.width = width + 'px';
  canvas.style.height = height + 'px';

  canvas.width = Math.floor(width * dpr);
  canvas.height = Math.floor(height * dpr);

  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
}
resizeCanvas();

// Simpan posisi mouse
let mouse = {
  x: null,
  y: null,
  radius: 150 // Jarak interaksi mouse
};

window.addEventListener('mousemove', function (event) {
  mouse.x = event.clientX;
  mouse.y = event.clientY;
});

window.addEventListener('mouseout', function () {
  mouse.x = null;
  mouse.y = null;
});

let particlesArray = [];
const numberOfParticles = 80; // Jumlah partikel

// Class untuk membuat satu partikel
class Particle {
  constructor(x, y, directionX, directionY, size, color) {
    this.x = x;
    this.y = y;
    this.directionX = directionX;
    this.directionY = directionY;
    this.size = size;
    this.color = color;
  }

  // Menggambar partikel
  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2, false);
    ctx.fillStyle = this.color;
    ctx.fill();
  }

  // Update posisi partikel
  update() {
    // Pantul jika partikel menyentuh tepi canvas
    if (this.x > canvas.clientWidth || this.x < 0) {
      this.directionX = -this.directionX;
    }
    if (this.y > canvas.clientHeight || this.y < 0) {
      this.directionY = -this.directionY;
    }

    // Interaksi dengan mouse (hanya jika mouse ada di layar)
    if (mouse.x !== null && mouse.y !== null) {
      const dx = mouse.x - this.x;
      const dy = mouse.y - this.y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance < mouse.radius + this.size) {
        if (mouse.x < this.x && this.x < canvas.clientWidth - this.size * 10) {
          this.x += 5;
        }
        if (mouse.x > this.x && this.x > this.size * 10) {
          this.x -= 5;
        }
        if (mouse.y < this.y && this.y < canvas.clientHeight - this.size * 10) {
          this.y += 5;
        }
        if (mouse.y > this.y && this.y > this.size * 10) {
          this.y -= 5;
        }
      }
    }

    // Gerakkan partikel
    this.x += this.directionX;
    this.y += this.directionY;

    this.draw();
  }
}

// Inisialisasi partikel
function init() {
  particlesArray = [];
  for (let i = 0; i < numberOfParticles; i++) {
    const size = Math.random() * 2 + 1;
    const x = Math.random() * (canvas.clientWidth - size * 4) + size * 2;
    const y = Math.random() * (canvas.clientHeight - size * 4) + size * 2;
    const directionX = Math.random() * 0.4 - 0.2;
    const directionY = Math.random() * 0.4 - 0.2;
    const color = 'rgba(255, 140, 0, 0.8)'; // Warna oranye

    particlesArray.push(new Particle(x, y, directionX, directionY, size, color));
  }
}

// Menghubungkan partikel dengan garis
function connect() {
  for (let a = 0; a < particlesArray.length; a++) {
    for (let b = a + 1; b < particlesArray.length; b++) {
      const dx = particlesArray[a].x - particlesArray[b].x;
      const dy = particlesArray[a].y - particlesArray[b].y;
      const distanceSq = dx * dx + dy * dy;

      // Batas koneksi berbasis dimensi kanvas
      const maxDist = (canvas.clientWidth / 7) * (canvas.clientHeight / 7);

      if (distanceSq < maxDist) {
        const opacityValue = Math.max(0, 1 - distanceSq / 20000);
        ctx.strokeStyle = `rgba(255, 140, 0, ${opacityValue})`;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(particlesArray[a].x, particlesArray[a].y);
        ctx.lineTo(particlesArray[b].x, particlesArray[b].y);
        ctx.stroke();
      }
    }
  }
}

// Animation Loop
function animate() {
  requestAnimationFrame(animate);
  ctx.clearRect(0, 0, canvas.clientWidth, canvas.clientHeight);

  for (let i = 0; i < particlesArray.length; i++) {
    particlesArray[i].update();
  }
  connect();
}

// Atur ulang canvas saat ukuran jendela berubah
window.addEventListener('resize', function () {
  resizeCanvas();
  init();
});

// Mulai semua!
init();
animate();

// ===================================================================================
// BAGIAN 2: LOGIKA ANIMASI ON-SCROLL
// ===================================================================================
const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.remove('hidden');
      observer.unobserve(entry.target); // opsional: animasi satu kali
    }
  });
}, {
  threshold: 0.15
});

const hiddenElements = document.querySelectorAll('.hidden');
hiddenElements.forEach((el) => observer.observe(el));
