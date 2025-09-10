// ===== Awal Script =====
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
  if (progress["ntt"]?.puzzle === true) {
    return; // sudah pernah selesai
  }

  alert("Puzzle selesai ✅");
  markPuzzleCompleted("ntt");   // konsisten pakai ntt
  window.location.reload();        // reload biar Klik Benda terbuka
}

// ===== Fungsi Klik Benda =====
function klikBenda() {
  alert("Selamat! Kamu menemukan benda tersebut ✅");
  window.location.href = "../bendabudayantt/ntt.html"; 
}

// ===== Inisialisasi setelah DOM siap =====
window.addEventListener("DOMContentLoaded", () => {
  // Ambil progress dari localStorage
  let progress = getProgress();
  let selesaiPuzzle = progress['ntt'] && progress['ntt'].puzzle === true;
  

  // Puzzle selalu bisa diakses
  const puzzleCard = document.getElementById('puzzle-ntt');
  if (puzzleCard) {
    puzzleCard.onclick = function() {
      window.location.href = '../puzzlegame/ntt.html';
    };
  }

  // Klik Benda hanya bisa diakses jika puzzle selesai
  const pilihBendaCard = document.getElementById('pilihbenda-ntt');
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
        window.location.href = '../bendabudayantt/ntt.html';
      };
    }
  }

  // --- Popup Slider ---
  const popup = document.getElementById("popup");
  const popupImage = document.getElementById("popup-image");
  const prevSlideBtn = document.getElementById("prev-slide");
  const nextSlideBtn = document.getElementById("next-slide");
  const closePopupBtn = document.getElementById("close-popup");

  if (popup && popupImage) {
    const images = [
      "../assets/img/ntt1.jpg",
      "../assets/img/ntt2.jpg",
      "../assets/img/ntt3.jpg"
    ];
    let currentIndex = 0;

    function showImage(index) {
      popupImage.src = images[index];
      popup.style.display = "flex";
    }

    prevSlideBtn.addEventListener("click", () => {
      currentIndex = (currentIndex - 1 + images.length) % images.length;
      showImage(currentIndex);
    });

    nextSlideBtn.addEventListener("click", () => {
      currentIndex = (currentIndex + 1) % images.length;
      showImage(currentIndex);
    });

    closePopupBtn.addEventListener("click", () => {
      popup.style.display = "none";
    });

    showImage(currentIndex);
  }

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
// ===== Akhir Script =====

