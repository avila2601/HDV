const { chromium } = require('playwright');
const path = require('path');
const url = require('url');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  const filePath = path.resolve(process.cwd(), 'cv-pdf.html');
  await page.goto(url.pathToFileURL(filePath).href, { waitUntil: 'networkidle' });
  await page.emulateMedia({ media: 'print' });
  await page.pdf({
    path: 'cv-es.pdf',
    format: 'A4',
    printBackground: true,
    margin: { top: '0px', bottom: '0px', left: '0px', right: '0px' }
  });
  await browser.close();
  console.log('PDF generado en cv-es.pdf');
})();
