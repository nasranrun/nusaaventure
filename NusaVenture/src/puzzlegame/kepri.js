// =====================
// Konfigurasi / Konstanta
// =====================
const CURRENT_PROVINCE = 'kepulauan riau'; // <- kunci progress provinsi ini

// =====================
// Data Soal
// =====================
const questions = [
  {
    preview: '../assets/img/rumahkepri.jpeg',
    pieces: [
      '../assets/img/rumahkriau/rumahkriau1_1.jpg',
      '../assets/img/rumahkriau/rumahkriau1_2.jpg',
      '../assets/img/rumahkriau/rumahkriau1_3.jpg',
      '../assets/img/rumahkriau/rumahkriau2_1.jpg',
      '../assets/img/rumahkriau/rumahkriau2_2.jpg',
      '../assets/img/rumahkriau/rumahkriau2_3.jpg',
      '../assets/img/rumahkriau/rumahkriau3_1.jpg',
      '../assets/img/rumahkriau/rumahkriau3_2.jpg',
      '../assets/img/rumahkriau/rumahkriau3_3.jpg'
    ],
    answer: [
      'rumahkriau1_1.jpg','rumahkriau1_2.jpg','rumahkriau1_3.jpg',
      'rumahkriau2_1.jpg','rumahkriau2_2.jpg','rumahkriau2_3.jpg',
      'rumahkriau3_1.jpg','rumahkriau3_2.jpg','rumahkriau3_3.jpg'
    ],
    question: 'Apa Rumah tradisional Kepulauan Riau pada gambar tersebut adalah '
  },
  {
    preview: '../assets/img/nasikepri.jpg',
    pieces: [
      '../assets/img/nasikriau/nasikriau1_1.jpg',
      '../assets/img/nasikriau/nasikriau1_2.jpg',
      '../assets/img/nasikriau/nasikriau1_3.jpg',
      '../assets/img/nasikriau/nasikriau2_1.jpg',
      '../assets/img/nasikriau/nasikriau2_2.jpg',
      '../assets/img/nasikriau/nasikriau2_3.jpg',
      '../assets/img/nasikriau/nasikriau3_1.jpg',
      '../assets/img/nasikriau/nasikriau3_2.jpg',
      '../assets/img/nasikriau/nasikriau3_3.jpg'
    ],
    answer: [
      'nasikriau1_1.jpg','nasikriau1_2.jpg','nasikriau1_3.jpg',
      'nasikriau2_1.jpg','nasikriau2_2.jpg','nasikriau2_3.jpg',
      'nasikriau3_1.jpg','nasikriau3_2.jpg','nasikriau3_3.jpg'
    ],
    question: 'Apa makanan tradisional Khas Kepulauan Riau pada gambar tersebut 🍚'
  },
  {
    preview: '../assets/img/taritandakkepri.jpg',
    pieces: [
      '../assets/img/tarikriau/tarikriau1_1.jpg',
      '../assets/img/tarikriau/tarikriau1_2.jpg',
      '../assets/img/tarikriau/tarikriau1_3.jpg',
      '../assets/img/tarikriau/tarikriau2_1.jpg',
      '../assets/img/tarikriau/tarikriau2_2.jpg',
      '../assets/img/tarikriau/tarikriau2_3.jpg',
      '../assets/img/tarikriau/tarikriau3_1.jpg',
      '../assets/img/tarikriau/tarikriau3_2.jpg',
      '../assets/img/tarikriau/tarikriau3_3.jpg'
    ],
    answer: [
      'tarikriau1_1.jpg','tarikriau1_2.jpg','tarikriau1_3.jpg',
      'tarikriau2_1.jpg','tarikriau2_2.jpg','tarikriau2_3.jpg',
      'tarikriau3_1.jpg','tarikriau3_2.jpg','tarikriau3_3.jpg'
    ],
    question: 'Apa tarian tradisional Kepulauan Riau pada gambar tersebut '
  }
];

// =====================
// State
// =====================
let current = 0;
let draggedPiece = null;
let timerInterval = null;
let timeLeft = 40;
let puzzleScore = 0;
let quizScore = 0;

// =====================
// Init
// =====================
window.addEventListener('load', () => {
  hookPiecesContainerDrop();
  loadQuestion(current);
});

// Backsound hanya play setelah interaksi user
window.addEventListener('DOMContentLoaded', function () {
  const backsound = document.getElementById('backsound');
  if (!backsound) return;
  document.body.addEventListener('click', function playOnce() {
    backsound.play();
    document.body.removeEventListener('click', playOnce);
  });
});

