// ===================================================================================
// BAGIAN 1: LOGIKA EFEK SOROTAN LEMBUT & GARIS PINDAI
// ===================================================================================
const canvas = document.getElementById('particle-canvas');
const ctx = canvas.getContext('2d');

let mouse = { x: window.innerWidth / 2, y: window.innerHeight / 2 };

window.addEventListener('mousemove', (event) => {
    mouse.x = event.clientX;
    mouse.y = event.clientY;
});

// Fungsi untuk menggambar garis-garis pindai (scanlines)
function drawScanlines() {
    ctx.strokeStyle = 'rgba(255, 127, 80, 0.05)'; // Warna scanlines sangat redup
    ctx.lineWidth = 1;
    for (let y = 0; y < canvas.height; y += 4) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
    }
}

// Fungsi untuk menggambar sorotan cahaya mouse
function drawMouseLight() {
    if (mouse.x === undefined || mouse.y === undefined) return;

    // Membuat gradasi lingkaran (radial gradient)
    const gradient = ctx.createRadialGradient(mouse.x, mouse.y, 0, mouse.x, mouse.y, 250);
    gradient.addColorStop(0, 'rgba(255, 127, 80, 0.1)'); // Cahaya di tengah
    gradient.addColorStop(1, 'rgba(255, 127, 80, 0)');   // Memudar ke luar

    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(mouse.x, mouse.y, 250, 0, Math.PI * 2);
    ctx.fill();
}

function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Gambar elemen-elemennya
    drawScanlines();
    drawMouseLight();

    requestAnimationFrame(animate);
}

function handleResize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

window.addEventListener('resize', handleResize);

// Inisialisasi
handleResize();
animate();


// ===================================================================================
// BAGIAN 2: LOGIKA ANIMASI ON-SCROLL (TETAP SAMA)
// ===================================================================================
const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.remove('hidden');
      observer.unobserve(entry.target);
    }
  });
}, {
  threshold: 0.15
});

const hiddenElements = document.querySelectorAll('.hidden');
hiddenElements.forEach((el) => observer.observe(el));