import puppeteer from 'puppeteer';
import fs from 'fs';

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  
  // Set viewport
  await page.setViewport({ width: 1280, height: 800 });

  page.on('console', msg => {
    console.log('BROWSER_LOG:', msg.text());
  });

  page.on('pageerror', err => {
    console.log('PAGE_ERROR:', err.toString());
  });

  try {
    console.log('Navigating to homepage...');
    await page.goto('http://localhost:5173/');
    await page.waitForSelector('body');

    console.log('Simulating login as user via UI...');
    await page.goto('http://localhost:5173/login');
    await page.waitForSelector('button');
    
    // Tìm button "Khách hàng" và click
    await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      const userBtn = buttons.find(b => b.textContent.includes('Khách hàng'));
      if (userBtn) userBtn.click();
    });

    console.log('Navigating to Booking Flow via SPA router...');
    await page.evaluate(() => {
      window.history.pushState({}, '', '/booking/1');
      window.dispatchEvent(new Event('popstate'));
    });
    
    // Wait for the booking page to render
    await new Promise(r => setTimeout(r, 2000));
    
    await new Promise(r => setTimeout(r, 2000));
    
    const content = await page.content();
    console.log('Page Title:', await page.title());
    console.log('Text content sample:', content.substring(0, 500));
    
    // Check specific strings
    const hasError = content.includes('Không tìm thấy phim');
    const hasSuccess = content.includes('Chọn ghế');
    
    console.log('Contains Error text?', hasError);
    console.log('Contains Success text?', hasSuccess);
    
    // Take screenshot
    await page.screenshot({ path: 'booking-flow.png' });
    console.log('Screenshot saved to booking-flow.png');
    
    // Dump full HTML to a file
    fs.writeFileSync('booking-flow.html', content);

  } catch (err) {
    console.error('TEST SCRIPT ERROR:', err);
  } finally {
    await browser.close();
  }
})();