// =====================
// UI & Game Flow
// =====================
function loadQuestion(idx) {
  // Header & pertanyaan
  document.getElementById('preview-img').src = questions[idx].preview;
  document.getElementById('soal').innerText = questions[idx].question;
  document.getElementById('feedback').innerHTML = '';

  // Shuffle pieces (Fisher-Yates)
  const piecesList = [...questions[idx].pieces];
  for (let i = piecesList.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [piecesList[i], piecesList[j]] = [piecesList[j], piecesList[i]];
  }

  // Render pieces (area asal)
  const piecesContainer = document.getElementById('pieces');
  piecesContainer.innerHTML = '';
  piecesList.forEach((src, i) => {
    const img = document.createElement('img');
    img.src = src;
    img.className = 'piece';
    img.draggable = true;
    img.id = 'piece-' + i;
    img.dataset.filename = src.split('/').pop();
    img.addEventListener('dragstart', dragStart);
    piecesContainer.appendChild(img);
  });

  // Render board 3x3
  const board = document.getElementById('board');
  board.innerHTML = '';
  for (let i = 0; i < 9; i++) {
    const slot = document.createElement('div');
    slot.className = 'slot';
    slot.dataset.index = i;
    slot.addEventListener('dragover', dragOver);
    slot.addEventListener('drop', dropPiece);
    board.appendChild(slot);
  }

  startTimer();
}

function dragStart(e) {
  draggedPiece = e.target;
  e.dataTransfer.setData('text/plain', e.target.id);
}

function dragOver(e) {
  e.preventDefault(); // izinkan drop
}

function dropPiece(e) {
  e.preventDefault();
  if (!draggedPiece) return;

  // gunakan currentTarget supaya pasti slot-nya, bukan child
  const slot = e.currentTarget;
  if (!slot.hasChildNodes()) {
    slot.appendChild(draggedPiece);
    // kalau sebelumnya kamu pernah menyembunyikan saat drag, pastikan terlihat lagi
    draggedPiece.style.visibility = 'visible';
    draggedPiece = null;
    checkBoard();
  }
}

// Area asal (#pieces) bisa menerima drop untuk mengembalikan potongan
function hookPiecesContainerDrop() {
  const piecesContainer = document.getElementById('pieces');
  if (!piecesContainer) return;

  piecesContainer.addEventListener('dragover', e => e.preventDefault());
  piecesContainer.addEventListener('drop', e => {
    e.preventDefault();
    const pieceId = e.dataTransfer.getData('text/plain');
    const piece = document.getElementById(pieceId);
    if (piece) {
      piece.style.visibility = 'visible';
      piecesContainer.appendChild(piece);
      draggedPiece = null;
    }
  });
}

// =====================
// Popup Bantuan / Feedback
// =====================
function showPopup() {
  let popup = document.createElement('div');
  popup.className = 'popup-overlay';
  popup.innerHTML = `
    <div class="popup-content">
      <img src="../assets/img/guidetour.png" alt="Salah" style="width:220px;">
      <br>
      <span style="color:red;font-size:1.2rem;">Coba lagi!</span>
    </div>`;
  document.body.appendChild(popup);
  setTimeout(() => popup.remove(), 1500);
}

function showQuizPopup() {
  let popup = document.createElement('div');
  popup.className = 'popup-overlay';
  popup.innerHTML = `
    <div class="popup-content">
      <img src="../assets/img/guidetour.png" alt="Salah" style="width:220px;">
      <br>
      <span style="color:red;font-size:1.2rem;">Jawaban salah! Coba lagi.</span>
    </div>`;
  document.body.appendChild(popup);
  setTimeout(() => popup.remove(), 1500);
}

function showTimeUpPopup() {
  let popup = document.createElement('div');
  popup.className = 'popup-overlay';
  popup.innerHTML = `
    <div class="popup-content">
      <img src="../assets/img/guidetour.png" alt="Waktu Habis" style="width:220px;">
      <br>
      <span style="color:red;font-size:1.2rem;">Waktu habis! Coba lagi.</span>
    </div>`;
  document.body.appendChild(popup);
  setTimeout(() => popup.remove(), 1500);
}

// =====================
// Quiz
// =====================
const quizOptions = [
  [
    "rumah riau belah bubung",
    "rumah lonitok melayu majo",
    "rumah selaso jatuh kembar",
    "limas potong"
  ],
  [
    "nasi lemak",
    "nasi limau",
    "nasi goreng",
    "ayam bakar hj slamet"
  ],
  [
    "tari gamelan",
    "tari tandak",
    "tari malemang",
    "tari mak yong"
  ]
];

const quizAnswers = [
  "rumah selaso jatuh kembar",
  "nasi lemak",
  "tari tandak"
];

