#!/usr/bin/env node

const { join } = require('path')
const fs = require('fs')

const assets = fs.readdirSync(join(__dirname, '../dist'))
for (const asset of assets) {
  const [, _, ext] = asset.split('.')
  if (ext === 'html' || _ === 'html') {
    // fs.renameSync(
    //   join(__dirname, '../dist/', asset),
    //   join(__dirname, '../view/', asset)
    // )
    fs.copyFileSync(
      join(__dirname, '../dist/', asset),
      join(__dirname, '../view/', asset)
    )
  }
}
