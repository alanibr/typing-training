const scoreEl = document.getElementById('score');
const livesEl = document.getElementById('lives');
const restartBtn = document.getElementById('restartBtn');
const messageEl = document.getElementById('message');
const textInput = document.getElementById('textInput');
const playerNameInput = document.getElementById('playerName');
const startPlayerNameInput = document.getElementById('startPlayerName');
const startGameBtn = document.getElementById('startGameBtn');
const startScreenEl = document.getElementById('startScreen');
const leaderboardListEl = document.getElementById('leaderboardList');
const leaderboardStatusEl = document.getElementById('leaderboardStatus');
const refreshLeaderboardBtn = document.getElementById('refreshLeaderboardBtn');
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

const levelThresholds = {
  easy: 20,
  medium: 50,
  hard: 100,
};

const sharedLives = 3;
const PLAYER_NAME_KEY = 'typing-game-player-name';
const MAX_LEADERBOARD_ITEMS = 10;

const [STORAGE_NICK, STORAGE_COLLECTION] = (() => {
  const parts = window.location.pathname.split('/').filter(Boolean);
  return [parts[0] || 'your-nick', parts[1] || 'game'];
})();
const STORAGE_URL = `https://teens.make-it.kz/api/data/${STORAGE_NICK}/${STORAGE_COLLECTION}`;

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

function getPlayerName() {
  const sourceValue = (playerNameInput?.value || startPlayerNameInput?.value || localStorage.getItem(PLAYER_NAME_KEY) || 'Игрок').trim();
  const normalized = sourceValue.replace(/\s+/g, ' ').trim() || 'Игрок';

  if (playerNameInput) playerNameInput.value = normalized;
  if (startPlayerNameInput) startPlayerNameInput.value = normalized;
  localStorage.setItem(PLAYER_NAME_KEY, normalized);

  return normalized;
}

function updateHud() {
  scoreEl.textContent = score;
  livesEl.textContent = lives;
}

