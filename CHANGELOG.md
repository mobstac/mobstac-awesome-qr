# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [5.0.0-beta.1] - 2026-03-28

### Added

- **SvgBuilder engine** — New `src/svg/` module replacing `svg.js` + `svgdom`:
  - `SvgElement`: Base element class with deterministic (alphabetically-sorted) attribute serialization. Identical input always produces identical SVG output regardless of environment.
  - `SvgCanvas`: Top-level `<svg>` with chainable drawing API (`rect`, `circle`, `ellipse`, `path`, `text`, `image`, `polygon`, `polyline`, `gradient`, `clipPath`, etc.).
  - `SvgGradient`: Content-addressable `<linearGradient>`/`<radialGradient>` builder. Identical gradient configurations produce the same `<defs>` ID, avoiding duplicates.
  - `SvgTextMetrics`: Pre-computed Roboto 400 character width table for `measureText()` without requiring a DOM.
  - `SvgNodeProxy`: Minimal DOM-like interface (`createElement`, `setAttribute`, `appendChild`) for JsBarcode compatibility without pulling in svgdom.

- **ImageIO adapter pattern** — New `src/io/` module for environment-agnostic image operations:
  - `ImageIO` interface: `fetchImage`, `probeSize`, `transcode`, `detectFormat`, `isSvgUrl`, `toBase64DataUri`, `resizeToBase64`.
  - `NodeImageIO`: Node.js implementation using `sharp`, `probe-image-size`, and native `fetch` (with `node-fetch` fallback).
  - `BrowserImageIO`: Browser implementation using `Image`, `canvas`, and optional image-server proxy pattern.
  - Auto-detection via `package.json` `browser` field — bundlers automatically swap `NodeImageIO` for `BrowserImageIO`.

- **New config options**:
  - `skipImageValidation: boolean` — Skip dimension probing for logo images (useful when image server doesn't support HEAD requests).
  - `imageIO: ImageIO` — Inject a custom image I/O adapter for full control over image fetching, resizing, and format detection.
  - `logoBackground: true` added to default config.

- `cellPhoneSVGPath` constant moved to `Constants.ts` (ported from dashboard_version branch).

### Changed

- **Svg.ts fully rewritten** (~2900 lines) to use `SvgCanvas` API instead of `svg.js` DOM manipulation.
  - All `object`-typed method parameters replaced with proper `SvgCanvas` types.
  - Gradient creation uses `SvgGradient.url()` instead of inline svg.js gradient builder.
  - `clipWith()` replaced with standard SVG `<clipPath>` in `<defs>` + `clip-path` attribute.
  - `getComputedTextLength()` replaced with `SvgTextMetrics.measureText()`.
  - `drawBarcode()` uses `SvgNodeProxy` instead of svgdom for JsBarcode rendering.
  - Logo/background loading uses `ImageIO` adapter instead of direct `fetch`/`sharp`/`probe` calls.
  - `addStickerWithConfig()` uses `SvgCanvas.children` instead of `canvas.node.childNodes` DOM API.
- **TypeScript target** upgraded from `es5` to `es2019`.
- **tsconfig.json**: Removed `"dom"` from lib (no longer needed — no DOM dependency).
- **webpack.config.js**: Removed `webpack-node-externals`, replaced with explicit externals for `sharp`, `probe-image-size`, `node-fetch`.
- `Common.ts`: `CanvasUtil.drawSVGAlignProtector` now properly typed with `SvgCanvas` parameter.
- `circle` and `ellipse` elements now correctly use `cx`/`cy` attributes in `move()` instead of `x`/`y`.
- `SvgCanvas.fill()` uses a background `<rect>` element instead of CSS `background` property (compatible with librsvg/sharp rendering pipeline).
- WebP format detection now checks full RIFF+WEBP magic byte signature (bytes 0-3 and 8-11) instead of just "RI" prefix.

### Removed

- **Dependencies removed**:
  - `@svgdotjs/svg.js` — replaced by SvgCanvas.
  - `svgdom` — replaced by SvgBuilder (no DOM needed).
  - `svg.colorat.js` — unused.
  - `xmlhttprequest` — replaced by ImageIO adapter.
  - `filereader` — replaced by ImageIO adapter.
  - `request` — replaced by ImageIO adapter.
- **Dependencies moved to optionalDependencies**: `sharp`, `probe-image-size`, `node-fetch` (only needed by `NodeImageIO`).
- `isNode` constant removed from `Util.ts` (environment detection handled by ImageIO adapter).
- `isSvgFile()` function removed from `Util.ts` (moved to `ImageIO.isSvgUrl()`).
- Dead `isNode` font loading code removed from `Svg.ts`.
- Unused `Gradient` import removed from test files.
- `console.log('No sticker found')` removed (was firing on every non-sticker QR code).

### Fixed

- Test files (`Index.test.ts`, `Circular-SVG.test.ts`) no longer import from removed `@svgdotjs/svg.js`.
- Duplicate `skipImageValidation` field removed from `QRDrawingConfig` in `Types.ts`.
- Outdated JSDoc in `drawBarcode()` no longer references removed dependencies.

---

## [4.2.2] - Previous release

Lambda/Node backend version. Used `svg.js` + `svgdom` for SVG generation.

## [2.6.5] - Previous release (dashboard_version branch)

Browser version. Used native `SVG()` from `svg.js` with browser DOM.
