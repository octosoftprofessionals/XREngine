const  {URL} = require('url')
const  {BrowserLauncher} = require('./browser-launcher')
const  InBrowserBot = require('./in-browser-bot')
const  InBrowserBotBuilder = require('./in-browser-bot-builder')
const  fs = require('fs');
const  getOS = require('./platform');

class PageUtils {
    constructor({page, autoLog = true}) {
        this.page = page
        this.autoLog = autoLog
    }
    async clickSelectorClassRegex(selector, classRegex) {
        if (this.autoLog) console.log(`Clicking for a ${selector} matching ${classRegex}`)

        await this.page.evaluate((selector, classRegex) => {
            classRegex = new RegExp(classRegex)
            let buttons = Array.from(document.querySelectorAll(selector))
            let enterButton = buttons.find(button => Array.from(button.classList).some(c => classRegex.test(c)))
            if (enterButton) enterButton.click()
        }, selector, classRegex.toString().slice(1,-1))
    }
    async clickSelectorId(selector, id) {
        if (this.autoLog) console.log(`Clicking for a ${selector} matching ${id}`)

        await this.page.evaluate((selector, id) => {
            let matches = Array.from(document.querySelectorAll(selector));
            let singleMatch = matches.find(button => button.id === id);
            let result;
            if (singleMatch && singleMatch.click) {
                console.log('normal click');
                result = singleMatch.click();
            }
            if (singleMatch && !singleMatch.click) {
                console.log('on click');
                result = singleMatch.dispatchEvent(new MouseEvent('click', {'bubbles': true}));
            }
            if (!singleMatch) {
                console.log('event click', matches.length);
                const m = matches[0];
                result = m.dispatchEvent(new MouseEvent('click', {'bubbles': true}));
            }
        }, selector, id)
    }
    async clickSelectorFirstMatch(selector) {
        if (this.autoLog) console.log(`Clicking for first ${selector}`)

        await this.page.evaluate((selector) => {
            let matches = Array.from(document.querySelectorAll(selector))
            let singleMatch = matches[0];
            if (singleMatch) singleMatch.click()
        }, selector)
    }
}

/**
 * Main class for creating a bot.
 */
class Bot {
    activeChannel;
    constructor({
        name = "Bot",
        fakeMediaPath,
        headless = true,
        autoLog = true} = {}
    ) {
        this.headless = headless;
        this.name = name;
        this.autoLog = autoLog;
        this.fakeMediaPath = fakeMediaPath;

        for (let method of Object.getOwnPropertyNames(InBrowserBot.prototype))
        {
            if (method in this) continue;

            this[method] = (...args) => this.evaluate(InBrowserBot.prototype[method], ...args)
        }
        
        const channelState = chatState.get('channels');
        const channels = channelState.get('channels');
        const activeChannelMatch = [...channels].find(([, channel]) => channel.channelType === 'instance');
        if (activeChannelMatch && activeChannelMatch.length > 0) {
            this.activeChannel = activeChannelMatch[1];
        }
    }

    async keyPress(key, numMilliSeconds) {
        console.log('Running with key ' + key);
        await this.setFocus('canvas');
        await this.clickElementById('canvas', 'engine-renderer-canvas');
        const interval = setInterval(() => {
            console.log('Pressing', key);
            this.pressKey(key);
        }, 100);
        return new Promise((resolve) => setTimeout(() => {
            console.log('Clearing button press for ' + key, numMilliSeconds);
            this.releaseKey(key);
            clearInterval(interval);
            resolve()
        }, numMilliSeconds));
    }

    async sendMessage(message) {
        await this.clickElementByClass('button', 'openChat');
        await this.clickElementById('input', 'newMessage');
        await this.typeMessage(message);
        await this.clickElementByClass('button', 'sendMessage');
    }

    async getInstanceMessages() {
        console.log("Getting messages from instance channel: ", this.activeChannel);
        return this.activeChannel && this.activeChannel.chatState;
    }


