// Game logic for clickable images with timer and stars

const clickableClasses = ['tenunntt', 'tenunntt2', 'parang', 'patung'];
let clicked = {};
let stars = 3;
let timeLeft = 15;
let timerInterval;
let gameEnded = false;

// Create UI: timer, stars, popup
function createUI() {
    // Timer
    const timer = document.createElement('div');
    timer.id = 'timer';
    timer.style.position = 'fixed';
    timer.style.top = '20px';
    timer.style.left = '50%';
    timer.style.transform = 'translateX(-50%)';
    timer.style.fontSize = '2rem';
    timer.style.fontWeight = 'bold';
    timer.style.zIndex = '100';
    timer.innerText = `⏰ ${timeLeft}`;
    document.body.appendChild(timer);

    // Stars
    const starsDiv = document.createElement('div');
    starsDiv.id = 'stars';
    starsDiv.style.position = 'fixed';
    starsDiv.style.top = '20px';
    starsDiv.style.right = '40px';
    starsDiv.style.zIndex = '100';
    updateStars(starsDiv, stars);
    document.body.appendChild(starsDiv);

    // Popup
    const popup = document.createElement('div');
    popup.id = 'popup';
    popup.style.position = 'fixed';
    popup.style.top = '50%';
    popup.style.left = '50%';
    popup.style.transform = 'translate(-50%, -50%)';
    popup.style.background = 'rgba(255,255,255,0.95)';
    popup.style.padding = '40px 30px';
    popup.style.borderRadius = '16px';
    popup.style.boxShadow = '0 4px 24px rgba(0,0,0,0.2)';
    popup.style.display = 'none';
    popup.style.textAlign = 'center';
    popup.style.zIndex = '200';
    document.body.appendChild(popup);
}

function updateStars(starsDiv, count) {
    starsDiv.innerHTML = '';
    for (let i = 0; i < 3; i++) {
        const star = document.createElement('img');
        star.src = '../assets/img/stars1.png';
        star.style.width = '40px';
        star.style.opacity = i < count ? '1' : '0.2';
        star.style.margin = '0 2px';
        starsDiv.appendChild(star);
    }
}

function showPopup(finalStars) {
    const popup = document.getElementById('popup');
    popup.innerHTML = `<h2>Skor Anda</h2>
        <div style="margin:16px 0;">
            ${[...Array(3)].map((_,i)=>`<img src="../assets/img/stars1.png" style="width:50px;opacity:${i<finalStars?1:0.2}">`).join('')}
        </div>
        <button id="reloadBtn" style="padding:8px 24px;font-size:1.1rem;border-radius:8px;border:none;background:#4caf50;color:#fff;cursor:pointer;">Main Lagi</button>
    `;
    popup.style.display = 'block';
    document.getElementById('reloadBtn').onclick = () => window.location.reload();
}

function endGame() {
    clearInterval(timerInterval);
    gameEnded = true;

    // Hitung jumlah target yang tidak diklik
    const notClickedCount = clickableClasses.filter(cls => !clicked[cls]).length;

    // Jika belum klik satupun → anggap gagal total
    if (Object.values(clicked).every(val => val === false)) {
        stars = 0;
    } else {
        // Kurangi bintang sesuai jumlah yang tidak diklik
        stars -= notClickedCount;
        if (stars < 0) stars = 0;
    }

    showPopup(stars);
}


function wrongClick() {
    if (gameEnded) return;
    stars--;
    updateStars(document.getElementById('stars'), stars);
    if (stars <= 0) endGame();
}

function rightClick(className, img) {
    if (gameEnded) return;
    if (!clicked[className]) {
        clicked[className] = true;
        img.style.filter = 'grayscale(80%) brightness(1.2)';
        img.style.opacity = '0.6';
    }
    if (Object.values(clicked).filter(Boolean).length === clickableClasses.length) {
        endGame();
    }
}

function startGame() {
    createUI();
    clickableClasses.forEach(cls => clicked[cls] = false);

    // Make images clickable
    document.querySelectorAll('img').forEach(img => {
        img.style.pointerEvents = 'auto';
        img.style.cursor = 'pointer';
        img.addEventListener('click', e => {
            if (gameEnded) return;

            const classList = Array.from(img.classList);
            const isTarget = clickableClasses.some(cls => classList.includes(cls));

            if (isTarget) {
                const targetClass = classList.find(cls => clickableClasses.includes(cls));
                if (!clicked[targetClass]) {
                    rightClick(targetClass, img);
                } else {
                    wrongClick(); // klik ulang target dianggap salah
                }
            } else {
                wrongClick(); // kalau klik image lain (misalnya background)
            }

            e.stopPropagation(); // biar klik di gambar nggak nembus ke body
        });
    });

    // Klik background (selain gambar tempelan)
    document.body.addEventListener('click', e => {
        if (gameEnded) return;

        // Pastikan kliknya bukan gambar
        if (e.target.tagName !== "IMG") {
            wrongClick();
        }
    });

    // Timer
    timerInterval = setInterval(() => {
        if (gameEnded) return;
        timeLeft--;
        document.getElementById('timer').innerText = `⏰ ${timeLeft}`;
        if (timeLeft <= 0) {
            endGame();
        }
    }, 1000);

    // Tambahkan animasi shake untuk feedback klik salah
    const style = document.createElement('style');
    style.innerHTML = `
    @keyframes shake {
        0% { transform: translateX(0); }
        20% { transform: translateX(-10px); }
        40% { transform: translateX(10px); }
        60% { transform: translateX(-10px); }
        80% { transform: translateX(10px); }
        100% { transform: translateX(0); }
    }`;
    document.head.appendChild(style);
}

window.onload = startGame;

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