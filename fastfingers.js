/*
  Do typing test on 10fastfingers.com
  Usage:
  node fastfingers.js
  Note:
  The 1 minute tests only have 361 words so it breaks down pretty quickly. 
  After the bot burns through all 361 words it won't be able to do anything.
  The test will stop after the system detects afk unless the user intervenes. SAD!
*/
const puppeteer = require("puppeteer");

async function main() {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();

  const link = "https://10fastfingers.com/typing-test/english";

  await page.goto(link, { waitUntil: "networkidle0" });

  await page.focus("#inputfield");

  const ongoing = async () =>
    await page.evaluate(() => {
      const words = document.querySelector("#words");
      console.log("hello");
      console.log(words.style);
      console.log(words.style.display);

      return words.style.display != "none";
    });

  await page.waitForSelector("#words");
  while (await ongoing()) {
    await page.focus("#inputfield");
    const word = await page.evaluate(() => {
      return document.querySelector("#row1 > span.highlight").innerText;
    });
    await page.keyboard.type(word + " ");
  }
  await page.waitForSelector("#wpm > strong");
  const wpm = await page.evaluate(() => {
    return document.querySelector("#wpm > strong").innerText;
  });

  console.log(wpm);
}

main();
