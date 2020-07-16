/**
 * @fileoverview Search developers.google.com/web for articles tagged
 * "Headless Chrome" and scrape results from the results page.
 */
const puppeteer = require("puppeteer");

const TRACKING_NUM = "1023038647106760";

(async () => {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();

  // this whole thing is unnecessary tbh we could just go to the link to the progress page itself
  // https://www.canadapost.ca/trackweb/en#/details/1023038647106760
  await page.goto("https://www.canadapost.ca/trackweb/en#/home");
  await page.focus("#input");
  await page.keyboard.type(TRACKING_NUM);
  await page.click("#submitButton");
  await page.waitForNavigation({ waitUntil: "networkidle0" });

  // await page.goto("https://www.canadapost.ca/trackweb/en#/details/" + TRACKING_NUM);

  await page.click("#showMoreLink");
  // Wait for suggest overlay to appear and click "show all results".
  // const allResultsSelector = ".devsite-suggest-all-results";
  // await page.waitForSelector(allResultsSelector);
  // await page.click(allResultsSelector);
  // Wait for the results page to load and display the results.
  // const resultsSelector = ".gsc-results .gsc-thumbnail-inside a.gs-title";
  // await page.waitForSelector(resultsSelector);
  // Extract the results from the page.
  // const links = await page.evaluate(resultsSelector => {
  //   const anchors = Array.from(document.querySelectorAll(resultsSelector));
  //   return anchors.map(anchor => {
  //     const title = anchor.textContent.split("|")[0].trim();
  //     return `${title} - ${anchor.href}`;
  //   });
  // }, resultsSelector);
  // console.log(links.join("\n"));
  const deliveryProgress = await page.evaluate(selector => {
    return document.getElementById(selector).outerHTML;
  }, "trackprogresstable");
  console.log(deliveryProgress);
})();
