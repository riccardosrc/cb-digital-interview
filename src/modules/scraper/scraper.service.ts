import { Injectable, Logger, OnApplicationBootstrap } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Browser, launch } from 'puppeteer';
import { PlayerData } from '../players/types/player-data.interface';

@Injectable()
export class ScraperService implements OnApplicationBootstrap {
  private browserInstance: Browser;
  private logger: Logger;
  private scarpeBaseUrl: string;

  constructor(private configService: ConfigService) {
    this.logger = new Logger(ScraperService.name);
    this.scarpeBaseUrl = this.configService.get('app.scrapingUrl');
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

  private async closeBrowser() {
    try {
      await this.browserInstance.close();
      this.logger.log('browser closed successfully!');
    } catch (error) {
      this.logger.error('error while closing browser', error);
    }
  }

  async getPage(url: string) {
    const page = await this.browserInstance.newPage();
    try {
      await page.goto(url, {
        waitUntil: 'domcontentloaded',
      });
      return page;
    } catch (error) {
      this.logger.error(`error requesting the desired page: ${url}`, error);
      throw error;
    }
  }

  async scrapeLeague(league: string) {
    const clubLinks = await this.getClubLinksByLeague(league);
    const playersByClub = await Promise.all(
      clubLinks.map((link) => this.scrapeClubPlayers(link)),
    );
    return playersByClub;
  }

  async scrapeClubPlayers(clubLink: string) {
    const page = await this.getPage(`${this.scarpeBaseUrl}${clubLink}`);
    const playersData: PlayerData[] = await page.evaluate(() => {
      return Array.from(document.querySelectorAll('tr'))
        .filter((row) => !row.className && row.children.length === 6)
        .map((row) => Array.from(row.children))
        .map((row) => {
          const [
            nameCell,
            weeklySalaryCell,
            yearlySalaryCell,
            ageCell,
            positionCell,
            nationalityCell,
          ] = row;
          return {
            name: nameCell.innerHTML,
            position: positionCell.innerHTML,
            nationality: nationalityCell.innerHTML,
            age: +ageCell.innerHTML,
            weeklySalary: weeklySalaryCell.innerHTML,
            yearlySalary: yearlySalaryCell.innerHTML,
          };
        });
    });
    const club = this.getClubNameFromLink(clubLink);
    return { players: playersData, club };
  }

  private getClubNameFromLink(clubLink: string) {
    return clubLink
      .split('/')
      .filter((segment) => segment.length > 0)
      .pop();
  }

  async getClubLinksByLeague(league: string) {
    const page = await this.getPage(`${this.scarpeBaseUrl}/football`);
    const clubLinks = await page.evaluate((leagueIdentifier) => {
      const headings = Array.from(document.querySelectorAll('h2'));
      const targetHeading = headings.find(
        (h) => h.innerText === leagueIdentifier,
      );
      const clubs = Array.from(targetHeading.nextElementSibling.children);
      const links = clubs.map((club) => club.getAttribute('href'));
      const clubLinks = links.filter((link) => !link.includes('highest-paid'));
      return clubLinks;
    }, league);
    return clubLinks;
  }

  async onApplicationBootstrap() {
    await this.startBrowser();
    await this.scrapeLeague('Serie A');
    await this.closeBrowser();
  }
}
