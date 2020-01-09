import React from 'react';
import ReactDOM from 'react-dom';
import App from './components/App';
import puppeteer from 'puppeteer';
import * as config from './setupTests';
import { BrowserRouter } from 'react-router-dom'

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<BrowserRouter><App /></BrowserRouter>, div);
  ReactDOM.unmountComponentAtNode(div);
});

describe('tv-list app testing', () => {
  let page;
  let browser;
  
  beforeAll(async () => {
    browser = await puppeteer.launch({
      headless: false,
    });
    page = await browser.newPage();
    await page.goto(config.appUrl);
    
    await page.evaluate(() => {
      localStorage.setItem('storedShows', '[{"id":1407,"seasons_watched":[1]}]');
    });
    page.reload();
    await page.waitFor(2000);
  });

  afterAll(async () => {
    browser.close();
  });

  test('stored show is visible', async () => {
    await page.$eval('#toggler-active0', value => value = 'Homeland');
  },
  config.timeout
  );

  test('remove show', async () => {
    await page.waitForSelector('#toggler-active0', {visible: true});
    await page.click('#toggler-active0');
    await page.waitForSelector('#remove-button-0', {visible: true});
    await page.waitFor(1000);
    await page.click('#remove-button-0');
    await page.waitForSelector('#toggler-active0', {hidden: true});
  },
  config.timeout
  );

  test('the search submit button is visible', async () => {
      const button = await page.$eval('.App-intro button', e => e.innerHTML);
      expect(button).toEqual('Submit');
    },
    config.timeout
  );

  test('search works', async () => {
    await page.focus('.App-intro input');
    await page.keyboard.type('Stranger');
    await page.click('.App-intro button');
    await page.waitFor('span p li');
    await page.$eval('span p li', value => value = 'Stranger Things');
  },
  config.timeout
  );

  test('storing show works', async () => {
    await page.click('#add-show-button-0');
    const newShowName = await page.$eval('p li', e => e.innerHTML);
    expect(newShowName).toEqual('Stranger Things');
  },
  config.timeout
  );

  test('finish all seasons', async () => {
    await page.waitForSelector('#toggler-active0', {visible: true});
    await page.waitForSelector('#toggler-finished0', {hidden: true});
    await page.click('#toggler-active0');
    await page.waitFor(1000);
    for (let i=1; i < 5; i++) {
      await page.click('#season-checkbox-66732-'+i);
    }
    await page.waitForSelector('#toggler-active0', {hidden: true});
    await page.waitForSelector('#toggler-finished0', {visible: true});
  },
  config.timeout
  );

  test('move show back to active', async () => {
    await page.click('#toggler-finished0');
    await page.waitFor(1000);
    await page.click('#season-checkbox-66732-1');
    await page.waitForSelector('#toggler-active0', {visible: true});
    await page.waitForSelector('#toggler-finished0', {hidden: true});
  },
  config.timeout
  );

  test('archive show', async () => {
    await page.click('#toggler-active0');
    await page.waitForSelector('#archive-button-0', {visible: true});
    await page.waitFor(1000);
    await page.click('#archive-button-0');
    await page.waitForSelector('#archive-button-0', {hidden: true});
  },
  config.timeout
  );

  test('cannot add a show with no seasons', async () => {
    await page.focus('.App-intro input');
    await page.keyboard.type('Dar');
    await page.click('.App-intro button');
    await page.waitFor('#add-show-button-0');
    await page.click('#add-show-button-0');
    await page.on('dialog', async dialog => {
      const defaultValue = await dialog.message();
      expect(defaultValue).toEqual('Sorry, this show does not have a season number provided!');
      await dialog.dismiss();
    });
    await page.waitFor(1000);
  },
  config.timeout
  );
});
