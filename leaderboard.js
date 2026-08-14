const leaderboardListEl = document.getElementById('leaderboardList');
const leaderboardStatusEl = document.getElementById('leaderboardStatus');
const refreshLeaderboardBtn = document.getElementById('refreshLeaderboardBtn');
const MAX_LEADERBOARD_ITEMS = 10;

const [STORAGE_NICK, STORAGE_COLLECTION] = (() => {
  const parts = window.location.pathname.split('/').filter(Boolean);
  if (window.location.protocol === 'file:' || parts.length < 2) {
    return ['alanibr', 'typing-training'];
  }
  return [parts[0], parts[1]];
})();
const STORAGE_URL = `https://teens.make-it.kz/api/data/${STORAGE_NICK}/${STORAGE_COLLECTION}-v3`;

function renderLeaderboard(items) {
  leaderboardListEl.replaceChildren();

  if (!items.length) {
    const empty = document.createElement('li');
    empty.className = 'leaderboard-empty';
    empty.textContent = 'Пока нет результатов.';
    leaderboardListEl.append(empty);
    leaderboardStatusEl.textContent = 'Пока нет результатов';
    return;
  }

  items.forEach((item, index) => {
    const row = document.createElement('li');
    row.className = 'leaderboard-item';

    const rank = document.createElement('span');
    rank.className = 'leaderboard-rank';
    rank.textContent = `#${index + 1}`;

    const name = document.createElement('span');
    name.className = 'leaderboard-name';
    name.textContent = item.username;

    const score = document.createElement('span');
    score.className = 'leaderboard-score';
    score.textContent = item.score;

    row.append(rank, name, score);
    leaderboardListEl.append(row);
  });

  leaderboardStatusEl.textContent = 'Топ 10 результатов';
}

async function loadLeaderboard() {
  leaderboardStatusEl.textContent = 'Загрузка таблицы...';
  refreshLeaderboardBtn.disabled = true;

  try {
    const response = await fetch(STORAGE_URL, {
      headers: { 'Content-Type': 'application/json' },
    });
    if (!response.ok) throw new Error(`Ошибка сервера: ${response.status}`);

    const data = await response.json();
    const items = (Array.isArray(data?.items) ? data.items : [])
      .map(item => ({
        username: String(item.username || 'Игрок'),
        score: Number(item.score) || 0,
        lives: Number(item.lives) || 0,
      }))
      .sort((a, b) => b.score - a.score || b.lives - a.lives)
      .slice(0, MAX_LEADERBOARD_ITEMS);

    renderLeaderboard(items);
  } catch (error) {
    console.error('Загрузка лидерборда не удалась', error);
    leaderboardListEl.innerHTML = '<li class="leaderboard-empty">Список недоступен.</li>';
    leaderboardStatusEl.textContent = 'Не удалось обновить таблицу';
  } finally {
    refreshLeaderboardBtn.disabled = false;
  }
}

refreshLeaderboardBtn.addEventListener('click', loadLeaderboard);
loadLeaderboard();
