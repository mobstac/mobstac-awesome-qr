# Code Review — v5.0.0 Unification (SvgBuilder + ImageIO)

_Reviewed: 2026-03-28_
_Reviewer: Claude Code (principal engineer)_
_Branch: master (uncommitted changes)_

---

## Summary

The v5.0.0 effort replaces `svg.js + svgdom` with a custom deterministic `SvgBuilder` layer and introduces `ImageIO` adapters to decouple environment-specific I/O from rendering logic. The architecture goal is sound and well-motivated. However, there are several correctness bugs in the API translation from svg.js to SvgBuilder, one SVG injection risk, stale documentation in docstrings, and missing test coverage for all new modules.

---

## BLOCKING — must be fixed before merge

---

### B-1. SVG injection via unescaped raw SVG strings injected into canvas (SECURITY)

**File:** `src/Svg.ts`, lines 927–928 and 2667

`context.add(text ...)` in `loadLogo()` and `watermarkCanvas.add(svgContent)` in `addWatermark()` both pass raw SVG strings (fetched from arbitrary URLs) directly into `SvgCanvas.add()`, which appends them as unescaped children of the root `<svg>` element. `SvgElement.serialize()` emits string children verbatim — no sanitization.

```typescript
// src/Svg.ts line 927
context.add(text
    .replace('<svg', `<svg fill='#000'` + extraText + ` x="${svgCoordX}" ...`));

// src/Svg.ts line 2667
watermarkCanvas.add(svgContent);
```

A malicious SVG logo or watermark URL could inject arbitrary SVG/XML content, including `<script>` tags, `<foreignObject>` with HTML, or `javascript:` event handlers. The library is primarily server-side (Lambda), but any downstream consumer that renders the resulting SVG in a browser is exposed.

**Fix:** Strip `<script>`, `<foreignObject>`, `on*` event attributes, and `javascript:` URI references before injecting. DOMPurify (browser) or a lightweight server-side sanitizer should be applied. At minimum, strip `<script>` blocks using a regex before injection.

---

### B-2. `circle().radius()` produces invalid SVG — `cx`/`cy` not set

**File:** `src/Svg.ts`, lines 1884 and 1890; `src/svg/SvgCanvas.ts` line 76; `src/svg/SvgElement.ts` lines 125–136

`drawCircle()` calls `canvas.circle().radius(radiusX).fill(...).move(...)`. The chain works as follows:

- `canvas.circle()` (no diameter argument): creates `<circle>` with no `cx`, `cy`, or `r`.
- `.radius(radiusX)`: via `SvgElement.radius()`, sets `r=radiusX` but does NOT set `cx` or `cy`.
- `.move(cx, cy)`: via `SvgElement.move()`, sets `x` and `y` attributes — **these are not valid SVG attributes on `<circle>`**. SVG circles use `cx`/`cy`, not `x`/`y`.

Result: every circle data dot in the QR code renders at `(0,0)` relative to its container, producing a broken QR code for `DataPattern.CIRCLE`.

```typescript
// src/Svg.ts line 1884
canvas.circle().radius(radiusX)
    .fill(gradient)
    .move(centerX + ..., centerY + ...);  // move() sets x/y, NOT cx/cy on <circle>
```

**Fix option A:** Change `SvgElement.move()` to set `cx`/`cy` when `this.tag === 'circle'`.
**Fix option B:** Change `drawCircle()` to use `canvas.circle().attr({ cx: ..., cy: ..., r: ... })` directly.

---

### B-3. Eye canvas positioning — `SvgCanvas.move()` sets `x`/`y` but they are only valid if the embedded `<svg>` is displayed inline

**File:** `src/Svg.ts`, lines 1658–1667 (eye frames), 1713–1722 (eye balls); `src/svg/SvgCanvas.ts` line 59

