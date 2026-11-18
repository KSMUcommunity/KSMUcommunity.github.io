/* KGMU · оболочка мини-приложения: главный экран дня, меню слева, подстраницы «‹ Назад», настройки списком.
   Работает поверх index.html и использует его функции (dayLessons, dateWeek, setView, setGroup…). */
(function () {
  'use strict';
  var $ = function (id) { return document.getElementById(id); };
  var MON = ['января', 'февраля', 'марта', 'апреля', 'мая', 'июня', 'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря'];
  var DOW = ['Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота', 'Воскресенье'];
  var DOWL = ['понедельник', 'вторник', 'среда', 'четверг', 'пятница', 'суббота', 'воскресенье'];
  var ROLE = { admin: 'Администратор', starosta: 'Староста', editor: 'Помощник старосты' };

  /* ---------- Telegram ---------- */
  var hash = new URLSearchParams(location.hash.replace(/^#/, ''));
  var tp = null;
  try {
    tp = JSON.parse(hash.get('tgWebAppThemeParams') || sessionStorage.getItem('kg-tg-theme') || 'null');
    if (tp) sessionStorage.setItem('kg-tg-theme', JSON.stringify(tp));
  } catch (e) { tp = null; }
  var inTG = !!(window.TelegramWebviewProxy || hash.get('tgWebAppPlatform') || hash.get('tgWebAppData') ||
    (function () { try { return sessionStorage.getItem('kg-tg-initdata'); } catch (e) { return ''; } })());
  function tgPost(type, data) {
    try {
      if (window.TelegramWebviewProxy) window.TelegramWebviewProxy.postEvent(type, JSON.stringify(data || {}));
      else if (window.parent !== window) window.parent.postMessage(JSON.stringify({ eventType: type, eventData: data || {} }), '*');
    } catch (e) {}
  }
  var tgSubs = [];
  function tgOn(f) { tgSubs.push(f); }
  /* лёгкая вибрация в мини-приложении: 'sel' — смена выбора (день, вкладка), 'tap' — нажатие, 'ok' — успех */
  function haptic(kind) {
    if (!inTG) return;
    if (kind === 'sel') tgPost('web_app_trigger_haptic_feedback', { type: 'selection_change' });
    else if (kind === 'ok') tgPost('web_app_trigger_haptic_feedback', { type: 'notification', notification_type: 'success' });
    else tgPost('web_app_trigger_haptic_feedback', { type: 'impact', impact_style: 'light' });
  }
  /* заглушка загрузки: серые мигающие плашки в форме будущего содержимого */
  function skel(kind) {
    var row = '<div class="cx-sk-row"><i class="cx-sk-ic"></i><span><i style="width:62%"></i><i style="width:38%"></i></span></div>';
    var body = kind === 'stats'
      ? '<div class="cx-sts">' + '<div class="cx-sk-tile"></div>'.repeat(3) + '</div><div class="cx-sk-chart"></div><div class="cx-sk-box">' + row + row + row + '</div>'
      : '<div class="cx-sk-box">' + row + row + row + row + '</div>';
    return '<div class="cx-skel" role="status"><span class="kg-sr">Загрузка…</span><div aria-hidden="true">' + body + '</div></div>';
  }
  function motionOk() { return !(window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches); }
  function lum(hex) {
    var m = /^#?([0-9a-f]{6})$/i.exec(hex || ''); if (!m) return 1;
    var n = parseInt(m[1], 16), r = (n >> 16) / 255, g = ((n >> 8) & 255) / 255, b = (n & 255) / 255;
    return 0.2126 * r + 0.7152 * g + 0.0722 * b;
  }
  function followTG() { return inTG && tp && tp.bg_color && (typeof userPreferences === 'undefined' || userPreferences.theme === 'system'); }
  function applyTGTheme() {
    var root = document.documentElement;
    if (followTG()) {
      root.dataset.theme = lum(tp.bg_color) < 0.5 ? 'dark' : 'light';
      root.style.setProperty('--tg-bg', tp.bg_color);
      if (tp.button_color) root.style.setProperty('--tg-accent', tp.button_color);
      root.classList.add('kg-tg-colors');
      tgPost('web_app_set_header_color', { color: tp.bg_color });
      tgPost('web_app_set_background_color', { color: tp.bg_color });
    } else {
      root.classList.remove('kg-tg-colors');
      root.style.removeProperty('--tg-bg'); root.style.removeProperty('--tg-accent');
      var dark = root.dataset.theme === 'dark';
      tgPost('web_app_set_header_color', { color: dark ? '#0c0e14' : '#EEF2F8' });
      tgPost('web_app_set_background_color', { color: dark ? '#0c0e14' : '#EEF2F8' });
    }
  }
  if (inTG) {
    window.Telegram = window.Telegram || {};
    /* События от Telegram: Android вызывает Telegram.WebView.receiveEvent, iOS — TelegramGameProxy.receiveEvent,
       веб-версия шлёт postMessage. Принимаем все три и раздаём подписчикам (tgOn). */
    var prevRecv0 = window.Telegram.WebView && window.Telegram.WebView.receiveEvent;
    var recv = function (type, data) {
      if (typeof data === 'string') { try { data = JSON.parse(data); } catch (e) {} }
      tgSubs.forEach(function (f) { try { f(type, data); } catch (e) {} });
      if (prevRecv0 && prevRecv0 !== recv) { try { prevRecv0(type, data); } catch (e) {} }
    };
    window.Telegram.WebView = window.Telegram.WebView || {};
    window.Telegram.WebView.receiveEvent = recv;
    window.TelegramGameProxy = window.TelegramGameProxy || {};
    window.TelegramGameProxy.receiveEvent = recv;
    window.TelegramGameProxy_receiveEvent = recv;
    /* события Telegram Web приходят только от родительского окна (web.telegram.org); чужой сайт,
       встроивший нас во фрейм, не должен управлять «Назад» и темой */
    window.addEventListener('message', function (ev) {
      if (window.parent === window || ev.source !== window.parent || !/^https:\/\/([a-z0-9-]+\.)*telegram\.org$/.test(ev.origin)) return;
      try { var d = JSON.parse(ev.data); if (d && d.eventType) recv(d.eventType, d.eventData); } catch (e) {}
    });
    tgOn(function (type, data) { if (type === 'theme_changed' && data && data.theme_params) { tp = data.theme_params; try { sessionStorage.setItem('kg-tg-theme', JSON.stringify(tp)); } catch (e) {} applyTGTheme(); } });
    tgPost('web_app_ready'); tgPost('web_app_expand');
    document.documentElement.classList.add('kg-in-tg');
  }

  /* ---------- вид: дизайн E на всех устройствах; на широком экране (не в Telegram) — боковое меню ---------- */
  var UI = 'cx';
  try { localStorage.removeItem('kg-ui'); } catch (e) {}
  document.documentElement.classList.add('kg-e');
  var DESK = window.matchMedia ? window.matchMedia('(min-width: 1024px)') : { matches: false };
  function desk() { return !inTG && !!DESK.matches; }
  function syncDesk() { document.documentElement.classList.toggle('kg-desk', desk()); }
  syncDesk();
  /* семестр: дата понедельника 1-й недели и число недель приходят вместе с расписанием (schedule-data.js) */
  function sem() { var s = window.KGMU_SEM || window.KGMU_SEMESTER || {}; return { title: s.title || 'Осень 2026/27', weeks: +s.weeks || 18 }; }

  /* ---------- утилиты ---------- */
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  function today() { return kazanTodayKey(); }
  function addDays(key, n) { var d = parseISO(key); d.setDate(d.getDate() + n); return dateISO(d); }
  function dow(key) { return (parseISO(key).getDay() + 6) % 7; }
  function mins(t) { var p = String(t).split(':'); return (+p[0]) * 60 + (+p[1] || 0); }
  function plural(n, a, b, c) { var m10 = n % 10, m100 = n % 100; return n + ' ' + (m10 === 1 && m100 !== 11 ? a : m10 >= 2 && m10 <= 4 && (m100 < 12 || m100 > 14) ? b : c); }
  function dur(m) { return m >= 60 ? Math.floor(m / 60) + ' ч' + (m % 60 ? ' ' + m % 60 + ' мин' : '') : m + ' мин'; }
  function niceDate(key) { var d = parseISO(key); return DOW[dow(key)] + ', ' + d.getDate() + ' ' + MON[d.getMonth()]; }
  function ddmm(key) { var d = parseISO(key); return String(d.getDate()).padStart(2, '0') + '.' + String(d.getMonth() + 1).padStart(2, '0'); }
  function fullName(e) { return subjTitle(e.fullSubject || e.subject); }
  function isLive(e) { return e.changeFlag !== 'cancel' && e.changeFlag !== 'moved-away'; }
  function roomChip(loc) {
    loc = String(loc || '').trim(); if (!loc) return '';
    var m = /^(НУК|ГУК|УЛК(?:\s*№\s*\d+)?|ОСЦ|СП)(?=[\s,]|$)[^,]*(?:,\s*(?:лекц\.\s*)?ауд\.\s*("?[0-9A-Za-zА-Яа-яЁё\-]+"?)(?!\s*этаж))?/.exec(loc);
    if (m) return (m[1].replace(/\s*№\s*/, '') + (m[2] ? ' ' + m[2].replace(/"/g, '') : /лекц/.test(loc) ? ' лекц.' : '')).slice(0, 14);
    var h = /больниц\S*\s*№\s*(\d+)/i.exec(loc);
    if (h) return (/клиническ/i.test(loc) ? 'ГКБ №' : 'ГБ №') + h[1];
    if (/Республиканск\S* клиническ/i.test(loc)) return 'РКБ';
    if (/Госпиталь/i.test(loc)) return 'Госпиталь';
    if (/Детск\S* республиканск|ДРКБ/i.test(loc)) return 'ДРКБ';
    /* длинные названия клиник и поликлиник — короткие понятные сокращения (полный адрес виден в раскрытой паре) */
    var n = function (re) { var x = re.exec(loc); return x ? ' №' + x[1] : ''; };
    var num = /№\s*(\d+)/;
    if (/Стоматологическ\S* поликлиник\S* КГМУ/i.test(loc)) return 'Стомат. КГМУ';
    if (/Детск\S* стоматологическ\S* поликлиник/i.test(loc)) return 'Детск. стомат.' + n(num);
    if (/Стоматологическ\S* поликлиник/i.test(loc)) return 'Стомат. пол.' + n(num);
    if (/Детск\S*.*поликлиник|поликлиник\S*.*детск/i.test(loc)) return num.test(loc) ? 'Детск. пол.' + n(num) : 'Детск. пол.';
    if (/ЦГКБ/i.test(loc)) return 'ЦГКБ' + n(num);
    if (/поликлиник/i.test(loc) && num.test(loc)) return 'Пол.' + n(num);
    if (/Институт фармации/i.test(loc)) return 'Инст. фармации';
    if (/Анатомическ\S* театр/i.test(loc)) return 'Анатом. театр';
    if (/клинико-диагностическ\S* центр/i.test(loc)) return 'МКДЦ';
    if (/Клиника медицинского университета/i.test(loc)) return 'Клиника КГМУ';
    if (/Клиника Вишневского/i.test(loc)) return 'Кл. Вишневского';
    if (/РЖД/.test(loc)) return 'Больница РЖД';
    if (/Центр гигиены/i.test(loc)) return 'Центр гигиены';
    var s = loc.replace(/^(Филиал\s+)?(ГАУЗ|ООО|АО|НУЗ|ФБУЗ)\s*/i, '').replace(/["«»]/g, '').split(/[,(]/)[0].trim();
    return s.length > 16 ? s.slice(0, 15).trim() + '…' : s;
  }
  var ICON = {
    menu: '<path d="M4 6h16M4 12h16M4 18h16"/>',
    left: '<path d="m15 18-6-6 6-6"/>', right: '<path d="m9 18 6-6-6-6"/>',
    cal: '<rect x="3" y="4" width="18" height="18" rx="3"/><path d="M16 2v4M8 2v4M3 10h18"/>',
    week: '<rect x="3" y="4" width="18" height="18" rx="3"/><path d="M3 10h18M8 14h8M8 18h5"/>',
    sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M6.3 17.7l-1.4 1.4M19.1 4.9l-1.4 1.4"/>',
    play: '<circle cx="12" cy="12" r="9"/><path d="m10 8 6 4-6 4z"/>',
    clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
    moon: '<path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z"/>',
    cup: '<path d="M17 8h1a4 4 0 0 1 0 8h-1"/><path d="M3 8h14v9a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4z"/><path d="M6 2v2M10 2v2M14 2v2"/>',
    news: '<path d="M3 11v2a1 1 0 0 0 1 1h3l5 4V6L7 10H4a1 1 0 0 0-1 1z"/><path d="M16 9a3 3 0 0 1 0 6M19 6a7 7 0 0 1 0 12"/>',
    flag: '<path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"/><path d="M4 22v-7"/>',
    search: '<circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/>',
    table: '<rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18M3 15h18M9 3v18"/>',
    users: '<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.9M16 3.1a4 4 0 0 1 0 7.8"/>',
    gear: '<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1.1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z"/>',
    send: '<path d="m22 2-7 20-4-9-9-4z"/><path d="M22 2 11 13"/>',
    heart: '<path d="M19 14c1.5-1.5 3-3.2 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.8 0-3 .5-4.5 2-1.5-1.5-2.7-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4 3 5.5l7 7z"/>',
    tool: '<path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.8-3.8a6 6 0 0 1-7.9 7.9l-6.9 6.9a2.1 2.1 0 0 1-3-3l6.9-6.9a6 6 0 0 1 7.9-7.9z"/>',
    x: '<path d="M18 6 6 18M6 6l12 12"/>', pin: '<path d="M20 10c0 6-8 12-8 12S4 16 4 10a8 8 0 0 1 16 0z"/><circle cx="12" cy="10" r="3"/>',
    home: '<path d="M3 10.5 12 3l9 7.5V20a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z"/>', layers: '<path d="M12 3 3 8l9 5 9-5z"/><path d="m3 12.5 9 5 9-5"/><path d="m3 17 9 5 9-5"/>', user: '<circle cx="12" cy="8" r="4"/><path d="M4 21c1.5-4 4.5-6 8-6s6.5 2 8 6"/>',
    plus: '<path d="M12 5v14M5 12h14"/>', share: '<path d="M12 3v12M7 8l5-5 5 5"/><path d="M5 13v6a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-6"/>', book: '<path d="M4 4.5A2.5 2.5 0 0 1 6.5 2H20v18H6.5A2.5 2.5 0 0 0 4 22.5zM4 19.5A2.5 2.5 0 0 1 6.5 17H20"/>', link: '<path d="M10 13a5 5 0 0 0 7 .5l3-3a5 5 0 0 0-7-7l-1.5 1.5M14 11a5 5 0 0 0-7-.5l-3 3a5 5 0 0 0 7 7l1.5-1.5"/>', ext: '<path d="M14 4h6v6M20 4l-9 9M19 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1h5"/>', chev: '<path d="m9 18 6-6-6-6"/>'
  };
  var SUN = '<svg class="kg-sun" viewBox="0 0 170 170" aria-hidden="true"><defs><radialGradient id="kgsg"><stop offset="0%" stop-color="#FFE3A3"/><stop offset="45%" stop-color="#FFB45E" stop-opacity=".9"/><stop offset="100%" stop-color="#FF8A5B" stop-opacity="0"/></radialGradient></defs><g stroke="rgba(255,226,170,.45)" stroke-width="3" stroke-linecap="round"><path d="M85 8v16M85 146v16M8 85h16M146 85h16M30 30l11 11M129 129l11 11M30 140l11-11M129 41l11-11"/></g><circle cx="85" cy="85" r="60" fill="url(#kgsg)"/><circle cx="85" cy="85" r="26" fill="#FFE7B0"/></svg>';
  function ic(n, cls) { return '<svg class="kg-ic ' + (cls || '') + '" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + ICON[n] + '</svg>'; }

  /* ---------- состояние ---------- */
  var state = { date: null, week: false, open: null, page: null, tab: 'home', stack: [] };
  try { localStorage.removeItem('kg-week-mode'); } catch (e) {}

  function ready() { return typeof dayLessons === 'function' && typeof selectedStudyGroup !== 'undefined' && selectedStudyGroup; }
  function role() {
    try {
      if (typeof cloudRoleIn === 'function') return cloudRoleIn() || '';
    } catch (e) {}
    return '';
  }
  function tgUser() { try { return typeof kgTgUser === 'function' ? kgTgUser() : null; } catch (e) { return null; } }
  /* имя бота: из кэша; в мини-приложении (автовход по initData) кэша может не быть — спрашиваем tg-auth и пока берём основной бот */
  var BOT_DEFAULT = 'KSMUcommunityBot';
  function botName() {
    var b = ''; try { b = localStorage.getItem('kg-tg-bot') || ''; } catch (e) {}
    if (!b) { try { if (typeof kgTgConfig === 'function') kgTgConfig(); } catch (e) {} }
    return b || BOT_DEFAULT;
  }
  /* ссылка t.me/<бот>?start=<p>: в параметре только латиница/цифры/_/- (буква «и» в номере группы → i, бот поймёт) */
  function botArg(g) { return String(g || '').toLowerCase().replace(/и/g, 'i').replace(/[^a-z0-9_-]/g, ''); }
  function openBot(p) {
    var b = botName(); if (!b) return;
    if (inTG) tgPost('web_app_open_tg_link', { path_full: '/' + b + '?start=' + p });
    else window.open('https://t.me/' + b + '?start=' + p, '_blank', 'noopener');
  }
  function groupCaption(g) {
    try {
      var info = (typeof GROUP_INFO !== 'undefined' && GROUP_INFO[g]) || {};
      var prog = (typeof PROGRAM_CONFIG !== 'undefined' && PROGRAM_CONFIG[info.program]) || {};
      return [prog.label, info.course ? info.course + ' курс' : ''].filter(Boolean).join(' · ');
    } catch (e) { return ''; }
  }

  /* ---------- каркас ---------- */
  function mount() {
    if ($('kgApp')) return;
    var mc = mountCx(); deepPage(); return mc;
  }

  /* ---------- нижнее меню: Объявления · Неделя · [Главная] · Модули · Профиль ---------- */
  function curTab() { if (state.page === 'news') return 'news'; if (state.page === 'modules') return 'modules'; if (state.page === 'settings') return 'profile'; if (state.page) return ''; return state.tab === 'day' ? 'week' : 'home'; }
  var SIDE_PAGES = { calendar: 1, search: 1, useful: 1, contacts: 1, roles: 1, stats: 1, tools: 1, about: 1, privacy: 1, group: 1 };
  function curNav() { return state.page && SIDE_PAGES[state.page] ? state.page : curTab(); }
  function renderSide() {
    var sd = $('cxSide'); if (!sd) return;
    var c = curNav(), nn = unread(), u = tgUser(), r = role(), g = curGroup(), mu = !u && window.kgMailUser ? kgMailUser() : null;
    if (mu) u = { name: mu.email };
    var nm = u ? (u.name || (u.username ? '@' + u.username : 'Студент')) : '';
    function it(id, icon, label, ex) { return '<button type="button" class="cx-nav' + (c === id ? ' on' : '') + '" data-tab="' + id + '"' + (c === id ? ' aria-current="page"' : '') + '>' + ic(icon) + '<span>' + label + '</span>' + (ex || '') + '</button>'; }
    sd.innerHTML = '<div class="cx-brand"><span class="cx-brand-logo"><i class="ksmu-mark"></i></span><div><b>KSMU <span>Community</span></b><small>' + esc(sem().title) + '</small></div></div>' +
      (g ? '<button type="button" class="cx-sgrp" data-tab="group"><span><small>Группа</small><b>' + esc(g) + '</b><em>' + esc(groupCaption(g)) + '</em><span class="kg-sr">, сменить группу</span></span>' + ic('chev') + '</button>' : '') +
      '<nav class="cx-navs" aria-label="Разделы">' + it('home', 'home', 'Главная') + it('week', 'week', 'Неделя') + it('calendar', 'cal', 'Календарь') + it('modules', 'layers', 'Модули и зачёты') +
      it('news', 'news', 'Объявления', nn ? '<span class="cx-nb" aria-label="непрочитанных: ' + nn + '">' + nn + '</span>' : '') + it('search', 'search', 'Поиск') + it('useful', 'link', 'Полезное') + it('contacts', 'send', 'Контакты') + it('about', 'heart', 'О проекте') +
      (canRoles() ? it('roles', 'users', 'Роли') : '') + (isAdm() ? it('stats', 'table', 'Статистика') : '') + (r ? it('tools', 'tool', r === 'admin' ? 'Инструменты админа' : 'Инструменты старосты') : '') + '</nav>' +
      '<div class="cx-side-foot"><button type="button" class="cx-me' + (c === 'profile' ? ' on' : '') + '" data-tab="profile"' + (c === 'profile' ? ' aria-current="page"' : '') + '><span class="cx-me-av" aria-hidden="true">' + (u ? esc(nm.replace('@', '').slice(0, 1).toUpperCase()) : ic('user')) + '</span><span><b>' + (u ? esc(nm) : 'Профиль') + '</b><small>' + (u ? esc(r ? ROLE[r] : 'Студент') : 'Войти: Telegram или почта') + '</small></span>' + ic('gear') + '</button></div>';
  }
  /* только непрочитанные: всё, что новее последнего просмотренного объявления */
  function unread() { var nn = 0; try { var nw = newsList(), si = nw.map(function (x) { return String(x.id); }).indexOf(seenNews()); nn = si < 0 ? nw.length : si; } catch (e) {} return nn; }
  function renderTabs() {
    renderSide();
    var tb = $('kgTabbar'); if (!tb) return;
    /* дизайн E: нижнего меню нет — разделы в боковом меню (☰) */
    document.documentElement.classList.add('kg-notab'); tb.innerHTML = ''; tb.hidden = true;
  }
  /* телефон: боковое меню выезжает слева */
  function openSide() {
    if (desk()) return;
    renderSide();
    sideOpener = document.activeElement;
    document.body.classList.add('cx-dr-open');
    ['kgHome', 'kgPage', 'kgSubBar', 'kgTabbar'].forEach(function (id) { var el = $(id); if (el) el.inert = true; });
    var mb = $('kgMenuB'); if (mb) mb.setAttribute('aria-expanded', 'true');
    setTimeout(function () { var f = document.querySelector('#cxSide .cx-nav.on') || document.querySelector('#cxSide .cx-nav'); if (f) f.focus({ preventScroll: true }); }, 60);
  }
  function closeSide() {
    if (!document.body.classList.contains('cx-dr-open')) return;
    document.body.classList.remove('cx-dr-open');
    ['kgHome', 'kgPage', 'kgSubBar', 'kgTabbar'].forEach(function (id) { var el = $(id); if (el) el.inert = false; });
    var mb = $('kgMenuB'); if (mb) mb.setAttribute('aria-expanded', 'false');
    /* фокус — туда, откуда открыли меню (если кнопка ещё на экране), иначе на видимую ☰ */
    var back = sideOpener && document.contains(sideOpener) && sideOpener.offsetParent ? sideOpener : null;
    if (!back) back = [mb, document.querySelector('#kgCx [data-cx="menu"]')].filter(function (x) { return x && x.offsetParent; })[0];
    sideOpener = null;
    if (back && document.activeElement && document.activeElement.closest && document.activeElement.closest('#cxSide')) { try { back.focus({ preventScroll: true }); } catch (e) {} }
  }
  var sideOpener = null;
  function onTab(ev) {
    var b = ev.target.closest('[data-tab]'); if (!b) return;
    var id = b.dataset.tab;
    haptic('sel');
    closeSide();
    if (id === 'home' || id === 'week') {
      state.tab = id === 'week' ? 'day' : 'home'; state.open = null; state.dayFrom = null;
      if (id === 'week') { state.board = true; stat('view', 'week'); }
      if (id === 'home' || !state.date) state.date = today();
      if (state.page) goHome(); else render();
      window.scrollTo({ top: 0 });
    } else {
      /* вкладка нижнего меню — раздел верхнего уровня: «Назад» из него ведёт на главную */
      state.stack = []; state.noPush = true; state.rootMenu = true; state.viaMenu = true;
      if (state.page === 'calendar' && id === 'calendar') { state.noPush = false; return; }
      try { navigate(id === 'profile' ? 'settings' : id); } finally { state.noPush = false; state.viaMenu = false; }
    }
    renderTabs();
  }

  function shift(n) {
    haptic('sel');
    state.open = null;
    state.date = addDays(state.date, state.week ? n * 7 : n);
    if (!state.week && dow(state.date) === 6) state.date = addDays(state.date, n > 0 ? 1 : -1);
    render(n);
  }

  /* ---------- главный экран ---------- */
  function lessonsFor(key) {
    var list = [];
    try { list = dayLessons(key) || []; } catch (e) { list = []; }
    return list.map(function (s) { return Array.isArray(s) ? s : [s]; })
      .sort(function (a, b) { return mins(a[0].start) - mins(b[0].start); });
  }
  function notesFor(key, subjects) {
    try { return visibleNotes(key).filter(function (n) { return !subjects || subjects.indexOf(n.subject) >= 0; }); } catch (e) { return []; }
  }
  function render(dir) {
    if (!$('kgApp')) return;
    if (!ready()) { document.body.classList.remove('kg-ready'); return; }
    document.body.classList.add('kg-ready');
    if (!state.date) state.date = (function () {
      var t = today();
      try { var u = new URLSearchParams(location.search).get('date'); if (u && /^\d{4}-\d{2}-\d{2}$/.test(u)) return u; } catch (e) {}
      return dow(t) === 6 && !inTG ? t : t;
    })();
    renderCx(dir); saveView();
  }
  var renderTimer = null;
  function renderSoon() { clearTimeout(renderTimer); renderTimer = setTimeout(function () { render(); }, 80); }

  document.addEventListener('click', function (ev) {
    var go = ev.target.closest('#kgApp [data-go]');
    if (go) { ev.preventDefault(); navigate(go.dataset.go); }
  });
  function openEditorFor(type, subject, key) {
    showCal(key);
    try { openEditor(type, subject); } catch (e) { console.warn(e); }
    setTimeout(function () { var r = $('recordEditor'); if (r) r.scrollIntoView({ block: 'start', behavior: 'smooth' }); }, 120);
  }

  /* ---------- меню ---------- */
  function newsList() {
    try {
      if (typeof newsRows === 'undefined') return [];
      return newsRows.filter(function (n) { return newsCurrent(n) && newsMatchesGroup(n, selectedStudyGroup); })
        .sort(function (a, b) { return String(b.published_at).localeCompare(String(a.published_at)); });
    } catch (e) { return []; }
  }
  function seenNews() { try { return localStorage.getItem('kg-news-seen') || ''; } catch (e) { return ''; } }

  function navigate(go) {
    switch (go) {
      case 'close': return;
      case 'news': return showNews();
      case 'calendar': return showCal(state.tab === 'day' && !state.page ? state.date : null);
      case 'modules': return showModules();
      case 'search': return showSearch();
      case 'schedule': return showOld('schedule', 'По неделям');
      case 'tools': return showOld('settings', role() === 'admin' ? 'Инструменты админа' : 'Инструменты старосты', true);
      case 'settings': return showSettings();
      case 'group': return showGroupPage();
      case 'bot': return openBot('g-' + botArg(selectedStudyGroup));
      case 'starreq': return openBot('star_' + botArg(selectedStudyGroup));
      case 'report': try { reportProblem(); } catch (e) {} return;
      case 'useful': return showUseful();
      case 'about': return showAbout();
      case 'contacts': return showContacts();
      case 'wizard': return openWizard();
      case 'roles': return showRoles();
      case 'stats': return showStats();
      case 'privacy': return showPrivacy();
      case 'consent': return showConsent();
      case 'week': state.tab = 'day'; state.date = state.date || today(); return state.page ? goHome() : render();
    }
  }

  /* ---------- подстраницы ---------- */
  /* «Назад» возвращает на предыдущую подстраницу (Профиль → Календарь → Назад = Профиль), а не сразу на главную */
  var REOPEN = {
    settings: function () { showSettings(); },
    calendar: function () { showCal(state.calSel); },
    news: function () { showNews(); },
    modules: function () { showModules(); },
    search: function () { showSearch(); },
    tools: function () { navigate('tools'); },
    group: function () { showGroupPage(); },
    useful: function () { showUseful(); },
    about: function () { showAbout(); },
    contacts: function () { showContacts(); },
    roles: function () { showRoles(); },
    stats: function () { showStats(); },
    privacy: function () { showPrivacy(); },
    consent: function () { showConsent(); }
  };
  function enterPage(name, title) {
    if (!state.page) { state.stack = []; state.rootMenu = !!state.viaMenu; try { history.pushState({ kg: name }, ''); } catch (e) {} }
    else if (state.page !== name && !state.noPush && REOPEN[state.page]) { state.stack.push(state.page); if (state.stack.length > 8) state.stack.shift(); }
    state.page = name;
    stat('view', name);
    /* на компьютере раздел из бокового меню открыт «сверху» — кнопка «Назад» не нужна */
    /* «верхний» раздел — открыт из меню; со второго экрана (с главной или из раздела) нужен «Назад» */
    document.body.classList.toggle('kg-toppage', !state.stack.length && !!state.rootMenu);
    $('kgSubTitle').textContent = title;
    window.scrollTo(0, 0);
    tgPost('web_app_setup_back_button', { is_visible: true });
    renderTabs();
    saveView();
  }
  function showOld(view, title, tools) {
    restoreMoved();
    enterPage(tools ? 'tools' : view, title);
    document.body.classList.remove('kg-mode-home', 'kg-mode-page');
    document.body.classList.add('kg-mode-old');
    document.body.classList.toggle('kg-tools', !!tools);
    try { setView(view); } catch (e) {}
    window.scrollTo(0, 0);
  }
  function showPage(name, title, html) {
    restoreMoved();
    enterPage(name, title);
    document.body.classList.remove('kg-mode-home', 'kg-mode-old', 'kg-tools');
    document.body.classList.add('kg-mode-page');
    $('kgPage').innerHTML = html + cxFoot();
    pageIn($('kgPage'), state.noPush ? 0 : 1);
  }
  /* плавное появление экрана: вперёд — сдвиг справа, назад/обновление — лёгкое затухание */
  function pageIn(el, dir) {
    if (!el || !el.animate || !motionOk()) return;
    el.animate(dir ? [{ opacity: 0, transform: 'translateX(14px)' }, { opacity: 1, transform: 'none' }] : [{ opacity: .4 }, { opacity: 1 }],
      { duration: dir ? 240 : 160, easing: 'cubic-bezier(.2,.8,.2,1)' });
  }
  function goHome(fromPop) {
    var had = !!state.page;
    state.page = null; state.stack = [];
    restoreMoved();
    document.body.classList.remove('kg-mode-old', 'kg-mode-page', 'kg-tools');
    document.body.classList.add('kg-mode-home');
    tgPost('web_app_setup_back_button', { is_visible: false });
    if (had && !fromPop) { try { history.back(); } catch (e) {} }
    render();
    if (had) pageIn($('kgHome'), 0);
  }
  function back() {
    var prev = state.stack && state.stack.pop();
    if (prev && REOPEN[prev] && state.page) { state.noPush = true; try { REOPEN[prev](); } finally { state.noPush = false; } return; }
    goHome(false);
  }
  /* кнопка «назад» браузера/телефона: та же логика, а запись в истории возвращаем, пока есть куда идти назад */
  function onPop() {
    if (!state.page) return;
    if (state.stack && state.stack.length) { back(); try { history.pushState({ kg: state.page }, ''); } catch (e) {} }
    else goHome(true);
  }
  if (inTG) {
    var lastBack = 0;
    tgOn(function (type) {
      if (type !== 'back_button_pressed') return;
      var now = Date.now(); if (now - lastBack < 250) return; lastBack = now; /* одно нажатие могло прийти двумя путями */
      if (state.page) back(); else tgPost('web_app_setup_back_button', { is_visible: false });
    });
  }

  function showNews() {
    var list = newsList();
    if (list[0]) { try { localStorage.setItem('kg-news-seen', list[0].id); } catch (e) {} }
    var h = list.length ? list.map(function (n) {
      var d = n.published_at ? new Date(n.published_at) : null;
      return '<article class="kg-news"><small>' + (d ? d.getDate() + ' ' + MON[d.getMonth()] : '') + (n.priority === 'urgent' ? ' · срочно' : n.priority === 'important' ? ' · важно' : '') + '</small><b>' + esc(n.title) + '</b>' +
        (n.body ? '<p>' + esc(n.body) + '</p>' : '') + (httpUrl(n.link_url) ? '<a class="kg-link" target="_blank" rel="noopener" href="' + esc(httpUrl(n.link_url)) + '">' + esc(n.link_label || 'Подробнее') + '</a>' : '') + '</article>';
    }).join('') : '<div class="kg-empty">' + ic('news') + '<b>Объявлений нет</b><span>Здесь появятся новости для вашей группы и курса</span></div>';
    if (role() === 'admin') h += '<button type="button" class="kg-btn kg-wide" data-go="tools">' + ic('tool') + 'Управление объявлениями</button>';
    showPage('news', 'Объявления', h);
  }

  /* ---------- настройки ---------- */
  var moved = [];
  function moveInto(node, target) { if (!node || !target) return; moved.push({ node: node, parent: node.parentNode, next: node.nextSibling }); target.appendChild(node); }
  function restoreMoved() { while (moved.length) { var m = moved.pop(); try { m.parent.insertBefore(m.node, m.next); } catch (e) {} } }
  function seg(name, opts, cur) {
    return '<div class="kg-seg" data-seg="' + name + '">' + opts.map(function (o) { return '<button type="button" data-v="' + o[0] + '" class="' + (o[0] === cur ? 'active' : '') + '">' + o[1] + '</button>'; }).join('') + '</div>';
  }
  function row(label, value, go, cls) {
    return '<' + (go ? 'button type="button" data-go="' + go + '"' : 'div') + ' class="kg-lrow ' + (cls || '') + '"><span>' + label + '</span><span class="kg-lval">' + value + (go ? ic('chev') : '') + '</span></' + (go ? 'button' : 'div') + '>';
  }
  function showSettings() { showPage('settings', 'Профиль', ''); renderProfile(); }

  /* ---------- компактный вид: экраны по референсу ---------- */
  var DOWS = ['пн', 'вт', 'ср', 'чт', 'пт', 'сб', 'вс'];
  var CXK = { lec: ['#A7B3CB', '#5C6B8A'], pr: ['#D98A90', '#8C2B33'], cyc: ['#DCC59A', '#9A7A3E'] };
  var CXI = { lec: '<rect x="3" y="4" width="18" height="12" rx="2"/><path d="M8 21l4-5 4 5"/>', pr: '<path d="M9 3h6M10 3v6l-5 9a2 2 0 0 0 1.8 3h10.4a2 2 0 0 0 1.8-3l-5-9V3"/><path d="M7.5 14h9"/>', cyc: '<path d="M12 3 3 8l9 5 9-5z"/><path d="m3 13 9 5 9-5"/>' };
  var FLAG = { cancel: 'Отменено', 'moved-away': 'Перенесено', 'moved-in': 'Перенесено сюда', move: 'Новое время', change: 'Изменено' };
  function kindOf(e) { return e.lessonType === 'cycle' ? 'cyc' : e.lecture ? 'lec' : 'pr'; }
  function kindName(e) { return e.lessonType === 'cycle' ? 'Цикл' : e.lecture ? 'Лекция' : 'Практика'; }
  function cyclePeriod(e) { return e.lessonType === 'cycle' && e.dateStart && e.dateEnd ? ' ' + ddmm(e.dateStart) + '–' + ddmm(e.dateEnd) : ''; }
  /* «2 пары · 1 цикл» вместо «3 пары», если в дне есть цикловые занятия */
  function countLabel(slots) {
    var c = slots.filter(function (s) { return s[0].lessonType === 'cycle'; }).length, p = slots.length - c;
    return [p ? plural(p, 'пара', 'пары', 'пар') : '', c ? plural(c, 'цикл', 'цикла', 'циклов') : ''].filter(Boolean).join(' · ');
  }
  /* подгруппы показываем только тем группам, у которых они есть в расписании */
  var subCache = {};
  function hasSubgroups() {
    var g = typeof selectedStudyGroup !== 'undefined' ? selectedStudyGroup : '';
    if (!(g in subCache)) { try { subCache[g] = (EVENT_DATA || []).some(function (e) { return e.subgroup; }); } catch (e) { subCache[g] = true; } }
    return subCache[g] || (typeof group !== 'undefined' && group !== 'all');
  }
  function kv(k) { var c = CXK[k] || CXK.pr; return '--k1:' + c[0] + ';--k2:' + c[1]; }
  function kIco(k, s) { return '<span class="cx-ki' + (s ? ' s' : '') + '" style="' + kv(k) + '" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">' + (CXI[k] || CXI.pr) + '</svg></span>'; }
  function gIco(icon, g1, g2, s) { return '<span class="cx-ki' + (s ? ' s' : '') + '" style="--k1:' + g1 + ';--k2:' + g2 + '" aria-hidden="true">' + ic(icon) + '</span>'; }
  function placeOf(x) { var v = null; try { v = placeInfo(x); } catch (e) {} var p = x.location || x.shortLocation || ''; var u = ''; try { u = p ? mapLink(v && v.address ? v.address : p) : ''; } catch (e) {} return { text: p, chip: roomChip(x.shortLocation || x.location) || p, addr: v && v.address ? v.address : '', url: u }; }
  function liveOf(key) { return lessonsFor(key).filter(function (s) { return s.some(isLive); }); }
  /* номер пары по предмету за семестр: «3/17» — третья из 17 (лекции и практики считаются отдельно, отменённые не считаются) */
  var PROG = { k: '', m: {} };
  /* ссылка только http(s): javascript:/data: в объявлении выполнили бы код на сайте */
  function httpUrl(u) { try { var x = new URL(String(u || '')); return x.protocol === 'https:' || x.protocol === 'http:' ? x.href : ''; } catch (e) { return ''; } }
  /* отпечаток изменений расписания для кэшей: правка существующего переноса тоже сбрасывает кэш */
  function amSig() {
    try {
      return amendments.length + ':' + amendments.map(function (a) {
        return [a.id, a.eventId, a.date, a.kind, a.targetDate, a.newStart, a.newEnd, a.newLocation, a.newTeacher].join('~');
      }).join(',');
    } catch (e) { return 0; }
  }
  function pkey(e) { return subjTitle(e.subject) + '|' + kindOf(e); }
  function progMap() {
    var g = typeof group !== 'undefined' ? String(group) : 'all', na = 0;
    na = amSig();
    var ck = selectedStudyGroup + '|' + g + '|' + na + '|' + LAST_WEEK;
    if (PROG.k === ck) return PROG.m;
    var s0 = (window.KGMU_SEM && window.KGMU_SEM.week1) || '2026-08-31', pos = {}, cnt = {}, m = {};
    for (var i = 0; i < LAST_WEEK * 7; i++) {
      var k = addDays(s0, i);
      liveOf(k).forEach(function (sl) { var id = pkey(sl[0]); cnt[id] = (cnt[id] || 0) + 1; pos[k + '|' + sl[0].start + '|' + id] = [cnt[id], id]; });
    }
    Object.keys(pos).forEach(function (x) { m[x] = [pos[x][0], cnt[pos[x][1]]]; });
    PROG.k = ck; PROG.m = m; return m;
  }
  function progOf(sl, key) {
    if (!sl.some(isLive)) return '';
    var p; try { p = progMap()[key + '|' + sl[0].start + '|' + pkey(sl[0])]; } catch (e) { return ''; }
    return p && p[1] > 1 ? p[0] + '/' + p[1] : '';
  }
  /* границы опубликованного расписания: недели 1–LAST_WEEK (semester.json) */
  var LAST_WEEK = sem().weeks;
  function semBounds(key) { var w = dateWeek(key), mon1 = addDays(key, -dow(key) - (w - 1) * 7); return { w: w, start: mon1, end: addDays(mon1, LAST_WEEK * 7 - 1) }; }
  function dayMonth(key) { var d = parseISO(key); return d.getDate() + ' ' + MON[d.getMonth()]; }
  function devGroup() { try { return typeof isDevGroup === 'function' && isDevGroup(selectedStudyGroup); } catch (e) { return false; } }
  function nextStudy(key) { for (var i = 1; i <= 60; i++) { var k = addDays(key, i), s = liveOf(k); if (s.length) return { key: k, sl: s }; } return null; }
  function namesOf(s) { var out = [], seen = {}; s.forEach(function (x) { var f = fullName(x); if (!seen[f]) { seen[f] = 1; out.push(f); } }); return out; }
  function dShort(key) { var d = parseISO(key); return DOWS[dow(key)] + ', ' + d.getDate() + ' ' + MON[d.getMonth()]; }
  function dayLabel(key) { var t = today(); return key === t ? 'Сегодня' : key === addDays(t, 1) ? 'Завтра' : DOW[dow(key)]; }
  function hm(m) { return String(Math.floor(m / 60)).padStart(2, '0') + ':' + String(m % 60).padStart(2, '0'); }

  function cxHead() {
    var g = selectedStudyGroup, u = tgUser(), h = Math.floor(kazanClockMinutes() / 60);
    var greet = h < 5 ? 'Доброй ночи' : h < 12 ? 'Доброе утро' : h < 18 ? 'Добрый день' : 'Добрый вечер';
    var ini = u && (u.name || u.username) ? esc(String(u.name || u.username).replace('@', '').slice(0, 1).toUpperCase()) : ic('user');
    return '<h1 class="kg-sr">Расписание группы ' + esc(g) + '</h1><div class="cx-hd"><button type="button" class="cx-ib gl cx-mb" data-cx="menu" aria-label="Меню' + (unread() ? ', есть новые объявления' : '') + '" aria-controls="cxSide">' + ic('menu') + (unread() ? '<i class="cx-dot" aria-hidden="true"></i>' : '') + '</button><button type="button" class="cx-who" data-cx="group"><span class="cx-av" aria-hidden="true"><b>' + ini + '</b></span><span style="min-width:0"><small>' + greet + ' · ' + dShort(today()) + '</small><strong>Группа ' + esc(g) + ic('chev') + '</strong><span class="kg-sr">, сменить группу</span></span></button>' +
      '<button type="button" class="cx-ib gl" data-cx="profile" aria-label="Профиль и настройки">' + ic('gear') + '</button></div>' +
      '<button type="button" class="cx-search gl" data-cx="search">' + ic('search') + 'Предмет, преподаватель, аудитория…</button>';
  }
  function cxFirst(s, label) {
    var e = s[0], p = placeOf(e);
    return '<div class="cx-first"><div><small>' + esc(label) + ' · ' + kindName(e).toLowerCase() + ' · ' + esc(e.start) + '</small><b>' + esc(namesOf(s).join(' / ')) + '</b>' + (p.text ? '<span>' + esc(p.text) + '</span>' : '') + '</div>' +
      (p.url ? '<a class="cx-route" href="' + esc(p.url) + '" target="_blank" rel="noopener">' + ic('pin') + 'Маршрут</a>' : '') + '</div>';
  }
  function cxRow(s, key, extra) {
    var e = s[0], live = s.some(isLive), names = namesOf(s);
    var pg = progOf(s, key);
    var sub = [kindName(e) + (pg ? ' ' + pg : ''), e.subgroup && s.length === 1 ? e.subgroup + '-я подгр.' : '', roomChip(e.shortLocation || e.location)].filter(Boolean).join(' · ');
    return '<button type="button" class="cx-row gl" data-cx="day" data-d="' + key + '">' + kIco(kindOf(e)) + '<div><b>' + esc(names[0]) + (names.length > 1 ? ' +' + (names.length - 1) : '') + '</b><span>' + esc(sub) + '</span></div><div class="tm">' + esc(e.start) + (!live ? '<small>отменено</small>' : extra ? '<small>' + esc(extra) + '</small>' : '') + '</div></button>';
  }
  /* список пар на главной с перерывами (от 15 минут), как в ленте недели */
  function cxRowsBrk(list, key, firstExtra) {
    var h = '', pe = null;
    list.forEach(function (s, i) {
      if (pe !== null && mins(s[0].start) - pe >= 15) h += '<div class="cx-brk cx-brk-h"><span>Перерыв ' + dur(mins(s[0].start) - pe) + '</span></div>';
      h += cxRow(s, key, i ? '' : firstExtra);
      pe = pe === null ? mins(s[0].end) : Math.max(pe, mins(s[0].end));
    });
    return '<div class="cx-rows">' + h + '</div>';
  }
  function cxTasks(t) {
    var list = [];
    try { list = notes.filter(function (n) { return (n.type === 'module' || n.type === 'homework') && n.date >= t && n.date <= addDays(t, 7) && noteRelevant(n); }).sort(function (a, b) { return a.date.localeCompare(b.date); }).slice(0, 3); } catch (e) {}
    var h = '', nw = newsList();
    if (nw.length && nw[0].id !== seenNews()) h += '<button type="button" class="cx-row gl" data-cx="news">' + gIco('news', '#DCC59A', '#9A7A3E') + '<div><b>' + esc(nw[0].title) + '</b><span>Новое объявление</span></div><div class="tm">' + ic('chev') + '</div></button>';
    list.forEach(function (n) {
      var d = Math.round((parseISO(n.date) - parseISO(t)) / 864e5), mod = n.type === 'module';
      h += '<button type="button" class="cx-row gl" data-cx="' + (mod ? 'modules' : 'calendar') + '">' + (mod ? gIco('layers', '#D98A90', '#8C2B33') : gIco('flag', '#A7B3CB', '#5C6B8A')) +
        '<div><b>' + (mod ? 'Модуль' : 'ДЗ') + ' · ' + esc(n.subject) + '</b><span>' + esc(n.title || '') + '</span></div><div class="tm">' + (d === 0 ? 'сегодня' : d === 1 ? 'завтра' : ddmm(n.date)) + (d <= 1 ? '<small>скоро</small>' : '') + '</div></button>';
    });
    /* ссылка в заголовке ведёт туда, что реально есть в блоке */
    var hasMod = list.some(function (n) { return n.type === 'module'; });
    var more = hasMod ? '<button type="button" data-cx="modules">Модули ›</button>' : list.length ? '<button type="button" data-cx="calendar">Календарь ›</button>' : '<button type="button" data-cx="news">Объявления ›</button>';
    return h ? '<div class="cx-sh"><h2>Важное</h2>' + more + '</div><div class="cx-rows">' + h + '</div>' : '';
  }
  function cxHome() {
    var t = today(), now = kazanClockMinutes(), sl = liveOf(t);
    var live = sl.find(function (s) { return mins(s[0].start) <= now && now < mins(s[0].end); });
    var rest = sl.filter(function (s) { return mins(s[0].start) > now; }), next = rest[0];
    var hero = '', bento = '', list = '', deco = '<i class="kg-glow"></i><i class="kg-sheen"></i>';
    if (live) {
      var e = live[0], len = Math.max(1, mins(e.end) - mins(e.start)), left = mins(e.end) - now, C = 182.2, off = (C * left / len).toFixed(1), nm = namesOf(live);
      var rb = left >= 60 ? '<b>' + Math.floor(left / 60) + ' ч</b><span>' + (left % 60) + ' мин</span>' : '<b>' + left + '</b><span>мин</span>';
      hero = '<section class="cx-hero">' + deco + '<div class="cx-ht"><div class="cx-col"><span class="cx-pill"><span class="cx-pulse"></span>Сейчас · ' + kindName(e).toLowerCase() + '</span><div class="cx-h1">' + esc(nm[0]) + (nm.length > 1 ? ' <span style="opacity:.75">+' + (nm.length - 1) + '</span>' : '') + '</div><div class="cx-hs">' + esc(e.start) + ' – ' + esc(e.end) + (placeOf(e).chip ? ' · ' + esc(placeOf(e).chip) : '') + '</div></div>' +
        '<div class="cx-ring" role="img" aria-label="До конца пары ' + dur(left) + '"><svg viewBox="0 0 72 72"><circle cx="36" cy="36" r="29" fill="none" stroke="rgba(255,255,255,.22)" stroke-width="7"/><circle cx="36" cy="36" r="29" fill="none" stroke="#fff" stroke-width="7" stroke-linecap="round" stroke-dasharray="' + C + '" stroke-dashoffset="' + off + '"/></svg><div>' + rb + '</div></div></div>' +
        (next ? '<div class="cx-next"><span>Далее: <b>' + esc(namesOf(next)[0]) + '</b></span><b>' + esc(next[0].start) + '</b></div>' : '<div class="cx-next"><span>Это последняя пара сегодня</span></div>') + '</section>';
    } else if (sl.length && now < mins(sl[0][0].start)) {
      var segs = sl.map(function (s, i) { return (i ? '<i class="gap" style="flex:' + Math.max(4, mins(s[0].start) - mins(sl[i - 1][0].end)) + '"></i>' : '') + '<i class="' + (i ? '' : 'on') + '" style="flex:' + Math.max(1, mins(s[0].end) - mins(s[0].start)) + '"></i>'; }).join('');
      hero = '<section class="cx-hero is-morning">' + SUN + '<i class="kg-sheen"></i><div class="cx-col" style="gap:4px"><span class="cx-pill">Пары ещё не начались</span><span class="cx-hs" style="margin-top:8px">До первой пары</span><span class="cx-big">' + dur(mins(sl[0][0].start) - now) + '</span></div>' +
        '<div class="cx-seg" aria-hidden="true">' + segs + '</div><div class="cx-segl"><span>' + esc(sl[0][0].start) + '</span><span>' + countLabel(sl) + '</span><span>' + esc(sl[sl.length - 1][0].end) + '</span></div>' + cxFirst(sl[0], 'Первая') + '</section>';
      list = '<div class="cx-sh"><h2>План на сегодня</h2><button type="button" data-cx="day" data-d="' + t + '">Весь день ›</button></div>' + cxRowsBrk(lessonsFor(t), t, 'первая');
    } else if (next) {
      /* полоса перерыва: от конца прошлой пары до начала следующей */
      var pe = 0; sl.forEach(function (s) { var en = mins(s[0].end); if (en <= now && en > pe) pe = en; });
      var bl = mins(next[0].start) - pe, bp = Math.max(0, Math.min(100, Math.round((now - pe) / Math.max(1, bl) * 100)));
      var bpb = pe ? '<div class="cx-pb" role="progressbar" aria-label="Перерыв" aria-valuemin="0" aria-valuemax="100" aria-valuenow="' + bp + '"><i style="width:' + bp + '%"></i></div><div class="cx-segl"><span>' + hm(pe) + '</span><span>перерыв ' + dur(bl) + '</span><span>' + esc(next[0].start) + '</span></div>' : '';
      hero = '<section class="cx-hero is-break">' + deco + '<div class="cx-col" style="gap:4px"><span class="cx-pill">' + ic('cup') + 'Перерыв</span><span class="cx-hs" style="margin-top:8px">До следующей пары</span><span class="cx-big">' + dur(mins(next[0].start) - now) + '</span></div>' + bpb + cxFirst(next, 'Далее') + '</section>';
    } else {
      var nd = nextStudy(t), lbl = nd ? (nd.key === addDays(t, 1) ? 'Завтра' : dShort(nd.key)) + ' · первая' : '', sb = semBounds(t);
      var freeHead = sb.w < 1 ? [ic('cal') + 'Семестр ещё не начался', 'Пары начнутся ' + dayMonth(sb.start), 'Расписание семестра «' + sem().title + '» уже опубликовано']
        : sb.w > LAST_WEEK ? [ic('cal') + 'Вне опубликованного расписания', 'Расписания на сегодня нет', 'Опубликованы недели 1–' + LAST_WEEK + ', до ' + dayMonth(sb.end)]
        : [ic('sun') + (lessonsFor(t).length ? 'Пары отменены' : dow(t) >= 5 ? 'Выходной' : 'Свободный день'), 'Сегодня пар нет', 'Можно отдохнуть'];
      hero = sl.length
        ? '<section class="cx-hero is-done">' + deco + '<div class="cx-col"><span class="cx-pill">' + ic('moon') + 'Пары закончились</span><div class="cx-h1">На сегодня всё</div><div class="cx-hs">Последняя закончилась в ' + esc(sl[sl.length - 1][0].end) + '</div></div>' + (nd ? cxFirst(nd.sl[0], lbl) : '') + '</section>'
        : '<section class="cx-hero is-free">' + deco + '<div class="cx-col"><span class="cx-pill">' + freeHead[0] + '</span><div class="cx-h1">' + freeHead[1] + '</div><div class="cx-hs">' + freeHead[2] + '</div></div>' + (nd ? cxFirst(nd.sl[0], lbl) : '') + '</section>';
      if (nd) list = '<div class="cx-sh"><h2>' + (nd.key === addDays(t, 1) ? 'Завтра' : DOW[dow(nd.key)] + ', ' + parseISO(nd.key).getDate() + ' ' + MON[parseISO(nd.key).getMonth()]) + '</h2><button type="button" data-cx="day" data-d="' + nd.key + '">Весь день ›</button></div>' + cxRowsBrk(lessonsFor(nd.key), nd.key);
    }
    if (live || (next && now >= mins(sl[0][0].start))) {
      var bt = null;
      for (var i = 1; i < sl.length; i++) { if (mins(sl[i - 1][0].end) > now && mins(sl[i][0].start) - mins(sl[i - 1][0].end) >= 10) { bt = [sl[i - 1][0].end, sl[i][0].start]; break; } }
      var last = sl[sl.length - 1][0].end;
      var tile1 = bt ? '<div class="cx-tile gl"><div class="cx-tl">' + gIco('cup', '#DCC59A', '#9A7A3E', 1) + 'Перерыв</div><div class="cx-tv">' + dur(mins(bt[1]) - mins(bt[0])) + '</div><div class="cx-ts">' + esc(bt[0]) + ' – ' + esc(bt[1]) + '</div></div>'
        : '<div class="cx-tile gl"><div class="cx-tl">' + gIco('flag', '#D98A90', '#8C2B33', 1) + 'Конец пар</div><div class="cx-tv">' + esc(last) + '</div><div class="cx-ts">через ' + dur(Math.max(0, mins(last) - now)) + '</div></div>';
      var done = sl.filter(function (s) { return mins(s[0].end) <= now; }).length;
      var bars = sl.map(function (s) { return mins(s[0].end) <= now ? '<i class="ok"></i>' : (now >= mins(s[0].start) ? '<i style="background:linear-gradient(90deg,#8C2B33 ' + Math.round((now - mins(s[0].start)) / Math.max(1, mins(s[0].end) - mins(s[0].start)) * 100) + '%,var(--e-sep) 0)"></i>' : '<i></i>'); }).join('');
      bento = '<div class="cx-bento">' + tile1 + '<div class="cx-tile gl"><div class="cx-tl">' + gIco('play', '#A7B3CB', '#5C6B8A', 1) + 'День</div><div class="cx-tv">' + done + ' из ' + sl.length + '</div><div class="cx-bars" aria-hidden="true">' + bars + '</div></div></div>';
      if (rest.length) list = '<div class="cx-sh"><h2>Дальше сегодня</h2><button type="button" data-cx="day" data-d="' + t + '">Весь день ›</button></div>' + cxRowsBrk(rest, t);
    }
    if (desk()) return cxHead() + '<div class="cx-dash"><div class="cx-main">' + hero + bento + (list || '') + '</div><aside class="cx-aside" aria-label="Неделя и важное">' + cxGlance(t) + cxTasks(t) + '</aside></div>' + cxFoot();
    return cxHead() + hero + list + bento + cxTasks(t) + cxFoot();
  }
  /* компьютер: краткий обзор недели справа от главной карточки */
  function cxGlance(t) {
    var mon = addDays(t, dow(t) === 6 ? 1 : -dow(t)), h = '', wn = dateWeek(mon);
    for (var i = 0; i < 6; i++) {
      var k = addDays(mon, i), sl = liveOf(k);
      var ends = sl.length ? sl.reduce(function (m, x) { return Math.max(m, mins(x[0].end)); }, 0) : 0;
      h += '<button type="button" class="cx-wg gl' + (k === t ? ' t' : '') + (sl.length ? '' : ' off') + '" data-cx="day" data-d="' + k + '"><span class="cx-wgd"><small>' + DOWS[i] + '</small><b>' + parseISO(k).getDate() + '</b></span>' +
        '<span class="cx-wgl"><b>' + (sl.length ? esc(countLabel(sl)) : (lessonsFor(k).length ? 'Пары отменены' : 'Пар нет')) + '</b>' + (sl.length ? '<small>' + esc(sl[0][0].start) + ' – ' + hm(ends) + '</small>' : '') + '</span>' + ic('chev') + '</button>';
    }
    return '<div class="cx-sh"><h2>' + (dow(t) === 6 ? 'Следующая неделя' : 'Эта неделя') + (wn >= 1 && wn <= LAST_WEEK ? ' <small>· ' + wn + '-я</small>' : '') + '</h2><button type="button" data-cx="week" data-d="' + mon + '">Сетка недели ›</button></div><div class="cx-rows cx-glance">' + h + '</div>';
  }
  /* мастер расписания: календарь на ближайшем учебном дне + форма изменения пары из старого приложения */
  function openWizard() {
    var t = today(), k = lessonsFor(t).length ? t : ((nextStudy(t) || {}).key || t);
    showCal(k);
    setTimeout(function () { try { openChangeEditor(); } catch (e) {} }, 60);
  }
  function cxFoot() {
    var up = window.KGMU_DATA_UPDATED ? dayMonth(window.KGMU_DATA_UPDATED) : '';
    return '<footer class="cx-foot">' + (up ? '<span class="cx-upd" title="Сверяется с сайтом КГМУ 3 раза в день">' + ic('clock') + 'Расписание обновлено ' + esc(up) + '</span>' : '') + '<span>© ' + new Date().getFullYear() + ' KSMU Community · Расписание КГМУ</span><button type="button" data-go="privacy">Политика конфиденциальности</button></footer>';
  }

  function cxCard(s, key, idx, isT, now) {
    var e = s[0], live = s.some(isLive), names = namesOf(s), id = key + ':' + idx;
    var isNow = isT && live && mins(e.start) <= now && now < mins(e.end), past = isT && mins(e.end) <= now;
    var flag = (s.find(function (x) { return x.changeFlag; }) || {}).changeFlag || '';
    var teachers = []; s.forEach(function (x) { if (x.teacher && teachers.indexOf(x.teacher) < 0) teachers.push(x.teacher); });
    var sub = s.length > 1 && s.some(function (x) { return x.subgroup; }) ? 'обе подгруппы' : (e.subgroup ? e.subgroup + '-я подгруппа' : '');
    var chips = '', seenP = {};
    s.forEach(function (x) { var p = placeOf(x); if (p.chip && !seenP[p.chip]) { seenP[p.chip] = 1; chips += p.url ? '<a class="cx-chip" href="' + esc(p.url) + '" target="_blank" rel="noopener" title="Открыть на карте">' + ic('pin') + esc(p.chip) + '</a>' : '<span class="cx-chip">' + esc(p.chip) + '</span>'; } });
    if (FLAG[flag]) chips = '<span class="cx-chip r">' + FLAG[flag] + '</span>' + chips;
    var subjects = []; s.forEach(function (x) { var tt = subjTitle(x.subject); if (subjects.indexOf(tt) < 0) subjects.push(tt); });
    var nts = notesFor(key, subjects);
    nts.forEach(function (n) { chips += '<span class="cx-chip w">' + (n.type === 'module' ? 'Модуль' : 'ДЗ') + (n.title ? ': ' + esc(n.title.length > 36 ? n.title.slice(0, 35) + '…' : n.title) : '') + '</span>'; });
    var h = '<article class="cx-card ' + (isNow ? 'live' : 'gl') + (past ? ' past' : '') + (!live ? ' cancel' : '') + '" style="' + kv(kindOf(e)) + '" data-cx="open" data-id="' + id + '">' +
      (isNow ? '<i class="kg-sheen"></i><span class="cx-left">ещё ' + dur(mins(e.end) - now) + '</span>' : '') + (past && live ? '<span class="cx-chk" aria-label="Прошла"><svg class="kg-ic" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12l5 5 9-10"/></svg></span>' : '') +
      '<h3><button type="button" class="cx-open" data-cx="open" data-id="' + id + '" aria-expanded="' + (state.open === id) + '">' + esc(names.join(' / ')) + '</button></h3><div class="m">' + esc([kindName(e) + cyclePeriod(e), sub].filter(Boolean).join(' · ')) + '</div>' + (teachers.length ? '<div class="m">' + esc(teachers.slice(0, 2).join(', ')) + '</div>' : '') +
      '<div class="ch">' + (function () { var pg = progOf(s, key); return pg ? '<span class="cx-chip cx-prog" title="' + pg.split('/')[0] + '-я пара по предмету из ' + pg.split('/')[1] + ' (' + kindName(e).toLowerCase() + ')">' + pg + '</span>' : ''; })() + chips + '</div>';
    if (isNow) h += '<div class="cx-pb"><i style="width:' + Math.max(0, Math.min(100, Math.round((now - mins(e.start)) / Math.max(1, mins(e.end) - mins(e.start)) * 100))) + '%"></i></div>';
    if (state.open === id) {
      h += '<div class="cx-more">';
      s.forEach(function (x) {
        var p = placeOf(x);
        h += '<div>' + (x.subgroup && s.length > 1 ? '<b>' + esc(x.subgroup) + '-я подгруппа · ' + esc(fullName(x)) + '</b><br>' : '') + (p.text ? esc(p.text) + (p.addr ? '<br><small>' + esc(p.addr) + '</small>' : '') : '') + (x.teacher && s.length > 1 ? '<br><small>' + esc(x.teacher) + '</small>' : '') + (p.url ? '<br><a href="' + esc(p.url) + '" target="_blank" rel="noopener">Открыть на карте</a>' : '') + (x.amendment && x.amendment.comment ? '<br><small>' + esc(x.amendment.comment) + '</small>' : '') + '</div>';
      });
      nts.forEach(function (n) { h += '<div><b>' + (n.type === 'module' ? 'Модуль: ' : 'ДЗ: ') + esc(n.title) + '</b>' + (n.details ? '<br><small>' + esc(n.details) + '</small>' : '') + (n._status === 'pending' ? '<br><small>ждёт подтверждения старосты</small>' : '') + '</div>'; });
      h += '<div class="r"><button type="button" class="cx-btn g" data-cx="add" data-t="homework" data-subj="' + esc(subjects[0]) + '">' + ic('plus') + 'ДЗ</button><button type="button" class="cx-btn g" data-cx="add" data-t="module" data-subj="' + esc(subjects[0]) + '">' + ic('plus') + 'Модуль</button></div></div>';
    }
    return h + '</article>';
  }
  function rangeLabel(a, b) { var x = parseISO(a), y = parseISO(b); return x.getMonth() === y.getMonth() ? x.getDate() + '–' + y.getDate() + ' ' + MON[y.getMonth()] : x.getDate() + ' ' + MON[x.getMonth()] + ' – ' + y.getDate() + ' ' + MON[y.getMonth()]; }
  function cxBoard(days, t, now) {
    return '<div class="cx-board" style="grid-template-columns:repeat(' + days.length + ',minmax(0,1fr))">' + days.map(function (k) {
      var sl = lessonsFor(k), isT = k === t, d = parseISO(k);
      var cards = sl.length ? sl.map(function (s, i) {
        var e = s[0], live = s.some(isLive), nm = namesOf(s), isNow = isT && live && mins(e.start) <= now && now < mins(e.end), past = isT && mins(e.end) <= now;
        var sub = [kindName(e), e.subgroup && s.length === 1 ? e.subgroup + '-я подгр.' : '', roomChip(e.shortLocation || e.location)].filter(Boolean).join(' · ');
        return '<button type="button" class="cx-bc gl' + (isNow ? ' live' : '') + (past ? ' past' : '') + (!live ? ' cancel' : '') + '" style="' + kv(kindOf(e)) + '" data-cx="bopen" data-d="' + k + '" data-i="' + i + '" aria-label="' + esc(DOW[dow(k)] + ', ' + e.start + '–' + e.end + ', ' + nm.join(' / ') + ', ' + sub + (!live ? ', отменено' : '')) + '">' +
          '<span class="cx-bct"><span>' + esc(e.start) + ' – ' + esc(e.end) + '</span>' + (isNow ? '<i>сейчас</i>' : '') + '</span><b>' + esc(nm[0]) + (nm.length > 1 ? ' <span>+' + (nm.length - 1) + '</span>' : '') + '</b><small>' + esc(sub) + '</small></button>';
      }).join('') : '<div class="cx-bempty">' + (dow(k) === 6 ? 'Выходной' : 'Пар нет') + '</div>';
      return '<section class="cx-bcol' + (isT ? ' t' : '') + '"><button type="button" class="cx-bh" data-cx="bday" data-d="' + k + '"><small>' + DOW[dow(k)] + (isT ? ' · сегодня' : '') + '</small><b>' + d.getDate() + ' ' + MON[d.getMonth()] + '</b></button>' + cards + '</section>';
    }).join('') + '</div>';
  }
  /* телефон: у экрана недели/дня — меню и возврат на главную (на компьютере есть боковое меню) */
  function cxTopBar() {
    /* открыто из меню — только ☰; со второго экрана (главная, календарь) — «Назад» туда */
    return '<div class="cx-tbar">' + (state.dayFrom
      ? '<button type="button" class="cx-ib gl cx-hb" data-cx="dback" aria-label="Назад">' + ic('left') + '</button>'
      : '<button type="button" class="cx-ib gl cx-mb" data-cx="menu" aria-label="Меню" aria-controls="cxSide">' + ic('menu') + '</button>') + '<b>Неделя</b><span></span></div>';
  }
  function cxDay() {
    var key = state.date, t = today(), now = kazanClockMinutes(), isT = key === t, slots = lessonsFor(key), w = dateWeek(key);
    var board = desk() && state.board !== false;
    var mon = addDays(key, -dow(key)), days = [];
    for (var i = 0; i < 7; i++) days.push(addDays(mon, i));
    if (!lessonsFor(days[6]).length && (dow(key) !== 6 || board)) days = days.slice(0, 6);
    var chips = days.map(function (k) {
      var n = liveOf(k).length;
      return '<button type="button" class="cx-d' + (k === key ? ' sel' : '') + (k === t ? ' t' : '') + (n ? '' : ' off') + '" data-cx="date" data-d="' + k + '" aria-label="' + DOW[dow(k)] + ', ' + parseISO(k).getDate() + ' ' + MON[parseISO(k).getMonth()] + '"><small>' + DOWS[dow(k)] + '</small><b>' + parseISO(k).getDate() + '</b><i>' + new Array(Math.min(n, 5) + 1).join('<em></em>') + '</i></button>';
    }).join('');
    var g = typeof group !== 'undefined' ? String(group) : 'all';
    var sgB = !hasSubgroups() ? '' : '<div class="cx-sg" role="group" aria-label="Подгруппа">' + [['all', 'Все'], ['1', '1'], ['2', '2']].map(function (o) { return '<button type="button" data-cx="sg" data-v="' + o[0] + '" aria-pressed="' + (g === o[0]) + '">' + o[1] + '</button>'; }).join('') + '</div>';
    var live = slots.filter(function (s) { return s.some(isLive); });
    var sub = [live.length ? countLabel(live) + ' · ' + live[0][0].start + ' – ' + live[live.length - 1][0].end : 'Пар нет', w >= 1 && w <= LAST_WEEK ? w + ' неделя' : w > LAST_WEEK ? 'вне семестра' : 'до начала семестра'].join(' · ');
    var d = parseISO(key);
    var vw = '<div class="cx-vtools">' + (desk() ? '<div class="cx-sg" role="group" aria-label="Вид">' + [['1', 'Неделя'], ['0', 'День']].map(function (o) { return '<button type="button" data-cx="board" data-v="' + o[0] + '" aria-pressed="' + ((o[0] === '1') === board) + '">' + o[1] + '</button>'; }).join('') + '</div>' : '') +
      '<button type="button" class="cx-mbtn" data-cx="calendar">' + ic('cal') + 'Месяц</button>' +
      (!board && liveOf(key).length ? '<button type="button" class="cx-mbtn" data-cx="share" aria-label="Поделиться расписанием дня картинкой">' + ic('share') + '<span>Поделиться</span></button>' : '') + '</div>';
    if (board) {
      var wl = [], wn = 0; days.forEach(function (k) { var s = liveOf(k); wn += s.length; });
      var thisWeek = addDays(t, -dow(t)) === days[0];
      var h0 = '<section class="cx-dh gl"><div class="cx-dt"><div><h1>' + (w >= 1 && w <= LAST_WEEK ? w + '-я неделя' : 'Неделя') + ' · ' + rangeLabel(days[0], days[days.length - 1]) + '</h1><p>' +
        esc([wn ? plural(wn, 'занятие', 'занятия', 'занятий') : 'Занятий нет', w > LAST_WEEK ? 'вне опубликованного расписания' : w < 1 ? 'до начала семестра' : ''].filter(Boolean).join(' · ')) + '</p>' +
        (!thisWeek ? '<button type="button" class="cx-today" data-cx="day" data-d="' + t + '">' + ic('left') + 'К текущей неделе</button>' : '') + '</div><div class="cx-dtr">' + sgB + vw + '</div></div>' +
        '<div class="cx-wk cx-wk-b"><button type="button" data-cx="wk" data-n="-7" aria-label="Предыдущая неделя">' + ic('left') + '<span>Пред. неделя</span></button><button type="button" data-cx="wk" data-n="7" aria-label="Следующая неделя"><span>След. неделя</span>' + ic('right') + '</button></div></section>';
      if (!wn && (w < 1 || w > LAST_WEEK)) return h0 + '<div class="cx-empty gl"><b>Нет расписания на эту неделю</b>Опубликованы недели 1–' + LAST_WEEK + ': ' + dayMonth(semBounds(key).start) + ' – ' + dayMonth(semBounds(key).end) + '</div>' + cxFoot();
      return h0 + cxBoard(days, t, now) + cxLegend() + cxFoot();
    }
    var h = '<section class="cx-dh gl"><div class="cx-dt"><div><h1>' + dayLabel(key) + ', ' + d.getDate() + ' ' + MON[d.getMonth()] + '</h1><p>' + esc(sub) + '</p>' + (key !== t ? '<button type="button" class="cx-today" data-cx="day" data-d="' + t + '">' + ic('left') + 'К сегодня</button>' : '') + '</div><div class="cx-dtr">' + sgB + vw + '</div></div>' +
      '<div class="cx-wk"><button type="button" data-cx="wk" data-n="-7" aria-label="Предыдущая неделя">' + ic('left') + '</button><div class="cx-days" style="grid-template-columns:repeat(' + days.length + ',minmax(0,1fr))">' + chips + '</div><button type="button" data-cx="wk" data-n="7" aria-label="Следующая неделя">' + ic('right') + '</button></div></section>';
    if (!slots.length) {
      return h + '<div class="cx-empty gl"><b>' + (dow(key) === 6 ? 'Воскресенье' : w < 1 || w > LAST_WEEK ? 'Нет расписания на эту дату' : 'Пар нет') + '</b>' + (w >= 1 && w <= LAST_WEEK ? (desk() ? 'Выберите другой день недели' : 'Свайпните или выберите другой день') : 'Опубликованы недели 1–' + LAST_WEEK + ': ' + dayMonth(semBounds(key).start) + ' – ' + dayMonth(semBounds(key).end)) + '</div>' + cxFoot();
    }
    var L = '', prevEnd = null, cur = hm(now);
    slots.forEach(function (s, i) {
      var e = s[0];
      if (prevEnd !== null) {
        var gap = mins(e.start) - prevEnd;
        if (isT && now >= prevEnd && now < mins(e.start)) L += '<div class="cx-now"><b>' + cur + '</b><i></i><span>перерыв, ещё ' + dur(mins(e.start) - now) + '</span></div>';
        else if (gap >= 15) L += '<div class="cx-brk"><span>Перерыв ' + dur(gap) + '</span></div>';
      } else if (isT && now < mins(e.start)) L += '<div class="cx-now"><b>' + cur + '</b><i></i></div>';
      L += '<div class="cx-slot"><div class="cx-tm">' + esc(e.start) + '<span>' + esc(e.end) + '</span></div>' + cxCard(s, key, i, isT, now) + '</div>';
      prevEnd = prevEnd === null ? mins(e.end) : Math.max(prevEnd, mins(e.end));
    });
    return h + '<div class="cx-list">' + L + '</div>' + cxLegend(true) + cxFoot();
  }
  /* «Поделиться днём»: картинка 1080×1350 с парами дня — удобно скинуть в чат группы */
  function shareDay(key) {
    var sl = liveOf(key); if (!sl.length) return;
    var W = 1080, P = 72, TW = W - P * 2 - 230;
    var cv = document.createElement('canvas'); cv.width = W;
    var x = cv.getContext('2d'), F = 'Inter, system-ui, sans-serif';
    var KC = { lec: '#6E7C9A', pr: '#8C2B33', cyc: '#9A7A3E' };
    var fit = function (s, max) { s = String(s); if (x.measureText(s).width <= max) return s; while (s.length > 1 && x.measureText(s + '…').width > max) s = s.slice(0, -1); return s.trim() + '…'; };
    /* название пары — до двух строк */
    var wrap2 = function (s, max) {
      var w = String(s).split(/\s+/), a = '';
      while (w.length && x.measureText((a ? a + ' ' : '') + w[0]).width <= max) a = (a ? a + ' ' : '') + w.shift();
      if (!a) a = w.shift() || '';
      return w.length ? [a, fit(w.join(' '), max)] : [a];
    };
    x.font = '700 38px ' + F;
    var lines = sl.map(function (s) { return wrap2(namesOf(s).join(' / '), TW); });
    var rows = lines.map(function (l) { return l.length > 1 ? 196 : 152; });
    var H = 390 + rows.reduce(function (a, b) { return a + b + 22; }, 0) + 110;
    cv.height = H;
    var draw = function (logo) {
      x.fillStyle = '#F4F6FA'; x.fillRect(0, 0, W, H);
      var g = x.createLinearGradient(0, 0, W, 330); g.addColorStop(0, '#8C2B33'); g.addColorStop(1, '#5E1820');
      x.fillStyle = g; x.fillRect(0, 0, W, 330);
      if (logo) x.drawImage(logo, W - P - 92, 56, 92, 100);
      x.fillStyle = 'rgba(255,255,255,.75)'; x.font = '600 34px ' + F; x.fillText('Группа ' + selectedStudyGroup + (typeof group !== 'undefined' && group !== 'all' ? ' · ' + group + '-я подгруппа' : ''), P, 104);
      /* в чате «сегодня» быстро устаревает — пишем день недели */
      x.fillStyle = '#fff'; x.font = '800 72px ' + F; x.fillText(fit(DOW[dow(key)] + ', ' + parseISO(key).getDate() + ' ' + MON[parseISO(key).getMonth()], W - P * 2 - 110), P, 196);
      x.fillStyle = 'rgba(255,255,255,.8)'; x.font = '500 34px ' + F; x.fillText(countLabel(sl) + ' · ' + sl[0][0].start + ' – ' + sl[sl.length - 1][0].end, P, 262);
      var y = 390;
      sl.forEach(function (s, i) {
        var e = s[0], c = KC[kindOf(e)] || '#8C2B33', rh = rows[i], ln = lines[i];
        x.fillStyle = '#fff'; x.beginPath(); x.roundRect ? x.roundRect(P, y, W - P * 2, rh, 28) : x.rect(P, y, W - P * 2, rh); x.fill();
        x.fillStyle = c; x.beginPath(); x.roundRect ? x.roundRect(P, y, 12, rh, [28, 0, 0, 28]) : x.rect(P, y, 12, rh); x.fill();
        x.fillStyle = '#14161C'; x.font = '800 40px ' + F; x.fillText(e.start, P + 44, y + 62);
        x.fillStyle = '#7A8194'; x.font = '500 30px ' + F; x.fillText(e.end, P + 44, y + 106);
        x.fillStyle = '#14161C'; x.font = '700 38px ' + F;
        ln.forEach(function (t, j) { x.fillText(t, P + 210, y + 62 + j * 46); });
        x.fillStyle = c; x.font = '600 30px ' + F;
        x.fillText(fit([kindName(e), e.subgroup && s.length === 1 ? e.subgroup + '-я подгр.' : '', roomChip(e.shortLocation || e.location)].filter(Boolean).join(' · '), TW), P + 210, y + rh - 42);
        y += rh + 22;
      });
      x.fillStyle = '#7A8194'; x.font = '600 30px ' + F; x.fillText('KSMU Community · ksmucommunity.github.io', P, H - 56);
      cv.toBlob(function (b) { if (b) shareShow(b, key); }, 'image/png');
    };
    /* эмблема — белая маска; на бордовой шапке рисуем как есть */
    var im = new Image(); im.onload = function () { draw(im); }; im.onerror = function () { draw(null); }; im.src = 'img/ksmu-mark.webp';
  }
  function shareShow(blob, key) {
    var url = URL.createObjectURL(blob), name = 'raspisanie-' + selectedStudyGroup + '-' + key + '.png';
    var file = null; try { file = new File([blob], name, { type: 'image/png' }); } catch (e) {}
    var canShare = !!(file && navigator.canShare && navigator.canShare({ files: [file] }));
    var ov = document.createElement('div'); ov.className = 'cx-shov'; ov.setAttribute('role', 'dialog'); ov.setAttribute('aria-modal', 'true'); ov.setAttribute('aria-label', 'Картинка с расписанием дня');
    ov.innerHTML = '<div class="cx-shbox"><img src="' + url + '" alt="Расписание группы ' + esc(selectedStudyGroup) + ' на ' + esc(ddmm(key)) + '"><p>' + (inTG ? 'Нажмите на картинку и удерживайте, чтобы сохранить или переслать' : 'Отправьте картинку в чат группы') + '</p><div class="r">' +
      (canShare ? '<button type="button" class="cx-btn" data-sh="share">' + ic('send') + 'Отправить</button>' : '') +
      '<a class="cx-btn g" href="' + url + '" download="' + esc(name) + '">Сохранить</a><button type="button" class="cx-btn g" data-sh="close">Закрыть</button></div></div>';
    var close = function () { ov.remove(); URL.revokeObjectURL(url); document.removeEventListener('keydown', onKey); };
    var onKey = function (e) { if (e.key === 'Escape') close(); };
    ov.addEventListener('click', function (e) {
      var b = e.target.closest('[data-sh]');
      if (e.target === ov || (b && b.dataset.sh === 'close')) return close();
      if (b && b.dataset.sh === 'share') navigator.share({ files: [file], title: 'Расписание ' + selectedStudyGroup }).catch(function () {});
    });
    document.addEventListener('keydown', onKey);
    ($('kgApp') || document.body).appendChild(ov);
    var f = ov.querySelector('[data-sh]'); if (f) f.focus();
    haptic('ok');
  }
  function cxLegend(short) {
    return '<div class="cx-leg cx-leg-k' + (short ? ' cx-leg-s' : '') + '"><span><i style="' + kv('lec') + '"></i>Лекция</span><span><i style="' + kv('pr') + '"></i>Практика</span><span><i style="' + kv('cyc') + '"></i>Цикл</span>' + (short ? '' : '<span>Нажмите на занятие — откроются аудитория, преподаватель и ДЗ</span>') + '</div>';
  }
  function renderCx(dir) {
    var box = $('kgCx'); if (!box) return;
    LAST_WEEK = sem().weeks;
    if (state.page === 'settings') renderProfile();
    if (devGroup()) {
      box.innerHTML = cxHead() + '<section class="cx-hero is-free"><i class="kg-glow"></i><div class="cx-col"><span class="cx-pill">' + ic('tool') + 'В разработке</span><div class="cx-h1">Расписание группы ' + esc(selectedStudyGroup) + ' временно скрыто</div><div class="cx-hs">Сверяем данные из исходного файла и скоро вернём группу. Пока можно выбрать другую.</div></div>' +
        '<button type="button" class="cx-route" data-cx="group" style="margin-top:14px;align-self:flex-start">' + ic('users') + 'Выбрать другую группу</button></section>';
      renderTabs();
      return;
    }
    box.innerHTML = state.tab === 'day' ? cxTopBar() + cxDay() : cxHome();
    if (dir && state.tab === 'day' && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
      var l = box.querySelector('.cx-list'); if (l) l.animate([{ opacity: 0, transform: 'translateX(' + (dir > 0 ? 18 : -18) + 'px)' }, { opacity: 1, transform: 'none' }], { duration: 220, easing: 'cubic-bezier(.2,.8,.2,1)' });
    }
    renderTabs();
  }
  function onCxClick(ev) {
    if (ev.target.closest('a')) return;
    var a = ev.target.closest('[data-cx]'); if (!a) return;
    var k = a.dataset.cx;
    haptic(/^(date|wk|sg|board)$/.test(k) ? 'sel' : 'tap');
    if (k === 'share') { shareDay(state.date); return; }
    if (k === 'menu') openSide();
    else if (k === 'dback') { var from = state.dayFrom; state.dayFrom = null; state.open = null;
      if (from === 'calendar') { state.tab = 'home'; state.viaMenu = true; try { showCal(state.date); } finally { state.viaMenu = false; } }
      else if (from && REOPEN[from]) { state.tab = 'home'; state.viaMenu = true; try { REOPEN[from](); } finally { state.viaMenu = false; } } else { state.tab = 'home'; state.date = today(); render(); window.scrollTo({ top: 0 }); } }
    else if (k === 'home') { state.tab = 'home'; state.open = null; state.date = today(); render(); window.scrollTo({ top: 0 }); }
    else if (k === 'group') navigate('group');
    else if (k === 'profile') navigate('settings');
    else if (k === 'search') navigate('search');
    else if (k === 'news') navigate('news');
    else if (k === 'modules') navigate('modules');
    else if (k === 'calendar') navigate('calendar');
    else if (k === 'useful') navigate('useful');
    else if (k === 'wizard') openWizard();
    else if (k === 'week') { if (state.tab !== 'day') state.dayFrom = 'home'; state.tab = 'day'; state.board = true; state.date = a.dataset.d || today(); state.open = null; render(); window.scrollTo({ top: 0 }); }
    else if (k === 'board') { state.board = a.dataset.v === '1'; state.open = null; render(); }
    else if (k === 'bday') { state.board = false; state.date = a.dataset.d; state.open = null; render(); window.scrollTo({ top: 0 }); }
    else if (k === 'bopen') { state.board = false; state.date = a.dataset.d; state.open = a.dataset.d + ':' + a.dataset.i; render(); window.scrollTo({ top: 0 }); }
    else if (k === 'day') { if (state.tab !== 'day') state.dayFrom = 'home'; state.tab = 'day'; state.date = a.dataset.d || today(); state.open = null; render(); window.scrollTo({ top: 0 }); }
    else if (k === 'date') { var n = a.dataset.d > state.date ? 1 : -1; state.date = a.dataset.d; state.open = null; render(n); }
    else if (k === 'wk') { state.date = addDays(state.date, +a.dataset.n); state.open = null; render(+a.dataset.n); }
    else if (k === 'sg') { try { setGroup(a.dataset.v); } catch (e) {} render(); }
    else if (k === 'add') { ev.stopPropagation(); openEditorFor(a.dataset.t, a.dataset.subj, state.date); }
    else if (k === 'open') { var id = a.dataset.id; state.open = state.open === id ? null : id; render(); }
  }
  function mountCx() {
    var app = document.createElement('div');
    app.id = 'kgApp';
    app.innerHTML = '<div class="kg-subbar" id="kgSubBar"><span class="kg-sl"><button type="button" class="kg-mb" id="kgMenuB" aria-label="Меню" aria-controls="cxSide" aria-expanded="false">' + ic('menu') + '</button><button type="button" class="kg-back" id="kgBack" aria-label="Назад">' + ic('left') + '<span>Назад</span></button></span><b id="kgSubTitle"></b><span></span></div>' +
      '<section class="kg-home cx-home" id="kgHome" role="main"><div id="kgCx"></div></section><section class="kg-page" id="kgPage" role="main"></section>' +
      '<nav class="kg-tabbar" id="kgTabbar" aria-label="Разделы"></nav><aside class="cx-side" id="cxSide" aria-label="Меню"></aside>';
    document.body.insertBefore(app, document.body.firstChild);
    $('cxSide').addEventListener('click', onTab);
    var scrim = document.createElement('div'); scrim.className = 'cx-scrim'; scrim.setAttribute('aria-hidden', 'true'); scrim.addEventListener('click', closeSide); app.appendChild(scrim);
    $('kgMenuB').addEventListener('click', openSide);
    var onDesk = function () { var was = document.documentElement.classList.contains('kg-desk'); syncDesk(); if (was !== desk()) { render(); if (state.page === 'calendar') renderCal(); } };
    if (DESK.addEventListener) DESK.addEventListener('change', onDesk); else if (DESK.addListener) DESK.addListener(onDesk);
    var bl = document.createElement('div'); bl.className = 'kg-blobs'; bl.setAttribute('aria-hidden', 'true'); bl.innerHTML = '<i></i><i></i><i></i><i></i>'; document.body.appendChild(bl);
    document.body.classList.add('kg-on', 'kg-mode-home');
    state.week = false;
    $('kgBack').onclick = back;
    $('kgTabbar').addEventListener('click', onTab);
    $('kgCx').addEventListener('click', onCxClick);
    $('kgCx').addEventListener('keydown', function (e) { if ((e.key === 'Enter' || e.key === ' ') && e.target.matches('[data-cx="open"]')) { e.preventDefault(); e.target.click(); } });
    var sx = 0, sy = 0;
    $('kgCx').addEventListener('touchstart', function (e) { sx = e.touches[0].clientX; sy = e.touches[0].clientY; }, { passive: true });
    $('kgCx').addEventListener('touchend', function (e) {
      if (state.tab !== 'day') return;
      var dx = e.changedTouches[0].clientX - sx, dy = e.changedTouches[0].clientY - sy;
      if (Math.abs(dx) > 70 && Math.abs(dy) < 45) shift(dx < 0 ? 1 : -1);
    }, { passive: true });
    window.addEventListener('popstate', onPop);
    document.addEventListener('keydown', function (e) {
      if (e.key !== 'Escape') return;
      if (document.body.classList.contains('cx-dr-open')) { closeSide(); var mb = state.page ? $('kgMenuB') : document.querySelector('#kgCx [data-cx="menu"]'); if (mb) mb.focus(); return; }
      if (state.page) back();
    });
  }
  function renderProfile() {
    var u = tgUser(), r = role(), g = selectedStudyGroup, theme = (typeof userPreferences !== 'undefined' && userPreferences.theme) || 'system';
    var mu = !u && window.kgMailUser ? kgMailUser() : null;
    var name = u ? (u.name || (u.username ? '@' + u.username : 'Студент')) : mu ? mu.email : 'Гость';
    var h = '<div class="cx-prof gl"><div class="kg-ava">' + esc((name.replace('@', '')[0] || '?').toUpperCase()) + '</div><div class="kg-prof-t"><small>' + esc(r ? ROLE[r] : 'Студент') + '</small><b>' + esc(name) + '</b><span>Группа ' + esc(g) + (groupCaption(g) ? ' · ' + esc(groupCaption(g)) : '') + '</span></div></div>' +
      '<div class="kg-lbox">' + row('Сменить группу', esc(g), 'group') + '</div>' +
      '<div class="kg-lt">Настройки</div><div class="kg-lbox kg-pad">' + (hasSubgroups() ? '<div class="cx-lab">Подгруппа</div>' + seg('sub', [['all', 'Обе'], ['1', '1-я'], ['2', '2-я']], typeof group !== 'undefined' ? group : 'all') : '') +
      '<div class="cx-lab">Тема</div>' + seg('theme', [['system', 'Авто'], ['light', 'Светлая'], ['dark', 'Тёмная']], theme) + '</div>' +
      (botName() ? '<div class="kg-lbox">' + row('Напоминания о парах', 'в боте', 'bot') + '</div>' : '') +
      '<div class="kg-lt">Аккаунт</div><div class="kg-lbox" id="kgAccBox">' +
      (u ? row('Telegram', esc(u.username ? '@' + u.username : u.name)) + '<button type="button" class="kg-lrow kg-danger" id="kgLogout"><span>Выйти</span></button>'
        : mu ? row('Почта', esc(mu.email)) + '<button type="button" class="kg-lrow kg-danger" id="kgLogout"><span>Выйти</span></button>' : '<div class="kg-pad" id="kgTgSlot"></div>') + '</div>' +
      (r ? '<div class="kg-lbox">' + row(r === 'admin' ? 'Инструменты админа' : 'Инструменты старосты', '', 'tools') + '</div>'
        : botName() ? '<div class="kg-lbox">' + row('Подать заявку на старосту', esc(g), 'starreq', 'kg-accent') + '</div>' : '') +
      (canRoles() ? '<div class="kg-lbox">' + row('Роли и доступ', 'синхронно с ботом', 'roles') + (isAdm() ? row('Статистика', '', 'stats') : '') + '</div>' : '') +
      '<div class="kg-lbox">' + row('Сообщить о проблеме', '', 'report') + '</div>' +
      '<div class="kg-ver">Версия 9.13</div>';
    restoreMoved();
    $('kgPage').innerHTML = h + cxFoot();
    if ($('kgTgSlot')) { moveInto($('kgTgLogin'), $('kgTgSlot')); moveInto(document.querySelector('.kg-mail-login'), $('kgTgSlot')); }
    if ($('kgLogout')) $('kgLogout').onclick = function () { try { cloudLogout(); } catch (e) {} setTimeout(renderProfile, 300); };
    $('kgPage').querySelectorAll('[data-seg]').forEach(function (box) {
      box.addEventListener('click', function (ev) {
        var b = ev.target.closest('button[data-v]'); if (!b) return;
        if (box.dataset.seg === 'sub') { try { setGroup(b.dataset.v); } catch (e) {} }
        else { var t = document.querySelector('[data-theme-choice="' + b.dataset.v + '"]'); if (t) t.click(); setTimeout(applyTGTheme, 30); }
        renderProfile();
      });
    });
  }

  /* ---------- полезные ссылки (идея из сборки NOVA) ---------- */
  var USEFUL = [
    ['https://lk.kazangmu.ru/', 'user', 'Личный кабинет студента', 'Оценки, документы, заявления', '#A7B3CB', '#5C6B8A'],
    ['https://kazangmu.ru/', 'home', 'Официальный сайт КГМУ', 'Новости, учебный процесс, документы', '#D98A90', '#8C2B33'],
    ['https://kazangmu.ru/obuchenie/studentam/raspisanie-zanyatij', 'table', 'Официальное расписание', 'Файлы, которые публикует университет', '#DCC59A', '#9A7A3E'],
    ['https://e.kazangmu.ru/', 'layers', 'Образовательный портал', 'e.kazangmu.ru · курсы, тесты, материалы', '#B7D3A8', '#4F7D3A'],
    ['https://kazangmu.ru/education/departments', 'users', 'Кафедры КГМУ', 'Деканаты и все кафедры на сайте университета', '#C9B6E4', '#6B4FA0'],
    ['https://t.me/libavicenna', 'book', 'Авиценна', 'База знаний и сообщество студентов в Telegram', '#9CC3E6', '#3D7AB8']
  ];
  /* контакты (раздел «Контакты»): одна почта; MAX — впишите тег, когда появится */
  var CONTACT = { channel: 'KsmuStudProject', max: '', mails: [['ksmucommunityinfo@mail.ru', 'Вопросы и предложения']] };
  var TEAM = [['brainfucker01'], ['dkkk111111']];
  function openExt(url) {
    if (inTG) tgPost('web_app_open_link', { url: url }); else window.open(url, '_blank', 'noopener');
  }
  function showUseful() {
    var h = '<div class="kg-lt">Университет</div><div class="cx-rows">' + USEFUL.map(function (x) {
      return '<a class="cx-row gl" href="' + esc(x[0]) + '" target="_blank" rel="noopener" data-ext="1">' + gIco(x[1], x[4], x[5]) + '<div><b>' + esc(x[2]) + '</b><span>' + esc(x[3]) + '</span></div><div class="tm">' + ic('ext') + '</div></a>';
    }).join('') + '</div>';
    showPage('useful', 'Полезное', h);
    bindExt();
  }

  /* ---------- роли: та же таблица kgmu_roles, что и у бота (tg-auth, вход через Telegram) ---------- */
  function myAssign() { try { return (typeof cloudAssignments !== 'undefined' && cloudAssignments) || []; } catch (e) { return []; } }
  function isAdm() { return myAssign().some(function (a) { return a.role === 'admin' && a.study_group === '*'; }); }
  function starGroups() { return myAssign().filter(function (a) { return a.role === 'starosta'; }).map(function (a) { return a.study_group; }); }
  function canRoles() { return !!tgUser() && (isAdm() || starGroups().length > 0); }
  /* роли с сервера после загрузки/обновления страницы приходят не сразу: пока есть вход, но роли не загружены — «Проверяем доступ…», потом перерисовка */
  var permsReady = false, waitTimer = null;
  function accessWait(name, title) {
    var s = null; try { s = typeof cloudSession !== 'undefined' ? cloudSession : null; } catch (e) {}
    if (permsReady || !s || (s.user && s.user.is_anonymous)) { state.accessWait = null; return false; }
    state.accessWait = name; state.accessTitle = title;
    showPage(name, title, '<div class="cx-empty gl" role="status"><b>Проверяем доступ…</b>Загружаем ваши роли</div>');
    /* запасной путь: роли могли начать грузиться до запуска kg-app.js (тогда обёртка не сработает) */
    var t0 = Date.now(); clearInterval(waitTimer);
    waitTimer = setInterval(function () {
      if (state.accessWait !== name) { clearInterval(waitTimer); return; }
      if (myAssign().length) { clearInterval(waitTimer); permsDone(); return; }
      if (Date.now() - t0 > 8000) { clearInterval(waitTimer); permsFail(); }
    }, 300);
    return true;
  }
  /* роли не загрузились (нет сети, 5xx) или зависли: не «Нет доступа», а повтор; придут позже — permsDone перерисует */
  function permsFail() {
    var name = state.accessWait, title = state.accessTitle;
    if (!name || state.page !== name) return;
    clearInterval(waitTimer);
    showPage(name, title, '<div class="cx-empty gl" role="status"><b>Не удалось проверить доступ</b>Проверьте интернет' +
      '<button type="button" class="cx-btn" data-accretry>Повторить</button></div>');
    var rb = document.querySelector('[data-accretry]');
    if (rb) rb.addEventListener('click', function () {
      showPage(name, title, '<div class="cx-empty gl"><b>Проверяем доступ…</b>Загружаем ваши роли</div>');
      try { if (typeof cloudLoadPermissions === 'function') cloudLoadPermissions(); else permsFail(); } catch (e) { permsFail(); }
    });
  }
  function permsDone() {
    permsReady = true;
    var w = state.accessWait;
    if (w && state.page === w && REOPEN[w]) { state.accessWait = null; state.noPush = true; try { REOPEN[w](); } finally { state.noPush = false; } }
  }
  function rolesCall(body) {
    var tok = ''; try { tok = cloudSession && cloudSession.access_token; } catch (e) {}
    if (!tok) return Promise.reject(new Error('Войдите через Telegram'));
    return fetch(KG_TG_FN, { method: 'POST', headers: { 'Content-Type': 'application/json', apikey: KGMU_CLOUD.key, Authorization: 'Bearer ' + tok }, body: JSON.stringify(Object.assign({ site: 1 }, body)) })
      .then(function (r) { return r.json().catch(function () { return {}; }).then(function (j) { if (!r.ok || j.error) throw new Error(j.error || 'Ошибка ' + r.status); return j; }); });
  }
  function showRoles() {
    if (!canRoles() && accessWait('roles', 'Роли и доступ')) return;
    state.accessWait = null;
    if (!canRoles()) { showPage('roles', 'Роли и доступ', '<div class="cx-empty gl"><b>Нет доступа</b>Раздел для администраторов и старост, вошедших через Telegram</div>'); return; }
    var adm = isAdm(), my = starGroups(), g = curGroup();
    var grp = adm ? '<input id="cxRlG" class="cx-in" inputmode="numeric" maxlength="12" placeholder="Группа, например 1307" value="' + esc(g) + '" aria-label="Группа">'
      : '<select id="cxRlG" class="cx-in" aria-label="Группа">' + my.map(function (x) { return '<option' + (x === g ? ' selected' : '') + '>' + esc(x) + '</option>'; }).join('') + '</select>';
    var roles = adm ? [['starosta', 'Староста'], ['editor', 'Помощник старосты'], ['admin', 'Администратор (все группы)']] : [['editor', 'Помощник старосты']];
    var h = '<p class="cx-note" style="margin-top:0">Роли общие с Telegram-ботом: назначение здесь сразу видно в боте (/myrole, админ-панель) и наоборот. Человек должен хотя бы раз написать боту или войти на сайт — через Telegram или по почте. Для Telegram можно указать числовой ID, для почты — адрес, с которым он входил.</p>' +
      '<div class="kg-lt">Назначить</div><form class="kg-lbox kg-pad cx-rf" id="cxRlF"><input id="cxRlT" class="cx-in" autocomplete="off" maxlength="40" placeholder="@username, Telegram ID или почта" aria-label="Кому" required>' + grp +
      '<select id="cxRlR" class="cx-in" aria-label="Роль">' + roles.map(function (r) { return '<option value="' + r[0] + '">' + r[1] + '</option>'; }).join('') + '</select>' +
      '<button type="submit" class="kg-btn kg-wide">' + ic('plus') + 'Назначить</button><p class="cx-rmsg" id="cxRlM" role="status"></p></form>' +
      '<div class="kg-lt">' + (adm ? 'Все роли' : 'Роли группы ' + esc(my.join(', '))) + '</div><div id="cxRlL" class="cx-rows">' + skel() + '</div>';
    showPage('roles', 'Роли и доступ', h);
    var msg = function (t, bad) { var m = $('cxRlM'); if (m) { m.textContent = t; m.classList.toggle('bad', !!bad); } };
    $('cxRlF').addEventListener('submit', function (ev) {
      ev.preventDefault();
      var role = $('cxRlR').value, body = { action: 'grant', target: $('cxRlT').value.trim(), role: role, group: role === 'admin' ? '*' : $('cxRlG').value.trim() };
      msg('Сохраняем…');
      rolesCall(body).then(function (j) { msg('Готово: ' + j.who + ' — ' + j.role_ru + (j.group !== '*' ? ', группа ' + j.group : '')); $('cxRlT').value = ''; loadRoles(); })
        .catch(function (e) { msg(e.message, true); });
    });
    $('cxRlL').addEventListener('click', function (ev) {
      var b = ev.target.closest('[data-rv]'); if (!b) return;
      if (!confirm('Снять роль «' + b.dataset.rr + '» у ' + b.dataset.who + '?')) return;
      b.disabled = true;
      rolesCall({ action: 'revoke', target: b.dataset.rv, group: b.dataset.g }).then(loadRoles).catch(function (e) { b.disabled = false; msg(e.message, true); });
    });
    loadRoles();
  }
  function loadRoles() {
    var box = $('cxRlL'); if (!box) return;
    rolesCall({ action: 'list' }).then(function (j) {
      var it = (j.items || []).slice().sort(function (a, b) { return String(a.study_group).localeCompare(String(b.study_group), 'ru', { numeric: true }); });
      var RU = { admin: 'Администратор', starosta: 'Староста', editor: 'Помощник' }, me = (tgUser() || {}).id;
      box.innerHTML = it.length ? it.map(function (r) {
        var self = me && r.tg_id && String(r.tg_id) === String(me);
        return '<div class="cx-row gl">' + gIco(r.role === 'admin' ? 'gear' : r.role === 'starosta' ? 'flag' : 'user', '#D98A90', '#8C2B33') + '<div><b>' + esc(r.who) + (self ? ' · вы' : '') + '</b><span>' + esc(RU[r.role] || r.role) + (r.study_group !== '*' ? ' · группа ' + esc(r.study_group) : ' · все группы') + '</span></div>' +
          (self && r.role === 'admin' ? '' : '<button type="button" class="cx-rx" data-rv="' + esc(r.tg_id || r.email) + '" data-g="' + esc(r.study_group) + '" data-rr="' + esc(RU[r.role] || r.role) + '" data-who="' + esc(r.who) + '" aria-label="Снять роль">' + ic('x') + '</button>') + '</div>';
      }).join('') : '<div class="cx-empty gl">Ролей пока нет</div>';
    }).catch(function (e) { box.innerHTML = '<div class="cx-empty gl"><b>Не удалось загрузить</b>' + esc(e.message) + '</div>'; });
  }
  function extRow(url, icon, title, sub) {
    return '<a class="cx-row gl" href="' + esc(url) + '" target="_blank" rel="noopener" data-ext="1">' + icon + '<div><b>' + esc(title) + '</b><span>' + esc(sub) + '</span></div><div class="tm">' + ic('ext') + '</div></a>';
  }
  function showContacts() {
    var h = '<section class="cx-about gl"><span class="cx-gp-logo"><i class="ksmu-mark"></i></span><div><small>Команда проекта</small><b>KSMU Community</b><span>Нашли ошибку или есть идея? Напишите нам — ответим в Telegram или по почте.</span></div></section>' +
      '<div class="kg-lt">Разработчики</div><div class="cx-rows">' + TEAM.map(function (x) { return extRow('https://t.me/' + x[0], gIco('user', '#D98A90', '#8C2B33'), '@' + x[0], 'Telegram'); }).join('') + '</div>' +
      '<div class="kg-lt">Почта</div><div class="cx-rows">' + CONTACT.mails.map(function (m) {
        return '<a class="cx-row gl cx-mail" href="mailto:' + esc(m[0]) + '">' + gIco('send', '#DCC59A', '#9A7A3E') + '<div><b>' + esc(m[0]) + '</b><span>' + esc(m[1]) + '</span></div><div class="tm">' + ic('ext') + '</div></a>';
      }).join('') + '</div>' +
      '<div class="kg-lt">Каналы</div><div class="cx-rows">' + extRow('https://t.me/' + CONTACT.channel, gIco('send', '#9CC3E6', '#2A8BD0'), 'Telegram-канал', '@' + CONTACT.channel) +
      (CONTACT.max ? extRow('https://max.ru/' + CONTACT.max, gIco('users', '#B9A7F0', '#5B3FD0'), 'MAX', '@' + CONTACT.max)
        : '<div class="cx-row gl">' + gIco('users', '#B9A7F0', '#5B3FD0') + '<div><b>MAX</b><span>Скоро</span></div></div>') +
      '<button type="button" class="cx-row gl" data-go="report">' + gIco('heart', '#E7A3B8', '#B04A6A') + '<div><b>Сообщить о проблеме</b><span>Ошибка в расписании или на сайте</span></div><div class="tm">' + ic('chev') + '</div></button></div>';
    showPage('contacts', 'Контакты', h);
    bindExt();
  }
  function bindExt() {
    $('kgPage').querySelectorAll('a[data-ext]').forEach(function (a) {
      a.addEventListener('click', function (ev) { if (!inTG) return; ev.preventDefault(); openExt(a.href); });
    });
  }
  function showAbout() {
    var n = allGroups().length;
    var h = '<section class="cx-about gl"><span class="cx-gp-logo"><i class="ksmu-mark"></i></span><div><small>Студенческий сервис</small><b>Расписание КГМУ</b><span>Сайт, мини-приложение и Telegram-бот с расписанием занятий Казанского государственного медицинского университета.</span></div></section>' +
      '<div class="kg-lt">Что умеет</div><div class="cx-facts">' +
      [['users', (n ? n + ' групп' : 'Все группы'), 'всех курсов и направлений'], ['clock', '3 раза в день', 'сверяется с официальными файлами КГМУ'], ['flag', 'ДЗ и модули', 'подтверждает староста группы'], ['send', 'Напоминания', 'утром в Telegram-боте']].map(function (x) {
        return '<div class="cx-fact gl">' + ic(x[0]) + '<b>' + esc(x[1]) + '</b><span>' + esc(x[2]) + '</span></div>';
      }).join('') + '</div>' +
      '<div class="kg-lt">Команда</div><div class="cx-rows"><button type="button" class="cx-row gl" data-go="contacts">' + gIco('users', '#C9B6E4', '#6B4FA0') + '<div><b>Контакты</b><span>Telegram разработчиков, почта и канал проекта</span></div><div class="tm">' + ic('chev') + '</div></button><button type="button" class="cx-row gl" data-go="report">' + gIco('heart', '#E7A3B8', '#B04A6A') + '<div><b>Сообщить о проблеме</b><span>Ошибка в расписании или на сайте</span></div><div class="tm">' + ic('chev') + '</div></button></div>' +
      '<p class="cx-note">Сервис сделан студентами и не является официальным ресурсом КГМУ. Источник расписания — файлы, которые университет публикует на kazangmu.ru; при расхождении верно официальное расписание.</p>';
    showPage('about', 'О проекте', h);
    bindExt();
  }
  /* политика и согласие по 152-ФЗ «О персональных данных»; при изменении текста — обновить DOC_DATE */
  var DOC_DATE = '16 ноября 2026 г.';
  function docHtml(P, tail) {
    return '<div class="cx-doc gl"><p class="cx-doc-d">Редакция от ' + DOC_DATE + '</p>' + P.map(function (x) {
      return '<h2>' + esc(x[0]) + '</h2>' + [].concat(x[1]).map(function (t) { return '<p>' + esc(t) + '</p>'; }).join('');
    }).join('') + (tail || '') + '</div>';
  }
  function showPrivacy() {
    var P = [
      ['1. Общие положения', ['Политика описывает, как сервис «Расписание КГМУ» (сайт, мини-приложение и Telegram-бот) обрабатывает персональные данные пользователей. Она составлена по Федеральному закону от 27.07.2006 № 152-ФЗ «О персональных данных».',
        'Оператор персональных данных — команда проекта «Расписание КГМУ». Связаться с командой можно в Telegram: контакты указаны на странице «Контакты». Сервис сделан студентами и не является официальным ресурсом КГМУ.',
        'Пользуясь расписанием без входа, вы не передаёте нам персональные данные. Вход через Telegram и Telegram-бот работают только с вашего согласия.']],
      ['2. Какие данные и зачем мы обрабатываем', ['Вход через Telegram, подпись записей и роли. Данные: идентификатор Telegram, имя и фамилия, имя пользователя (@username), ссылка на фото профиля, если Telegram её передаёт. Цель: подтвердить, что вы — это вы, показать автора записей ДЗ и модулей, назначить роли старост, помощников и администраторов.',
        'Вход по почте. Данные: адрес электронной почты и одноразовый код входа, который приходит в письме. Цель: войти без Telegram, подписывать свои записи и получать роли в группе. Письма с кодом отправляет Supabase (раздел 5).',
        'Записи ДЗ, модулей, заявки на правку и объявления. Данные: текст записи, группа, дата, автор, статус проверки. Цель: обмен домашними заданиями и сведениями о модулях внутри группы.',
        'Telegram-бот. Данные: идентификатор чата, имя пользователя, группа, подгруппа, время напоминания, заявки на роль старосты. Цель: присылать расписание и напоминания, рассматривать заявки старост.',
        'Технические данные. Хостинг сайта и база данных автоматически получают IP-адрес и сведения о браузере, как любой сервер в интернете. Мы не используем их для отслеживания и не составляем по ним профили.',
        'Анонимная статистика использования. Данные: случайный номер устройства, который создаёт сам сайт (он не связан с аккаунтом, именем и Telegram), выбранная группа, открытые разделы, площадка (сайт, мини-приложение или установленное приложение) и дата. Цель: понимать, сколько людей и какими разделами пользуются, чтобы улучшать сервис. Сводку видят только администраторы. Если в браузере включено «Не отслеживать» (Do Not Track), статистика не собирается.',
        'Мы не получаем номер телефона, пароль Telegram, переписку и список контактов.']],
      ['3. Основание обработки', 'Обработка ведётся на основании вашего согласия (п. 1 ч. 1 ст. 6 152-ФЗ). Согласие даётся отметкой перед входом через Telegram и запуском бота; его текст приведён на отдельной странице «Согласие на обработку персональных данных».'],
      ['4. Что мы делаем с данными', 'Обработка автоматизированная: сбор, запись, систематизация, хранение, уточнение, использование, передача обработчикам (раздел 5), блокирование, удаление и уничтожение. Мы не принимаем на основе этих данных решений, которые влекут для вас юридические последствия, не продаём их и не используем для рекламы.'],
      ['5. Кто ещё получает данные', ['Для работы сервиса данные обрабатывают:',
        'Supabase Inc. — база данных; серверы в Германии (Франкфурт). Там хранятся аккаунты, роли и записи.',
        'GitHub Inc. — хостинг сайта; серверы в США. Получает только технические данные при открытии сайта.',
        'Telegram — вход через Telegram и работа бота; данные передаёт сам Telegram по своим правилам.',
        'Это трансграничная передача данных: в Германию — страну, обеспечивающую адекватную защиту прав субъектов персональных данных, и в США. Другим лицам данные передаются только по требованию закона.']],
      ['6. Что хранится на вашем устройстве', 'Выбранная группа и подгруппа, тема оформления, вид сайта, отметка о прочитанных объявлениях, отметка о согласии, ключ входа и случайный номер устройства для анонимной статистики хранятся в памяти браузера (localStorage). Сайт не использует cookie, рекламу, сторонние счётчики посещаемости и трекеры — собственная анонимная статистика описана в разделе 2. Шрифты загружаются с самого сайта.'],
      ['7. Сроки хранения', ['Данные хранятся, пока вы пользуетесь сервисом и не отозвали согласие.',
        'Анонимная статистика хранится не дольше 12 месяцев.',
        'После отзыва согласия или запроса на удаление мы удаляем аккаунт, роли и данные бота в течение 30 дней. Записи ДЗ и модулей удаляем или обезличиваем, убирая имя автора. При закрытии сервиса все данные уничтожаются.']],
      ['8. Ваши права', ['Вы можете узнать, какие ваши данные обрабатываются; потребовать уточнить, заблокировать или удалить их; отозвать согласие; обжаловать наши действия в Роскомнадзоре или в суде.',
        'Чтобы воспользоваться правами, напишите команде в Telegram. Мы ответим в течение 10 рабочих дней. Выйти из аккаунта можно в профиле, остановить рассылку бота — командой /stop.']],
      ['9. Как мы защищаем данные', 'Сайт и база работают только по защищённому соединению (HTTPS). Вход через Telegram проверяется по цифровой подписи Telegram. Доступ к записям ограничен правилами базы данных: изменять и удалять записи группы могут только её староста, помощники и администраторы. Ключи бота и сервера хранятся только на сервере. Доступ к базе есть только у команды проекта.'],
      ['10. Изменения политики', 'Мы можем обновлять политику; новая редакция действует с момента публикации на этой странице. Дата редакции указана вверху.']
    ];
    showPage('privacy', 'Политика конфиденциальности', docHtml(P,
      '<div style="display:flex;gap:8px;flex-wrap:wrap"><button type="button" class="cx-btn g" data-go="consent">' + ic('flag') + 'Текст согласия</button><button type="button" class="cx-btn g" data-go="about">' + ic('users') + 'Контакты команды</button></div>'));
  }
  function showConsent() {
    var P = [
      ['Согласие на обработку персональных данных', ['Отмечая согласие на сайте или в мини-приложении «Расписание КГМУ» либо запуская Telegram-бот сервиса, я свободно, своей волей и в своём интересе даю согласие команде проекта «Расписание КГМУ» (далее — оператор) на обработку моих персональных данных на следующих условиях.',
        'Данные: идентификатор Telegram, имя и фамилия, имя пользователя (@username), ссылка на фото профиля; адрес электронной почты, если я вхожу по почте; идентификатор чата с ботом; учебная группа и подгруппа, время напоминания; созданные мной записи ДЗ и модулей, заявки и их статус.',
        'Цели: вход в сервис, подпись моих записей, назначение ролей в группе, отправка расписания и напоминаний в Telegram.',
        'Действия: сбор, запись, систематизация, хранение, уточнение, использование, передача обработчикам, блокирование, удаление, уничтожение; обработка автоматизированная.',
        'Я согласен на поручение обработки и трансграничную передачу данных Supabase Inc. (серверы в Германии) и GitHub Inc. (серверы в США) для хранения данных и работы сайта.',
        'Согласие действует до его отзыва. Отозвать его можно, написав команде проекта в Telegram (контакты на странице «Контакты»); после отзыва данные удаляются в течение 30 дней.',
        'Я ознакомлен с Политикой конфиденциальности сервиса.']]
    ];
    showPage('consent', 'Согласие на обработку данных', docHtml(P,
      '<button type="button" class="cx-btn g" data-go="privacy">' + ic('flag') + 'Политика конфиденциальности</button>'));
  }
  window.kgShowConsent = function () { showConsent(); };
  /* прямые ссылки на документы: ?page=privacy | consent | about (ссылается Telegram-бот) */
  function deepPage() {
    var pg = ''; try { pg = new URLSearchParams(location.search).get('page') || ''; } catch (e) {}
    var f = { privacy: showPrivacy, consent: showConsent, about: showAbout }[pg];
    if (!f) { restoreView(); return; }
    try { var url = new URL(location.href); url.searchParams.delete('page'); history.replaceState(history.state, '', url); } catch (e) {}
    setTimeout(f, 0);
  }

  /* обновление страницы возвращает в тот же раздел (sessionStorage — только до закрытия вкладки/приложения) */
  var VIEW_KEY = 'kg-view', viewRestoring = false;
  function saveView() {
    if (viewRestoring) return;
    try {
      sessionStorage.setItem(VIEW_KEY, JSON.stringify({ p: state.page || '', r: !!state.rootMenu, t: state.tab, b: !!state.board,
        d: state.date || '', f: state.dayFrom || '', c: state.calSel || '' }));
    } catch (e) {}
  }
  function restoreView() {
    var v = null; try { v = JSON.parse(sessionStorage.getItem(VIEW_KEY) || 'null'); } catch (e) {}
    if (!v) return;
    var okDate = function (d) { return /^\d{4}-\d{2}-\d{2}$/.test(d || ''); };
    if (v.p && REOPEN[v.p]) {
      if (okDate(v.c)) state.calSel = v.c;
      viewRestoring = true;
      setTimeout(function () {
        viewRestoring = false;
        state.viaMenu = !!v.r;
        try { REOPEN[v.p](); } catch (e) {} finally { state.viaMenu = false; }
      }, 0);
    } else if (v.t === 'day') {
      state.tab = 'day'; state.board = !!v.b; state.dayFrom = v.f || null;
      if (okDate(v.d)) state.date = v.d;
    }
  }

  /* ---------- анонимная статистика (таблица kgmu_stats; см. политику, раздел 2) ----------
     Случайный номер устройства (не связан с аккаунтом), группа, раздел, площадка. Не собираем при «Не отслеживать». */
  var STAT_ON = (function () {
    try {
      if (navigator.doNotTrack === '1' || navigator.globalPrivacyControl) return false;
      if (/^(localhost|127\.)/.test(location.hostname) && localStorage.getItem('kg-stats-dev') !== '1') return false;
      return typeof KGMU_CLOUD !== 'undefined' && !!KGMU_CLOUD.url;
    } catch (e) { return false; }
  })();
  function statDev() {
    try {
      var d = localStorage.getItem('kg-dev');
      if (!d) { d = (window.crypto && crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).slice(2) + Date.now().toString(36)).replace(/-/g, '').slice(0, 24); localStorage.setItem('kg-dev', d); }
      return d;
    } catch (e) { return ''; }
  }
  /* одно событие каждого вида за сеанс — без лишних запросов */
  function stat(event, section) {
    if (!STAT_ON) return;
    try {
      var key = 'kg-st-' + event + '-' + (section || '');
      if (sessionStorage.getItem(key)) return;
      sessionStorage.setItem(key, '1');
      var dev = statDev(); if (!dev) return;
      var plat = inTG ? 'tg' : (window.matchMedia && matchMedia('(display-mode: standalone)').matches ? 'pwa' : 'web');
      fetch(KGMU_CLOUD.url + '/rest/v1/kgmu_stats', { method: 'POST', keepalive: true,
        headers: { apikey: KGMU_CLOUD.key, 'Content-Type': 'application/json', Prefer: 'return=minimal' },
        body: JSON.stringify({ device: dev, grp: curGroup() || null, event: event, section: section || null, platform: plat }) }).catch(function () {});
    } catch (e) {}
  }

  /* ---------- страница «Статистика» (только администратор) ---------- */
  var SEC_RU = { calendar: 'Календарь', week: 'Неделя', modules: 'Модули', search: 'Поиск', news: 'Объявления', useful: 'Полезное', contacts: 'Контакты',
    about: 'О проекте', privacy: 'Политика', consent: 'Согласие', settings: 'Профиль', group: 'Выбор группы', roles: 'Роли', tools: 'Инструменты', stats: 'Статистика' };
  function showStats(days) {
    state.statDays = days || state.statDays || 30;
    if (!isAdm() && accessWait('stats', 'Статистика')) return;
    state.accessWait = null;
    if (!isAdm()) { showPage('stats', 'Статистика', '<div class="cx-empty gl"><b>Нет доступа</b>Статистику видят только администраторы</div>'); return; }
    var h = '<div class="cx-sg cx-mseg" role="group" aria-label="Период">' + [[7, '7 дней'], [30, '30 дней'], [90, '90 дней']].map(function (o) {
      return '<button type="button" data-st="d" data-v="' + o[0] + '" aria-pressed="' + (state.statDays === o[0]) + '">' + o[1] + '</button>'; }).join('') + '</div><div id="cxSt">' + skel('stats') + '</div>' +
      '<p class="cx-note">Считаются устройства, а не люди: телефон и компьютер одного студента — два устройства. Статистика анонимная, без имён и Telegram-аккаунтов; при включённом в браузере «Не отслеживать» не собирается.</p>';
    showPage('stats', 'Статистика', h);
    var tok = ''; try { tok = cloudSession && cloudSession.access_token; } catch (e) {}
    fetch(KGMU_CLOUD.url + '/rest/v1/rpc/kgmu_stats_summary', { method: 'POST', headers: { apikey: KGMU_CLOUD.key, Authorization: 'Bearer ' + tok, 'Content-Type': 'application/json' }, body: JSON.stringify({ days: state.statDays }) })
      .then(function (r) { return r.json().then(function (j) { if (!r.ok) throw new Error(j.message || ('Ошибка ' + r.status)); return j; }); })
      .then(renderStats)
      .catch(function (e) { var b = $('cxSt'); if (b) b.innerHTML = '<div class="cx-empty gl"><b>Не удалось загрузить</b>' + esc(e.message) + '</div>'; });
  }
  function renderStats(j) {
    var box = $('cxSt'); if (!box) return;
    var daily = j.daily || [], max = Math.max.apply(null, daily.map(function (d) { return d.users; }).concat([1]));
    state.statDaily = daily;
    /* сравнение с прошлым периодом: prev_* — те же счётчики за предыдущие 1/7/30 дней (нужны в kgmu_stats_summary) */
    var delta = function (v, p) {
      if (p == null || !p) return '';
      var pc = Math.round((v - p) / p * 100);
      return '<em class="cx-dl ' + (pc > 0 ? 'up' : pc < 0 ? 'dn' : '') + '" title="Предыдущий период: ' + p + '">' + (pc > 0 ? '↑ ' : pc < 0 ? '↓ ' : '') + Math.abs(pc) + '%</em>';
    };
    var tile = function (v, l, p) { return '<div class="cx-stt gl"><b>' + v + '</b><span>' + l + '</span>' + delta(v, p) + '</div>'; };
    var h = '<div class="cx-sts">' + tile(j.today || 0, 'сегодня', j.prev_today) + tile(j.week || 0, 'за 7 дней', j.prev_week) + tile(j.month || 0, 'за 30 дней', j.prev_month) + '</div>';
    var DL = ['П', 'В', 'С', 'Ч', 'П', 'С', 'В'], few = daily.length <= 31;
    h += '<div class="cx-lab">Устройств в день</div><section class="cx-stc gl"><div class="cx-stcap" id="cxStCap" aria-live="polite"></div><div class="cx-bars2' + (few ? '' : ' many') + '">' +
      daily.map(function (d, i) {
        var pct = Math.round(d.users / max * 100), we = dow(d.day) >= 5;
        return '<button type="button" class="cx-bar2' + (we ? ' we' : '') + '" data-sb="' + i + '" aria-label="' + esc(DOW[dow(d.day)] + ', ' + ddmm(d.day) + ': ' + plural(d.users, 'устройство', 'устройства', 'устройств') + ', открытий ' + d.opens) + '"><i style="height:' + Math.max(pct, d.users ? 4 : 0) + '%"></i></button>';
      }).join('') + '</div>' +
      (few ? '<div class="cx-bdw" aria-hidden="true">' + daily.map(function (d) { return '<span class="' + (dow(d.day) >= 5 ? 'we' : '') + '">' + DL[dow(d.day)] + '</span>'; }).join('') + '</div>' : '') +
      '<div class="cx-bax"><span>' + (daily[0] ? ddmm(daily[0].day) : '') + '</span><span><i class="cx-wek"></i>суббота и воскресенье</span><span>' + (daily.length ? ddmm(daily[daily.length - 1].day) : '') + '</span></div></section>';
    var pl = j.platform || {}, pt = (pl.tg || 0) + (pl.web || 0) + (pl.pwa || 0);
    var row = function (label, n, tot, extra) { var pc = tot ? Math.round(n / tot * 100) : 0; return '<div class="cx-str"><span>' + label + '</span><b>' + n + (extra || '') + '</b><i style="--w:' + pc + '%"></i></div>'; };
    h += '<div class="cx-lab">Где открывают</div><section class="cx-stl gl">' + (pt ? row('Мини-приложение Telegram', pl.tg || 0, pt) + row('Сайт в браузере', pl.web || 0, pt) + row('Установленное приложение', pl.pwa || 0, pt) : '<span class="cx-stn">Пока нет данных</span>') + '</section>';
    var gs = j.groups || [], gmax = gs.length ? gs[0].users : 0;
    h += '<div class="cx-lab">Группы</div><section class="cx-stl gl">' + (gs.length ? gs.map(function (g) { return row('Группа ' + esc(g.grp), g.users, gmax); }).join('') : '<span class="cx-stn">Пока нет данных</span>') + '</section>';
    var ss = j.sections || [], smax = ss.length ? ss[0].views : 0;
    h += '<div class="cx-lab">Разделы</div><section class="cx-stl gl">' + (ss.length ? ss.map(function (x) { return row(esc(SEC_RU[x.section] || x.section), x.views, smax); }).join('') : '<span class="cx-stn">Пока нет данных</span>') + '</section>';
    h += '<div class="cx-lab">Аккаунты</div><section class="cx-stl gl"><div class="cx-str"><span>Вошли через Telegram</span><b>' + (j.tg_accounts || 0) + '</b></div></section>';
    box.innerHTML = h;
    statPick(daily.length - 1);
  }
  /* выбранный столбик (касание или клик) — подпись над графиком */
  function statPick(i) {
    var d = (state.statDaily || [])[i], cap = $('cxStCap'); if (!d || !cap) return;
    cap.innerHTML = '<b>' + plural(d.users, 'устройство', 'устройства', 'устройств') + '</b><span>' + DOW[dow(d.day)] + ', ' + parseISO(d.day).getDate() + ' ' + MON[parseISO(d.day).getMonth()] + ' · открытий ' + d.opens + '</span>';
    document.querySelectorAll('#cxSt .cx-bar2').forEach(function (b) { b.classList.toggle('on', +b.dataset.sb === i); b.setAttribute('aria-pressed', String(+b.dataset.sb === i)); });
  }

  /* ---------- модули и зачёты (новый экран вместо старого V8.8) ---------- */
  function modList() { try { return notes.filter(function (n) { return n.type === 'module' && noteRelevant(n); }); } catch (e) { return []; } }
  function daysTo(k) { return Math.round((parseISO(k) - parseISO(today())) / 864e5); }
  function inDays(d) { return d === 0 ? 'сегодня' : d === 1 ? 'завтра' : d === -1 ? 'вчера' : d > 0 ? 'через ' + plural(d, 'день', 'дня', 'дней') : plural(-d, 'день', 'дня', 'дней') + ' назад'; }
  function resLinks(raw) {
    var out = String(raw || '').split(/\r?\n/).map(function (x) { return x.trim(); }).filter(Boolean).slice(0, 12).map(function (item) {
      var parts = item.split(/\s+\|\s+/), url = parts.length > 1 ? parts.slice(1).join(' | ').trim() : item, ok = '';
      try { var u = new URL(url); if (u.protocol === 'https:' || u.protocol === 'http:') ok = u.href; } catch (e) {}
      var label = parts.length > 1 ? parts[0].trim() : url;
      return ok ? '<a class="cx-res" href="' + esc(ok) + '" target="_blank" rel="noopener" data-ext="1">' + ic('link') + '<span>' + esc(label || ok) + '</span></a>' : '<span class="cx-res">' + ic('book') + '<span>' + esc(item) + '</span></span>';
    }).join('');
    return out ? '<div class="cx-ress">' + out + '</div>' : '';
  }
  function showModules(tab) {
    state.modTab = tab || state.modTab || 'next';
    var t = today(), all = modList();
    var next = all.filter(function (n) { return n.date >= t; }).sort(function (a, b) { return a.date.localeCompare(b.date) || a.subject.localeCompare(b.subject, 'ru'); });
    var past = all.filter(function (n) { return n.date < t; }).sort(function (a, b) { return b.date.localeCompare(a.date); });
    var list = state.modTab === 'past' ? past : next, nx = next[0];
    var h = '<section class="cx-mhero"><div><small>Группа ' + esc(selectedStudyGroup) + '</small><b>' + (next.length ? plural(next.length, 'модуль впереди', 'модуля впереди', 'модулей впереди') : 'Модулей впереди нет') + '</b>' +
      '<span>' + (nx ? 'Ближайший — ' + esc(nx.subject) + ', ' + inDays(daysTo(nx.date)) : 'Староста или помощник добавит модуль — он появится здесь и в календаре') + '</span></div>' +
      '<button type="button" class="cx-madd" data-mod="add">' + ic('plus') + 'Модуль</button></section>' +
      '<div class="cx-sg cx-mseg" role="group" aria-label="Какие модули показать">' + [['next', 'Предстоящие', next.length], ['past', 'Прошедшие', past.length]].map(function (o) {
        return '<button type="button" data-mod="tab" data-v="' + o[0] + '" aria-pressed="' + (state.modTab === o[0]) + '">' + o[1] + (o[2] ? ' · ' + o[2] : '') + '</button>'; }).join('') + '</div>';
    h += list.length ? '<div class="cx-mods">' + list.map(function (n) {
      var d = daysTo(n.date), dt = parseISO(n.date), soon = d >= 0 && d <= 3;
      return '<article class="cx-mod gl' + (soon ? ' soon' : '') + (d < 0 ? ' past' : '') + '"><div class="cx-mdate"><small>' + DOWS[dow(n.date)] + '</small><b>' + dt.getDate() + '</b><small>' + MON[dt.getMonth()].slice(0, 3) + '</small></div>' +
        '<div class="cx-mbody"><span class="cx-mpill">' + inDays(d) + '</span><h3>' + esc(n.subject) + '</h3>' + (n.title ? '<p class="cx-mt">' + esc(n.title) + '</p>' : '') +
        (n.subgroup && n.subgroup !== 'all' ? '<p class="cx-mm">' + esc(n.subgroup) + '-я подгруппа</p>' : '') +
        (n.details ? '<p class="cx-md">' + esc(n.details) + '</p>' : '') + resLinks(n.resources) +
        '<div class="cx-mact">' + (d >= 0 ? '<button type="button" class="cx-btn g" data-ics="' + esc(n.id) + '">' + ic('cal') + 'Календарь</button>' : '') +
        '<button type="button" class="cx-btn g" data-mod="day" data-d="' + n.date + '">' + ic('week') + 'День</button>' +
        '<button type="button" class="cx-btn g" data-share-module="' + esc(n.id) + '">' + ic('send') + 'Поделиться</button></div></div></article>';
    }).join('') + '</div>'
      : state.modTab === 'past' ? '<div class="cx-empty gl"><b>Прошедших модулей нет</b>Здесь будут модули, которые уже прошли</div>' : '';
    showPage('modules', 'Модули и зачёты', h);
    bindExt();
  }

  /* ---------- поиск по всему семестру (новый экран вместо старого V8.8) ---------- */
  var OCC = { k: '', list: [] };
  function occAll() {
    var g = typeof group !== 'undefined' ? String(group) : 'all', na = 0;
    na = amSig();
    var ck = selectedStudyGroup + '|' + g + '|' + na + '|' + LAST_WEEK;
    if (OCC.k === ck) return OCC.list;
    var s0 = (window.KGMU_SEM && window.KGMU_SEM.week1) || '2026-08-31', out = [];
    for (var i = 0; i < LAST_WEEK * 7; i++) { var k = addDays(s0, i); liveOf(k).forEach(function (sl) { out.push({ k: k, s: sl }); }); }
    OCC.k = ck; OCC.list = out; return out;
  }
  function nrm(v) { return String(v || '').toLocaleLowerCase('ru-RU').replace(/ё/g, 'е').replace(/№\s*/g, '').replace(/\s+/g, ' ').trim(); }
  function showSearch() {
    state.sf = state.sf || 'all';
    var h = '<label class="cx-gq gl">' + ic('search') + '<input id="cxSq" type="search" enterkeyhint="search" autocomplete="off" maxlength="60" placeholder="Предмет, преподаватель, аудитория, тема" aria-label="Что найти" value="' + esc(state.sq || '') + '"></label>' +
      '<div class="cx-sg cx-sf" role="group" aria-label="Где искать">' + [['all', 'Всё'], ['class', 'Пары'], ['homework', 'ДЗ'], ['module', 'Модули']].map(function (o) {
        return '<button type="button" data-sr="f" data-v="' + o[0] + '" aria-pressed="' + (state.sf === o[0]) + '">' + o[1] + '</button>'; }).join('') + '</div><div id="cxSr" aria-live="polite"></div>';
    showPage('search', 'Поиск', h);
    var q = $('cxSq');
    q.addEventListener('input', function () { state.sq = q.value; renderSearchCx(); });
    if (desk()) setTimeout(function () { q.focus(); }, 30);
    renderSearchCx();
  }
  function renderSearchCx() {
    var box = $('cxSr'); if (!box) return;
    var q = nrm(state.sq), f = state.sf, t = today(), res = [];
    if (q.length < 2) {
      box.innerHTML = '<div class="cx-empty gl"><b>Поиск по всему семестру</b>Название предмета, фамилия преподавателя, корпус или аудитория, тема ДЗ или модуля. Например: «пато», «УЛК», «воспаление».</div>';
      return;
    }
    if (f === 'all' || f === 'class') {
      var byS = {}, order = [];
      occAll().forEach(function (o) {
        var e = o.s[0], hay = nrm(o.s.map(function (x) { return [subjTitle(x.subject), x.fullSubject, x.teacher, x.location, x.shortLocation, roomChip(x.shortLocation || x.location)].join(' '); }).join(' '));
        if (hay.indexOf(q) < 0) return;
        var id = pkey(e);
        if (!byS[id]) { byS[id] = { e: e, occ: [], teachers: {}, places: {} }; order.push(id); }
        var r = byS[id]; r.occ.push(o);
        o.s.forEach(function (x) { if (x.teacher) r.teachers[x.teacher] = 1; var pl = roomChip(x.shortLocation || x.location); if (pl) r.places[pl] = 1; });
      });
      order.forEach(function (id) {
        var r = byS[id], nx = r.occ.filter(function (o) { return o.k >= t; })[0], last = r.occ[r.occ.length - 1], done = r.occ.filter(function (o) { return o.k < t; }).length;
        var when = nx ? 'следующая ' + (nx.k === t ? 'сегодня' : dShort(nx.k)) + ', ' + nx.s[0].start : 'все прошли, последняя ' + ddmm(last.k);
        res.push({ sort: nx ? '0' + nx.k + nx.s[0].start : '1' + last.k, html: '<button type="button" class="cx-row gl cx-srr" data-sr="day" data-d="' + (nx || last).k + '">' + kIco(kindOf(r.e)) +
          '<div><b>' + esc(subjTitle(r.e.subject)) + '</b><span>' + esc(kindName(r.e) + ' · ' + done + ' из ' + r.occ.length + ' прошло · ' + when) + '</span>' +
          '<span>' + esc(Object.keys(r.teachers).slice(0, 2).concat(Object.keys(r.places).slice(0, 2)).join(' · ')) + '</span></div><div class="tm">' + ic('chev') + '</div></button>' });
      });
    }
    if (f !== 'class') {
      var ns = []; try { ns = notes.filter(function (n) { return noteRelevant(n) && (f === 'all' || n.type === f); }); } catch (e) {}
      ns.forEach(function (n) {
        if (nrm([n.subject, n.title, n.details, n.resources].join(' ')).indexOf(q) < 0) return;
        var mod = n.type === 'module';
        res.push({ sort: (n.date >= t ? '0' : '1') + n.date, html: '<button type="button" class="cx-row gl cx-srr" data-sr="day" data-d="' + n.date + '">' + (mod ? gIco('layers', '#D98A90', '#8C2B33') : gIco('flag', '#A7B3CB', '#5C6B8A')) +
          '<div><b>' + (mod ? 'Модуль' : 'ДЗ') + ' · ' + esc(n.subject) + '</b><span>' + esc((n.title || '') + (n.title ? ' · ' : '') + dShort(n.date)) + '</span>' + (n.details ? '<span>' + esc(n.details.slice(0, 90)) + '</span>' : '') + '</div><div class="tm">' + ic('chev') + '</div></button>' });
      });
    }
    res.sort(function (a, b) { return a.sort < b.sort ? -1 : a.sort > b.sort ? 1 : 0; });
    box.innerHTML = res.length ? '<div class="cx-lab">Найдено: ' + res.length + '</div><div class="cx-rows">' + res.slice(0, 80).map(function (r) { return r.html; }).join('') + '</div>'
      : '<div class="cx-empty gl"><b>Ничего не нашлось</b>Попробуйте часть слова: «анат», «хир», «213»</div>';
  }

  /* ---------- компактный вид: выбор группы ---------- */
  var gp = null;
  function progs() { return typeof PROGRAM_CONFIG !== 'undefined' ? PROGRAM_CONFIG : {}; }
  function curGroup() { return typeof selectedStudyGroup !== 'undefined' && selectedStudyGroup ? selectedStudyGroup : ''; }
  function showGroupPage(first) {
    var g = curGroup(), keys = Object.keys(progs());
    gp = { prog: g ? studyProgram(g) : keys[0], course: g ? studyCourse(g) : null, flow: g ? studyStream(g) : null, first: !!first };
    document.body.classList.toggle('kg-cx-first', !!first);
    showPage('group', 'Выбор группы',
      (first ? '<div class="cx-wl">' + welcomeHero() + '<div class="cx-wl-main"><div class="cx-wl-head"><span class="cx-wl-k">Шаг 1 · ваша группа</span><h2>Выберите группу</h2><p>Выбор запомнится на этом устройстве, сменить группу можно в профиле.</p></div>' : '') +
      '<div class="cx-lab">' + (first ? 'Знаете номер? Введите сразу' : 'Номер группы') + '</div>' +
      '<label class="cx-gq gl">' + ic('search') + '<input id="cxGpQ" type="search" inputmode="numeric" enterkeyhint="go" autocomplete="off" maxlength="12" placeholder="Например, 1307" aria-label="Номер группы" aria-controls="cxGpSug"></label>' +
      '<div id="cxGpSug" class="cx-gsug" role="listbox" aria-label="Подходящие группы" hidden></div><div id="cxGpBody"></div>' + (first ? '</div></div>' : ''));
    var q = $('cxGpQ');
    q.addEventListener('input', renderGroupSuggest);
    q.addEventListener('keydown', function (e) {
      if (e.key !== 'Enter') return;
      e.preventDefault();
      var m = groupMatches(q.value);
      if (m.length) pickGroup(m[0]);
    });
    renderGroupPage();
  }
  /* приветственная страница при первом запуске (идея из варианта 3 — KSMU NOVA) */
  function welcomeHero() {
    var feat = [['cal', 'Расписание', 'пары на день, неделю и месяц'], ['book', 'ДЗ и модули', 'общие для группы, подтверждает староста'],
      ['news', 'Объявления', 'новости и изменения в расписании'], ['send', 'Telegram-бот', 'утром напомнит о парах']];
    return '<aside class="cx-wl-hero"><i class="ksmu-full" role="img" aria-label="KSMU Community"></i><div class="cx-wl-brand"><span class="cx-gp-logo"><i class="ksmu-mark"></i></span><div><b>KSMU <span>Community</span></b><small>Студенческое сообщество КГМУ</small></div></div>' +
      '<div class="cx-wl-copy"><span class="cx-wl-k">Начните здесь</span><h1>Ваш университет.<br><em>Ваш ритм.</em></h1><p>Расписание, домашние задания, модули и новости курса — в одном месте. Выберите группу один раз, дальше покажем только ваше.</p></div>' +
      '<ul class="cx-wl-feat">' + feat.map(function (f) { return '<li>' + ic(f[0]) + '<div><b>' + f[1] + '</b><span>' + f[2] + '</span></div></li>'; }).join('') + '</ul>' +
      '<small class="cx-wl-note">Студенческий проект · не официальный ресурс КГМУ</small></aside>';
  }
  function allGroups() {
    try { if (typeof GROUP_IDS !== 'undefined') return GROUP_IDS.slice(); } catch (e) {}
    var out = [], P = progs();
    Object.keys(P).forEach(function (p) { var c = P[p].courses || {}; Object.keys(c).forEach(function (k) { Object.keys(c[k]).forEach(function (f) { out = out.concat(c[k][f] || []); }); }); });
    return out;
  }
  /* сначала группы, которые начинаются с набранного, потом те, где оно встречается внутри */
  function groupMatches(raw) {
    var q = String(raw || '').replace(/\s+/g, '').toLowerCase(); if (!q) return [];
    var all = allGroups(), starts = [], inside = [];
    all.forEach(function (id) { var s = String(id).toLowerCase(); if (s.indexOf(q) === 0) starts.push(id); else if (s.indexOf(q) > 0) inside.push(id); });
    var byNum = function (a, b) { return String(a).localeCompare(String(b), 'ru', { numeric: true }); };
    return starts.sort(byNum).concat(inside.sort(byNum));
  }
  function renderGroupSuggest() {
    var box = $('cxGpSug'), body = $('cxGpBody'), q = $('cxGpQ'); if (!box || !q) return;
    var v = q.value.trim();
    box.hidden = !v; body.hidden = !!v;
    if (!v) { box.innerHTML = ''; return; }
    var m = groupMatches(v), cur = curGroup(), shown = m.slice(0, 12);
    box.innerHTML = shown.length ? '<div class="cx-lab">' + (m.length === 1 ? 'Найдена 1 группа' : 'Найдено: ' + plural(m.length, 'группа', 'группы', 'групп')) + (m.length > shown.length ? ', показаны первые ' + shown.length : '') + '</div>' +
      shown.map(function (id) {
        var s = String(id), i = s.toLowerCase().indexOf(v.replace(/\s+/g, '').toLowerCase()), L = v.replace(/\s+/g, '').length;
        var num = i >= 0 ? esc(s.slice(0, i)) + '<mark>' + esc(s.slice(i, i + L)) + '</mark>' + esc(s.slice(i + L)) : esc(s);
        return '<button type="button" class="cx-gs gl' + (id === cur ? ' on' : '') + '" role="option" data-gp="pick" data-v="' + esc(id) + '"><b>' + num + '</b><span>' + esc(groupCaption(id) || '') + (id === cur ? ' · текущая' : '') + '</span>' + ic('chev') + '</button>';
      }).join('') : '<div class="cx-empty gl"><b>Нет такой группы</b>Проверьте номер или выберите по направлению и курсу</div>';
  }
  function renderGroupPage() {
    var P = progs(), cfg = P[gp.prog] || P[Object.keys(P)[0]]; if (!cfg) return;
    var courses = cfg.courses || {}, ck = Object.keys(courses).sort(function (a, b) { return a - b; });
    if (!courses[gp.course]) gp.course = ck[0];
    var flows = Object.keys(courses[gp.course] || {}); if (flows.indexOf(gp.flow) < 0) gp.flow = flows[0];
    var ids = (courses[gp.course] || {})[gp.flow] || [], cur = curGroup();
    function pick(kind, v, label, on, small) { return '<button type="button" class="cx-pick' + (on ? ' on' : '') + '" data-gp="' + kind + '" data-v="' + esc(v) + '" aria-pressed="' + on + '">' + label + (small ? '<small>' + small + '</small>' : '') + '</button>'; }
    function step(n, t) { return '<div class="cx-lab cx-step"><i>' + n + '</i>' + t + '</div>'; }
    var many = flows.length > 1;
    var h = step(1, 'Направление') + '<div class="cx-picks">' + Object.keys(P).map(function (k) { return pick('prog', k, esc(P[k].label), k === gp.prog); }).join('') + '</div>';
    h += step(2, 'Курс') + '<div class="cx-picks cx-picks-c">' + ck.map(function (c) {
      var n = 0; Object.keys(courses[c]).forEach(function (f) { n += (courses[c][f] || []).length; });
      return pick('course', c, c + ' курс', c === gp.course, plural(n, 'группа', 'группы', 'групп'));
    }).join('') + '</div>';
    if (many) h += step(3, 'Поток') + '<div class="cx-picks">' + flows.map(function (f) {
      var a = courses[gp.course][f] || [], custom = gp.prog === 'stomatologiya' && gp.course === '3';
      return pick('flow', f, custom && a.length ? 'Группы ' + esc(a[0]) + '–' + esc(a[a.length - 1]) : f + '-й поток', f === gp.flow);
    }).join('') + '</div>';
    h += step(many ? 4 : 3, 'Группа') + '<div class="cx-ggrid">' + (ids.length ? ids.map(function (id) {
      var dev = false; try { dev = isDevGroup(id); } catch (e) {}
      return '<button type="button" class="cx-gt gl' + (id === cur ? ' on' : '') + '" data-gp="pick" data-v="' + esc(id) + '"' + (id === cur ? ' aria-current="true"' : '') + '><b>' + esc(id) + '</b><small>' + (id === cur ? 'текущая' : dev ? 'в разработке' : 'открыть') + '</small></button>';
    }).join('') : '<div class="cx-empty gl">Групп нет</div>') + '</div>';
    if ($('cxGpBody')) $('cxGpBody').innerHTML = h;
  }
  function pickGroup(id) {
    haptic('ok');
    var first = gp && gp.first;
    gp = null; document.body.classList.remove('kg-cx-first');
    function go() { if (go.done) return; go.done = true; try { selectStudyGroup(id); } catch (e) { console.warn(e); } }
    if (first) { state.page = null; go(); return; }
    if (id === curGroup()) { back(); return; }
    /* сначала дождаться возврата по истории, иначе он затрёт ?studyGroup= новой группы */
    window.addEventListener('popstate', function () { setTimeout(go, 0); }, { once: true });
    setTimeout(go, 400);
    state.stack = [];
    back();
  }

  /* ---------- компактный вид: календарь и ДЗ ---------- */
  var MONN = ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'];
  function monthOf(key) { return key.slice(0, 8) + '01'; }
  function showCal(key) {
    key = key || (typeof selectedDate !== 'undefined' && selectedDate) || today();
    state.calSel = key; state.calMonth = monthOf(key);
    showPage('calendar', 'Календарь', '<div class="cx-calwrap"><section class="cx-cal gl" id="cxCal"></section><div class="cx-calp" id="cxCalSlot"><div class="cx-calday" id="cxCalDay"></div></div></div>');
    try { selectDate(key, false); } catch (e) {}
    moveInto($('calendarDayPanel'), $('cxCalSlot'));
    renderCal();
  }
  function renderCal() {
    var box = $('cxCal'); if (!box) return;
    var m0 = parseISO(state.calMonth), y = m0.getFullYear(), m = m0.getMonth(), t = today();
    var off = (new Date(y, m, 1, 12).getDay() + 6) % 7, cnt = new Date(y, m + 1, 0, 12).getDate(), total = Math.ceil((off + cnt) / 7) * 7, cells = '', big = desk();
    box.classList.toggle('big', big);
    for (var i = 0; i < total; i++) {
      var d = new Date(y, m, 1 - off + i, 12), k = dateISO(d), out = d.getMonth() !== m, nl = liveOf(k).length, ns = [], ch = false;
      try { ns = visibleNotes(k); } catch (e) {}
      try { ch = amendments.some(function (a) { return a.date === k || a.targetDate === k; }); } catch (e) {}
      var mod = ns.some(function (n) { return n.type === 'module'; }), hw = ns.some(function (n) { return n.type === 'homework'; });
      var lines = '';
      if (big && !out) { var ls = liveOf(k); lines = '<span class="cx-cl">' + ls.slice(0, 3).map(function (s) { return '<span style="' + kv(kindOf(s[0])) + '" title="' + esc(s[0].start + ' ' + namesOf(s).join(' / ')) + '"><i></i><span class="nm">' + esc(subjTitle(s[0].subject) || namesOf(s)[0]) + '</span></span>'; }).join('') + (ls.length > 3 ? '<span class="more">ещё ' + (ls.length - 3) + '</span>' : '') + '</span>'; }
      cells += '<button type="button" class="cx-cd' + (out ? ' out' : '') + (k === t ? ' t' : '') + (k === state.calSel ? ' sel' : '') + '" data-cal="d" data-d="' + k + '" aria-pressed="' + (k === state.calSel) + '" aria-label="' + esc(niceDate(k)) + (nl ? ', ' + plural(nl, 'пара', 'пары', 'пар') : '') + (mod ? ', модуль' : '') + (hw ? ', ДЗ' : '') + (ch ? ', изменение' : '') + '">' +
        '<b>' + d.getDate() + '</b><i>' + new Array(Math.min(nl, 4) + 1).join('<em></em>') + '</i><span>' + (mod ? '<u class="m"></u>' : '') + (hw ? '<u class="h"></u>' : '') + (ch ? '<u class="c"></u>' : '') + '</span>' + lines + '</button>';
    }
    box.innerHTML = '<div class="cx-calh"><button type="button" class="cx-ib gl" data-cal="m" data-n="-1" aria-label="Предыдущий месяц">' + ic('left') + '</button>' +
      '<div><h2>' + MONN[m] + ' ' + y + '</h2>' + (monthOf(t) !== state.calMonth ? '<button type="button" class="cx-today" data-cal="today">Сегодня</button>' : '<small>' + (big ? 'полоска — тип занятия, точки — записи' : 'точки — пары, цвет — записи') + '</small>') + '</div>' +
      '<button type="button" class="cx-ib gl" data-cal="m" data-n="1" aria-label="Следующий месяц">' + ic('right') + '</button></div>' +
      '<div class="cx-cw" aria-hidden="true">' + DOWS.map(function (x) { return '<span>' + x + '</span>'; }).join('') + '</div><div class="cx-cg">' + cells + '</div>' +
      '<div class="cx-leg"><span><u class="m"></u>Модуль</span><span><u class="h"></u>ДЗ</span><span><u class="c"></u>Изменение</span></div>';
    renderCalDay();
  }
  /* над панелью записей — пары выбранного дня и переход к нему */
  function renderCalDay() {
    var box = $('cxCalDay'); if (!box) return;
    var k = state.calSel, sl = lessonsFor(k);
    box.innerHTML = '<div class="cx-sh"><h2>' + esc(niceDate(k)) + '</h2><button type="button" data-cal="open" data-d="' + k + '">Открыть день ›</button></div>' +
      (sl.length ? cxRowsBrk(sl, k) : '<div class="cx-empty gl"><b>' + (dow(k) === 6 ? 'Воскресенье' : 'Пар нет') + '</b>' + (dateWeek(k) >= 1 && dateWeek(k) <= LAST_WEEK ? 'В этот день занятий нет' : 'Дата вне опубликованного расписания') + '</div>');
  }
  function calSelect(key) {
    setTimeout(saveView, 0);
    state.calSel = key; state.calMonth = monthOf(key);
    try { selectDate(key, false); } catch (e) {}
    renderCal();
  }
  function onCxPage(ev) {
    var r = ev.target.closest('#cxCalDay [data-cx="day"]');
    if (r) { state.dayFrom = 'calendar'; state.tab = 'day'; state.board = false; state.date = r.dataset.d; state.open = null; goHome(); return; }
    var sb = ev.target.closest('[data-sb]');
    if (sb) { haptic('sel'); statPick(+sb.dataset.sb); return; }
    var st = ev.target.closest('[data-st]');
    if (st) { state.noPush = true; try { showStats(+st.dataset.v); } finally { state.noPush = false; } return; }
    var m = ev.target.closest('[data-mod],[data-sr]');
    if (m) {
      var mv = m.dataset.mod || m.dataset.sr;
      if (mv === 'tab') { state.modTab = m.dataset.v; state.noPush = true; try { showModules(); } finally { state.noPush = false; } return; }
      if (mv === 'add') { var nd = nextStudy(addDays(today(), -1)); openEditorFor('module', null, nd ? nd.key : today()); return; }
      if (mv === 'f') { state.sf = m.dataset.v; m.parentNode.querySelectorAll('button').forEach(function (b) { b.setAttribute('aria-pressed', String(b === m)); }); renderSearchCx(); return; }
      if (mv === 'day') { state.dayFrom = state.page; state.tab = 'day'; state.board = false; state.date = m.dataset.d; state.open = null; goHome(); return; }
    }
    var a = ev.target.closest('[data-gp],[data-cal]'); if (!a) return;
    if (a.dataset.gp) {
      if (!gp) return;
      var k = a.dataset.gp, v = a.dataset.v;
      if (k === 'pick') return pickGroup(v);
      if (k === 'prog') { gp.prog = v; gp.course = null; gp.flow = null; }
      else if (k === 'course') { gp.course = v; gp.flow = null; }
      else if (k === 'flow') gp.flow = v;
      renderGroupPage();
      return;
    }
    var c = a.dataset.cal;
    if (c === 'open') { state.dayFrom = 'calendar'; state.tab = 'day'; state.board = false; state.date = a.dataset.d; state.open = null; goHome(); return; }
    if (c === 'd') calSelect(a.dataset.d);
    else if (c === 'today') calSelect(today());
    else if (c === 'm') { var d = parseISO(state.calMonth); state.calMonth = dateISO(new Date(d.getFullYear(), d.getMonth() + (+a.dataset.n), 1, 12)); renderCal(); }
  }
  /* старые кнопки «К расписанию», «К занятиям», «Открыть день» ведут на новые экраны */
  function bootCxHooks() {
    var sv = window.setView;
    if (typeof sv === 'function' && !sv.__kgcx) {
      var f = function (v) {
        if (state.page) {
          if (v === 'calendar') { showCal(typeof selectedDate !== 'undefined' ? selectedDate : null); return; }
          if (v === 'today' || v === 'schedule') { back(); return; }
        }
        return sv.apply(this, arguments);
      };
      f.__kgcx = true; window.setView = f;
    }
    window.showGroupChooser = function () { navigate('group'); };
    wrap('renderCalendar', function () {
      if (state.page !== 'calendar') return;
      if (typeof selectedDate !== 'undefined' && selectedDate && selectedDate !== state.calSel) { state.calSel = selectedDate; state.calMonth = monthOf(selectedDate); }
      renderCal();
    });
    $('kgPage').addEventListener('click', onCxPage);
    if (!curGroup()) showGroupPage(true);
    stat('open');
  }

  /* ---------- связка со старым приложением ---------- */
  function wrap(name, after) {
    try {
      var orig = window[name];
      if (typeof orig !== 'function' || orig.__kg) return;
      var f = function () { var r = orig.apply(this, arguments); try { after(); } catch (e) {} return r; };
      f.__kg = true; window[name] = f;
    } catch (e) {}
  }
  /* Группа из ссылки бота (?studyGroup=) не должна затирать группу, выбранную вручную */
  function rememberGroup() {
    try {
      var u = new URL(location.href), g = u.searchParams.get('studyGroup'), from = window.KG_URL_GROUP || g, cur = selectedStudyGroup;
      if (from && cur && from !== cur) localStorage.setItem('kg-group-override', JSON.stringify({ from: from, to: cur }));
      else if (from) localStorage.removeItem('kg-group-override');
      if (g && g !== cur) { u.searchParams.set('studyGroup', cur); history.replaceState(history.state, '', u); }
    } catch (e) {}
  }
  /* показать страницу после первой отрисовки (класс kg-boot ставится в <head>) */
  function bootDone() { try { if (window.kgBootDone) window.kgBootDone(); } catch (e) {} }
  function boot() {
    mount();
    wrap('render', renderSoon);
    wrap('applyTheme', applyTGTheme);
    wrap('newsRender', renderSoon);
    wrap('cloudLoadPermissions', renderSoon);
    (function () {
      var orig = window.cloudLoadPermissions;
      if (typeof orig !== 'function') { permsReady = true; return; }
      /* cloudLoadPermissions возвращает false при сбое загрузки ролей — тогда не «готово», а экран с повтором */
      var f = function () { var r = orig.apply(this, arguments); Promise.resolve(r).then(function (ok) { if (ok === false) permsFail(); else permsDone(); }, permsFail); return r; };
      f.__kg = true; window.cloudLoadPermissions = f;
    })();
    wrap('activateStudyGroup', function () { state.date = null; state.open = null; rememberGroup(); goHome(true); });
    bootCxHooks();
    applyTGTheme();
    render();
    bootDone();
    setInterval(function () { if (!state.page && !document.hidden) render(); }, 60000);
    document.addEventListener('visibilitychange', function () { if (!document.hidden && !state.page) render(); });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot); else boot();
})();
