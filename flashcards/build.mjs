#!/usr/bin/env node
import { readFileSync, writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dir = dirname(fileURLToPath(import.meta.url));
const questionsDir = join(__dir, '../questions/pl');

const CATEGORIES = [
  { file: '1-jvm.md',          id: 'jvm',    label: 'Java / JVM' },
  { file: '2-spring.md',       id: 'spring', label: 'Spring Boot' },
  { file: '3-db.md',           id: 'db',     label: 'Bazy Danych / JPA' },
  { file: '4-architecture.md', id: 'arch',   label: 'Architektura' },
  { file: '5-microservices.md',id: 'micro',  label: 'Mikroserwisy' },
  { file: '6-communication.md',id: 'comm',   label: 'Komunikacja' },
  { file: '7-devops.md',       id: 'devops', label: 'DevOps / Kubernetes' },
  { file: '8-security.md',     id: 'sec',    label: 'Bezpieczeństwo' },
  { file: '9-testing.md',      id: 'test',   label: 'Testowanie' },
  { file: '10-performance.md', id: 'perf',   label: 'Performance' },
  { file: '11-system-design.md',id:'sys',    label: 'System Design' },
  { file: '12-public-api.md',  id:'api',    label: 'Public API Design' },
];

function stripHtmlTags(text) {
  // Keep inner text of span tags, remove the tags themselves
  return text.replace(/<span[^>]*>([^<]*)<\/span>/g, '$1');
}

function parseCards(content, catId) {
  // Match all question headers: #### 🔹 N. Question text
  const headerRe = /^#### 🔹 \d+\.?\s+(.+)$/gm;
  const headers = [...content.matchAll(headerRe)];

  const cards = [];
  for (let i = 0; i < headers.length; i++) {
    const question = headers[i][1].trim();

    const bodyStart = headers[i].index + headers[i][0].length + 1;
    const bodyEnd = i + 1 < headers.length ? headers[i + 1].index : content.length;
    let answer = content.slice(bodyStart, bodyEnd);

    // Remove the "✅ <span...>Odpowiedź</span>" line (first occurrence)
    answer = answer.replace(/✅ <span[^>]*>[^<]*<\/span>\n\n?/, '');
    // Strip remaining HTML spans throughout the answer
    answer = stripHtmlTags(answer);
    // Remove trailing separator
    answer = answer.replace(/\n?---\s*$/, '').trim();

    if (!question || !answer) continue;

    cards.push({ id: `${catId}-${i}`, q: question, a: answer });
  }

  return cards;
}

const categories = [];
let totalCards = 0;

for (const cat of CATEGORIES) {
  const filepath = join(questionsDir, cat.file);
  let content;
  try {
    content = readFileSync(filepath, 'utf8');
  } catch {
    console.warn(`Skipping ${cat.file} (not found)`);
    continue;
  }

  const cards = parseCards(content, cat.id);
  totalCards += cards.length;
  console.log(`${cat.file}: ${cards.length} cards`);
  categories.push({ id: cat.id, label: cat.label, cards });
}

writeFileSync(
  join(__dir, 'data.json'),
  JSON.stringify({ categories }, null, 2),
  'utf8'
);
console.log(`\n✓ data.json: ${totalCards} cards total`);
