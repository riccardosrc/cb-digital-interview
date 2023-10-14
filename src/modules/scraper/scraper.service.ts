import { Logger } from '@nestjs/common';
import { Browser, launch } from 'puppeteer';

export class ScraperService {
  private browserInstance: Browser;
  private logger: Logger;

  constructor() {
    this.logger = new Logger(ScraperService.name);
    this.startBrowser();
  }

  private async startBrowser() {
    try {
      this.browserInstance = await launch({
        headless: 'new',
        args: ['--no-sandbox'],
      });
      this.logger.log('browser launched successfully');
    } catch (error) {
      this.logger.error('error while launching browser', error);
    }
  }

  async getPage(url: string) {
    const page = await this.browserInstance.newPage();
    await page.goto(url, {
      waitUntil: 'domcontentloaded',
    });
    const res = await page.evaluate(() => {
      const headings = Array.from(document.querySelectorAll('h2'));
      const serieAheading = headings.find((heading) =>
        heading.textContent.includes('Serie A'),
      );
      return serieAheading;
    });
    console.log(res);
  }
}
