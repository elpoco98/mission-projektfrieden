'use strict';
const { test, before, after } = require('node:test');
const assert = require('node:assert/strict');
const { spawn } = require('node:child_process');
const path = require('node:path');
let child, address;
before(async () => {
  child = spawn(process.execPath, ['server.cjs'], { cwd: path.join(__dirname, '..'), env: { ...process.env, PORT: '0' }, stdio: ['ignore', 'pipe', 'pipe'] });
  address = await new Promise((resolve, reject) => {
    const timer = setTimeout(() => reject(Error('Server startet nicht rechtzeitig.')), 5000);
    child.on('error', err => { clearTimeout(timer); reject(err); });
    child.stdout.on('data', data => {
      const match = data.toString().match(/http:\/\/127\.0\.0\.1:\d+/);
      if (match) { clearTimeout(timer); resolve(match[0]); }
    });
  });
});
after(() => child?.kill());

test('Startseite und alle eingebundenen Dateien sind erreichbar', async () => {
  const page = await fetch(address); assert.equal(page.status, 200);
  assert.match(page.headers.get('content-type'), /text\/html/);
  const html = await page.text();
  for (const match of html.matchAll(/(?:src|href)="(\.\/src\/[^"]+)"/g)) {
    const res = await fetch(new URL(match[1], address)); assert.equal(res.status, 200, match[1]);
    assert.ok((await res.text()).length > 0);
  }
  assert.match(page.headers.get('content-security-policy'), /connect-src 'none'/);
});
test('CSS, JavaScript und SVG haben passende MIME-Typen', async () => {
  for (const [file, type] of [['src/style.css', 'text/css'], ['src/app.js', 'text/javascript'], ['src/favicon.svg', 'image/svg+xml']]) {
    const res = await fetch(`${address}/${file}`); assert.ok(res.headers.get('content-type').startsWith(type));
  }
});
test('Unbekannte Dateien, versteckte Pfade und Schreibmethoden werden abgelehnt', async () => {
  assert.equal((await fetch(`${address}/existiert-nicht`)).status, 404);
  assert.equal((await fetch(`${address}/.git/config`)).status, 403);
  assert.equal((await fetch(`${address}/%2e%2e%2fpackage.json`)).status, 403);
  assert.equal((await fetch(address, { method: 'POST', body: 'test' })).status, 405);
});
test('HEAD liefert Header ohne Seiteninhalt', async () => {
  const res = await fetch(address, { method: 'HEAD' }); assert.equal(res.status, 200); assert.equal(await res.text(), '');
});
