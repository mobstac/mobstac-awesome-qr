'use strict'

const express = require('express')
const path = require('path')

// Use the built bundle so we don't need ts-node in the demo
// Prefer the CommonJS library build for Node demos
const QRLib = require(path.join(__dirname, '..', 'lib', 'index.js'))

const app = express()
const PORT = process.env.PORT || 3000

app.use(express.static(path.join(__dirname)))

// Only allow a safe, whitelisted subset of config keys
const ALLOWED_KEYS = new Set([
  'text',
  'logoBackground',
  'backgroundColor',
  'canvasType',
  'dataPattern',
  'dotScale',
  'colorDark',
  'colorLight',
  'eyeBallShape',
  'eyeFrameShape',
  'eyeFrameColor',
  'eyeBallColor',
  'frameStyle',
  'frameText',
  'frameColor',
  'frameTextColor',
  'gradientType',
  'logoScale',
  'backgroundImage',
  'logoImage',
  'size',
  'margin',
  'correctLevel',
  'logoMargin',
  'showBarcodeValue',
  'barcodeValue',
  'showBarcode',
  'barcodeType',
  'barcodeText',
  'primaryIdentifierValue',
  'whiteMargin',
  'isVCard',
  'useOpacity'
])

const STRING_ENUMS = {
  canvasType: new Set(['svg']), // demo renders SVG only
  dataPattern: new Set(['square','circle','kite','left-diamond','right-diamond','thin-square','smooth-round','smooth-sharp']),
  eyeBallShape: new Set(['square','circle','rounded','left-leaf','right-leaf','left-diamond','right-diamond']),
  eyeFrameShape: new Set(['square','circle','rounded','left-leaf','right-leaf']),
  gradientType: new Set(['none','linear','radial','vertical','horizontal']),
  frameStyle: new Set(['none','box-bottom','box-top','banner-top','banner-bottom','balloon-bottom','balloon-top','circular','text-only','focus'])
}

function clamp(num, min, max) { return Math.min(Math.max(num, min), max) }

function sanitizeConfig(input) {
  const cfg = {}
  for (const k of Object.keys(input || {})) {
    if (ALLOWED_KEYS.has(k)) cfg[k] = input[k]
  }
  // Required
  if (typeof cfg.text !== 'string' || !cfg.text.trim()) {
    throw new Error('text is required')
  }
  // Types and bounds
  if (cfg.size != null) cfg.size = clamp(Number(cfg.size) || 512, 128, 4096)
  if (cfg.margin != null) cfg.margin = clamp(Number(cfg.margin) || 0, 0, Math.round((cfg.size||512)/2))
  if (cfg.dotScale != null) cfg.dotScale = clamp(Number(cfg.dotScale) || 0.35, 0.05, 1)
  if (cfg.logoScale != null) cfg.logoScale = clamp(Number(cfg.logoScale) || 0.15, 0, 0.5)
  if (cfg.logoMargin != null) cfg.logoMargin = clamp(Number(cfg.logoMargin) || 0, 0, 100)
  if (cfg.correctLevel != null) {
    const allowedLevels = new Set([0,1,2,3])
    cfg.correctLevel = allowedLevels.has(Number(cfg.correctLevel)) ? Number(cfg.correctLevel) : 3
  }
  // Strings
  for (const key of Object.keys(STRING_ENUMS)) {
    if (cfg[key] != null && !STRING_ENUMS[key].has(String(cfg[key]).toLowerCase())) {
      delete cfg[key]
    } else if (cfg[key] != null) {
      cfg[key] = String(cfg[key]).toLowerCase()
    }
  }
  // Colors: ensure non-empty strings
  for (const k of ['backgroundColor','colorDark','colorLight','eyeFrameColor','eyeBallColor','frameColor','frameTextColor']) {
    if (cfg[k] != null && typeof cfg[k] !== 'string') delete cfg[k]
  }
  // Booleans
  for (const k of ['logoBackground','showBarcode','showBarcodeValue','whiteMargin','isVCard','useOpacity']) {
    if (cfg[k] != null) cfg[k] = Boolean(cfg[k])
  }
  return cfg
}

app.get('/', (_req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'))
})

// Renders an SVG using query param `config` (JSON string)
app.get('/render', async (req, res) => {
  try {
    const { config } = req.query
    if (!config) {
      return res.status(400).send('Missing config query parameter')
    }
    let cfg
    try {
      cfg = sanitizeConfig(JSON.parse(config))
    } catch (e) {
      return res.status(400).send('Invalid JSON in config')
    }

    // Build QR
    const builder = new QRLib.QRCodeBuilder(cfg)
    const qr = await builder.build()
    const svg = qr.toBuffer()

    res.setHeader('Content-Type', 'image/svg+xml')
    res.send(svg)
  } catch (err) {
    console.error(err)
    res.status(500).send('Failed to render QR')
  }
})

app.listen(PORT, () => {
  console.log(`Demo running on http://localhost:${PORT}`)
})