`eyeFrameCanvas.move(x, y)` and `eyeBallCanvas.move(x, y)` call `SvgCanvas.move()` which sets `x` and `y` on the root `<svg>` element. The resulting SVG string (`eyeFrameCanvas.svg()`) is then `context.add()`-ed as a raw string. This works in browsers (embedded `<svg>` respects `x`/`y`) but the `SvgCanvas.rect()`, `.path()` etc. drawing calls inside the canvas add elements with coordinates relative to the canvas origin — not to the parent. This is the correct SVG pattern.

However, the `eyeFrameCanvas.path(framePath).fill(...).stroke({width: 10})` call uses a hard-coded `stroke-width: 10` on line 1653. This is an absolute pixel value with no scaling by `sizeRatio` or `moduleSize`. At the standard 1024px output size this is a 10px stroke — roughly 1% of canvas width. At a 200px QR code it is 5% of canvas width, making the eye frame visually distorted.

**Fix:** Scale the eye frame stroke width: `stroke({ width: Math.max(1, Math.round(moduleSize / 10)) })`.

---

### B-4. `SvgCanvas.fill()` uses CSS `background` property instead of SVG background rect — breaks raster rendering

**File:** `src/svg/SvgCanvas.ts`, lines 51–57

```typescript
fill(color: string): this {
    // svg.js does this by setting fill on the <svg> element, but
    // standard SVG doesn't render fill on <svg>. We use style.
    this.root.setAttr('style', `background:${color}`);
    return this;
}
```

`background` is a CSS property. It works when SVG is rendered in a browser as an inline or `<img>` element but it is NOT rendered by:
- `sharp` (which uses `librsvg`) when converting SVG to PNG/JPEG on the Lambda path
- Inkscape, Illustrator, or other standalone SVG processors
- Any consumer that uses SVG as a document (not CSS-enabled HTML)

The old svg.js code almost certainly used a background `<rect>` or the SVG `fill` attribute on the root (also non-standard but renders in librsvg).

This is a Lambda-path regression: the background color of every generated QR code will be transparent in raster output if it goes through `sharp`.

**Fix:**
```typescript
fill(color: string): this {
    // Insert a full-size background rect as the first child
    const bg = new SvgElement('rect');
    bg.setAttr('width', '100%');
    bg.setAttr('height', '100%');
    bg.setAttr('fill', color);
    this.root.insertAt(this._defs ? 1 : 0, bg);
    return this;
}
```

---

### B-5. `gradientCounter` is module-level mutable state — breaks determinism across requests

**File:** `src/svg/SvgGradient.ts`, line 3

```typescript
let gradientCounter = 0;
```

`gradientCounter` is incremented every time a `SvgGradient` is constructed. In a Lambda or long-lived Node.js process that handles multiple requests, gradient IDs grow unboundedly (`lg_abc123_0`, `lg_abc123_1`, ...). The comment says IDs are "content-addressable" but the counter suffix breaks this guarantee — two identical gradient configurations in different requests produce different IDs.

More importantly, if the Lambda process handles concurrent requests, the counter is a shared mutable variable that is not thread-safe (JavaScript is single-threaded so no race condition, but the counter makes output non-deterministic relative to process lifetime, which breaks caching and snapshot testing).

**Fix:** Remove `gradientCounter` entirely. Use only the content hash as the ID:
```typescript
this.id = `${type[0]}g_${hashStr}`;
```
If collision risk is a concern (two different stop configurations producing the same hash), append a per-canvas sequential counter that is scoped to each `SvgCanvas` instance, not the module.

---

### B-6. No tests for any new module — `SvgElement`, `SvgCanvas`, `SvgGradient`, `SvgTextMetrics`, `SvgNodeProxy`, `NodeImageIO`, `BrowserImageIO`

All seven new files under `src/svg/` and `src/io/` have zero test coverage. The library's stated coverage tool is nyc/mocha. The existing test suite exercises `SVGDrawing` end-to-end but does not unit-test:
- `SvgElement.serialize()` output for every element type
- `escapeAttr()` behavior for all XML special characters
- `SvgCanvas.gradient()` — that the gradient is placed in `<defs>` before other children
- `SvgCanvas.fill()` producing a valid background
- `SvgTextMetrics.measureText()` for known strings
- `SvgNodeProxy` — that JsBarcode output is correctly translated
- `NodeImageIO.detectFormat()` magic-byte accuracy
- `NodeImageIO.toBase64DataUri()` MIME type handling

