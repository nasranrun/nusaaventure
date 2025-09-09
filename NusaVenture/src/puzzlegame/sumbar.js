const questions = [
  {
    preview: '../assets/img/Baju_Batabue.webp',
    pieces: [
      '../assets/img/batabuepadang/puzzle2_1_1.png',
      '../assets/img/batabuepadang/puzzle2_1_2.png',
      '../assets/img/batabuepadang/puzzle2_1_3.png',
      '../assets/img/batabuepadang/puzzle2_2_1.png',
      '../assets/img/batabuepadang/puzzle2_2_2.png',
      '../assets/img/batabuepadang/puzzle2_2_3.png',
      '../assets/img/batabuepadang/puzzle2_3_1.png',
      '../assets/img/batabuepadang/puzzle2_3_2.png',
      '../assets/img/batabuepadang/puzzle2_3_3.png'
    ],
    answer: [
      'puzzle2_1_1.png','puzzle2_1_2.png','puzzle2_1_3.png',
      'puzzle2_2_1.png','puzzle2_2_2.png','puzzle2_2_3.png',
      'puzzle2_3_1.png','puzzle2_3_2.png','puzzle2_3_3.png'
    ],
    question: 'Apa Baju adat tradisional Sumatera barat pada gambar tersebut adalah '
  },
  {
    preview: '../assets/img/ayampop.jpg',
    pieces: [
      '../assets/img/ayampop/puzzle_piece_1_1.jpg',
      '../assets/img/ayampop/puzzle_piece_1_2.jpg',
      '../assets/img/ayampop/puzzle_piece_1_3.jpg',
      '../assets/img/ayampop/puzzle_piece_2_1.jpg',
      '../assets/img/ayampop/puzzle_piece_2_2.jpg',
      '../assets/img/ayampop/puzzle_piece_2_3.jpg',
      '../assets/img/ayampop/puzzle_piece_3_1.jpg',
      '../assets/img/ayampop/puzzle_piece_3_2.jpg',
      '../assets/img/ayampop/puzzle_piece_3_3.jpg'
    ],
    answer: [
      'puzzle_piece_1_1.jpg','puzzle_piece_1_2.jpg','puzzle_piece_1_3.jpg',
      'puzzle_piece_2_1.jpg','puzzle_piece_2_2.jpg','puzzle_piece_2_3.jpg',
      'puzzle_piece_3_1.jpg','puzzle_piece_3_2.jpg','puzzle_piece_3_3.jpg'
    ],
    question: 'Apa makanan tradisional Khas Sumatera barat pada gambar tersebut 🍚'
  },
  {
    preview: '../assets/img/rumahgadang.jpg',
    pieces: [
      '../assets/img/gadangmaharam/puzzle_piece_1_1.jpg',
      '../assets/img/gadangmaharam/puzzle_piece_1_2.jpg',
      '../assets/img/gadangmaharam/puzzle_piece_1_3.jpg',
      '../assets/img/gadangmaharam/puzzle_piece_2_1.jpg',
      '../assets/img/gadangmaharam/puzzle_piece_2_2.jpg',
      '../assets/img/gadangmaharam/puzzle_piece_2_3.jpg',
      '../assets/img/gadangmaharam/puzzle_piece_3_1.jpg',
      '../assets/img/gadangmaharam/puzzle_piece_3_2.jpg',
      '../assets/img/gadangmaharam/puzzle_piece_3_3.jpg'
    ],
    answer: [
      'puzzle_piece_1_1.jpg','puzzle_piece_1_2.jpg','puzzle_piece_1_3.jpg',
      'puzzle_piece_2_1.jpg','puzzle_piece_2_2.jpg','puzzle_piece_2_3.jpg',
      'puzzle_piece_3_1.jpg','puzzle_piece_3_2.jpg','puzzle_piece_3_3.jpg'
    ],
    question: 'Apa Rumah adat Sumatera barat pada gambar tersebut '
  }
];

let current = 0;
let draggedPiece = null;
let timerInterval = null;
let timeLeft = 40;
let puzzleScore = 0;
let quizScore = 0;

function loadQuestion(idx) {
  document.getElementById('preview-img').src = questions[idx].preview;
  document.getElementById('soal').innerText = questions[idx].question;
  document.getElementById('feedback').innerHTML = '';

  // Shuffle pieces
  const pieces = [...questions[idx].pieces];
  for (let i = pieces.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [pieces[i], pieces[j]] = [pieces[j], pieces[i]];
  }

  // Render pieces
  const piecesDiv = document.getElementById('pieces');
  piecesDiv.innerHTML = '';
  pieces.forEach((src, i) => {
    const img = document.createElement('img');
    img.src = src;
    img.className = 'piece';
    img.draggable = true;
    img.id = 'piece-' + i;
    img.dataset.filename = src.split('/').pop();
    img.addEventListener('dragstart', dragStart);
    piecesDiv.appendChild(img);
  });

  // Render board
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
  // Hapus perubahan opacity agar gambar tidak transparan
}

function dragOver(e) {
  e.preventDefault();
}

function dropPiece(e) {
  e.preventDefault();
  if (!draggedPiece) return;
  if (e.target.classList.contains('slot') && !e.target.hasChildNodes()) {
    e.target.appendChild(draggedPiece); // Pindahkan gambar, tidak menduplikasi
    draggedPiece = null;
    checkBoard();
  }
}

