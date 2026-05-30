import puppeteer from 'puppeteer';

(async () => {
  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();

  page.on('console', msg => {
    const type = msg.type();
    if (type === 'error' || type === 'warning') {
        console.log(`[BROWSER ${type.toUpperCase()}] ${msg.text()}`);
    }
  });

  page.on('pageerror', err => {
    console.log(`[BROWSER PAGEERROR] ${err.toString()}`);
  });

  try {
    console.log('Navigating to http://localhost:5173/login...');
    await page.goto('http://localhost:5173/login', { waitUntil: 'networkidle2' });
    await new Promise(r => setTimeout(r, 2000));
    console.log('Finished testing login page.');
    
    console.log('Navigating to http://localhost:5173/news...');
    await page.goto('http://localhost:5173/news', { waitUntil: 'networkidle2' });
    await new Promise(r => setTimeout(r, 2000));
    console.log('Finished testing news page.');
    
  } catch (error) {
    console.error('Puppeteer Script Error:', error);
  } finally {
    await browser.close();
  }
})();