Missing tests on new business logic is a blocking criterion. The 85% coverage threshold cannot be verified.

---

### B-7. Test files still import from `@svgdotjs/svg.js` — test suite is broken

**File:** `src/tests/Index.test.ts` line 1; `src/tests/Circular-SVG.test.ts` line 1

```typescript
import { Gradient } from '@svgdotjs/svg.js';
```

`@svgdotjs/svg.js` has been removed from `package.json`. Running `npm test` will fail immediately with a module-not-found error. The entire existing test suite is non-functional against the new code.

**Fix:** Remove the `@svgdotjs/svg.js` import from both test files (the `Gradient` type is not used in the test assertions). Verify all tests pass against the new `SvgCanvas` API.

---

### B-8. `NodeImageIO.detectFormat()` — incorrect WebP magic bytes

**File:** `src/io/NodeImageIO.ts`, line 64; `src/io/BrowserImageIO.ts`, line 123

```typescript
if (buf[0] === 0x52 && buf[1] === 0x49) return 'webp';  // "RI"
if (buf[0] === 0x47 && buf[1] === 0x49) return 'gif';   // "GI"
```

WebP files start with the 12-byte sequence `52 49 46 46 ?? ?? ?? ?? 57 45 42 50` (`RIFF....WEBP`). Checking only the first two bytes (`RI`) will false-positive on any RIFF file that is not a WebP (AVI, WAV, etc.).

GIF files start with `GIF89a` (0x47 0x49 0x46 0x38 0x39 0x61) or `GIF87a`. Checking only the first two bytes is acceptable but also matches any binary starting with `GI`.

The practical risk: a RIFF/WAV audio attachment in a logo field would be detected as `webp`, producing `data:image/webp;base64,...` and silently embedding garbage in the SVG.

**Fix:**
```typescript
// WebP: RIFF header + WEBP marker at bytes 8-11
if (buf[0] === 0x52 && buf[1] === 0x49 && buf[2] === 0x46 && buf[3] === 0x46
    && buf[8] === 0x57 && buf[9] === 0x45 && buf[10] === 0x42 && buf[11] === 0x50) {
    return 'webp';
}
// GIF: "GIF8"
if (buf[0] === 0x47 && buf[1] === 0x49 && buf[2] === 0x46 && buf[3] === 0x38) {
    return 'gif';
}
```

---

### B-9. Stale docstring in `drawBarcode()` references removed dependencies

**File:** `src/Svg.ts`, lines 2510–2513

```
* Dependencies:
*   - `svgdom` for creating an SVG window and document.
*   - `JsBarcode` for generating the barcode.
*   - `@svgdotjs/svg.js` for manipulating SVG elements.
```

`svgdom` and `@svgdotjs/svg.js` are no longer dependencies. The docstring is factually incorrect and misleading. Given that this PR replaces both libraries, this is not a cleanup miss — it directly contradicts the PR intent and will confuse future developers.

**Fix:** Update the docstring to reflect `SvgNodeProxy` as the JsBarcode adapter.

---

## SUGGESTIONS — should be addressed

---

### S-1. `NodeImageIO.toBase64DataUri()` — content-type MIME params not stripped

**File:** `src/io/NodeImageIO.ts`, line 96–98

If the server returns `Content-Type: image/png; charset=utf-8`, the subtype extraction produces `png; charset=utf-8`, resulting in `data:image/png; charset=utf-8;base64,...` which is an invalid data URI.

**Fix:**
```typescript
const mime = contentType.split(';')[0].trim();
const subtype = mime.includes('/') ? mime.split('/')[1] : mime;
```

---

### S-2. `SvgCanvas.fill()` — `style` attribute can be overwritten by subsequent `attr()` calls

