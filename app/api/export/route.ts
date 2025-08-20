// app/api/export/route.ts
export const runtime = 'nodejs'; // Puppeteer работает только в Node.js рантайме

import { NextResponse } from 'next/server';
import puppeteer from 'puppeteer';

export async function POST(req: Request) {
  // Тут можешь разобрать payload, если отправляешь BuildState с клиента:
  // const data = await req.json();

  const browser = await puppeteer.launch({
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });
  const page = await browser.newPage();

  // Простейший HTML-шаблон для проверки — позже подставим реальную разметку
  const html = `
    <html>
      <head><meta charset="utf-8"><title>Spec</title></head>
      <body style="font-family: system-ui; padding: 24px;">
        <h1>Конфигуратор диванов — PDF тест</h1>
        <p>Если ты это видишь — экспорт работает.</p>
      </body>
    </html>`;
  await page.setContent(html, { waitUntil: 'networkidle0' });

  const pdfBuffer = await page.pdf({ format: 'A4', printBackground: true });
  await browser.close();

  // ВАЖНО: отдаём не Buffer напрямую, а Uint8Array / ArrayBuffer
  return new NextResponse(new Uint8Array(pdfBuffer), {
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': 'attachment; filename="sofa.pdf"',
      'Cache-Control': 'no-store',
    },
  });
}

// По желанию: GET для быстрых ручных проверок в браузере
export async function GET() {
  return NextResponse.json({ ok: true, hint: 'POST сюда вернёт PDF' });
}
