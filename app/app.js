// Neon Bay Trophy Guide: a 55-trophy tracker for Grand Theft Auto VI on PS5.
// The list and the guides live in data/trophies.json, the roadmap in
// data/roadmap.json. Progress is kept in localStorage; export and import move
// it between browsers. Nothing here reaches the network at run time.
const KEY = 'neon-bay-trophy-guide-v1';
const SPOILER_KEY = 'neon-bay-trophy-guide-spoiler';

const [trophyDoc, roadmapDoc] = await Promise.all([
  (await fetch('data/trophies.json')).json(),
  (await fetch('data/roadmap.json')).json(),
]);
const trophies = trophyDoc.trophies;
const sourceById = trophyDoc.sources;

let earned = new Set(JSON.parse(localStorage.getItem(KEY) ?? '[]'));
let spoiler = localStorage.getItem(SPOILER_KEY) === '1';
let kind = 'all';
let grade = 'all';
let query = '';
let hideEarned = false;

const list = document.getElementById('list');
const listMeta = document.getElementById('listMeta');

function save() {
  localStorage.setItem(KEY, JSON.stringify([...earned].sort((a, b) => a - b)));
}

function gradeCounts() {
  const counts = { platinum: 0, gold: 0, silver: 0, bronze: 0 };
  for (const t of trophies) if (earned.has(t.id)) counts[t.grade]++;
  return counts;
}

function renderProgress() {
  const n = earned.size;
  document.getElementById('progress').textContent = `${n} of ${trophies.length} earned`;
  document.getElementById('progressFill').style.width = `${Math.round((n / trophies.length) * 100)}%`;
  const c = gradeCounts();
  document.getElementById('progressGrades').textContent =
    `Platinum ${c.platinum}/1 · Gold ${c.gold}/2 · Silver ${c.silver}/6 · Bronze ${c.bronze}/46`;
}

function renderRoadmap() {
  document.getElementById('roadmapTitle').textContent = roadmapDoc.title;
  document.getElementById('roadmapIntro').textContent = roadmapDoc.intro;
  document.getElementById('missableText').textContent = roadmapDoc.missable.note;
  const stages = document.getElementById('roadmapStages');
  stages.replaceChildren();
  for (const stage of roadmapDoc.stages) {
    const card = document.createElement('div');
    card.className = 'stage';
    const h = document.createElement('h4');
    h.textContent = stage.title;
    const hours = document.createElement('p');
    hours.className = 'hours';
    hours.textContent = stage.hours;
    const ol = document.createElement('ol');
    for (const step of stage.steps) {
      const li = document.createElement('li');
      li.textContent = step;
      ol.append(li);
    }
    card.append(h, hours, ol);
    stages.append(card);
  }
  const checklist = document.getElementById('roadmapChecklist');
  checklist.replaceChildren();
  for (const item of roadmapDoc.checklist_at_a_glance) {
    const li = document.createElement('li');
    li.textContent = `${item.label}: ${item.need}`;
    checklist.append(li);
  }
  const sources = document.getElementById('roadmapSources');
  sources.replaceChildren(document.createTextNode('Roadmap sources: '));
  roadmapDoc.sources.forEach((id, i) => {
    if (i > 0) sources.append(document.createTextNode(' · '));
    const s = sourceById[id];
    if (s.url) {
      const a = document.createElement('a');
      a.href = s.url;
      a.textContent = s.name;
      sources.append(a);
    } else {
      sources.append(document.createTextNode(s.name));
    }
  });
}

function kindLabel(k) {
  return { story: 'Story', missable: 'Missable', collectibles: 'Collectibles', activities: 'Activities', robbery: 'Robbery', online: 'Online', platinum: 'Platinum' }[k] ?? k;
}

function matches(t) {
  if (grade !== 'all' && t.grade !== grade) return false;
  if (hideEarned && earned.has(t.id)) return false;
  if (kind === 'missable' && !t.missable) return false;
  if (kind === 'online') return false;
  if (kind !== 'all' && kind !== 'missable' && kind !== 'online' && !t.kinds.includes(kind)) return false;
  if (query) {
    const hay = `${t.name} ${t.description} ${t.guide}`.toLowerCase();
    if (!hay.includes(query)) return false;
  }
  return true;
}

function sourceLinks(ids) {
  const p = document.createElement('p');
  p.className = 'sources';
  p.append(document.createTextNode('Source: '));
  ids.forEach((id, i) => {
    if (i > 0) p.append(document.createTextNode(' · '));
    const s = sourceById[id];
    if (!s) return;
    if (s.url) {
      const a = document.createElement('a');
      a.href = s.url;
      a.textContent = s.name;
      p.append(a);
    } else {
      p.append(document.createTextNode(s.name));
    }
  });
  return p;
}

