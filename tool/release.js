#!/usr/bin/env node

const { join } = require('path')
const fs = require('fs')

const assets = fs.readdirSync(join(__dirname, '../dist'))
const pages = fs.readdirSync(join(__dirname, '../view'))

pages.forEach((page) => {
  page = join(__dirname, '../view', page)
  let text = fs.readFileSync(page, 'utf-8')

  assets.forEach((asset) => {
    const [name, _, ext, map] = asset.split('.')
    if (map) {
      return
    }

    const reg = new RegExp(name + '.\\w+.' + ext)
    text = text.replace(reg, asset)
  })

  fs.writeFileSync(page, text)
})
