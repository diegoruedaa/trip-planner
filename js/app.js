/* app.js — the app's logic. You shouldn't need to touch this file to customize your trip — edit js/data.js instead. */

let memStore = {};
function storageGet(key) { try { const v = localStorage.getItem(key); return v === null ? null : v; } catch (e) { return memStore[key] ?? null; } }
function storageSet(key, val) { try { localStorage.setItem(key, val); } catch (e) { memStore[key] = val; } }
function mapsUrl(q) { return 'https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent(q); }
function dirUrl(q) { return 'https://www.google.com/maps/dir/?api=1&destination=' + encodeURIComponent(q) + '&travelmode=walking'; }
function isDone(dayId, idx) { return storageGet('tp-' + dayId + '-' + idx) === '1'; }
function setDone(dayId, idx, val) { storageSet('tp-' + dayId + '-' + idx, val ? '1' : '0'); }

function renderHeader() {
  document.title = TRIP.name;
  document.getElementById('eyebrow').textContent = TRIP.eyebrow || '';
  document.getElementById('tripTitle').textContent = TRIP.name;
  document.getElementById('tripSubtitle').textContent = TRIP.subtitle || '';
}

function renderPanels() {
  const panels = document.getElementById('panels');
  panels.innerHTML = '';
  TRIP.days.forEach(day => {
    const panel = document.createElement('div');
    panel.className = 'day-panel';
    panel.id = 'panel-' + day.id;
    panel.style.setProperty('--day-color', day.color);
    panel.style.setProperty('--day-soft', day.bg);

    const doneCount = day.stops.filter((_, i) => isDone(day.id, i)).length;
    const pct = Math.round((doneCount / day.stops.length) * 100);

    let html = `
      <div class="daymeta">
        <div class="datebig">${day.dateLabel}</div>
        <h2>${day.name}</h2>
        <div class="progress-wrap">
          <div class="progress-bar"><div class="progress-fill" id="fill-${day.id}" style="width:${pct}%"></div></div>
          <div class="progress-text" id="ptext-${day.id}">${doneCount}/${day.stops.length}</div>
        </div>
      </div>
      <div class="timeline">
    `;

    day.stops.forEach((s, idx) => {
      const done = isDone(day.id, idx);
      const cat = CATEGORIES[s.cat] || { icon: '•', label: '' };
      html += `
        <div class="stop ${done ? 'done' : ''}" data-day="${day.id}" data-idx="${idx}">
          <div class="stop-dot"></div>
          <div class="card">
            <div class="card-top">
              <div class="checkbox" data-toggle role="checkbox" tabindex="0" aria-checked="${done}" aria-label="Mark as done: ${s.title}">
                <svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M5 13l4 4L19 7" stroke="white" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/></svg>
              </div>
              <div class="card-body">
                <div class="time">${s.time}</div>
                <div class="title-row">
                  <span class="badge" title="${cat.label}" aria-hidden="true">${cat.icon}</span>
                  <span class="title">${s.title}</span>
                </div>
                ${s.desc ? `<div class="desc">${s.desc}</div>` : ''}
                ${s.ticketFile ? `<a class="ticket-tag" download="${s.ticketFile}" href="tickets/${s.ticketFile}">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><path d="M14 2v6h6"/><path d="M9 15h6"/><path d="M9 11h2"/></svg>
                  View ticket
                </a>` : ''}
                ${s.maps ? `<div class="cta-row">
                  <a class="maps-link" target="_blank" rel="noopener" href="${mapsUrl(s.maps)}">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" aria-hidden="true"><path d="M21 10c0 6-9 12-9 12s-9-6-9-12a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>
                    Open in Maps
                  </a>
                  <a class="dir-link" target="_blank" rel="noopener" href="${dirUrl(s.maps)}">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" aria-hidden="true"><path d="M3 11l18-8-8 18-2-8-8-2z"/></svg>
                    Directions
                  </a>
                </div>` : ''}
              </div>
            </div>
          </div>
        </div>
      `;
    });

    html += `</div>`;
    panel.innerHTML = html;
    panels.appendChild(panel);
  });

  document.querySelectorAll('.stop').forEach(stopEl => {
    const box = stopEl.querySelector('[data-toggle]');
    const toggle = () => {
      const dayId = stopEl.dataset.day;
      const idx = stopEl.dataset.idx;
      const nowDone = !stopEl.classList.contains('done');
      stopEl.classList.toggle('done', nowDone);
      box.setAttribute('aria-checked', String(nowDone));
      setDone(dayId, idx, nowDone);
      updateProgress(dayId);
    };
    box.addEventListener('click', toggle);
    box.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggle(); }
    });
  });
}