    async sendAudio(duration) {
        console.log("Sending audio...");
        await this.clickElementById('button', 'UserAudio');
        await this.waitForTimeout(duration);
    }

    async stopAudio(bot) {
        console.log("Stop audio...");
        await this.clickElementById('button', 'UserAudio');
    }

    async recvAudio(duration) {
        console.log("Receiving audio...");
        await this.waitForSelector('[class*=PartyParticipantWindow]', duration);
    }

    async sendVideo(duration) {
        console.log("Sending video...");
        await this.clickElementById('button', 'UserVideo');
        await this.waitForTimeout(duration);
    }

    async stopVideo(bot) {
        console.log("Stop video...");
        await this.clickElementById('button', 'UserVideo');
    }

    async recvVideo(duration) {
        console.log("Receiving video...");
        await this.waitForSelector('[class*=PartyParticipantWindow]', duration);
    }

    async delay(timeout) {
        console.log(`Waiting for ${timeout} ms... `);
        await this.waitForTimeout(timeout);
    }

    async interactObject() {

    }

    /** Runs a function and takes a screenshot if it fails
     * @param {Function} fn Function to execut _in the node context._
     */
    async catchAndScreenShot(fn, path="botError.png") {
        try {
            await fn()
        }
        catch (e) {
            if (this.page)
            {
                console.warn("Caught error. Trying to screenshot")
                this.page.screenshot({path})
            }
            throw e
        }
    }

    /**
     * Runs a funciton in the browser context
     * @param {Function} fn Function to evaluate in the browser context
     * @param args The arguments to be passed to fn. These will be serailized when passed through puppeteer
     */
    async evaluate(fn, ...args) {
        if (!this.browser) {
            await this.launchBrowser();
        }
        return await this.page.evaluate(fn, ...args)
    }

    /**
     * A main-program type wrapper. Runs a function and quits the bot with a
     * screenshot if the function throws an exception
     * @param {Function} fn Function to evaluate in the node context
     */
    exec(fn) {
        this.catchAndScreenShot(() => fn(this)).catch((e) => {
            console.error("Failed to run. Check botError.png if it exists. Error:", e)
            process.exit(-1)
        })
    }

    /**
     * Detect OS platform and set google chrome path.
     */
    detectOsOption() {
        const os = getOS();
        const options = {};
        let chromePath = '';
        switch (os) {
            case 'Mac OS':
                chromePath = '/Applications/Google\ Chrome.app/Contents/MacOS/Google\ Chrome';
                break;
            case 'Windows':
                chromePath = 'C:/Program Files (x86)/Google/Chrome/Application/chrome.exe';
                break;
            case 'Linux':
                chromePath = '/usr/bin/google-chrome';
                break;
            default:
                break;
        }

        if (chromePath) {
            if (fs.existsSync(chromePath)) {
                options.executablePath = chromePath;
            }
            else {
                console.warn("Warning! Please install Google Chrome to make bot workiing correctly in headless mode.\n");
            }
        }
        return options;
    }

    /** Launches the puppeteer browser instance. It is not necessary to call this
     *  directly in most cases. It will be done automatically when needed.
     */
    async launchBrowser () {
        console.log('Launching browser');
        const options = {
            headless: this.headless,
            ignoreHTTPSErrors: true,
            args: [
                "--disable-gpu",
                "--use-fake-ui-for-media-stream=1",
                "--use-fake-device-for-media-stream=1",
                `--use-file-for-fake-video-capture=${this.fakeMediaPath}/video.y4m`,
                `--use-file-for-fake-audio-capture=${this.fakeMediaPath}/audio.wav`,
                '--disable-web-security=1',
            //     '--use-fake-device-for-media-stream',
            //     '--use-file-for-fake-video-capture=/Users/apple/Downloads/football_qcif_15fps.y4m',
            //     // '--use-file-for-fake-audio-capture=/Users/apple/Downloads/BabyElephantWalk60.wav',
                '--allow-file-access=1',
            ],
            ignoreDefaultArgs: ['--mute-audio'],
            ...this.detectOsOption()
        };
        
        this.browser = await BrowserLauncher.browser(options);
        this.page = await this.browser.newPage();

        if (this.autoLog)
        {
            this.page.on('console', consoleObj => console.log(">> ", consoleObj.text()));
        }

        this.page.setViewport({ width: 1600, height: 900});
        await this.page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/69.0.3497.100 Safari/537.36')

        this.pu = new PageUtils(this);
    }

