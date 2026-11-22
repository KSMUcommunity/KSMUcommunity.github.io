(function (root) {
  const config = Object.freeze({
    modulesWeight: .35,
    examWeight: .45,
    // Preview assumption. Confirm the exam threshold and display rounding with KSMU.
    examPass: 70,
    displayDecimals: 1
  });
  const epsilon = 1e-9;
  const valid = (n, max) => Number.isFinite(n) && n >= 0 && n <= max;
  function parse(value) {
    const text = value.trim();
    if (!text) return null;
    return /^(?:\d+(?:[.,]\d*)?|[.,]\d+)$/.test(text) ? Number(text.replace(',', '.')) : NaN;
  }
  function average(scores, max) {
    return scores.length && scores.every(n => valid(n, max)) ? scores.reduce((sum, n) => sum + n, 0) / scores.length : null;
  }
  function attendance(total, attended) {
    return Number.isSafeInteger(total) && total > 0 && Number.isSafeInteger(attended) && valid(attended, total)
      ? 10 * attended / total : null;
  }
  function semester(modules, classes, points) {
    return valid(modules,100) && valid(classes,10) && valid(points,10)
      ? config.modulesWeight * modules + classes + points : null;
  }
  function final(base, exam) {
    return valid(base,55) && valid(exam,100) ? base + config.examWeight * exam : null;
  }
  function requiredExam(base, target) {
    if (!valid(base,55) || !valid(target,100)) return null;
    if (final(base,100) + epsilon < target) return Infinity;
    let score = Math.max(0, Math.ceil((target - base) / config.examWeight - epsilon));
    if (final(base,score) + epsilon < target) score++;
    return score <= 100 ? score : Infinity;
  }
  function display(n) {
    const s = 10 ** config.displayDecimals;
    return Math.round((n + epsilon) * s) / s;
  }
  const api = { config, valid, parse, average, attendance, semester, final, requiredExam, display };
  if (typeof module !== 'undefined') module.exports = api;
  else root.KsmuRating = api;
})(globalThis);
