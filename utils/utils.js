/**
 * @file Utility functions shared across scripts
 */
import fs from "fs";
import open from "open";

/** The destination folder of all reports - relative to the root */
const reportDest = "./reports/";

/**
 * Write the Lighthouse Flow report to disk and open it if desired
 * @param {String} name The name of the report being generated - results in name.html
 * @param {String} report The generated Flow report to be written to disk - comes from Flow in the script files
 * @param {Boolean} openFile Whether or not to open the resulting report file
 */
export function writeLighthouseReport(name, report, openFile = true) {
    const output = reportDest + name;
    fs.writeFileSync(output, report);

    if (openFile) {
        open(output, { wait: false });
    }
}
