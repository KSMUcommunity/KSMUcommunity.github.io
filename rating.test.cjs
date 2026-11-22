const { test } = require('node:test');
const a = require('node:assert/strict');
const r = require('./rating.js');

test('example 1: separate modules and the minimum whole exam score', () => {
  const modules = r.average([80,85,90],100);
  a.equal(modules,85);
  const base = r.semester(modules,7.5,10);
  a.equal(r.requiredExam(base,90),95);
  a.equal(r.final(base,95),90);
  a.ok(r.final(base,94)<90);
});
test('example 2: maximum is 92.25 and displays as 92.3', () => {
  const base = r.semester(85,7.5,10);
  a.equal(r.final(base,100),92.25);
  a.equal(r.display(r.final(base,100)),92.3);
  a.equal(r.final(base,85),85.5);
});
test('example 3: target 90 is unreachable with a maximum of 80', () => {
  const base = r.semester(60,6,8);
  a.equal(r.requiredExam(base,90),Infinity);
  a.equal(r.final(base,100),80);
});
test('thresholds and decimal target require a whole score that actually meets the target', () => {
  const base = r.semester(100,10,10);
  for (const target of [69.9,70,70.1,79.9,80,80.1,89.9,90,90.1,93.5,100]) {
    const exam = r.requiredExam(base,target);
    a.ok(r.final(base,exam) >= target - 1e-9);
    a.ok(r.final(base,exam-1) < target);
  }
  a.equal(r.requiredExam(base,55),0);
});
test('rounding does not decide whether a target is reachable', () => {
  a.equal(r.display(89.95),90);
  a.equal(r.requiredExam(44.95,90),Infinity);
});
test('blank, real zero, decimal separator and malformed scores', () => {
  a.equal(r.parse(''),null);
  a.equal(r.parse('0'),0);
  a.equal(r.parse('7,5'),7.5);
  a.equal(r.parse('7.5'),7.5);
  a.ok(Number.isNaN(r.parse('7,5.1')));
  a.equal(r.average([0,10],10),5);
  a.equal(r.average([null,10],10),null);
  a.equal(r.average([101],100),null);
  a.equal(r.semester(80,11,0),null);
});
test('attendance rejects invalid totals, counts and division by zero', () => {
  a.equal(r.attendance(20,18),9);
  a.equal(r.attendance(20,0),0);
  for (const [total,attended] of [[0,0],[20,21],[20,2.5],[10,null],[null,2]]) {
    a.equal(r.attendance(total,attended),null);
  }
});
