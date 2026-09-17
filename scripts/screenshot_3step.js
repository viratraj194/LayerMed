const puppeteer = require('puppeteer');
const { spawn } = require('child_process');

(async () => {
    // Start Vite server
    const server = spawn('npm', ['run', 'dev'], { shell: true });

    server.stdout.on('data', (data) => {
        console.log(`Server: ${data}`);
    });

    server.stderr.on('data', (data) => {
        console.error(`Server Error: ${data}`);
    });

    // Give server time to start
    await new Promise(resolve => setTimeout(resolve, 5000));

    try {
        console.log('Launching browser...');
        const browser = await puppeteer.launch();
        const page = await browser.newPage();
        await page.setViewport({ width: 1920, height: 1080 });
        
        page.on('console', msg => console.log('PAGE LOG:', msg.text()));

        console.log('Navigating to http://localhost:5173...');
        await page.goto('http://localhost:5173', { waitUntil: 'networkidle0' });
        
        console.log('Waiting for WebGL to render...');
        await new Promise(resolve => setTimeout(resolve, 5000));
        
        // Scroll 0 (Top)
        console.log('Taking screenshot at scroll 0...');
        await page.screenshot({ path: 'screenshot_step1.png' });
        
        // Scroll 0.5 (Middle)
        console.log('Scrolling to middle...');
        await page.evaluate(() => {
            window.scrollTo(0, document.body.scrollHeight / 2);
        });
        await new Promise(resolve => setTimeout(resolve, 2000));
        console.log('Taking screenshot at scroll 0.5...');
        await page.screenshot({ path: 'screenshot_step2.png' });

        // Scroll 1.0 (Bottom)
        console.log('Scrolling to bottom...');
        await page.evaluate(() => {
            window.scrollTo(0, document.body.scrollHeight);
        });
        await new Promise(resolve => setTimeout(resolve, 2000));
        console.log('Taking screenshot at scroll 1.0...');
        await page.screenshot({ path: 'screenshot_step3.png' });
        
        console.log('Screenshots saved.');
        
        await browser.close();
    } catch (err) {
        console.error('Error taking screenshot:', err);
    } finally {
        server.kill();
        process.exit(0);
    }
})();
