import puppeteer from "puppeteer";
import { startFlow } from "lighthouse/lighthouse-core/fraggle-rock/api.js";
import { writeLighthouseReport } from "./utils.js";

const args = process.argv.slice(2);
const urlToTest = args[0];
const reportName = args[1] + ".html";

async function captureSingleReport(link) {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();

  const flow = await startFlow(page, { name: "Single Navigation" });
  await flow.navigate(link);
  await browser.close();

  const report = flow.generateReport();
  writeLighthouseReport(reportName, report);
}

switch (args[0]) {
  case "help":
    console.log("Your first argument should be the URL you want to test.");
    console.log("Your second argument should be the name of the output report file.");
    console.log("Basic usage: node single https://www.example.com example ");
    break;
  default:
    captureSingleReport(urlToTest);
    break;
}