**File:** `src/svg/SvgCanvas.ts`

If any code calls `mainCanvas.fill(color)` and then later calls `mainCanvas.attr({style: 'something'})`, the background color is silently lost. The `style` attribute is a single string, not an object — there is no style merging. Even fixing B-4 above eliminates this, but worth noting that the current design is fragile.

---

### S-3. `SvgGradient.generateId()` — hash collision is possible and silent

**File:** `src/svg/SvgGradient.ts`, lines 68–78

The djb2-derived hash over stop configurations can collide. If two distinct gradients produce the same hash, they receive the same `id`, and whichever is added to `<defs>` second will silently override the first. The `gradients` Map on `SvgCanvas` stores them by ID, but the collision produces incorrect rendering without any warning.

Consider appending a full base64-encoded JSON of stops rather than a 32-bit hash for a collision-free stable key.

---

### S-4. `SvgCanvas.rect()` calls `el.size(w, h)` redundantly

**File:** `src/svg/SvgCanvas.ts`, lines 67–73

```typescript
rect(w: number, h: number): SvgElement {
    const el = new SvgElement('rect');
    el.setAttr('width', String(w));    // sets width
    el.setAttr('height', String(h));   // sets height
    el.size(w, h);                     // sets width + height again via internal fields
    this.root.add(el);
    return el;
}
```

`el.size(w, h)` calls `setAttr('width', ...)` and `setAttr('height', ...)` again, which are no-ops since the same values are already set. The `_width`/`_height` internal fields on `SvgElement` (used by `getWidth()`/`getHeight()`) are set by `size()`, but `rect()` already sets the attributes manually. This is harmless but confusing.

---

### S-5. `BrowserImageIO.toBase64DataUri()` — O(n) string concatenation for base64 encoding

**File:** `src/io/BrowserImageIO.ts`, lines 141–144

```typescript
for (let i = 0; i < bytes.length; i++) {
    binary += String.fromCharCode(bytes[i]);
}
const base64 = btoa(binary);
```

For a 1MB logo image (1,048,576 bytes), this loop creates ~1M string allocations due to string immutability in JavaScript. This is O(n²) in practice and will cause noticeable slowdowns for large images in the browser.

**Fix:** Use `String.fromCharCode.apply(null, Array.from(bytes.slice(chunk)))` in chunks of 8192 bytes.

---

### S-6. `SvgNodeProxy` — `textContent` and `childNodes` not mutually exclusive

**File:** `src/svg/SvgNodeProxy.ts`, lines 61–68

`ProxyNode.toSvgElement()` adds `this.textContent` as a child AND then iterates `this.childNodes`. If a text node has both set (unusual but possible with JsBarcode internals), the text would appear twice. The `#text` tag type is also emitted as an `<#text>` SVG element, which is invalid SVG.

```typescript
toSvgElement(): SvgElement {
    const el = new SvgElement(this.tagName);
    ...
    if (this.textContent) {
        el.add(this.textContent);  // adds text
    }
    for (const child of this.childNodes) {
        el.add(child.toSvgElement());  // childNodes may also contain text nodes
    }
    return el;
}
```

Text nodes with `tagName === '#text'` should be converted to their `textContent` string directly rather than wrapped in `<#text>` elements.

---

### S-7. `SvgTextMetrics` — all digits have the same width (suspicious)

**File:** `src/svg/SvgTextMetrics.ts`, lines 19–20

```typescript
'0': 53.4, '1': 53.4, '2': 53.4, '3': 53.4, '4': 53.4,
'5': 53.4, '6': 53.4, '7': 53.4, '8': 53.4, '9': 53.4,
```

In Roboto Regular, digits are indeed all the same width (tabular numerals) — this is intentional. However, the value of 53.4 at 100px reference size should be verified against actual Roboto font metrics. A 1–2px error at small font sizes is acceptable but at large frame text sizes could cause noticeable layout shift.

This is flagged as a suggestion, not a blocker, because the comment states these are measured values.

---

