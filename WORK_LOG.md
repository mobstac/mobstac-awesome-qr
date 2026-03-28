# Work log — mobstac-awesome-qr
_Last updated: 2026-03-28_

## In progress
- [ ] Phase 5: Node 24 upgrade, dep updates, branch merge

## Completed this session
- [x] Phase 1: SvgBuilder scaffolding (SvgElement, SvgCanvas, SvgGradient, SvgTextMetrics, SvgNodeProxy) — 2026-03-28
- [x] Phase 1: ImageIO adapter (interface + NodeImageIO + BrowserImageIO) — 2026-03-28
- [x] Phase 2: Unified Types.ts, Constants.ts, Util.ts, Common.ts, index.ts — 2026-03-28
- [x] Phase 3: Svg.ts full rewrite (replaced svgdom/svg.js with SvgBuilder, ImageIO adapters) — 2026-03-28
- [x] Phase 4: package.json, tsconfig.json, webpack.config.js updated — 2026-03-28
- [x] Code review fixes (circle cx/cy, background rect, deterministic gradient IDs, WebP magic bytes, #text nodes, test imports) — 2026-03-28
- [x] TypeScript compilation verified clean — 2026-03-28

## Pending / not started
- [ ] Unit tests for SvgElement, SvgCanvas, SvgGradient, SvgTextMetrics, SvgNodeProxy
- [ ] SVG snapshot tests for QR code variants
- [ ] Node 24 compatibility testing
- [ ] TypeScript 5.x upgrade
- [ ] Replace node-fetch with native fetch
- [ ] Update sharp to 0.33.x
- [ ] Merge dashboard_version branch

## Needs review
- [ ] All new files in src/svg/ and src/io/ — core architecture review
- [ ] Svg.ts rewrite — verify feature parity with original

## Blockers / open questions
- B-1 from review: SVG injection risk (raw SVG logos injected without sanitization) — pre-existing, needs sanitization layer
- B-3 from review: Hard-coded stroke-width=10 on eye frame — pre-existing, needs sizeRatio scaling
- B-6 from review: Zero unit tests on new modules — must add before v5.0.0 release

## Notes for next session
- Branch: feat/v5-svgbuilder-unification (cut from master)
- TypeScript compiles clean with zero errors
- All old deps removed: @svgdotjs/svg.js, svgdom, svg.colorat.js, xmlhttprequest, filereader, request
- sharp, probe-image-size, node-fetch moved to optionalDependencies
- REVIEW.md has full code review findings
