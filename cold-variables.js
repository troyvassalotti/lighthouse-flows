import fs from 'fs'
import open from 'open'
import puppeteer from 'puppeteer'
import {startFlow} from 'lighthouse/lighthouse-core/fraggle-rock/api.js'

async function captureReport(link) {
    const browser = await puppeteer.launch({headless: false})
    const page = await browser.newPage()

    const flow = await startFlow(page, {name: 'Single Navigation'})
    await flow.navigate(link)

    await browser.close()

    const report = flow.generateReport()
    fs.writeFileSync('flow.report.html', report)
    open('flow.report.html', {wait: false})
}

captureReport("https://web.dev/performance-scoring/")