/**
 * @file Performs a Lighthouse test on pages from VSL through to Order Form
 * vto stands for VSL, Transcript, Offer
 */

import puppeteer from "puppeteer";
import { startFlow } from "lighthouse/lighthouse-core/fraggle-rock/api.js";
import { writeLighthouseReport } from "./utils/utils.js";

const args = process.argv.slice(2);
const nameOfReport = args[0] + ".html";
const urlToTest = args[1];

async function capturePromoReport(file, link) {
    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();

    const flow = await startFlow(page, { name: "Promo snapshots" });

    await page.goto(link, { waitUntil: "networkidle0" });

    // Wait for the transcript button, then click it.
    const transcriptButtonSelector = "a#readTranscriptShortcut";
    await page.waitForSelector(transcriptButtonSelector);
    await flow.snapshot({ stepName: "Transcript button visible" });
    await page.click(transcriptButtonSelector);

    // Wait for the 2-step button, then click it.
    const twoStepButtonSelector = "button.placeOrder__button";
    await page.waitForSelector(twoStepButtonSelector);
    await flow.snapshot({ stepName: "Two step button visible" });
    await page.click(twoStepButtonSelector);

    // Wait for the Order Form button, then click it
    const offerButtonSelector = "a#twoStepProceed";
    await page.waitForSelector(offerButtonSelector);
    await flow.snapshot({ stepName: "Order button visible" });
    await page.click(offerButtonSelector);

    await flow.snapshot({ stepName: "Order form reached" });

    browser.close();

    writeLighthouseReport(file, flow.generateReport());
}

if (args[0] === "help") {
    console.log(
        `
      Your first argument should be the name of the output report file
      Your second argument should be the VSL URL you're testing
      Basic usage: node single example https://www.example.com
    `
    );
} else {
    capturePromoReport(nameOfReport, urlToTest);
}
