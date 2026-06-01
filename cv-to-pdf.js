const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');
const url = require('url');

const [,, inputFile = 'cv-pdf.html', outputFile = 'cv-es.pdf'] = process.argv;

const defaultStyles = `
      @page {
        margin: 28px 12px 28px 12px;
      }
      @page :first {
        margin-top: 12px;
      }
      body {
        margin: 0;
        padding: 0;
        background: #fff;
      }
      .cv-container {
        max-width: 100%;
        margin: 0;
        background: #fff;
        font-family: "Segoe UI", Arial, sans-serif;
        color: #222;
        box-shadow: none;
        border-radius: 0;
        overflow: hidden;
      }
      .cv-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        background: #181818;
        color: #fff;
        padding: 32px 40px 24px 40px;
      }
      .cv-header-info h1 {
        font-size: 2rem;
        margin: 0 0 12px 0;
        font-weight: bold;
      }
      .cv-header-list {
        list-style: none;
        padding: 0;
        margin: 0;
        display: flex;
        flex-wrap: wrap;
        max-width: 420px;
        font-size: 0.95rem;
      }
      .cv-header-list li {
        display: flex;
        align-items: center;
        gap: 4px;
        width: 50%;
        box-sizing: border-box;
        margin-bottom: 4px;
      }
      .cv-header-list li:nth-child(odd) {
        padding-right: 12px;
      }
      .cv-header-list li:nth-child(3),
      .cv-header-list li:nth-child(4) {
        margin-top: 4px;
      }
      .cv-header-photo {
        width: 110px;
        height: 110px;
        border-radius: 50%;
        overflow: hidden;
        border: 4px solid #fff;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        background: #fff;
        display: flex;
        align-items: center;
        justify-content: center;
      }
      .cv-header-photo img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
      .cv-header-list .icon {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        margin-right: 6px;
        vertical-align: middle;
      }
      .cv-main {
        display: flex;
        flex-direction: row;
        gap: 24px;
        padding: 28px 28px 32px 28px;
      }
      .cv-main-left {
        flex: 1;
        min-width: 0;
      }
      .cv-main-right {
        flex: 1;
        min-width: 220px;
        margin-left: 24px;
        display: flex;
        flex-direction: column;
        gap: 10px;
      }
      .cv-profile h2,
      .cv-education h2,
      .cv-experience h2,
      .cv-skills h2,
      .cv-hobbies h2 {
        color: #2a4cff;
        font-size: 1.2rem;
        margin-bottom: 12px;
        margin-top: 0;
      }
      .cv-profile p {
        margin-top: 0;
        font-size: 1rem;
        color: #222;
      }
      .cv-education-item,
      .cv-experience-item {
        margin-bottom: 18px;
      }
      .cv-education-item span,
      .cv-experience-item span {
        font-size: 0.95rem;
        color: #888;
        display: block;
      }
      .cv-education-item strong,
      .cv-experience-item strong {
        font-size: 1.05rem;
        display: block;
        margin-bottom: 4px;
      }
      .cv-experience-item p,
      .experience-details,
      .education-details {
        margin: 0;
        font-size: 0.98rem;
        color: #222;
      }
      .cv-experience-item ul,
      .experience-details {
        margin: 0;
        padding-left: 18px;
      }
      .cv-experience-item li {
        margin-bottom: 6px;
        list-style: disc;
      }
      .cv-skills-group h3 {
        font-size: 1.2rem;
        margin: 12px 0 6px 0;
        color: #222;
      }
      .cv-skills-group {
        margin-bottom: 18px;
      }
      .cv-skill-bar {
        display: flex;
        align-items: center;
        gap: 10px;
        margin-bottom: 8px;
      }
      .cv-skill-bar span {
        flex: 1 0 90px;
        font-size: 0.98rem;
      }
      .cv-skill-bar .bar {
        flex: 2 1 120px;
        height: 8px;
        background: #e0e0e0;
        border-radius: 6px;
        overflow: hidden;
        position: relative;
      }
      .cv-skill-bar .fill {
        height: 100%;
        background: linear-gradient(90deg, #2a4cff 60%, #4f8cff 100%);
        border-radius: 6px 0 0 6px;
      }
      p.education-details,
      p.experience-details {
        margin-top: 4px;
      }
      em {
        display: inline-block;
        font-style: italic;
        margin-top: 4px;
      }
      ul.experience-details {
        margin-top: 8px;
      }
    `;

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  const inputPath = path.resolve(process.cwd(), inputFile);
  let htmlContent = fs.readFileSync(inputPath, 'utf8');

  const isFullDocument = /<html[\s>]/i.test(htmlContent) || /<!doctype html>/i.test(htmlContent);

  if (!isFullDocument) {
    htmlContent = `<!doctype html>
<html lang="es">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>CV Industrial - Diego Fernando Avila Gómez</title>
    <style>${defaultStyles}</style>
  </head>
  <body>${htmlContent}</body>
</html>`;
    await page.setContent(htmlContent, { waitUntil: 'networkidle' });
  } else {
    await page.goto(url.pathToFileURL(inputPath).href, { waitUntil: 'networkidle' });
  }

  await page.emulateMedia({ media: 'print' });
  await page.pdf({
    path: outputFile,
    format: 'A4',
    printBackground: true,
    margin: { top: '0px', bottom: '0px', left: '0px', right: '0px' }
  });
  await browser.close();
  console.log(`PDF generado en ${outputFile}`);
})();
