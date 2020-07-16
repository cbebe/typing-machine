/*
  Play a certain level on typingclub.com
  Usage:
  node type.js [OPTIONS] filename
  Options:
  -h : HEADLESS, will not display the browser
*/
const puppeteer = require("puppeteer");
require("dotenv").config();

const args = process.argv.slice(2);
const headless = args[0] == "-h";
const filename = args.find(arg => arg.includes(".json"));
const { text, link } = require(filename);

const waitTime = 2;

const asyncForEach = async (array, callback) => {
  for (let i = 0; i < array.length; i++) await callback(array[i], i, array);
};

async function main() {
  const browser = await puppeteer.launch({ headless, slowMo: 15 });
  const page = await browser.newPage();

  async function login(email, password) {
    console.log("Logging in...");
    await page.goto("https://www.typingclub.com/login.html", {
      waitUntil: "networkidle0",
    });
    await page.type("#username", email);
    await page.type("#password", password);
    await page.click("#login-with-password");

    await page.waitForNavigation({ waitUntil: "networkidle0" });
  }

  const { EMAIL, PASSWORD } = process.env;
  if (EMAIL != null) await login(EMAIL, PASSWORD);
  else console.log("No EMAIL and PASSWORD defined in .env, playing as guest");

  await page.goto(link);

  // remove annoying popup
  const classSelect =
    "#root > div:nth-child(1) > div > div > div > div > a:nth-child(3)";
  await page.waitForSelector(classSelect);
  await page.click(classSelect);

  let iterations = 0;

  console.log("Starting rampage...");
  async function type(num) {
    await page.waitForSelector("body > input[type=text]");
    await asyncForEach(text, async line => {
      await page.keyboard.type(line);
      await page.keyboard.press("Enter");
    });
    await page.waitFor(waitTime * 1000);
    await page.goto(link);
    process.stdout.write("\rIterations: " + ++iterations);
    if (num > 0) {
      await type(num - 1);
    }
  }

  const arr = new Array(100).fill(0);
  await asyncForEach(arr, async () => {
    await asyncForEach(arr, async () => {
      await type(100, text);
    });
  });
}

main();