async function loadLeaderboard() {
  if (!leaderboardListEl || !leaderboardStatusEl) return;

  leaderboardStatusEl.textContent = 'Загрузка таблицы...';

  try {
    const response = await fetch(STORAGE_URL, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Ошибка сервера: ${response.status}`);
    }

    const data = await response.json();
    const items = Array.isArray(data?.items) ? data.items : [];

    const sortedItems = [...items]
      .map(item => ({
        username: item.username || 'Игрок',
        score: Number(item.score) || 0,
        difficulty: item.difficulty || 'easy',
        lives: Number(item.lives) || 0,
        finishedAt: item.finishedAt || new Date().toISOString(),
      }))
      .sort((a, b) => b.score - a.score || b.lives - a.lives)
      .slice(0, MAX_LEADERBOARD_ITEMS);

    if (!sortedItems.length) {
      leaderboardListEl.innerHTML = '<li class="leaderboard-empty">Пока нет результатов.</li>';
      leaderboardStatusEl.textContent = 'Пока нет результатов';
      return;
    }

    leaderboardListEl.innerHTML = sortedItems
      .map((item, index) => `
        <li class="leaderboard-item">
          <span class="leaderboard-rank">#${index + 1}</span>
          <span class="leaderboard-name">${item.username}</span>
          <span class="leaderboard-score">${item.score}</span>
        </li>
      `)
      .join('');

    leaderboardStatusEl.textContent = 'Топ 10 результатов';
  } catch (error) {
    console.error('Загрузка лидерборда не удалась', error);
    leaderboardListEl.innerHTML = '<li class="leaderboard-empty">Список недоступен.</li>';
    leaderboardStatusEl.textContent = 'Не удалось обновить таблицу';
  }
}

async function saveResult(result) {
  const payload = {
    username: getPlayerName(),
    score: result.score,
    difficulty: result.difficulty,
    lives: result.lives,
    status: result.status,
    finishedAt: result.finishedAt,
    message: result.message,
  };

  try {
    messageEl.textContent = 'Сохраняю результат...';
    const response = await fetch(STORAGE_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error(`Ошибка сервера: ${response.status}`);
    }

    const data = await response.json();
    if (!data.ok) {
      throw new Error('Сервер вернул неок');
    }

    messageEl.textContent = 'Результат сохранён на сервере.';
      await loadLeaderboard();
  } catch (error) {
    console.error('Сохранение не удалось', error);
    messageEl.textContent = 'Не удалось сохранить. Результат сохранён локально.';
    localStorage.setItem('typing-game-last-result', JSON.stringify(payload));
    return false;
  }
}

function applyDifficulty(difficulty) {
  currentDifficulty = difficulty;
  const settings = difficultySettings[difficulty];
  lives = sharedLives;
  updateHud();
  messageEl.textContent = `Сложность: ${settings.label}`;
  textInput.value = '';
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

function isMobileDevice() {
  return /Mobi|Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || window.matchMedia('(hover: none) and (pointer: coarse)').matches;
}

function focusInput() {
  textInput?.focus();
}

function handleTextInput(event) {
  if (!isRunning || !currentWord) return;
  const value = (event.target.value || '').toLowerCase().replace(/[^а-яё]/gi, '');
  if (value.length < typedText.length) {
    typedText = value;
    renderWord();
    messageEl.textContent = 'Набирай дальше...';
    return;
  }

  const nextChar = value.slice(-1);
  if (!nextChar) return;

  if (currentWord.startsWith(typedText + nextChar)) {
    typedText += nextChar;
    textInput.value = typedText;
    renderWord();
    messageEl.textContent = 'Набирай дальше...';

    if (typedText === currentWord) {
      handleSuccess();
    }
    return;
  }

  textInput.value = '';
  typedText = '';
  renderWord();
  messageEl.textContent = 'Не та буква — попробуй снова.';
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
  textInput.value = '';
  renderWord();
  messageEl.textContent = 'Набирай слово, пока оно падает.';
  focusInput();
}

function endGame() {
  isRunning = false;
  if (wordEl) {
    wordEl.remove();
    wordEl = null;
  }
  messageEl.textContent = 'Игра окончена. Нажми «Начать заново». ';
  saveResult({
    score,
    difficulty: currentDifficulty,
    lives,
    status: 'finished',
    finishedAt: new Date().toISOString(),
    message: 'Игра окончена',
  });
}

function checkLevelProgress() {
  if (currentDifficulty === 'easy' && score >= levelThresholds.easy) {
    applyDifficulty('medium');
    messageEl.textContent = 'Поздравляем! Переход на средний уровень.';
    return;
  }

  if (currentDifficulty === 'medium' && score >= levelThresholds.medium) {
    applyDifficulty('hard');
    messageEl.textContent = 'Поздравляем! Переход на сложный уровень.';
    return;
  }

  if (currentDifficulty === 'hard' && score >= levelThresholds.hard) {
    messageEl.textContent = 'Звание чемпион присвоено!';
    saveResult({
      score,
      difficulty: currentDifficulty,
      lives,
      status: 'champion',
      finishedAt: new Date().toISOString(),
      message: 'Звание чемпион',
    });
  }
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
  textInput.value = '';
  focusInput();
  checkLevelProgress();
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
  textInput.value = '';
  focusInput();
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

function startGame() {
  getPlayerName();
  if (startScreenEl) {
    startScreenEl.classList.add('hidden');
  }

  score = 0;
  lives = sharedLives;
  isRunning = true;
  updateHud();
  if (wordEl) {
    wordEl.remove();
    wordEl = null;
  }
  textInput.value = '';
  lastTime = 0;
  spawnWord();
  focusInput();
  requestAnimationFrame(updateFrame);
}

restartBtn.addEventListener('click', () => {
  startGame();
});

startGameBtn?.addEventListener('click', startGame);

document.querySelectorAll('.difficulty-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    applyDifficulty(btn.dataset.difficulty);
    if (isRunning) {
      if (wordEl) {
        wordEl.remove();
        wordEl = null;
      }
      textInput.value = '';
      lastTime = 0;
      spawnWord();
      focusInput();
    }
  });
});

textInput?.addEventListener('input', handleTextInput);
playerNameInput?.addEventListener('input', () => {
  localStorage.setItem(PLAYER_NAME_KEY, getPlayerName());
});
refreshLeaderboardBtn?.addEventListener('click', loadLeaderboard);
window.addEventListener('keydown', handleInput);
appEl?.addEventListener('click', focusInput);
trackEl?.addEventListener('click', focusInput);

if (playerNameInput) {
  const savedName = localStorage.getItem(PLAYER_NAME_KEY) || 'Игрок';
  playerNameInput.value = savedName;
}

applyDifficulty(currentDifficulty);
spawnWord();
loadLeaderboard();
if (isMobileDevice()) {
  setTimeout(focusInput, 500);
}
requestAnimationFrame(updateFrame);
