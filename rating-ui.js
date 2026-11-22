(() => {
  const r = window.KsmuRating;
  const source = 'https://kazangmu.ru/sveden/files/air/O_tekuschem_kontrole_uspevaemosti_i_promeghutochnoi_attestacii_obuchayuschixsya.pdf';
  const state = { modulesMode:'mean', classesMode:'mean', attendanceMode:'visits',
    modules:'', classes:'', modulesList:[''], classesList:[''], total:'', attended:'', points:'', target:'90', forecast:'85' };
  const english = () => document.documentElement.lang === 'en';
  const l = (ru,en) => english() ? en : ru;
  const fmt = (n, rating = false) => new Intl.NumberFormat(english() ? 'en-GB' : 'ru-RU', rating
    ? {minimumFractionDigits:r.config.displayDecimals,maximumFractionDigits:r.config.displayDecimals}
    : {maximumFractionDigits:3}).format(rating ? r.display(n) : n);
  const attrs = s => s.replace(/[&"<>]/g, ch => ({'&':'&amp;','"':'&quot;','<':'&lt;','>':'&gt;'}[ch]));
  const labelAverage = () => l('Средний балл','Average score');
  const field = (key,label,placeholder,mode = 'decimal',visible = true) =>
    '<label class="kr-field"><span class="' + (visible ? '' : 'kg-sr') + '">' + label +
    '</span><input class="cx-in" data-score="' + key + '" inputmode="' + mode + '" value="' + attrs(state[key]) +
    '" placeholder="' + placeholder + '"></label>';
  function group(key,label,options) {
    return '<div class="kr-switch cx-sg" role="group" aria-label="' + label + '">' + options.map(([value,text]) =>
      '<button type="button" data-mode="' + key + '" data-choice="' + value + '" aria-pressed="' +
      (state[key] === value) + '">' + text + '</button>').join('') + '</div>';
  }
  function listFields(key) {
    const item = key === 'modules' ? l('Модуль','Module') : l('Оценка','Grade');
    return state[key+'List'].map((value,i) => '<div class="kr-entry"><label><span class="kg-sr">' + item + ' ' + (i+1) +
      '</span><input class="cx-in" inputmode="decimal" data-list="' + key + '" data-row="' + i + '" value="' + attrs(value) +
      '" placeholder="' + item + ' ' + (i+1) + '"></label><button type="button" data-remove="' + key +
      '" data-row="' + i + '" aria-label="' + l('Удалить: ','Remove: ') + item + ' ' + (i+1) + '">×</button></div>').join('');
  }
  function gradeBlock(key,n,title,max,listLabel,addLabel,example) {
    return '<section class="kr-block gl" aria-labelledby="kr-' + key + '"><div class="kr-heading"><h2 id="kr-' + key + '">' +
      n + '. ' + title + '</h2><span>' + l('из ','out of ') + max + '</span></div>' +
      group(key+'Mode',title,[['mean',labelAverage()],['list',listLabel]]) +
      '<div data-panel="' + key + ':mean">' + field(key,title,example,'decimal',false) + '</div>' +
      '<div data-panel="' + key + ':list"><div class="kr-entries" data-entries="' + key + '">' + listFields(key) +
      '</div><div class="kr-inline"><button class="kr-add cx-btn g" type="button" data-add="' + key + '">+ ' + addLabel +
      '</button><span>' + labelAverage() + ' <strong data-average="' + key + '">—</strong></span></div>' +
      (key === 'modules' ? '<p class="kr-hint">' + l('Простое среднее — прогноз. Кафедра может учитывать итоговый тест или применять другие веса.',
        'The arithmetic mean is an estimate. Your department may include a final test or use different weights.') + '</p>' : '') + '</div></section>';
  }
  function shell() {
    return '<div class="kr" id="kgRating" data-own-locale><p class="kr-intro">' +
      l('Узнайте, сколько баллов нужно набрать на экзамене.','Find out what score you need on the exam.') + '</p>' +
      gradeBlock('modules',1,l('Оценки за модули','Module scores'),100,l('По модулям','By module'),l('Добавить модуль','Add module'),'85') +
      gradeBlock('classes',2,l('Оценки за занятия','Class grades'),10,l('Все оценки','All grades'),l('Добавить оценку','Add grade'),l('7,5','7.5')) +
      '<section class="kr-block gl" aria-labelledby="kr-attendance"><div class="kr-heading"><h2 id="kr-attendance">3. ' +
      l('Посещаемость','Attendance') + '</h2><span>' + l('до 10 баллов','up to 10 points') + '</span></div>' +
      group('attendanceMode',l('Посещаемость','Attendance'),[['visits',l('По посещениям','By attendance')],['points',l('Готовые баллы','Awarded points')]]) +
      '<div data-panel="attendance:visits"><div class="kr-pair">' +
      field('total',l('Всего занятий','Total classes'),'20','numeric') + field('attended',l('Посещено','Attended'),'18','numeric') +
      '</div><div class="kr-inline"><span>' + l('Посещаемость','Attendance') + ' <strong id="krPercent">—</strong></span>' +
      '<strong id="krPoints">— / 10</strong></div><p class="kr-hint">' + l('Предварительный расчёт. Фактические баллы могут отличаться.',
        'This is an estimate. Your awarded points may differ.') + '</p></div><div data-panel="attendance:points">' +
      field('points',l('Начисленные баллы, от 0 до 10','Awarded points, 0 to 10'),'10','decimal',false) + '</div></section>' +
      '<section class="kr-block gl" aria-labelledby="kr-target"><div class="kr-heading"><h2 id="kr-target">4. ' +
      l('Какой итоговый рейтинг хотите получить?','What final rating are you aiming for?') + '</h2></div><div class="kr-target">' +
      [70,80,90].map(n => '<button type="button" data-target="' + n + '">' + n + '+</button>').join('') +
      field('target',l('Желаемый рейтинг, от 0 до 100','Target rating, 0 to 100'),'90','decimal',false) + '</div></section>' +
      '<section class="kr-result gl" aria-live="polite" aria-atomic="true" id="krResult"></section>' +
      '<section class="kr-block kr-forecast gl" aria-labelledby="kr-forecast"><div class="kr-heading"><label id="kr-forecast" for="krRange">' +
      l('А если я получу на экзамене…','What if I score…') + '</label><strong id="krExam"></strong></div>' +
      '<input id="krRange" data-score="forecast" type="range" min="0" max="100" step="1" value="' + state.forecast + '">' +
      '<div class="kr-inline"><span>' + l('Итоговый рейтинг','Final rating') + '</span><strong id="krForecast"></strong></div></section>' +
      '<p class="kr-source">' + l('Расчёт основан на балльно-рейтинговой системе КГМУ и носит информационный характер. Фактические результаты могут отличаться в зависимости от методики кафедры.',
      'This estimate uses the KSMU points and rating system. Actual results may differ depending on your department’s method.') +
      ' <a data-ext href="' + source + '" target="_blank" rel="noopener">' + l('Положение КГМУ','KSMU regulations') + '</a></p></div>';
  }
  function calculate(root) {
    const q = s => root.querySelector(s);
    root.querySelectorAll('[data-panel]').forEach(panel => {
      const [key, mode] = panel.dataset.panel.split(':');
      panel.hidden = state[key+'Mode'] !== mode;
    });
    root.querySelectorAll('[data-mode]').forEach(button => {
      button.setAttribute('aria-pressed', String(state[button.dataset.mode] === button.dataset.choice));
    });
    const target = r.parse(state.target);
    root.querySelectorAll('[data-target]').forEach(button => button.setAttribute('aria-pressed',String(+button.dataset.target === target)));
    root.querySelectorAll('[aria-invalid]').forEach(input => input.removeAttribute('aria-invalid'));
    let error = '';
    const check = (input, value, valid, message) => {
      if (value !== null && !valid) {
        input.setAttribute('aria-invalid','true');
        error ||= message;
      }
      return valid ? value : null;
    };
    function grade(key,max,message) {
      const scores = state[key+'List'].map(r.parse);
      const mean = r.average(scores,max);
      q('[data-average="' + key + '"]').textContent = mean === null ? '—' : fmt(mean);
      if (state[key+'Mode'] === 'list') {
        scores.forEach((score,i) => check(q('[data-list="' + key + '"][data-row="' + i + '"]'),score,r.valid(score,max),message));
        return mean;
      }
      const score = r.parse(state[key]);
      return check(q('[data-score="' + key + '"]'),score,r.valid(score,max),message);
    }
    const modules = grade('modules',100,l('Оценки за модули должны быть от 0 до 100.','Module scores must be between 0 and 100.'));
    const classes = grade('classes',10,l('Оценки за занятия должны быть от 0 до 10.','Class grades must be between 0 and 10.'));
    const total = r.parse(state.total), attended = r.parse(state.attended);
    const estimate = r.attendance(total,attended);
    q('#krPercent').textContent = estimate === null ? '—' : fmt(estimate * 10) + '%';
    q('#krPoints').textContent = (estimate === null ? '—' : fmt(estimate,true)) + ' / 10';
    let points = estimate;
    if (state.attendanceMode === 'visits') {
      check(q('[data-score="total"]'),total,Number.isSafeInteger(total) && total > 0,
        l('Укажите целое число занятий больше нуля.','Enter a whole number of classes greater than zero.'));
      check(q('[data-score="attended"]'),attended,Number.isSafeInteger(attended) && attended >= 0 &&
        (!(total > 0) || attended <= total),l('Число посещений должно быть целым и не больше общего числа занятий.',
          'Attendance must be a whole number and cannot exceed the total classes.'));
    } else {
      points = r.parse(state.points);
      points = check(q('[data-score="points"]'),points,r.valid(points,10),
        l('Баллы посещаемости должны быть от 0 до 10.','Attendance points must be between 0 and 10.'));
    }
    check(q('[data-score="target"]'),target,r.valid(target,100),
      l('Желаемый рейтинг должен быть от 0 до 100.','The target rating must be between 0 and 100.'));
    const base = r.semester(modules,classes,points);
    const required = r.requiredExam(base,target);
    const max = r.final(base,100);
    const forecast = r.final(base,+state.forecast);
    q('#krExam').textContent = state.forecast + ' / 100';
    q('#krForecast').textContent = (forecast === null ? '—' : fmt(forecast,true)) + ' / 100';
    const mainLabel = l('Необходимо набрать на экзамене','Required exam score');
    let body = '<h2>' + mainLabel + '</h2>';
    if (error || required === null) {
      body += '<p>' + (error || l('Заполните оценки, посещаемость и желаемый рейтинг.',
        'Enter your grades, attendance and target rating.')) + '</p>';
    } else {
      if (required === Infinity) {
        body = '<h2 class="kr-impossible">' + l('Цель недостижима','Target unreachable') + '</h2><p>' +
          l('Максимальный итоговый рейтинг при экзамене на 100 — ','The maximum final rating with an exam score of 100 is ') + fmt(max,true) + '.</p>';
      } else {
        body += '<div class="kr-score">' + required + ' <span>/ 100</span></div><p>' +
          l('Чтобы получить итоговый рейтинг ','To reach a final rating of ') + fmt(target) + '.</p>';
      }
      body += '<dl class="kr-stats"><div><dt>' + l('Баллы за семестр','Semester points') + '</dt><dd>' + fmt(base,true) +
        '</dd></div><div><dt>' + l('Максимальный итоговый рейтинг','Maximum final rating') + '</dt><dd>' + fmt(max,true) + '</dd></div></dl>';
      if (required < r.config.examPass) body += '<p class="kr-hint">' +
        l('Это математический минимум. Для сдачи экзамена ориентируйтесь на отдельный порог ',
          'This is the mathematical minimum. For passing the exam, use the separate threshold of ') + r.config.examPass +
        l(' баллов и уточните его на кафедре.',' points and confirm it with your department.') + '</p>';
    }
    const result = q('#krResult');
    if (result.innerHTML !== body) result.innerHTML = body;
  }
  function mount() {
    const old = document.getElementById('kgRating');
    if (!old) return;
    old.outerHTML = shell();
    const root = document.getElementById('kgRating');
    root.addEventListener('input', e => {
      const input = e.target;
      if (input.dataset.score) state[input.dataset.score] = input.value;
      else if (input.dataset.list) state[input.dataset.list+'List'][+input.dataset.row] = input.value;
      else return;
      calculate(root);
    });
    root.addEventListener('click', e => {
      const button = e.target.closest('button');
      if (!button) return;
      const {mode,choice,target,add,remove,row} = button.dataset;
      if (mode) state[mode] = choice;
      else if (target) {
        state.target = target;
        root.querySelector('[data-score="target"]').value = target;
      } else if (add || remove) {
        const key = add || remove;
        const list = state[key+'List'];
        if (add) list.push('');
        else list.splice(+row,1);
        root.querySelector('[data-entries="' + key + '"]').innerHTML = listFields(key);
        const next = add ? list.length - 1 : Math.min(+row,list.length-1);
        (root.querySelector('[data-list="' + key + '"][data-row="' + next + '"]') ||
          root.querySelector('[data-add="' + key + '"]')).focus();
      }
      calculate(root);
    });
    calculate(root);
  }
  window.KsmuRatingPage = { shell, mount };
  document.addEventListener('kg-language',mount);
})();