function renderList() {
  list.replaceChildren();
  const shown = trophies.filter(matches);
  if (kind === 'online') {
    const p = document.createElement('p');
    p.className = 'empty';
    p.textContent = 'No online trophies: all 55 are single-player, and none needs PlayStation Plus or GTA Online.';
    list.append(p);
  } else if (shown.length === 0) {
    const p = document.createElement('p');
    p.className = 'empty';
    p.textContent = 'No trophies match these filters. Clear the search or pick another kind.';
    list.append(p);
  }
  for (const t of shown) {
    const isEarned = earned.has(t.id);
    const hiddenBySpoiler = spoiler && t.hidden && !isEarned;
    const card = document.createElement('article');
    card.className = 'card' + (isEarned ? ' earned' : '');
    card.id = `trophy-${t.id}`;
    const box = document.createElement('input');
    box.type = 'checkbox';
    box.checked = isEarned;
    box.setAttribute('aria-label', `Mark ${t.name} earned`);
    box.addEventListener('change', () => {
      if (box.checked) earned.add(t.id);
      else earned.delete(t.id);
      save();
      renderProgress();
      renderList();
    });
    const body = document.createElement('div');
    const h = document.createElement('h3');
    h.textContent = hiddenBySpoiler ? 'Hidden story trophy' : t.name;
    const desc = document.createElement('p');
    desc.className = 'desc';
    desc.textContent = hiddenBySpoiler ? 'Hidden on PlayStation until earned — tick it off once it pops.' : t.description;
    body.append(h, desc);
    const tags = document.createElement('div');
    tags.className = 'tags';
    for (const k of t.kinds) {
      const tag = document.createElement('span');
      tag.className = 'tag';
      tag.textContent = kindLabel(k);
      tags.append(tag);
    }
    if (t.hidden) {
      const tag = document.createElement('span');
      tag.className = 'tag hiddenTag';
      tag.textContent = 'Hidden';
      tags.append(tag);
    }
    if (t.missable) {
      const tag = document.createElement('span');
      tag.className = 'tag missable';
      tag.textContent = 'Missable';
      tags.append(tag);
    }
    body.append(tags);
    if (!hiddenBySpoiler) {
      const guide = document.createElement('p');
      guide.className = 'guide';
      guide.textContent = t.guide;
      body.append(guide, sourceLinks(t.sources));
    } else {
      const guide = document.createElement('p');
      guide.className = 'guide';
      guide.textContent = 'Guide hidden in spoiler-free mode until you earn this trophy.';
      body.append(guide);
    }
    const gradeBadge = document.createElement('span');
    gradeBadge.className = `grade ${t.grade}`;
    gradeBadge.textContent = t.grade;
    card.append(box, body, gradeBadge);
    list.append(card);
  }
  const shownCount = kind === 'online' ? 0 : shown.length;
  listMeta.textContent = `Showing ${shownCount} of ${trophies.length} trophies · ${earned.size} earned`;
}

function renderKindChips() {
  const chips = document.getElementById('kindChips');
  chips.replaceChildren();
  for (const k of ['all', 'story', 'missable', 'collectibles', 'activities', 'robbery', 'online']) {
    const b = document.createElement('button');
    b.type = 'button';
    b.className = 'chip';
    b.textContent = k === 'all' ? 'All' : kindLabel(k);
    b.setAttribute('aria-pressed', String(kind === k));
    b.addEventListener('click', () => {
      kind = k;
      renderKindChips();
      renderList();
    });
    chips.append(b);
  }
}

document.getElementById('grade').addEventListener('change', (e) => {
  grade = e.target.value;
  renderList();
});
document.getElementById('search').addEventListener('input', (e) => {
  query = e.target.value.trim().toLowerCase();
  renderList();
});
document.getElementById('hideEarned').addEventListener('change', (e) => {
  hideEarned = e.target.checked;
  renderList();
});
const spoilerBox = document.getElementById('spoiler');
spoilerBox.checked = spoiler;
spoilerBox.addEventListener('change', (e) => {
  spoiler = e.target.checked;
  localStorage.setItem(SPOILER_KEY, spoiler ? '1' : '0');
  renderList();
});
document.getElementById('export').addEventListener('click', () => {
  const a = document.createElement('a');
  a.href = URL.createObjectURL(new Blob([JSON.stringify({ game: 'Grand Theft Auto VI', earned: [...earned].sort((x, y) => x - y) }, null, 2)], { type: 'application/json' }));
  a.download = 'neon-bay-trophy-progress.json';
  a.click();
});
document.getElementById('import').addEventListener('change', async (e) => {
  const file = e.target.files[0];
  if (!file) return;
  try {
    const data = JSON.parse(await file.text());
    const ids = Array.isArray(data) ? data : data.earned;
    const valid = new Set(trophies.map((t) => t.id));
    earned = new Set(ids.filter((id) => valid.has(id)));
    save();
    renderProgress();
    renderList();
  } catch {
    listMeta.textContent = 'That file is not a trophy progress export — nothing changed.';
  }
});
document.getElementById('reset').addEventListener('click', () => {
  earned = new Set();
  save();
  renderProgress();
  renderList();
});

// Staging API for the deterministic screenshot scenes (src/shots.js).
export function setEarned(ids) {
  earned = new Set(ids);
  save();
  renderProgress();
  renderList();
}
export function setSpoiler(value) {
  spoiler = value;
  spoilerBox.checked = value;
  localStorage.setItem(SPOILER_KEY, value ? '1' : '0');
  renderList();
}
export function setKind(value) {
  kind = value;
  renderKindChips();
  renderList();
}
export function setGrade(value) {
  grade = value;
  document.getElementById('grade').value = value;
  renderList();
}
export function setSearch(value) {
  query = value.toLowerCase();
  document.getElementById('search').value = value;
  renderList();
}
export function scrollToSection(id) {
  document.getElementById(id)?.scrollIntoView({ block: 'start' });
}
export function scrollToTrophy(id) {
  document.getElementById(`trophy-${id}`)?.scrollIntoView({ block: 'center' });
}

renderRoadmap();
renderKindChips();
renderProgress();
renderList();
window.__appReady = true;
window.dispatchEvent(new CustomEvent('neonbay:ready'));
