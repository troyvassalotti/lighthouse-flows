/**
 * @file Run a Lighthouse report on multiple URLs.
 * @version 1.0.0
 */

import puppeteer from "puppeteer";
import { startFlow } from "lighthouse/lighthouse-core/fraggle-rock/api.js";
import { writeLighthouseReport } from "./utils/utils.js";

/**
 * Grab the node arguments to use in the function.
 * The first argument is the name of the report to be generated. If it isn't provided, it is false.
 * The second argument is the URL being tested.
 */
const args = process.argv.slice(2);
const nameOfReport = args[0] + ".html";
const urlsToTest = process.argv.slice(3);

async function captureMultipleReports(file, links) {
    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();
    const flow = await startFlow(page, { name: "Multi-page Navigations" });

    await flow.navigate(links[0], { stepName: "First Page (Cold)" });

    for (const link of links.splice(1)) {
        await flow.navigate(link, {
            stepName: "Warm Navigation for " + link,
            configContext: {
                settingsOverrides: { disableStorageReset: true },
            },
        });
    }
    await browser.close();

    writeLighthouseReport(file, flow.generateReport());
}

if (args[0] === "--help") {
    console.log(
        `
        # This script is best used with pages on the same domain
        - Your first argument should be the name of the output report file
        - The rest of your arguments should be URLs to visit
        - Basic usage: node multi example https://www.example.com https://www.example.com/about https://www.example.com/page-3
     `
    );
} else {
    captureMultipleReports(nameOfReport, urlsToTest).then((r) => console.log("Completed flow:", r));
}
