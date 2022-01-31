import fs from 'fs'
import open from 'open'
import puppeteer from 'puppeteer'
import {startFlow} from 'lighthouse/lighthouse-core/fraggle-rock/api.js'

async function captureReport() {
    const browser = await puppeteer.launch({headless: false})
    const page = await browser.newPage()

    const firstUrl = 'https://www.troyv.dev/'
    const secondUrl = 'https://www.troyv.dev/music/'
    const flow = await startFlow(page, {name: 'Cold and warm navigations'})
    await flow.navigate(firstUrl, {stepName: 'Cold navigation'})
    await flow.navigate(secondUrl, {
        stepName: 'Warm navigation',
        configContext: {
            settingsOverrides: {disableStorageReset: true},
        },
    })

    await browser.close()

    const report = flow.generateReport()
    fs.writeFileSync('flow-troyv.report.html', report)
    open('flow-troyv.report.html', {wait: false})
}

captureReport()