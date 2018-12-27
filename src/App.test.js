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
    await page.waitFor(1000);
  });

  afterAll(async () => {
    browser.close();
  });

  test('stored show is visible', async () => {
    await page.$eval('p li', value => value = 'Homeland');
  },
  config.timeout
  );

  test('remove show', async () => {
    await page.waitForSelector('p li', {visible: true});
    await page.click('#remove-button-0');
    await page.waitForSelector('p li', {hidden: true});
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
});
