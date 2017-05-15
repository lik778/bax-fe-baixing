#!/usr/bin/env node

const { join } = require('path')
const fs = require('fs')

const assets = fs.readdirSync(join(__dirname, '../dist'))
const pages = fs.readdirSync(join(__dirname, '../view'))

pages.forEach((page) => {
  page = join(__dirname, '../view', page)
  let text = fs.readFileSync(page, 'utf-8')

  assets.forEach((asset) => {
    const [name, _, ext] = asset.split('.')
    const reg = new RegExp(name + '*' + '.' + ext)
    text = text.replace(reg, asset)
  })

  fs.writeFileSync(page, text)
})
