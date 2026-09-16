import assert from 'node:assert/strict';
import fs from 'node:fs';
import {calculateRelations,relationEvidence} from './relations.js';
const unit=(id,concepts,references=[])=>({id,concepts,references});
const cs=(ds,id)=>({id,documents:ds.filter(d=>d.concepts.includes(id)).map(d=>d.id),frequency:ds.filter(d=>d.concepts.includes(id)).length});
// No citations: geometric bidirectional probability must reduce to Ochiai.
const d=[unit('1',['A','B']),unit('2',['A']),unit('3',['B']),unit('4',['B'])];
const e=calculateRelations(d,[cs(d,'A'),cs(d,'B')])[0];assert.ok(Math.abs(e.score-1/Math.sqrt(6))<1e-12);
// One-way cross-reference alone does not invent symmetric support.
const one=[unit('a',['A'],['b']),unit('b',['B'])];assert.equal(calculateRelations(one,[cs(one,'A'),cs(one,'B')]).length,0);
// Mutual references, counted once, produce 1/2 each direction.
const mutual=[unit('a',['A'],['b','b']),unit('b',['B'],['a'])];const both=calculateRelations(mutual,[cs(mutual,'A'),cs(mutual,'B')])[0];assert.equal(both.score,.5);assert.equal(both.evidenceAB[0].denominator,2);
const data=JSON.parse(fs.readFileSync('graph-data.json')),tasks=JSON.parse(fs.readFileSync('exam-data.json'));
assert.equal(tasks.length,25);assert.equal(new Set(tasks.map(t=>t.id)).size,25);
assert.equal(new Set(data.documents.map(d=>d.id)).size,data.documents.length);
assert.ok(data.documents.some(d=>d.label==='Celestial Lines'));assert.ok(data.documents.some(d=>d.label==='Coordinate Transformation'));
for(const n of ['O5','O6','O8','O9'])assert.ok(data.documents.some(d=>d.label==='IOAA 2022 · Question '+n));
assert.ok(!data.documents.some(d=>/How OBS Marking Works|Determining Limiting Magnitude/.test(d.label)));
assert.equal(data.documents.filter(d=>d.subsection==='IOAA 2025 Grid-style').length,9);
assert.ok(data.documents.find(d=>d.label==='INAO · 2018').text.includes('11 days prior'));
assert.ok(!data.documents.find(d=>d.label==='INAO · 2018').text.includes('Observation of Planets in the night sky is pretty easy'));
const relations=calculateRelations(data.documents,data.concepts);assert.ok(relations.every(e=>e.score>0&&e.score<=1));
assert.equal(data.concepts.find(c=>c.key==='orbital-period').frequency,0);assert.equal(data.concepts.find(c=>c.key==='ring-geometry').frequency,0);
const before=JSON.stringify(relations);tasks.splice(0);assert.equal(JSON.stringify(calculateRelations(data.documents,data.concepts)),before);
for(const c of data.concepts)assert.equal(c.frequency,c.documents.length);
const source=fs.readFileSync('graph.html','utf8');assert.ok(!source.includes('function buildGraph'));assert.ok(source.includes('graph-engine-v8.js'));
console.log('PASS: formula identities, citation direction, deduplication, complete task IDs, parser regressions, concept disambiguation, and exam independence');
