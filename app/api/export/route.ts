import { NextRequest, NextResponse } from 'next/server';
import { chromium } from 'playwright';

export async function POST(req: NextRequest){
  const data = await req.json();
  const browser = await chromium.launch();
  const page = await browser.newPage();
  const html = `<!DOCTYPE html><html><body><h1>${data.title||''}</h1><img src="${data.scene}" style="max-width:100%"/>`+
    `<p>${data.notes||''}</p></body></html>`;
  await page.setContent(html);
  const pdf = await page.pdf({format:'A4'});
  await browser.close();
  return new NextResponse(pdf, { headers:{'Content-Type':'application/pdf'} });
}