### S-8. Missing `select_related` equivalent — `SvgCanvas.defs()` creates a new `SvgCanvasDefs` wrapper on every call

**File:** `src/svg/SvgCanvas.ts`, lines 186–193

Every call to `canvas.defs()` constructs a new `SvgCanvasDefs` wrapper object. The underlying `this._defs` element is shared, so mutation is correct, but object allocation is unnecessary. Low impact, but `defs()` is called in tight loops (once per font import in every barcode/text block).

---

### S-9. `console.log('No sticker found')` in production rendering path

**File:** `src/Svg.ts`, line 2678

```typescript
async addSticker(mainCanvas: any) {
    if (!this.config.sticker || !this.config.sticker.imageUrl) {
        console.log('No sticker found');
        return mainCanvas;
    }
```

This `console.log` fires on every QR code generated without a sticker — i.e., the majority of all calls. This is noise in Lambda CloudWatch logs and costs money per log byte.

**Fix:** Remove the log entirely. The early return is self-documenting.

---

### S-10. Naming: `any` casts throughout `Svg.ts` remain

**File:** `src/Svg.ts`, lines 58–63, 128–129, 652, 728, 1728, 2220, 2229

```typescript
public canvas: any;
public context: any;
public maskCanvas: any;
public TwoDArray: any;
```

These `any` fields were already present in the pre-refactor code, but the migration is an opportunity to tighten them. `canvas` and `context` should be typed as `SvgCanvas`. `TwoDArray` should be `boolean[][] | {i: number; j: number}[][]`. `maskCanvas` appears unused (see S-11).

---

### S-11. Dead code — `maskCanvas` and `canvas` public fields are unused

**File:** `src/Svg.ts`, lines 58–63

```typescript
public canvas: any;
public context: any;
public maskCanvas: any;
```

`canvas` is assigned in the constructor (`this.canvas = new SvgCanvas(...)`) but never read anywhere in the class — `this.QrSvg` is the actual working canvas. `maskCanvas` has a TODO comment (`// TODO: mask canvas`) at line 1176 and is never assigned a value. Both are dead code.

---

## OBSERVATIONS — for awareness

---

### O-1. `SvgCanvas.fill()` argument not escaped — background-color injection

**File:** `src/svg/SvgCanvas.ts`, line 55

```typescript
this.root.setAttr('style', `background:${color}`);
```

`color` is passed through without escaping. If `color` contains `;` followed by CSS declarations, the style attribute could contain unexpected rules. In practice, colors come from the caller's config, so this is low-risk — but if `backgroundColor` ever accepts freeform user input it becomes a CSS injection vector. Note: `escapeAttr()` in `serializeAttrs()` would escape the `"` in the attribute value, but the color itself within the CSS value is not validated.

---

### O-2. `SvgGradient` — `from()`/`to()` set absolute coordinates, not percentages

**File:** `src/svg/SvgGradient.ts`, lines 44–54

svg.js's `from(x, y)` for gradients takes values in the range `[0, 1]` (percentage). The `SvgGradient.from()`/`.to()` methods set them as raw numbers (`x1`, `y1`, `x2`, `y2`). By default, SVG gradient coordinates are in `objectBoundingBox` units (0–1 range), so this is correct if the caller passes 0–1. The one usage in `Svg.ts` line 666 calls `.from(0, 0).to(0, 1)` which is in that range. This is fine but undocumented and fragile.

---

### O-3. `BrowserImageIO` declared globals may conflict with TypeScript DOM lib

**File:** `src/io/BrowserImageIO.ts`, lines 6–38

The file manually declares `fetch`, `btoa`, `Image`, `Blob`, `TextDecoder`, `URL`, `document`, `HTMLCanvasElement`, and `CanvasRenderingContext2D`. The `tsconfig.json` has `"lib": ["es2019"]` with no `"dom"`, so these declarations are necessary. However, if a consumer of this library adds `"dom"` to their tsconfig, these declarations will conflict with the built-in DOM types.

The correct pattern is to use `/// <reference lib="dom" />` at the top of the browser-only file rather than re-declaring globals.

