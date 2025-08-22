function initializePageScripts() {
    
    // ===================================================================================
    // BAGIAN 1: EFEK PARTIKEL LATAR BELAKANG
    // ===================================================================================
    const canvas = document.getElementById('dots-canvas');
    if (canvas) {
        // ... (KODE PARTIKEL ANDA TETAP SAMA SEPERTI SEBELUMNYA, TIDAK PERLU DIUBAH)
        const ctx = canvas.getContext('2d');
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        let particlesArray;
        const mouse = { x: null, y: null, radius: (canvas.height / 80) * (canvas.width / 80) };
        window.addEventListener('mousemove', function(event) { mouse.x = event.clientX; mouse.y = event.clientY; });
        window.addEventListener('mouseout', function() { mouse.x = undefined; mouse.y = undefined; });
        class Particle {
            constructor(x, y, directionX, directionY, size, color) { this.x = x; this.y = y; this.directionX = directionX; this.directionY = directionY; this.size = size; this.originalSize = size; this.color = color; }
            draw() { ctx.beginPath(); ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2, false); ctx.fillStyle = this.color; ctx.fill(); }
            update() {
                if (this.x > canvas.width || this.x < 0) { this.directionX = -this.directionX; }
                if (this.y > canvas.height || this.y < 0) { this.directionY = -this.directionY; }
                let dx = mouse.x - this.x; let dy = mouse.y - this.y; let distance = Math.sqrt(dx * dx + dy * dy);
                if (distance < mouse.radius) { if (this.size < 5) { this.size += 0.2; } } 
                else if (this.size > this.originalSize) { this.size -= 0.1; }
                if (this.size < this.originalSize) { this.size = this.originalSize; }
                this.x += this.directionX; this.y += this.directionY; this.draw();
            }
        }
        function init() {
            particlesArray = [];
            let numberOfParticles = (canvas.height * canvas.width) / 15000;
            for (let i = 0; i < numberOfParticles; i++) {
                let size = (Math.random() * 1.5) + 1; let x = Math.random() * innerWidth; let y = Math.random() * innerHeight;
                let directionX = (Math.random() * 0.4) - 0.2; let directionY = (Math.random() * 0.4) - 0.2;
                let color = 'rgba(0, 191, 255, 0.3)'; particlesArray.push(new Particle(x, y, directionX, directionY, size, color));
            }
        }
        function connect() {
            let opacityValue = 1;
            for (let a = 0; a < particlesArray.length; a++) {
                for (let b = a; b < particlesArray.length; b++) {
                    let distance = ((particlesArray[a].x - particlesArray[b].x) ** 2) + ((particlesArray[a].y - particlesArray[b].y) ** 2);
                    if (distance < (canvas.width / 9) * (canvas.height / 9)) {
                        opacityValue = 1 - (distance / 20000);
                        ctx.strokeStyle = 'rgba(0, 191, 255,' + opacityValue * 0.2 + ')'; ctx.lineWidth = 1;
                        ctx.beginPath(); ctx.moveTo(particlesArray[a].x, particlesArray[a].y); ctx.lineTo(particlesArray[b].x, particlesArray[b].y); ctx.stroke();
                    }
                }
            }
        }
        let animationFrameId;
        function animate() {
            animationFrameId = requestAnimationFrame(animate); ctx.clearRect(0, 0, innerWidth, innerHeight);
            for (let i = 0; i < particlesArray.length; i++) { particlesArray[i].update(); } connect();
        }
        window.addEventListener('resize', function() { canvas.width = innerWidth; canvas.height = innerHeight; init(); });
        init(); if (typeof animationFrameId !== 'undefined') { cancelAnimationFrame(animationFrameId); } animate();
    }

    // ===================================================================================
    // BAGIAN 2: LOGIKA ANIMASI ON-SCROLL
    // ===================================================================================
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.remove('hidden');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.15 });
    const hiddenElements = document.querySelectorAll('.hidden');
    hiddenElements.forEach((el) => observer.observe(el));

    // ===================================================================================
    // BAGIAN 3: LOGIKA UNTUK TOMBOL BACK TO TOP
    // ===================================================================================
    const backToTopButton = document.querySelector('.back-to-top');
    if (backToTopButton) {
        // Tampilkan tombol saat scroll melewati 300px
        window.addEventListener('scroll', () => {
            if (window.scrollY > 300) {
                backToTopButton.classList.add('visible');
            } else {
                backToTopButton.classList.remove('visible');
            }
        });

        // Fungsi smooth scroll saat tombol diklik
        backToTopButton.addEventListener('click', (e) => {
            e.preventDefault();
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
}

// Jalankan fungsi saat halaman pertama kali dimuat
initializePageScripts();

// Jalankan kembali fungsi setiap kali Astro selesai melakukan transisi halaman
document.addEventListener('astro:page-load', initializePageScripts);