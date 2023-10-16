import { Injectable, Logger, OnApplicationBootstrap } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Browser, launch } from 'puppeteer';
import { PlayerData } from '../players/types/player-data.interface';
import { PlayersService } from '../players/players.service';

@Injectable()
export class ScraperService implements OnApplicationBootstrap {
  private browserInstance: Browser;
  private logger: Logger;
  private scarpeBaseUrl: string;
  private readonly leagueToScrape = ['Serie A'];

  constructor(
    private configService: ConfigService,
    private playersService: PlayersService,
  ) {
    this.logger = new Logger(ScraperService.name);
    this.scarpeBaseUrl = this.configService.get('app.scrapingUrl');
  }

  /**
   * start browser instance for scraping
   */
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

  /**
   * close browser instance
   */
  private async closeBrowser() {
    try {
      await this.browserInstance.close();
      this.logger.log('browser closed successfully!');
    } catch (error) {
      this.logger.error('error while closing browser', error);
    }
  }

  /**
   * get page by url
   * @param url desired url page
   * @returns page
   */
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

  /**
   * scrape all the clubs that belong to target league
   * @param league league identifier
   * @returns players informations, group by club
   */
  async scrapeLeague(league: string) {
    const clubLinks = await this.getClubLinksByLeague(league);
    const playersByClub = await Promise.all(
      clubLinks.map((link) => this.scrapeClubPlayers(link)),
    );
    return playersByClub;
  }

  /**
   * scrape all the players data from the club page
   * @param clubLink link for club's players list
   * @returns players data
   */
  async scrapeClubPlayers(clubLink: string) {
    const page = await this.getPage(`${this.scarpeBaseUrl}${clubLink}`);
    const playersData: PlayerData[] = await page.evaluate(() => {
      return Array.from(document.querySelectorAll('tbody > tr'))
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
          const nameLinkEl = nameCell.firstElementChild;
          const name = nameLinkEl?.innerHTML ?? nameCell.innerHTML;
          return {
            name,
            detailLink: nameLinkEl?.getAttribute('href'),
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

  /**
   * utility to extract club name from club link
   * @param clubLink link of the club
   * @returns club name
   */
  private getClubNameFromLink(clubLink: string) {
    return clubLink
      .split('/')
      .filter((segment) => segment.length > 0)
      .pop();
  }

  /**
   * scrape all the links for clubs pages of the desired league
   * @param league league target identifier
   * @returns all the clubs links of the league
   */
  private async getClubLinksByLeague(league: string) {
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
    await Promise.allSettled(
      this.leagueToScrape.map(async (leagueIdentifier) => {
        const playersByClub = await this.scrapeLeague(leagueIdentifier);
        playersByClub.forEach(({ club, players }) =>
          this.playersService.syncClubPlayers(leagueIdentifier, club, players),
        );
      }),
    );
    await this.closeBrowser();
  }
}
