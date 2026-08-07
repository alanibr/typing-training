const scoreEl = document.getElementById('score');
const livesEl = document.getElementById('lives');
const restartBtn = document.getElementById('restartBtn');
const messageEl = document.getElementById('message');
const appEl = document.getElementById('app');
const trackEl = document.getElementById('track');
const lifeNoticeEl = document.getElementById('lifeNotice');

const wordLists = {
  easy: ['мир', 'свет', 'дом', 'кот', 'лес', 'снег', 'парк', 'круг', 'вода', 'день'],
  medium: ['привет', 'скорость', 'слово', 'мышь', 'проект', 'клавиатура', 'тренажер', 'компьютер', 'стол', 'птица'],
  hard: ['интерактивность', 'комбинация', 'пользователь', 'взаимодействие', 'конструктивный', 'максимальный', 'функционал', 'стратегия', 'программный', 'параллельно']
};

const difficultySettings = {
  easy: { fallSpeed: 55, label: 'Лёгкий' },
  medium: { fallSpeed: 75, label: 'Средний' },
  hard: { fallSpeed: 100, label: 'Сложный' }
};

const sharedLives = 3;

let currentDifficulty = 'easy';
let score = 0;
let lives = sharedLives;
let isRunning = true;
let currentWord = '';
let typedText = '';
let wordEl = null;
let wordTop = 0;
let lastTime = 0;
let audioContext = null;

function ensureAudio() {
  if (!audioContext) {
    const AudioContextCtor = window.AudioContext || window.webkitAudioContext;
    audioContext = AudioContextCtor ? new AudioContextCtor() : null;
  }

  if (audioContext && audioContext.state === 'suspended') {
    audioContext.resume();
  }

  return audioContext;
}

function playTone(frequency, duration, type = 'sine', volume = 0.05) {
  const ctx = ensureAudio();
  if (!ctx) return;

  const oscillator = ctx.createOscillator();
  const gainNode = ctx.createGain();

  oscillator.type = type;
  oscillator.frequency.value = frequency;
  gainNode.gain.value = volume;

  oscillator.connect(gainNode);
  gainNode.connect(ctx.destination);

  oscillator.start();
  gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
  oscillator.stop(ctx.currentTime + duration);
}

function playSuccessSound() {
  playTone(660, 0.12, 'triangle', 0.05);
  setTimeout(() => playTone(880, 0.12, 'sine', 0.04), 70);
}

function playMissSound() {
  playTone(220, 0.18, 'sawtooth', 0.05);
  setTimeout(() => playTone(180, 0.16, 'sine', 0.04), 90);
}

function updateHud() {
  scoreEl.textContent = score;
  livesEl.textContent = lives;
}

function applyDifficulty(difficulty) {
  currentDifficulty = difficulty;
  const settings = difficultySettings[difficulty];
  lives = sharedLives;
  updateHud();
  messageEl.textContent = `Сложность: ${settings.label}`;
  document.querySelectorAll('.difficulty-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.difficulty === difficulty);
  });
}

function renderWord() {
  if (!wordEl) return;
  const typedLength = typedText.length;
  const before = currentWord.slice(0, typedLength);
  const after = currentWord.slice(typedLength);
  wordEl.innerHTML = `${before.split('').map(ch => `<span class="letter-correct">${ch}</span>`).join('')}${after}`;
}

function spawnWord() {
  if (!isRunning) return;
  const pool = wordLists[currentDifficulty] || wordLists.easy;
  currentWord = pool[Math.floor(Math.random() * pool.length)];
  typedText = '';
  wordTop = -40;
  if (wordEl) {
    wordEl.remove();
    wordEl = null;
  }
  wordEl = document.createElement('div');
  wordEl.className = 'falling-word';
  wordEl.style.left = `${Math.random() * 70 + 15}%`;
  wordEl.style.top = '0px';
  trackEl.appendChild(wordEl);
  renderWord();
  messageEl.textContent = 'Набирай слово, пока оно падает.';
  appEl?.focus();
}

function endGame() {
  isRunning = false;
  if (wordEl) {
    wordEl.remove();
    wordEl = null;
  }
  messageEl.textContent = 'Игра окончена. Нажми «Начать заново». ';
}

function handleSuccess() {
  score += 1;
  messageEl.textContent = `Верно! +1 очко за слово «${currentWord}»`;
  updateHud();
  playSuccessSound();
  if (wordEl) {
    wordEl.remove();
    wordEl = null;
  }
  setTimeout(() => {
    if (isRunning) spawnWord();
  }, 250);
}

function showLifeNotice() {
  lifeNoticeEl.classList.remove('show');
  void lifeNoticeEl.offsetWidth;
  lifeNoticeEl.classList.add('show');
  clearTimeout(showLifeNotice.timeoutId);
  showLifeNotice.timeoutId = setTimeout(() => {
    lifeNoticeEl.classList.remove('show');
  }, 900);
}

function handleMiss() {
  if (!isRunning || !wordEl) return;

  lives -= 1;
  messageEl.textContent = `Промах! Нужное слово: «${currentWord}»`;
  updateHud();
  playMissSound();
  showLifeNotice();
  if (wordEl) {
    wordEl.remove();
    wordEl = null;
  }
  if (lives <= 0) {
    endGame();
  } else {
    setTimeout(() => {
      if (isRunning) spawnWord();
    }, 250);
  }
}

function handleInput(event) {
  if (!isRunning) return;

  ensureAudio();
  const key = event.key;
  if (key === 'Backspace') {
    typedText = typedText.slice(0, -1);
    renderWord();
    messageEl.textContent = 'Набирай дальше...';
    return;
  }

  if (key.length !== 1) return;
  event.preventDefault();

  const lowerKey = key.toLowerCase();
  const nextText = typedText + lowerKey;

  if (currentWord.startsWith(nextText)) {
    typedText = nextText;
    renderWord();

    if (typedText === currentWord) {
      handleSuccess();
      return;
    }

    messageEl.textContent = 'Набирай дальше...';
    return;
  }

  typedText = '';
  renderWord();
  messageEl.textContent = 'Не та буква — попробуй снова.';
}

function updateFrame(time) {
  if (!isRunning) return;
  if (!lastTime) lastTime = time;
  const delta = (time - lastTime) / 1000;
  lastTime = time;

  if (wordEl) {
    wordTop += difficultySettings[currentDifficulty].fallSpeed * delta;
    wordEl.style.top = `${wordTop}px`;

    const trackHeight = trackEl.clientHeight;
    if (wordTop > trackHeight - 120) {
      handleMiss();
      requestAnimationFrame(updateFrame);
      return;
    }
  }

  requestAnimationFrame(updateFrame);
}

restartBtn.addEventListener('click', () => {
  score = 0;
  lives = sharedLives;
  isRunning = true;
  updateHud();
  if (wordEl) {
    wordEl.remove();
    wordEl = null;
  }
  lastTime = 0;
  spawnWord();
  requestAnimationFrame(updateFrame);
});

document.querySelectorAll('.difficulty-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    applyDifficulty(btn.dataset.difficulty);
    if (isRunning) {
      if (wordEl) {
        wordEl.remove();
        wordEl = null;
      }
      lastTime = 0;
      spawnWord();
    }
  });
});

window.addEventListener('keydown', handleInput);
appEl?.addEventListener('click', () => appEl.focus());

applyDifficulty(currentDifficulty);
spawnWord();
requestAnimationFrame(updateFrame);
