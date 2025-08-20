// app/api/export/route.ts
export const runtime = 'nodejs'; // Puppeteer работает только в Node.js рантайме

import { NextResponse } from 'next/server';
import puppeteer from 'puppeteer';
import fs from 'fs';
import path from 'path';

export async function POST(req: Request) {
  const { buildState, modules, accessories, options, screenshot } = await req.json();
  if (!buildState || buildState.isComplete !== true) {
    return new NextResponse('incomplete', { status: 400 });
  }

  const moduleMap: Record<string, any> = Object.fromEntries(modules.map((m: any) => [m.id, m]));
  const chainRows = buildState.chain.map((id: string, idx: number) => {
    const m = moduleMap[id];
    const size = `${m.bbox.width}×${m.bbox.depth}`;
    return `<tr><td>${idx + 1}</td><td>${m.sku}</td><td>${m.name}</td><td>${size}</td><td>${m.seatCount}</td></tr>`;
  }).join('');

  const accMap: Record<string, any> = Object.fromEntries(accessories.map((a: any) => [a.id, a]));
  const accCounts: Record<string, number> = {};
  for (const f of buildState.freeItems || []) {
    accCounts[f.accessoryId] = (accCounts[f.accessoryId] || 0) + 1;
  }
  const accRows = Object.entries(accCounts).map(([id, qty]) => {
    const a = accMap[id];
    const size = a.size || '';
    return `<tr><td>${a.name}</td><td>${size}</td><td>${qty}</td></tr>`;
  }).join('');

  const loadIcon = (p?: { icon: string }) => {
    if (!p?.icon) return '';
    try {
      const file = fs.readFileSync(path.join(process.cwd(), 'public', p.icon.replace(/^\//, '')));
      return `data:image/png;base64,${file.toString('base64')}`;
    } catch {
      return '';
    }
  };
  const logo = loadIcon({ icon: '/brand/destyle_gray_alfa.png' });
  const fabricIcon = loadIcon(options?.fabric);
  const legsIcon = loadIcon(options?.legs);
  const now = new Date();
  const dateStr = now.toISOString().split('T')[0];

  const html = `<!doctype html>
    <html><head><meta charset="utf-8"/><title>Spec</title></head>
    <body style="font-family: system-ui; padding:24px;">
      <div style="display:flex;align-items:center;gap:12px;">
        ${logo ? `<img src="${logo}" style="height:40px"/>` : ''}
        <h1 style="font-size:20px;">${buildState.modelId}</h1>
        ${fabricIcon ? `<img src="${fabricIcon}" style="height:24px"/>` : ''}
        ${legsIcon ? `<img src="${legsIcon}" style="height:24px"/>` : ''}
        <span style="margin-left:auto;font-size:12px;">${dateStr}</span>
      </div>
      <p style="margin:8px 0;">Ш×Г: ${buildState.totalSize.width}×${buildState.totalSize.depth} мм · Места: ${buildState.totalSeats}</p>
      <div><img src="${screenshot}" style="max-width:100%;"/></div>
      <h2>Модули</h2>
      <table border="1" cellpadding="4" cellspacing="0" style="border-collapse:collapse;width:100%;">
        <thead><tr><th>№</th><th>SKU</th><th>Название</th><th>Ш×Г</th><th>Места</th></tr></thead>
        <tbody>${chainRows}</tbody>
      </table>
      <h2>Аксессуары</h2>
      <table border="1" cellpadding="4" cellspacing="0" style="border-collapse:collapse;width:100%;">
        <thead><tr><th>Название</th><th>Размер</th><th>Qty</th></tr></thead>
        <tbody>${accRows}</tbody>
      </table>
    </body></html>`;

  const browser = await puppeteer.launch({ args: ['--no-sandbox', '--disable-setuid-sandbox'] });
  const page = await browser.newPage();
  await page.setContent(html, { waitUntil: 'networkidle0' });
  const pdfBuffer = await page.pdf({ format: 'A4', printBackground: true });
  await browser.close();

  return new NextResponse(new Uint8Array(pdfBuffer), {
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': 'attachment',
      'Cache-Control': 'no-store',
    },
  });
}

// По желанию: GET для быстрых ручных проверок в браузере
export async function GET() {
  return NextResponse.json({ ok: true, hint: 'POST сюда вернёт PDF' });
}
