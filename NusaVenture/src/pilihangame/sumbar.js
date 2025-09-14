// ===== Progress Manager =====
function getProgress() {
  return JSON.parse(localStorage.getItem('progress_game')) || {};
}

function saveProgress(progress) {
  localStorage.setItem('progress_game', JSON.stringify(progress));
}

function markPuzzleCompleted(provinsi) {
  let progress = getProgress();
  progress[provinsi] = progress[provinsi] || {};
  progress[provinsi].puzzle = true;
  saveProgress(progress);
}

// ===== Fungsi Klik Puzzle =====
function mainPuzzle() {
  let progress = getProgress();
  if (progress["sumbar"]?.puzzle === true) {
    return; // sudah pernah selesai
  }

  alert("Puzzle selesai ✅");
  markPuzzleCompleted("sumbar");
  window.location.reload(); // reload biar Klik Benda terbuka
}

// ===== Fungsi Klik Benda =====
function klikBenda() {
  alert("Selamat! Kamu menemukan benda tersebut ✅");
  window.location.href = "../bendabudayasumbar/sumbar.html";
}

// ===== Inisialisasi setelah DOM siap =====
window.addEventListener("DOMContentLoaded", () => {
  // --- Progress Puzzle ---
  let progress = getProgress();
  let selesaiPuzzle = progress['sumbar'] && progress['sumbar'].puzzle === true;

  const puzzleCard = document.getElementById('puzzle-sumbar');
  if (puzzleCard) {
    puzzleCard.onclick = function() {
      window.location.href = '../puzzlegame/sumbar.html';
    };
  }

  const pilihBendaCard = document.getElementById('pilihbenda-sumbar');
  if (pilihBendaCard) {
    if (!selesaiPuzzle) {
      pilihBendaCard.classList.add('locked');
      pilihBendaCard.style.pointerEvents = 'none';
      pilihBendaCard.style.opacity = '0.5';
      pilihBendaCard.title = 'Selesaikan puzzle terlebih dahulu!';
      pilihBendaCard.onclick = null;
    } else {
      pilihBendaCard.classList.remove('locked');
      pilihBendaCard.style.pointerEvents = 'auto';
      pilihBendaCard.style.opacity = '1';
      pilihBendaCard.title = '';
      pilihBendaCard.onclick = function() {
        window.location.href = '../bendabudayasumbar/sumbar.html';
      };
    }
  }

<<<<<<< HEAD
  // --- Popup Slider ---
  const popup = document.getElementById("popup");
  const popupImage = document.getElementById("popup-image");
  const prevSlideBtn = document.getElementById("prev-slide");
  const nextSlideBtn = document.getElementById("next-slide");
  const closePopupBtn = document.getElementById("close-popup");
  const howtoBtn = document.getElementById("htp-btn");
=======
  // --- Popup Pengetahuan ---
  const htpBtn = document.getElementById("htp-btn");
  const popup = document.getElementById("popup-htp");
  const closeBtn = document.getElementById("close-htp");
>>>>>>> bae308d1a1ede4d0d8fdb1aefdca8dd6a4c71b89

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
    slides[index].classList.add("active");
    indicators[index].classList.add("active");
    currentSlide = index;
  }

  if (htpBtn && popup && closeBtn) {
    htpBtn.addEventListener("click", () => {
      popup.classList.add("active");
      updateSlide(0);
    });

    closeBtn.addEventListener("click", () => {
      popup.classList.remove("active");
    });
  }

  if (nextBtn && prevBtn) {
    nextBtn.addEventListener("click", () => {
      updateSlide((currentSlide + 1) % slides.length);
    });

    prevBtn.addEventListener("click", () => {
      updateSlide((currentSlide - 1 + slides.length) % slides.length);
    });
  }

  indicators.forEach((dot, index) => {
    dot.addEventListener("click", () => updateSlide(index));
  });

  // --- BackSound ---
  const backsound = document.getElementById("backsound");
  if (backsound) {
    backsound.volume = 0.2;
    backsound.play().catch(() => {
      console.log("Autoplay diblokir, menunggu interaksi pengguna.");
    });

    backsound.addEventListener("click", () => {
      if (backsound.paused) {
        backsound.play();
      } else {
        backsound.pause();
      }
    });
  }
});
