import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import puppeteer from 'puppeteer';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<App />, div);
  ReactDOM.unmountComponentAtNode(div);
});

describe('search works', () => {
  test(
    'the search submit button is visible',
    async () => {
      let browser = await puppeteer.launch({
        headless: true,
      });
      let page = await browser.newPage();

      await page.goto('http://localhost:3000');
      await page.waitForSelector('.App-intro');

      const button = await page.$eval('.App-intro button', e => e.innerHTML);
      expect(button).toEqual('Submit');

      browser.close();
    },
    16000
  );
});