    async pressKey(keycode) {
        await this.page.keyboard.down(keycode);
    }

    async releaseKey(keycode) {
        await this.page.keyboard.up(keycode);
    }

    async navigate(url) {
        if (!this.browser) {
            await this.launchBrowser();
        }

        let parsedUrl = new URL(url)
        const context = this.browser.defaultBrowserContext();
        console.log("permission allow for ", parsedUrl.origin);
        context.overridePermissions(parsedUrl.origin, ['microphone', 'camera']);

        console.log('Going to ' + url);
        await this.page.goto(url, {waitUntil: 'domcontentloaded'});

        const granted = await this.page.evaluate(async () => {
            return (await navigator.permissions.query({name: 'camera'})).state;
          });
        console.log('Granted:', granted);
    }

    /** Enters the room specified, enabling the first microphone and speaker found
     * @param {string} roomUrl The url of the room to join
     * @param {Object} opts
     * @param {string} opts.name Name to set as the bot name when joining the room
     */
    async enterRoom(roomUrl, {name = 'bot'} = {}) {
        await this.navigate(roomUrl);
        await this.page.waitForSelector("div[class*=\"instance-chat-container\"]", { timeout: 100000});

        if (name) {
            this.name = name
        }
        else {
            name = this.name
        }

        if (this.headless) {
            // Disable rendering for headless, otherwise chromium uses a LOT of CPU
        }

        //@ts-ignore
        if (this.setName != null) this.setName(name)

        await this.page.mouse.click(0, 0);
        // await new Promise(resolve => {setTimeout(async() => {
        //     // await this.pu.clickSelectorClassRegex("button", /join_world/);
        //     setTimeout(async() => {
        //         // await this.page.waitForSelector('button.openChat');
        //         resolve();
        //     }, 30000)
        // }, 2000) });
    }

    async waitForTimeout(timeout) {
        return await new Promise(resolve =>  setTimeout(() => resolve(), timeout));
    }

    async waitForSelector(selector, timeout) {
        return this.page.waitForSelector(selector, { timeout });
    }

    async clickElementByClass(elemType, classSelector) {
        await this.pu.clickSelectorClassRegex(elemType || 'button', classSelector);
    }

    async clickElementById(elemType, id) {
        await this.pu.clickSelectorId(elemType, id);
    }

    async typeMessage(message) {
        await this.page.keyboard.type(message);
    }

    async setFocus(selector) {
        await this.page.focus(selector);
    }
    /**
     * Creates an {@link InBrowserBotBuilder} to allow building a bot for use in the
     * developer console.
     * @return {InBrowserBotBuilder} An InBrowserBotBuilder which can be used to
     * create client-side code to execute `fn`. This code can then be copied and
     * pasted into the developer console
     * @param {Function} fn The function to execute in the browser context. The
     `this` passed to fn will be an InBrowserBot version of this this. If
     this bot is a subclass of Bot, the subclassed definitions will
     be injected into the built [InBrowserBot](#inbrowserbot) code.
     * @param args Arguments to be serialized and passed to fn
     */
    asBrowserBot(fn, ...args) {
        return new InBrowserBotBuilder(this, fn, ...args)
    }

    /**
     * Leaves the room and closes the browser instance without exiting node
     */
    quit() {
        if (this.page) {
            this.page.close();
        }
        if (this.browser) {
            this.browser.close();
        }
    }
}

module.exports = Bot