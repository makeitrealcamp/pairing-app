const puppeteer = require("puppeteer");
const mongoose = require("mongoose");
const { app } = require("../../server/app");

let server;
let page;
let browser;
const width = 1920;
const height = 1080;

beforeAll(async () => {
  try {
    server = app.listen(3000);

    browser = await puppeteer.launch({
      headless: false,
      slowMo: 40,
      args: [`--window-size=${width},${height}`, '–no-sandbox', '–disable-setuid-sandbox']
    });
    page = await browser.newPage();
    await page.setViewport({ width, height });
  } catch (err) {
    console.log(err);
  }

});

beforeEach(async () => {
  for (var i in mongoose.connection.collections) {
    await mongoose.connection.collections[i].remove({});
  }
});

afterAll(async () => {
  server.close();
  await mongoose.disconnect();
  browser.close();
});

test("user can signup with Github", async () => {
  await page.goto("http://localhost:3000/");
  await page.waitForSelector('.login-page');
  expect(page.url()).toMatch(/login$/);
}, 15000);
