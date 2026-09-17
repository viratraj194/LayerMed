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
        
        console.log('Navigating to http://localhost:5173...');
        // Go to localhost and wait for network to be idle
        await page.goto('http://localhost:5173', { waitUntil: 'networkidle0' });
        
        console.log('Waiting for WebGL to render...');
        // Wait an additional few seconds for WebGL and GSAP to render
        await new Promise(resolve => setTimeout(resolve, 5000));
        
        console.log('Scrolling to bottom...');
        await page.evaluate(() => {
            window.scrollTo(0, document.body.scrollHeight);
        });
        
        console.log('Waiting for animation...');
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        console.log('Taking screenshot...');
        await page.screenshot({ path: 'screenshot_v2.png' });
        console.log('Screenshot saved to screenshot_v2.png');
        
        await browser.close();
    } catch (err) {
        console.error('Error taking screenshot:', err);
    } finally {
        server.kill();
        process.exit(0);
    }
})();
