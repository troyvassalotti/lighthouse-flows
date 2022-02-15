/**
 * @file Run a Lighthouse report on a single URL with cold and warm navigations.
 * @version 1.0.0
 */

 import puppeteer from "puppeteer";
 import { startFlow } from "lighthouse/lighthouse-core/fraggle-rock/api.js";
 import { writeLighthouseReport } from "./utils.js";
 
 /**
  * Grab the node arguments to use in the function.
  * The first argument is the name of the report to be generated. If it isn't provided, it is false.
  * The second argument is the URL being tested.
  */
 const args = process.argv.slice(2);
 const nameOfReport = args[0] + ".html";
 const urlsToTest = args.slice(1);
 
 async function captureMultipleReports(file, ...links) {
     for (const[key, value] of links.entries()) {
         console.log(key, value)
     }
     return
     // Abort early if there is no name for the report
     if (!links) {
         console.log("\nYou only provided a set of URLs. Please provide a name for the report first.\n");
         return;
     }
 
     const browser = await puppeteer.launch({ headless: false });
     const page = await browser.newPage();
     const flow = await startFlow(page, { name: "Cold and Warm Navigations" });
 
     await flow.navigate(links[0], { stepName: "First Page (Cold)" });
     for (const link of links) {
        await flow.navigate(link, {
            stepName: "Warm Navigation",
            configContext: {
                settingsOverrides: { disableStorageReset: true },
            },
        });
     }
     await browser.close();
 
     writeLighthouseReport(file, flow.generateReport());
 }
 
 if (args[0] === "help") {
     console.log(
         `
       Your first argument should be the name of the output report file
       Your second argument should be the name of the URL you want to test.
       Basic usage: node single example https://www.example.com
     `
     );
 } else {
    captureMultipleReports(nameOfReport, urlsToTest);
 }
 