function updateProgress(dayId) {
  const day = TRIP.days.find(d => String(d.id) === String(dayId));
  const doneCount = day.stops.filter((_, i) => isDone(day.id, i)).length;
  const pct = Math.round((doneCount / day.stops.length) * 100);
  document.getElementById('fill-' + dayId).style.width = pct + '%';
  document.getElementById('ptext-' + dayId).textContent = doneCount + '/' + day.stops.length;
}

function renderTabs() {
  const bar = document.getElementById('tabbar');
  bar.innerHTML = '';
  const todayIso = new Date().toISOString().slice(0, 10);
  TRIP.days.forEach(day => {
    const btn = document.createElement('button');
    btn.className = 'tab';
    btn.dataset.day = day.id;
    btn.style.setProperty('--tab-color', day.color);
    btn.style.setProperty('--tab-bg', day.bg);
    btn.setAttribute('aria-label', day.dateLabel + ' — ' + day.name);
    if (day.isoDate === todayIso) btn.classList.add('today');
    const [datePart, dayPart] = day.dateLabel.split(' ');
    btn.innerHTML = `
      <span class="tabdate">${datePart || ''}</span>
      <span class="tabday">${dayPart || day.dateLabel}</span>
      <span class="tabdot"></span>
    `;
    btn.addEventListener('click', () => selectDay(day.id));
    bar.appendChild(btn);
  });
}

let lastDayId = null;
function selectDay(dayId) {
  lastDayId = dayId;
  document.getElementById('panel-expenses').classList.remove('active');
  document.querySelectorAll('.day-panel').forEach(p => p.classList.toggle('active', p.id === 'panel-' + dayId));
  document.querySelectorAll('.tab').forEach(t => t.classList.toggle('active', String(t.dataset.day) === String(dayId)));
  document.getElementById('nextBanner').classList.toggle('show', shouldShowBanner(dayId));
  updateNextBanner(dayId);
}

function openExpenses() {
  document.querySelectorAll('.day-panel').forEach(p => p.classList.remove('active'));
  document.getElementById('nextBanner').classList.remove('show');
  document.getElementById('panel-expenses').classList.add('active');
}
function closeExpenses() {
  selectDay(lastDayId || initialDay());
}
document.getElementById('expensesBtn').addEventListener('click', openExpenses);
document.getElementById('backFromExpenses').addEventListener('click', closeExpenses);

function initialDay() {
  const todayIso = new Date().toISOString().slice(0, 10);
  const match = TRIP.days.find(d => d.isoDate === todayIso);
  return match ? match.id : TRIP.days[0].id;
}

function renderLegend() {
  const list = document.getElementById('legendList');
  list.innerHTML = Object.values(CATEGORIES).map(c => `
    <div class="legend-row"><div class="badge" aria-hidden="true">${c.icon}</div><div class="llabel">${c.label}</div></div>
  `).join('');
}

document.getElementById('settingsBtn').addEventListener('click', () => { document.getElementById('sheetOverlay').classList.add('open'); });
document.getElementById('sheetClose').addEventListener('click', () => { document.getElementById('sheetOverlay').classList.remove('open'); });
document.getElementById('sheetOverlay').addEventListener('click', (e) => { if (e.target.id === 'sheetOverlay') document.getElementById('sheetOverlay').classList.remove('open'); });
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') document.getElementById('sheetOverlay').classList.remove('open');
});

/* --- Compact view --- */
function applyCompact(on) {
  document.body.classList.toggle('compact-mode', on);
  document.getElementById('compactSwitch').classList.toggle('on', on);
  document.getElementById('compactSwitch').setAttribute('aria-checked', on);
  storageSet('tp-compact', on ? '1' : '0');
}
document.getElementById('compactSwitch').addEventListener('click', () => {
  applyCompact(!document.body.classList.contains('compact-mode'));
});

/* --- Dark mode (manual, with automatic detection on first run) --- */
function computeAutoDark() {
  const h = new Date().getHours();
  return (h >= 21 || h < 7);
}
function applyDark(on) {
  document.body.classList.toggle('dark', on);
  document.getElementById('darkSwitch').classList.toggle('on', on);
  document.getElementById('darkSwitch').setAttribute('aria-checked', on);
}
function initDarkMode() {
  const pref = storageGet('tp-dark-pref');
  applyDark(pref === null ? computeAutoDark() : pref === '1');
}
document.getElementById('darkSwitch').addEventListener('click', () => {
  const on = !document.body.classList.contains('dark');
  storageSet('tp-dark-pref', on ? '1' : '0');
  applyDark(on);
});

