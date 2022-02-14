import path from "path"

const __dirname = path.dirname(new URL(import.meta.url).pathname)
const file = path.basename(new URL(import.meta.url).pathname, ".js")

console.log(file)

console.log(__dirname)
console.log(process.cwd())