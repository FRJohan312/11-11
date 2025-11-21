const btn = document.getElementById("openBtn");
let opened = false;

const playerBox   = document.getElementById("playerBox");
const audio       = document.getElementById("audioPlayer");
const playBtn     = document.getElementById("playPauseBtn");
const prevBtn     = document.getElementById("prevBtn");
const nextBtn     = document.getElementById("nextBtn");
const progressBar = document.getElementById("progressBar");
const titleBox    = document.getElementById("musicTitle");
const coverImg    = document.getElementById("coverImg");

// -------------------------------
// 🎵 PLAYLIST LOCAL
// -------------------------------
const playlist = [
  { title: "Golden Hour", file: "music/cancion1.mp3", cover: "music/cover1.jpeg" },
  { title: "Golden Hours", file: "music/cancion2.mp3", cover: "music/cover2.png" },
  { title: "Te amo 💖", file: "music/cancion3.mp3", cover: "music/cover3.png" }
];

let currentSong = 0;

// -------------------------------
// 🌸 TRANSICIÓN SUAVE ENTRE CANCIONES
// -------------------------------
function animateSongChange() {
  coverImg.classList.remove("pop");
  void coverImg.offsetWidth; 
  coverImg.classList.add("pop");
}

// -------------------------------
// 🔊 CAMBIAR CANCIÓN
// -------------------------------
function setSong(index) {
  currentSong = (index + playlist.length) % playlist.length;
  const song = playlist[currentSong];

  audio.src = song.file;
  titleBox.textContent = song.title;
  coverImg.src = song.cover;

  animateSongChange();
  audio.currentTime = 0;

  audio.play().then(() => {
    playBtn.classList.add("playing");
    playBtn.textContent = "⏸";
    playerBox.classList.add("playing");
  }).catch(() => {
    playBtn.classList.remove("playing");
    playBtn.textContent = "▶";
  });
}

// -------------------------------
// ▶⏸ CONTROLES
// -------------------------------
function togglePlay() {
  if (audio.paused) {
    audio.play();
    playBtn.textContent = "⏸";
    playBtn.classList.add("playing");
    playerBox.classList.add("playing");
  } else {
    audio.pause();
    playBtn.textContent = "▶";
    playBtn.classList.remove("playing");
    playerBox.classList.remove("playing");
  }
}

function nextSong() { setSong(currentSong + 1); }
function prevSong() { setSong(currentSong - 1); }

// -------------------------------
// ⏳ PROGRESO DINÁMICO
// -------------------------------
audio.addEventListener("timeupdate", () => {
  if (!audio.duration) return;
  progressBar.value = (audio.currentTime / audio.duration) * 100;
  progressBar.style.setProperty("--p", progressBar.value + "%");
});

progressBar.addEventListener("input", () => {
  if (!audio.duration) return;
  audio.currentTime = (progressBar.value / 100) * audio.duration;
});

audio.addEventListener("ended", nextSong);

// -------------------------------
// 🎛 BOTONES
// -------------------------------
playBtn.addEventListener("click", togglePlay);
nextBtn.addEventListener("click", nextSong);
prevBtn.addEventListener("click", prevSong);

// -------------------------------
// 🚀 AL ABRIR
// -------------------------------
btn.addEventListener("click", () => {
  if (opened) return;
  opened = true;

  document.body.classList.add("open");
  document.getElementById("nextBtnRow").style.display = "flex";

  playerBox.style.display = "flex";

  // Centrar inicialmente
  const centerX = window.innerWidth / 2 - playerBox.offsetWidth / 2;
  const bottomY = window.innerHeight - playerBox.offsetHeight - 16;
  playerBox.style.left = `${centerX}px`;
  playerBox.style.top = `${bottomY}px`;
  playerBox.style.transform = "none"; // quitamos el translateX inicial

  setSong(0);
});

// -------------------------------
// 🔀 ARRASTRABLE
// -------------------------------
let isDragging = false;
let startX, startY, origX, origY;

playerBox.addEventListener("mousedown", startDrag);
playerBox.addEventListener("touchstart", startDrag);

function startDrag(e) {
  isDragging = true;
  if (e.type === "mousedown") {
    startX = e.clientX;
    startY = e.clientY;
  } else {
    startX = e.touches[0].clientX;
    startY = e.touches[0].clientY;
  }
  origX = parseFloat(playerBox.style.left);
  origY = parseFloat(playerBox.style.top);

  document.addEventListener("mousemove", drag);
  document.addEventListener("mouseup", endDrag);
  document.addEventListener("touchmove", drag, { passive: false });
  document.addEventListener("touchend", endDrag);
}

function drag(e) {
  if (!isDragging) return;
  e.preventDefault();
  let clientX = e.type.includes("touch") ? e.touches[0].clientX : e.clientX;
  let clientY = e.type.includes("touch") ? e.touches[0].clientY : e.clientY;

  const dx = clientX - startX;
  const dy = clientY - startY;

  playerBox.style.left = `${origX + dx}px`;
  playerBox.style.top = `${origY + dy}px`;
}

function endDrag() {
  isDragging = false;
  document.removeEventListener("mousemove", drag);
  document.removeEventListener("mouseup", endDrag);
  document.removeEventListener("touchmove", drag);
  document.removeEventListener("touchend", endDrag);
}