/* --- Next-stop banner --- */
function parseStartMinutes(timeStr) {
  const m = timeStr.match(/(\d{1,2}):(\d{2})/);
  if (!m) return null;
  return parseInt(m[1], 10) * 60 + parseInt(m[2], 10);
}
function shouldShowBanner(dayId) {
  const todayIso = new Date().toISOString().slice(0, 10);
  const day = TRIP.days.find(d => String(d.id) === String(dayId));
  return day && day.isoDate === todayIso;
}
function updateNextBanner(dayId) {
  const banner = document.getElementById('nextBanner');
  if (dayId === 'expenses' || !shouldShowBanner(dayId)) { banner.classList.remove('show'); return; }
  const day = TRIP.days.find(d => String(d.id) === String(dayId));
  const now = new Date();
  const nowMin = now.getHours() * 60 + now.getMinutes();
  let next = null;
  for (const s of day.stops) {
    const start = parseStartMinutes(s.time);
    if (start !== null && start >= nowMin) { next = s; break; }
  }
  banner.style.setProperty('--day-color', day.color);
  banner.style.setProperty('--day-soft', day.bg);
  if (next) {
    const cat = CATEGORIES[next.cat] || { icon: '📍' };
    document.getElementById('nbIcon').textContent = cat.icon;
    document.getElementById('nbTitle').textContent = next.time + ' · ' + next.title;
    banner.classList.add('show');
  } else {
    document.getElementById('nbIcon').textContent = '🌙';
    document.getElementById('nbTitle').textContent = 'No more stops planned for today';
    banner.classList.add('show');
  }
}

/* --- Expenses --- */
function loadExpenses() {
  const raw = storageGet('tp-expenses');
  try { return raw ? JSON.parse(raw) : []; } catch (e) { return []; }
}
function saveExpenses(list) { storageSet('tp-expenses', JSON.stringify(list)); }

function renderExpenses() {
  const list = loadExpenses();
  const listEl = document.getElementById('expenseList');
  if (list.length === 0) {
    listEl.innerHTML = '<div class="empty-expenses">No expenses yet.</div>';
  } else {
    listEl.innerHTML = list.slice().reverse().map((e) => {
      const realIdx = list.indexOf(e);
      return `
        <div class="expense-item">
          <div class="ei-left">
            <div class="ei-desc">${e.desc}</div>
          </div>
          <div class="ei-amount">${e.amount.toFixed(2)}€</div>
          <button class="ei-del" data-idx="${realIdx}" aria-label="Delete expense: ${e.desc}">✕</button>
        </div>
      `;
    }).join('');
    listEl.querySelectorAll('.ei-del').forEach(btn => {
      btn.addEventListener('click', () => {
        const idx = parseInt(btn.dataset.idx, 10);
        const l = loadExpenses();
        l.splice(idx, 1);
        saveExpenses(l);
        renderExpenses();
      });
    });
  }

  const total = list.reduce((sum, e) => sum + e.amount, 0);
  document.getElementById('expenseSummary').innerHTML = `
    <div class="sc-total">${total.toFixed(2)}€</div>
    <div class="sc-sub">Total spent from the shared wallet</div>
  `;
  document.getElementById('fabTotal').textContent = total.toFixed(0) + '€';
}

document.getElementById('expAdd').addEventListener('click', () => {
  const descEl = document.getElementById('expDesc');
  const amountEl = document.getElementById('expAmount');
  const desc = descEl.value.trim();
  const amount = parseFloat(amountEl.value);
  if (!desc || isNaN(amount) || amount <= 0) return;
  const list = loadExpenses();
  list.push({ desc, amount });
  saveExpenses(list);
  descEl.value = '';
  amountEl.value = '';
  renderExpenses();
});

/* --- Service worker --- */
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('sw.js').catch(() => {});
  });
}

/* --- Init --- */
renderHeader();
renderPanels();
renderTabs();
renderLegend();
renderExpenses();
applyCompact(storageGet('tp-compact') === '1');
initDarkMode();
selectDay(initialDay());
setInterval(() => {
  if (storageGet('tp-dark-pref') === null) applyDark(computeAutoDark());
  if (lastDayId !== null && !document.getElementById('panel-expenses').classList.contains('active')) {
    updateNextBanner(lastDayId);
  }
}, 60000);