// Drop ke area asal (pieces)
const pieces = document.getElementById('pieces');
pieces.addEventListener('dragover', function(e) {
  e.preventDefault();
});
pieces.addEventListener('drop', function(e) {
  e.preventDefault();
  const pieceId = e.dataTransfer.getData('text/plain');
  const piece = document.getElementById(pieceId);
  if (piece) {
    pieces.appendChild(piece); // Pindahkan gambar ke area asal
    draggedPiece = null;
  }
});

function showPopup() {
  let popup = document.createElement('div');
  popup.className = 'popup-overlay';
  popup.innerHTML = `
    <div class="popup-content">
      <img src="../assets/img/guidetour.png" alt="Salah" style="width:220px;">
      <br>
      <span style="color:red;font-size:1.2rem;">Coba lagi!</span>
    </div>
  `;
  document.body.appendChild(popup);
  setTimeout(() => {
    popup.remove();
  }, 1500);
}

function showQuizPopup() {
  let popup = document.createElement('div');
  popup.className = 'popup-overlay';
  popup.innerHTML = `
    <div class="popup-content">
      <img src="../assets/img/guidetour.png" alt="Salah" style="width:220px;">
      <br>
      <span style="color:red;font-size:1.2rem;">Jawaban salah! Coba lagi.</span>
    </div>
  `;
  document.body.appendChild(popup);
  setTimeout(() => {
    popup.remove();
  }, 1500);
}

function showTimeUpPopup() {
  let popup = document.createElement('div');
  popup.className = 'popup-overlay';
  popup.innerHTML = `
    <div class="popup-content">
      <img src="../assets/img/guidetour.png" alt="Waktu Habis" style="width:220px;">
      <br>
      <span style="color:red;font-size:1.2rem;">Waktu habis! Coba lagi.</span>
    </div>
  `;
  document.body.appendChild(popup);
  setTimeout(() => {
    popup.remove();
  }, 1500);
}

const quizOptions = [
  [
    "baju batu sangkar",
    "baju payakumbuah",
    "baju sabai nan ampek",
    "baju batabue"
  ],
  [
    "ayam sayur",
    "ayam pop",
    "ayam rendang",
    "nasi uduk"
  ],
  [
    "rumah gadang gonjong limo",
    "rumah gadang serambi papek",
    "rumah gadang maharam",
    "rumah gadang batingkek"
  ]
];

const quizAnswers = [
  "baju batabue",
  "ayam pop",
  "rumah gadang maharam"
];

function renderQuiz(idx) {
  const quizDiv = document.getElementById('quiz');
  quizDiv.innerHTML = '';
  const question = document.createElement('div');
  question.className = 'quiz-question';
  quizDiv.appendChild(question);

  quizOptions[idx].forEach(opt => {
    const label = document.createElement('label');
    label.className = 'quiz-option';
    const radio = document.createElement('input');
    radio.type = 'radio';
    radio.name = 'quiz';
    radio.value = opt;
    radio.onclick = function() {
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
  for (let r of radios) {
    if (r.checked) selected = r.value;
  }
  const quizDiv = document.getElementById('quiz');
  if (selected === quizAnswers[idx]) {
    quizDiv.innerHTML = '<span style="color:green;font-size:1.2rem;">Jawaban benar! ✅</span>';
    quizScore += 10;
  } else {
    quizDiv.innerHTML = '<span style="color:red;font-size:1.2rem;">Jawaban salah! Tetap lanjut.</span>';
  }
  setTimeout(() => {
    current++;
    if (current < questions.length) {
      loadQuestion(current);
    } else {
      document.getElementById('feedback').innerHTML = '<span style="color:blue;font-size:1.3rem;">Semua puzzle & quiz selesai!</span>';
      document.getElementById('pieces').innerHTML = '';
      document.getElementById('board').innerHTML = '';
      quizDiv.innerHTML = '';
      showScorePopup();
    }
  }, 1200);
}

function checkBoard() {
  const board = document.getElementById('board');
  const slots = Array.from(board.children);
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
        loadQuestion(current); // Reset puzzle jika waktu habis
      }, 1500);
    }
  }, 1000);
}

function updateTimerDisplay() {
  const timerDiv = document.getElementById('timer');
  if (timerDiv) timerDiv.textContent = timeLeft + 's';
}

function onPuzzleCompleted() {
  // Tandai puzzle sudah selesai
  let progress = JSON.parse(localStorage.getItem('progress_game')) || {};
  progress['sumatera barat'] = progress['sumatera barat'] || {};
  progress['sumatera barat'].puzzle = true;
  localStorage.setItem('progress_game', JSON.stringify(progress));
  // Redirect ke halaman pilihan game
  window.location.href = '../pilihangame/sumbar.html';
}

function onQuizCompleted(isCorrect) {
  quizScore = isCorrect ? 10 : 0;
  if (puzzleScore > 0) showScorePopup();
}

function showScorePopup() {
  clearInterval(timerInterval);
  document.getElementById('puzzle-score').textContent = puzzleScore;
  document.getElementById('quiz-score').textContent = quizScore;
  document.getElementById('total-score').textContent = puzzleScore + quizScore;
  document.getElementById('score-popup').style.display = 'flex';
}

document.getElementById('btn-kembali').onclick = function() {
  window.location.href = '../pilihangame/sumbar.html';
};

document.getElementById('btn-main-lagi').onclick = function() {
  puzzleScore = 0;
  quizScore = 0;
  current = 0;
  document.getElementById('score-popup').style.display = 'none';
  loadQuestion(0);
};

window.onload = () => {
  loadQuestion(current);
};

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