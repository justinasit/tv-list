import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import puppeteer from 'puppeteer';
import * as config from './setupTests';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<App />, div);
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
  });

  afterAll(async () => {
    browser.close();
  });

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
});