function renderQuiz(idx) {
  const quizDiv = document.getElementById('quiz');
  quizDiv.innerHTML = '';

  const question = document.createElement('div');
  question.className = 'quiz-question';
  question.textContent = 'Pilih jawaban yang benar:'; // isi teksnya
  quizDiv.appendChild(question);

  quizOptions[idx].forEach(opt => {
    const label = document.createElement('label');
    label.className = 'quiz-option';

    const radio = document.createElement('input');
    radio.type = 'radio';
    radio.name = 'quiz';
    radio.value = opt;
    radio.onclick = function () {
      document.querySelectorAll('.quiz-option').forEach(l => l.classList.remove('selected'));
      label.classList.add('selected');
    };

    label.appendChild(radio);
    label.appendChild(document.createTextNode(opt));
    quizDiv.appendChild(label);
  });

  const btn = document.createElement('button');
  btn.innerText = 'Jawab';
  btn.className = 'quiz-btn';
  btn.onclick = () => checkQuiz(idx);
  quizDiv.appendChild(btn);
}

function checkQuiz(idx) {
  const radios = document.getElementsByName('quiz');
  let selected = '';
  for (let r of radios) if (r.checked) selected = r.value;

  const quizDiv = document.getElementById('quiz');
  if (selected === quizAnswers[idx]) {
    quizDiv.innerHTML = '<span style="color:green;font-size:1.2rem;">Jawaban benar! ✅</span>';
    quizScore += 10;
  } else {
    quizDiv.innerHTML = '<span style="color:red;font-size:1.2rem;">Jawaban salah! Tetap lanjut.</span>';
    // showQuizPopup(); // opsional
  }

  setTimeout(() => {
    current++;
    if (current < questions.length) {
      loadQuestion(current);
    } else {
      // Semua puzzle & quiz selesai
      document.getElementById('feedback').innerHTML = '<span style="color:blue;font-size:1.3rem;">Semua puzzle & quiz selesai!</span>';
      document.getElementById('pieces').innerHTML = '';
      document.getElementById('board').innerHTML = '';
      quizDiv.innerHTML = '';
      finalizeGame();
    }
  }, 1200);
}

// =====================
// Cek Puzzle
// =====================
function checkBoard() {
  const board = document.getElementById('board');
  const slots = Array.from(board.children);

  // lanjut hanya jika semua slot terisi
  if (slots.every(slot => slot.hasChildNodes())) {
    const userAnswer = slots.map(slot => slot.firstChild.dataset.filename);
    const correct = userAnswer.every((filename, i) => filename === questions[current].answer[i]);

    if (correct) {
      document.getElementById('feedback').innerHTML = '<span style="color:green;font-size:1.3rem;">Puzzle benar! 🎉</span>';
      puzzleScore += 10;
    } else {
      document.getElementById('feedback').innerHTML = '<span style="color:red;font-size:1.3rem;">Puzzle salah! Tetap lanjut ke quiz.</span>';
      showPopup();
    }

    setTimeout(() => {
      document.getElementById('feedback').innerHTML = '';
      renderQuiz(current);
    }, 800);
  }
}

// =====================
// Timer
// =====================
function startTimer() {
  clearInterval(timerInterval);
  timeLeft = 40;
  updateTimerDisplay();
  timerInterval = setInterval(() => {
    timeLeft--;
    updateTimerDisplay();
    if (timeLeft <= 0) {
      clearInterval(timerInterval);
      showTimeUpPopup();
      setTimeout(() => {
        loadQuestion(current); // reset puzzle jika waktu habis
      }, 1500);
    }
  }, 1000);
}

function updateTimerDisplay() {
  const timerDiv = document.getElementById('timer');
  if (timerDiv) timerDiv.textContent = timeLeft + 's';
}

// =====================
// Skor & Progress
// =====================
function showScorePopup() {
  clearInterval(timerInterval);
  document.getElementById('puzzle-score').textContent = puzzleScore;
  document.getElementById('quiz-score').textContent = quizScore;
  document.getElementById('total-score').textContent = puzzleScore + quizScore;
  document.getElementById('score-popup').style.display = 'flex';
}

function markProvinceComplete() {
  try {
    const key = CURRENT_PROVINCE.toLowerCase();
    const progress = JSON.parse(localStorage.getItem('progress_game')) || {};
    progress[key] = progress[key] || {};
    progress[key].allCompleted = true;
    localStorage.setItem('progress_game', JSON.stringify(progress));
  } catch (e) {
    console.warn('Gagal menyimpan progress:', e);
  }
}

function finalizeGame() {
  markProvinceComplete();
  showScorePopup();
}

// Tombol kontrol
document.getElementById('btn-kembali').onclick = function () {
  window.location.href = '../pilihangame/kepri.html';
};

document.getElementById('btn-main-lagi').onclick = function () {
  puzzleScore = 0;
  quizScore = 0;
  current = 0;
  document.getElementById('score-popup').style.display = 'none';
  loadQuestion(0);
};

document.getElementById('btn-reset').onclick = function () {
  puzzleScore = 0;
  quizScore = 0;
  current = 0;
  document.getElementById('score-popup').style.display = 'none';
  loadQuestion(0);
};