---

### O-4. `webpack.config.js` bundles for `target: node` but `package.json` has `browser` field

**File:** `webpack.config.js`, line 18; `package.json`, line 9

The webpack bundle targets Node.js (`target: 'node'`) and externalizes `sharp`, `probe-image-size`, and `node-fetch`. The `browser` field in `package.json` remaps `NodeImageIO` to `BrowserImageIO`. These two configurations are not aligned: the webpack bundle always embeds `NodeImageIO`; the browser remapping only works for bundlers that respect the `browser` field (webpack/rollup/vite). A browser consumer using the webpack bundle (`dist/bundle.js`) directly would get `NodeImageIO` regardless.

Consider building a separate browser bundle or documenting that `dist/bundle.js` is Node-only.

---

### O-5. `SvgCanvas.clear()` re-inserts `_defs` — double-insertion risk if `clear()` is called after `defs()` was never called

**File:** `src/svg/SvgCanvas.ts`, lines 234–241

```typescript
clear(): this {
    this.root.clear();
    if (this._defs) {
        this.root.insertAt(0, this._defs);  // re-insert defs
    }
    return this;
}
```

If `this._defs` exists (from a prior `gradient()` or `defs()` call) and `clear()` is called, then `defs` is re-inserted at index 0. If `clear()` is called again, `defs` is cleared again and re-inserted — correct. The bug occurs if `_defs` is non-null but its children were already cleared by `root.clear()` (since `_defs` is a child of root, `root.clear()` removes the reference from root.children but `this._defs` still holds the `SvgElement` reference). On re-insert, the empty `<defs>` is added back. This is correct behavior. Marking as observation for clarity.

---

### O-6. Technical debt — `hexToRgb` uses `@ts-ignore` and regex-replace hack

**File:** `src/Svg.ts`, line 2230

```typescript
//@ts-ignore
return hex.replace(/^#?([a-f\d])([a-f\d])([a-f\d])$/i
     ,(m, r, g, b) => '#' + r + r + g + g + b + b)
    .substring(1).match(/.{2}/g)
    .map(x => parseInt(x, 16))
```

This pre-dates the unification and is pre-existing debt, but the v5.0.0 rewrite is an opportunity to replace it with a clean implementation. The `@ts-ignore` suppresses a TypeScript error that could surface real issues.

---

### O-7. `getImageBase64Data` is a thin wrapper with no added value

**File:** `src/Svg.ts`, lines 994–996

```typescript
private async getImageBase64Data(imageUrl: string): Promise<string> {
    return this.imageIO.toBase64DataUri(imageUrl);
}
```

This private method is a one-liner wrapper around `this.imageIO.toBase64DataUri()`. It adds no logic, no error handling, and no documentation. Call sites should use `this.imageIO.toBase64DataUri()` directly. Track in `WORK_LOG.md`.

---

### O-8. Docstring claims `addDesign` is "explicitly for circular frames" but the promise chain always runs it

**File:** `src/Svg.ts`, line 299 and line 635

The comment block at line 261–268 says "addDesign() is explicitly for circular frames, above functions may not run for circular frames." But `addDesign()` is always in the `.then()` chain starting at line 299. `addDesign()` itself has an early return if `frameStyle !== CIRCULAR` (line 636), so the logic is correct — but the comment is misleading about control flow.

---

## Comprehension gate

The following design decisions should be verifiable by the author without re-querying the AI:

1. **Why does `SvgElement.move()` set `x`/`y` rather than `cx`/`cy`?** The current design breaks circle positioning (B-2). What was the intended migration path for `drawCircle()`?
2. **Why is `gradientCounter` module-level rather than per-canvas?** This was presumably for uniqueness across canvases, but the counter breaks the "content-addressable" guarantee stated in the docstring.
3. **What is the expected behavior of `SvgCanvas.fill()` in the Lambda raster pipeline?** The CSS `background` property does not work in `librsvg`. Was this tested?
4. **Why do test files still import `Gradient` from `@svgdotjs/svg.js`?** If the import is unused in the test assertions, when was it removed from the implementation, and why was it not removed from the tests?

