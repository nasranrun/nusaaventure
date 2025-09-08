const dialogues = [
  {
    speaker: "../assets/img/cutscene2.png",
    text: "Selamat datang di Papua! Saya akan jadi pemandu sekaligus teman perjalanan kakak hari ini. Papua punya banyak sekali adat istiadat dan budaya yang menarik. Yuk, saya ajak berkeliling sambil belajar."
  },
  {
    speaker: "../assets/img/cutscene_kepri.png",
    text: "Tentu, aku sudah tidak sabar untuk menjelajahi warisan kebudayaan milik Papua."
  },
  {
    speaker: "../assets/img/cutscene2.png",
    text: "Mau kita mulai dari mana?"
  }
];

let dialogueIndex = 0;
let charIndex = 0;
let currentText = "";
let isTyping = false;

const dialogueElement = document.getElementById("dialogue-text");
const characterElement = document.getElementById("character");
const nextBtn = document.getElementById("next-btn");

// ...existing code...

function typeDialogue() {
  if (charIndex < currentText.length) {
    dialogueElement.textContent += currentText.charAt(charIndex);
    charIndex++;
    setTimeout(typeDialogue, 40); // speed ketik
  } else {
    isTyping = false;
  }
}

function showNextDialogue() {
  // Jika sedang mengetik, langsung tampilkan seluruh teks
  if (isTyping) {
    dialogueElement.textContent = currentText;
    charIndex = currentText.length;
    isTyping = false;
    return;
  }

  // Jika sudah di dialog terakhir, redirect ke pilihangame
  if (dialogueIndex >= dialogues.length) {
    window.location.href = "../pilihangame/papua.html";
    return;
  }

  const dialogue = dialogues[dialogueIndex];
  currentText = dialogue.text;
  characterElement.src = dialogue.speaker;
  dialogueElement.textContent = "";
  charIndex = 0;
  isTyping = true;

  typeDialogue();
  dialogueIndex++;
}

// ...existing code...
nextBtn.addEventListener("click", showNextDialogue);


// langsung tampil pertama kali
showNextDialogue();

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