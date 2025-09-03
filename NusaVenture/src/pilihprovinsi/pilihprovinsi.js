const progressGame = JSON.parse(localStorage.getItem('progress_game')) || {};
const icons = document.querySelectorAll('.icon');

icons.forEach(icon => {
  const provinsi = icon.getAttribute('data-provinsi').toLowerCase();

  // Sulawesi Barat selalu terbuka
  if (provinsi === 'sulawesi barat') {
    icon.classList.remove('locked');
    icon.parentElement.style.pointerEvents = 'auto';
  }
  // Kepulauan Riau terbuka jika Sulawesi Barat selesai
  else if (
    progressGame['sulawesi barat'] &&
    progressGame['sulawesi barat'].allCompleted &&
    provinsi === 'kepulauan riau'
  ) {
    icon.classList.remove('locked');
    icon.parentElement.style.pointerEvents = 'auto';
  }
  // Papua Barat terbuka jika Kepulauan Riau selesai
  else if (
    progressGame['kepulauan riau'] &&
    progressGame['kepulauan riau'].allCompleted &&
    provinsi === 'papua barat'
  ) {
    icon.classList.remove('locked');
    icon.parentElement.style.pointerEvents = 'auto';
  }
  // Provinsi lain tetap terkunci
});
