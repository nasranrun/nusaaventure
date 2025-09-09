window.addEventListener('DOMContentLoaded', function() {
  const progressGame = JSON.parse(localStorage.getItem('progress_game')) || {};
  const icons = document.querySelectorAll('.icon');

  icons.forEach(icon => {
    const provinsi = icon.getAttribute('data-provinsi');
    if (provinsi === 'sulawesi barat') {
      icon.classList.remove('locked');
      icon.parentElement.style.pointerEvents = 'auto';
    } else if (
      progressGame['sulawesi barat'] &&
      progressGame['sulawesi barat'].allCompleted &&
      provinsi === 'ntt'
    ) {
      icon.classList.remove('locked');
      icon.parentElement.style.pointerEvents = 'auto';
    } else if (
      progressGame['ntt'] &&
      progressGame['ntt'].allCompleted &&
      provinsi === 'maluku'
    ) {
      icon.classList.remove('locked');
      icon.parentElement.style.pointerEvents = 'auto';
    }
    // Lanjutkan untuk provinsi berikutnya...
  });
});document.addEventListener("DOMContentLoaded", () => {
  const htpBtn = document.getElementById("htp-btn");
  const popup = document.getElementById("popup-htp");
  const closeBtn = document.getElementById("close-htp");

  const slides = document.querySelectorAll(".popup-htp .slide");
  const indicators = document.querySelectorAll(".slide-indicator");
  const prevBtn = document.getElementById("prev-slide");
  const nextBtn = document.getElementById("next-slide");

  let currentSlide = 0;

  function updateSlide(index) {
    slides.forEach((slide, i) => {
      slide.classList.remove("active");
      indicators[i].classList.remove("active");
    });
    currentSlide = index;
  }

  htpBtn.addEventListener("click", () => {
    popup.classList.add("active");
    updateSlide(0);
  });

  closeBtn.addEventListener("click", () => {
    popup.classList.remove("active");
  });

  nextBtn.addEventListener("click", () => {
    updateSlide((currentSlide + 1) % slides.length);
  });

  prevBtn.addEventListener("click", () => {
    updateSlide((currentSlide - 1 + slides.length) % slides.length);
  });

  indicators.forEach((dot, index) => {
    dot.addEventListener("click", () => updateSlide(index));
  });
});

// ...existing code...
window.addEventListener('DOMContentLoaded', function() {
  const backsound = document.getElementById('backsound');
  // Untuk memastikan backsound play setelah interaksi user (agar autoplay tidak diblokir)
  document.body.addEventListener('click', function playOnce() {
    backsound.play();
    document.body.removeEventListener('click', playOnce);
  });
});
// ...existing code...

function onAllGamesCompleted() {
  let progress = JSON.parse(localStorage.getItem('progress_game')) || {};
  progress['sulawesi barat'] = progress['sulawesi barat'] || {};
  progress['sulawesi barat'].allCompleted = true;
  localStorage.setItem('progress_game', JSON.stringify(progress));
  // Tampilkan tombol/benda untuk kembali ke pilihan provinsi
  document.getElementById('btn-provinsi').style.display = 'block';
}

document.getElementById('btn-provinsi').onclick = function() {
  window.location.href = '../pilihprovinsi/pilihprovinsi.html';
};