import fs from 'fs'
import open from 'open'

const reportDest = './reports/'

export function writeLighthouseReport(name, report, openFile = true) {
    const output = reportDest + name
    fs.writeFileSync(output, report)

    if (openFile) {
        open(output, {wait: false})
    }
}
