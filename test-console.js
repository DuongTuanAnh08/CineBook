import puppeteer from 'puppeteer';

(async () => {
  console.log("Starting Puppeteer...");
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  
  page.on('console', msg => {
    if (msg.type() === 'error' || msg.type() === 'warning') {
      console.log(`[PAGE CONSOLE ${msg.type().toUpperCase()}] ${msg.text()}`);
    }
  });
  
  page.on('pageerror', error => {
    console.log(`[PAGE ERROR] ${error.message}`);
  });

  try {
    console.log("Navigating to /admin/settings...");
    await page.goto('http://localhost:5173/admin/settings', { waitUntil: 'networkidle0' });
    console.log("Navigated to /admin/settings");
    
    console.log("Navigating to /booking?movie=1...");
    await page.goto('http://localhost:5173/booking?movie=1', { waitUntil: 'networkidle0' });
    console.log("Navigated to /booking");

    console.log("Navigating to /login...");
    await page.goto('http://localhost:5173/login', { waitUntil: 'networkidle0' });
    console.log("Navigated to /login");
  } catch (err) {
    console.error("Script error:", err);
  } finally {
    await browser.close();
    console.log("Done.");
  }
})();
