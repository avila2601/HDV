const fs=require('fs');
const { PDFDocument } = require('pdf-lib');
(async()=>{
  const input = 'C:\\Users\\Asus\\Downloads\\cv-component.pdf';
  const bytes = fs.readFileSync(input);
  const pdfDoc = await PDFDocument.load(bytes);
  let pages = pdfDoc.getPages();
  console.log('Initial pages:', pages.length);
  
  if (pages.length > 2) {
    const lastPage = pages[pages.length - 1];
    pdfDoc.removePage(lastPage);
    pages = pdfDoc.getPages();
    console.log('After removal:', pages.length);
  }
  
  const outBytes = await pdfDoc.save();
  fs.writeFileSync(input, outBytes);
  console.log('PDF saved with', pdfDoc.getPages().length, 'pages');
})().catch(err=>{console.error('Error:', err.message); process.exit(1);});
