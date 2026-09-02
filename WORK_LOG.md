# Work log — mobstac-awesome-qr
_Last updated: 2026-03-29_

## In progress
(none)

## Completed this session
- [x] Coverage boost: 266 tests, 87.91% statements / 78.86% branches / 95.13% functions — 2026-03-29
  - v5-fixes.test.ts: 12 tests (circular padding, transparent fill, skipImageValidation, HTTP errors, radius consistency)
  - coverage-boost.test.ts: 63 tests (gradients, text tags, smooth patterns, frames, eye shapes, barcode, watermark, edge cases)
- [x] Port 3 dashboard_version fixes into v5 — 2026-03-29
  - Circular frame stroke overflow padding (moduleSize/2)
  - Circular frame transparent fill (#ffffff00 instead of gradient)
  - skipImageValidation for logos and stickers (use URL directly in browser)
- [x] Modernize dependencies for v5.0.0 — 2026-03-28
  - TypeScript 3.4.3 → 5.7.3, target es2022
  - Node 16 → 20 in CI, actions v2 → v4
  - webpack 4 → 5, ts-loader 5 → 9, ts-node 8 → 10
  - mocha 6 → 10 (migrated mocha.opts → .mocharc.yml)
  - nyc 14 → 17, prettier 1 → 3
  - sharp 0.30 → 0.33, removed node-fetch (native fetch)
  - Removed tslint, file-loader, url-loader, json-loader
  - @types/node moved to devDependencies, bumped to ^20
  - NodeImageIO.ts: removed globalThis fetch fallback
  - All 191 tests passing, tsc + webpack build clean

## Previously completed
- [x] Unit tests for all v5 modules: SvgElement, SvgCanvas, SvgGradient, SvgTextMetrics, SvgNodeProxy, NodeImageIO (~100 new tests) — 2026-03-28
- [x] B-1 fix: SVG injection sanitization — added sanitizeSvg() to strip script/iframe/object/embed/foreignObject/on* handlers — 2026-03-28
- [x] B-3 fix: Eye frame stroke-width now scales by sizeRatio — 2026-03-28
- [x] All 191 tests passing, svg/ coverage >97%, io/ coverage 76% — 2026-03-28
- [x] Phase 1: SvgBuilder scaffolding (SvgElement, SvgCanvas, SvgGradient, SvgTextMetrics, SvgNodeProxy) — 2026-03-28
- [x] Phase 1: ImageIO adapter (interface + NodeImageIO + BrowserImageIO) — 2026-03-28
- [x] Phase 2: Unified Types.ts, Constants.ts, Util.ts, Common.ts, index.ts — 2026-03-28
- [x] Phase 3: Svg.ts full rewrite (replaced svgdom/svg.js with SvgBuilder, ImageIO adapters) — 2026-03-28
- [x] Phase 4: package.json, tsconfig.json, webpack.config.js updated — 2026-03-28
- [x] Code review fixes (circle cx/cy, background rect, deterministic gradient IDs, WebP magic bytes, #text nodes, test imports) — 2026-03-28
- [x] TypeScript compilation verified clean — 2026-03-28

## Pending / not started
- [ ] SVG snapshot tests for QR code variants
- [ ] Merge dashboard_version branch (functional fixes ported; only browser-specific adaptations remain)

## Needs review
- [ ] All new files in src/svg/ and src/io/ — core architecture review
- [ ] Svg.ts rewrite — verify feature parity with original

## Blockers / open questions
- (none)

## Notes for next session
- Branch: feat/v5-svgbuilder-unification (cut from master)
- All deps modernized: TS 5.7, webpack 5, mocha 10, Node 20 CI
- node-fetch fully removed — native fetch only (Node 18+)
- sharp 0.33.x in optionalDependencies
- .mocharc.yml replaces test/mocha.opts
- tslint removed (no eslint added — strict TS is sufficient)
- REVIEW.md has full code review findings
