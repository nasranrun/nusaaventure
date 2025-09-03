document.addEventListener('DOMContentLoaded', () => {
    const startButton = document.getElementById('start-btn');
    const htpButton = document.getElementById('htp-btn');

    if (!startButton || !htpButton) {
        console.error('Some buttons could not be found');
        return;
    }

    startButton.addEventListener('click', () => {
        window.location.href = '../pilihprovinsi/pilihprovinsi.html';
    });

  
});

document.addEventListener("DOMContentLoaded", function() {
  const htpBtn = document.getElementById('htp-btn');
  const popup = document.getElementById('popup-htp');
  const closeBtn = document.getElementById('close-htp');

  htpBtn.addEventListener('click', () => {
    popup.classList.add('active');
  });

  closeBtn.addEventListener('click', () => {
    popup.classList.remove('active');
  });

  // Optional: Tutup popup jika klik di luar konten popup
  popup.addEventListener('click', function(e) {
    if (e.target === popup) {
      popup.classList.remove('active');
    }
  });
});

document.addEventListener('DOMContentLoaded', function() {
  const slides = document.querySelectorAll('.slide');
  const prevBtn = document.getElementById('prev-slide');
  const nextBtn = document.getElementById('next-slide');
  const indicators = document.querySelectorAll('.slide-indicator');
  let currentSlide = 0;
  let isAnimating = false;

  function updateIndicators(index) {
    indicators.forEach((ind, i) => {
      ind.classList.toggle('active', i === index);
    });
  }

  function showSlide(newIndex, direction = 1) {
    if (isAnimating || newIndex === currentSlide) return;
    isAnimating = true;
    const oldSlide = slides[currentSlide];
    const newSlide = slides[newIndex];

    // Reset classes
    slides.forEach(slide => slide.classList.remove('to-left', 'to-right', 'active'));

    // Set posisi awal slide baru
    newSlide.classList.add(direction > 0 ? 'to-right' : 'to-left');
    newSlide.offsetWidth; // Force reflow

    // Mulai animasi
    oldSlide.classList.add(direction > 0 ? 'to-left' : 'to-right');
    newSlide.classList.add('active');
    newSlide.classList.remove(direction > 0 ? 'to-right' : 'to-left');

    setTimeout(() => {
      oldSlide.classList.remove('active', 'to-left', 'to-right');
      isAnimating = false;
    }, 400);

    currentSlide = newIndex;
    updateIndicators(currentSlide);
  }

  prevBtn.addEventListener('click', function() {
    const newIndex = (currentSlide - 1 + slides.length) % slides.length;
    showSlide(newIndex, -1);
  });

  nextBtn.addEventListener('click', function() {
    const newIndex = (currentSlide + 1) % slides.length;
    showSlide(newIndex, 1);
  });

  // Klik indikator
  indicators.forEach((ind, idx) => {
    ind.addEventListener('click', () => {
      if (idx !== currentSlide) {
        showSlide(idx, idx > currentSlide ? 1 : -1);
      }
    });
  });

  // Reset ke slide pertama saat popup dibuka
  document.getElementById('htp-btn').addEventListener('click', function() {
    showSlide(0, 1);
  });
});

window.addEventListener('DOMContentLoaded', function() {
  const backsound = document.getElementById('backsound');
  // Untuk memastikan backsound play setelah interaksi user (agar autoplay tidak diblokir)
  document.body.addEventListener('click', function playOnce() {
    backsound.play();
    document.body.removeEventListener('click', playOnce);
  });
});