---

## Summary table

| ID  | Severity | File(s)                              | Issue                                               |
|-----|----------|--------------------------------------|-----------------------------------------------------|
| B-1 | BLOCKING | `Svg.ts:927, 2667`                   | SVG injection from unescaped logo/watermark content |
| B-2 | BLOCKING | `Svg.ts:1884,1890`, `SvgElement.ts`  | `circle().radius().move()` sets invalid `x`/`y`     |
| B-3 | BLOCKING | `Svg.ts:1653`                        | Hard-coded stroke-width=10 not scaled to moduleSize  |
| B-4 | BLOCKING | `SvgCanvas.ts:51-57`                 | CSS `background` not rendered by librsvg/sharp       |
| B-5 | BLOCKING | `SvgGradient.ts:3`                   | Module-level gradient counter breaks determinism     |
| B-6 | BLOCKING | `src/svg/`, `src/io/`                | Zero unit tests on all seven new modules             |
| B-7 | BLOCKING | `Index.test.ts:1`, `Circular-SVG.test.ts:1` | Tests import removed `@svgdotjs/svg.js` — suite broken |
| B-8 | BLOCKING | `NodeImageIO.ts:64`, `BrowserImageIO.ts:123` | Incorrect WebP magic bytes (false positives)     |
| B-9 | BLOCKING | `Svg.ts:2510-2513`                   | Docstring references removed dependencies            |
| S-1 | SUGGEST  | `NodeImageIO.ts:96`                  | Content-type MIME params not stripped for data URI   |
| S-2 | SUGGEST  | `SvgCanvas.ts`                       | `style` attr overwrite risk with `fill()`            |
| S-3 | SUGGEST  | `SvgGradient.ts`                     | 32-bit hash collision → silent gradient override     |
| S-4 | SUGGEST  | `SvgCanvas.ts:67-73`                 | Redundant `el.size()` after manual attr sets         |
| S-5 | SUGGEST  | `BrowserImageIO.ts:141-144`          | O(n²) string concat for base64 encoding              |
| S-6 | SUGGEST  | `SvgNodeProxy.ts:61-68`              | `#text` nodes emitted as invalid SVG elements        |
| S-7 | SUGGEST  | `SvgTextMetrics.ts`                  | Digit widths — verify against actual Roboto metrics  |
| S-8 | SUGGEST  | `SvgCanvas.ts:186`                   | Needless object allocation per `defs()` call         |
| S-9 | SUGGEST  | `Svg.ts:2678`                        | `console.log` fires on every non-sticker QR code     |
| S-10| SUGGEST  | `Svg.ts:58-63`                       | `any` casts on public fields; tighten types          |
| S-11| SUGGEST  | `Svg.ts:58-63`                       | Dead fields: `canvas` (assigned never read), `maskCanvas` |
| O-1 | OBSERVE  | `SvgCanvas.ts:55`                    | CSS color value not validated — CSS injection risk   |
| O-2 | OBSERVE  | `SvgGradient.ts:44-54`               | `from()`/`to()` units undocumented (0–1 assumption)  |
| O-3 | OBSERVE  | `BrowserImageIO.ts:6-38`             | Manual global re-declarations may conflict with dom lib |
| O-4 | OBSERVE  | `webpack.config.js`, `package.json`  | webpack bundle is Node-only; `browser` field misaligned |
| O-5 | OBSERVE  | `SvgCanvas.ts:234`                   | `clear()` re-inserts defs correctly but subtly       |
| O-6 | OBSERVE  | `Svg.ts:2230`                        | `@ts-ignore` in `hexToRgb()` — pre-existing debt     |
| O-7 | OBSERVE  | `Svg.ts:994`                         | `getImageBase64Data` is a no-value wrapper           |
| O-8 | OBSERVE  | `Svg.ts:261-268`                     | Misleading comment about `addDesign()` control flow  |
