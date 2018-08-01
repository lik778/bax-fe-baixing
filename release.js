#!/usr/bin/env node
const child_process = require('child_process')
const { promisify } = require('util')
const { name, version } = require('./package')
const ora = require('ora')

const exec = promisify(child_process.exec)

async function release() {

    try {
        const spinner = ora('😇 building for production ...')
        spinner.start()
        var { stdout } = await exec('npm run build')
        spinner.stop()
        console.log(stdout)
        var { stdout } = await exec('npm run upload')
        console.log(stdout)
        exec('npm run release')
        exec('git add view/*.html')
        console.log('==================================================')
        console.log(`release ${name} -V${version}`)
        console.log('==================================================')
    } catch(err) {
        console.log(err)
    }
}


release()

