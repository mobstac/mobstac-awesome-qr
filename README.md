
# Mobstac Awesome QR

A TypeScript library for generating customizable QR codes as SVG. Supports logos, custom eye shapes, data patterns, gradients, frames, barcodes, stickers, text tags, and more.

## Installation

```bash
npm install mobstac-awesome-qr
```

**Node.js requirements:** Node 14+ (Node 18+ recommended for native `fetch`).

Optional peer dependencies for Node.js (installed automatically if available):

- `sharp` — image resizing and format conversion for logos/backgrounds
- `probe-image-size` — image dimension probing for logo sizing
- `node-fetch` — HTTP fetching on Node < 18 (Node 18+ uses native `fetch`)

These are not needed in browser environments.

## Quick start

```typescript
import { QRCodeBuilder } from 'mobstac-awesome-qr';
import { CanvasType } from 'mobstac-awesome-qr/lib/Enums';

const builder = new QRCodeBuilder({
    text: 'https://example.com',
    size: 1024,
    colorDark: '#000000',
    colorLight: '#ffffff',
});

const qrCode = await builder.build(CanvasType.SVG);
console.log(qrCode.svg); // SVG string
```

## Configuration

Pass a config object to `QRCodeBuilder`. All fields except `text` have sensible defaults.

### Core options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `text` | `string` | (required) | Data to encode. URL, plain text, or vCard string. |
| `size` | `number` | `800` | Output size in pixels. Recommended: 512, 800, 1024, 2048, 4096. |
| `margin` | `number` | `size/12` | Quiet zone margin in pixels. |
| `correctLevel` | `QRErrorCorrectLevel` | `H` | Error correction: `L`, `M`, `Q`, `H`. |
| `typeNumber` | `number` | `4` | QR version (1-40). Higher = more data capacity. |

### Colors and gradients

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `colorDark` | `string` | `'#000000'` | Foreground (dark module) color. |
| `colorLight` | `string` | `'#ffffff'` | Background (light module) color. |
| `backgroundColor` | `string` | — | Overall background color. |
| `gradientType` | `GradientType` | `NONE` | `NONE`, `LINEAR`, `RADIAL`, `VERTICAL`, `HORIZONTAL`. |

### Data pattern

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `dataPattern` | `DataPattern` | `SQUARE` | Module shape: `SQUARE`, `CIRCLE`, `KITE`, `LEFT_DIAMOND`, `RIGHT_DIAMOND`, `THIN_SQUARE`, `SMOOTH_ROUND`, `SMOOTH_SHARP`. |
| `dotScale` | `number` | `0.35` | Scale of each data module (0-1). |

### Eye customization

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `eyeFrameShape` | `EyeFrameShape` | — | Frame shape: `SQUARE`, `CIRCLE`, `ROUNDED`, `LEFT_LEAF`, `RIGHT_LEAF`. |
| `eyeBallShape` | `EyeBallShape` | — | Ball shape: `SQUARE`, `CIRCLE`, `ROUNDED`, `LEFT_LEAF`, `RIGHT_LEAF`, `LEFT_DIAMOND`, `RIGHT_DIAMOND`. |
| `eyeFrameColor` | `string` | — | Eye frame color (hex). |
| `eyeBallColor` | `string` | — | Eye ball color (hex). |

### Logo

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `logoImage` | `string` | — | URL to logo image. |
| `logoScale` | `number` | `0.15` | Logo size relative to QR code (max 0.27). |
| `logoMargin` | `number` | `size/48` | Margin around logo in pixels. |
| `logoCornerRadius` | `number` | `8` | Logo background corner radius. |
| `logoBackground` | `boolean` | `true` | Show white background behind logo. |
| `logoWidth` | `number` | `0` | Override logo width (0 = auto). |
| `logoHeight` | `number` | `0` | Override logo height (0 = auto). |

### Background image

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `backgroundImage` | `string` | — | URL to background image. |
| `backgroundDimming` | `string` | `'rgba(0,0,0,0)'` | Dimming overlay color on background. |

### Frame

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `frameStyle` | `QRCodeFrame` | `NONE` | `NONE`, `BOX_BOTTOM`, `BOX_TOP`, `BANNER_TOP`, `BANNER_BOTTOM`, `BALLOON_BOTTOM`, `BALLOON_TOP`, `CIRCULAR`, `TEXT_ONLY`, `FOCUS`. |
| `frameColor` | `string` | — | Frame color (hex). |
| `frameText` | `string` | — | Text displayed in frame (max 30 chars). |
| `frameTextColor` | `string` | — | Frame text color (hex). |

### Text tag

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `textTag` | `string` | — | Identification text label (max 30 chars). |
| `textTagColor` | `string` | — | Text tag color. |
| `textTagFontSize` | `number` | — | Text tag font size. |
| `textTagPosition` | `TextTagPosition` | — | Position: `TOP_CENTER`, `TOP_RIGHT`, `RIGHT_UPPER`, `RIGHT_CENTER`, `RIGHT_LOWER`, `BOTTOM_RIGHT`, `BOTTOM_CENTER`, `BOTTOM_LEFT`, `LEFT_LOWER`, `LEFT_CENTER`, `LEFT_UPPER`, `TOP_LEFT`. |

### Barcode

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `showBarcode` | `boolean` | `false` | Show barcode below QR code. |
| `barcodeValue` | `string` | — | Barcode data value. |
| `barcodeType` | `string` | `'CODE128'` | Barcode format (any JsBarcode-supported type). |
| `showBarcodeValue` | `boolean` | `false` | Show human-readable barcode value. |

### Sticker

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `sticker` | `Sticker` | — | Sticker overlay config (see below). |

```typescript
interface Sticker {
    imageUrl: string;        // URL to sticker image
    qrCodeX?: number;        // QR code X position within sticker
    qrCodeY?: number;        // QR code Y position within sticker
    qrCodeScale?: number;    // QR code scale within sticker (0-1)
    qrCodeRotate?: number;   // QR code rotation in degrees
}
```

### Advanced

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `isVCard` | `boolean` | `false` | Set `true` when `text` is a vCard string. |
| `maskedDots` | `boolean` | `false` | Apply mask to data dots. |
| `useOpacity` | `boolean` | `true` | Use opacity for overlapping elements. |
| `rectangular` | `boolean` | `false` | Use rectangular logo dimensions. |
| `skipImageValidation` | `boolean` | — | Skip image dimension probing for logos. |
| `imageIO` | `ImageIO` | auto | Custom image I/O adapter (advanced). |

### Browser usage

In browser environments, the package automatically uses `BrowserImageIO` instead of `NodeImageIO` (via the `browser` field in `package.json`). If your logos/backgrounds are on a different origin, provide an image proxy:

```typescript
import { BrowserImageIO } from 'mobstac-awesome-qr/lib/io/BrowserImageIO';

const builder = new QRCodeBuilder({
    text: 'https://example.com',
    imageIO: new BrowserImageIO(
        'https://your-proxy.example.com/image',  // proxy URL
        { Authorization: 'Bearer ...' }           // optional headers
    ),
});
```

## Full example

```typescript
import { QRCodeBuilder } from 'mobstac-awesome-qr';
import {
    CanvasType,
    DataPattern,
    EyeBallShape,
    EyeFrameShape,
    GradientType,
    QRCodeFrame,
    QRErrorCorrectLevel,
} from 'mobstac-awesome-qr/lib/Enums';

const builder = new QRCodeBuilder({
    text: 'https://example.com',
    size: 1024,
    margin: 80,
    correctLevel: QRErrorCorrectLevel.H,
    colorDark: '#1a1a2e',
    colorLight: '#e94560',
    backgroundColor: '#ffffff',
    gradientType: GradientType.LINEAR,
    dataPattern: DataPattern.SMOOTH_ROUND,
    eyeFrameShape: EyeFrameShape.ROUNDED,
    eyeBallShape: EyeBallShape.CIRCLE,
    eyeFrameColor: '#1a1a2e',
    eyeBallColor: '#e94560',
    logoImage: 'https://example.com/logo.png',
    logoScale: 0.2,
    logoBackground: true,
    frameStyle: QRCodeFrame.BANNER_BOTTOM,
    frameColor: '#1a1a2e',
    frameText: 'SCAN ME',
    frameTextColor: '#ffffff',
});

const qrCode = await builder.build(CanvasType.SVG);

// qrCode.svg contains the SVG string
// qrCode.toBuffer() returns a Buffer for file writing
```

## Enums reference

Import from `mobstac-awesome-qr/lib/Enums`:

| Enum | Values |
|------|--------|
| `CanvasType` | `SVG`, `PNG`, `JPEG`, `PDF` |
| `QRErrorCorrectLevel` | `L`, `M`, `Q`, `H` |
| `DataPattern` | `SQUARE`, `CIRCLE`, `KITE`, `LEFT_DIAMOND`, `RIGHT_DIAMOND`, `THIN_SQUARE`, `SMOOTH_ROUND`, `SMOOTH_SHARP` |
| `EyeFrameShape` | `SQUARE`, `CIRCLE`, `ROUNDED`, `LEFT_LEAF`, `RIGHT_LEAF` |
| `EyeBallShape` | `SQUARE`, `CIRCLE`, `ROUNDED`, `LEFT_LEAF`, `RIGHT_LEAF`, `LEFT_DIAMOND`, `RIGHT_DIAMOND` |
| `GradientType` | `NONE`, `LINEAR`, `RADIAL`, `VERTICAL`, `HORIZONTAL` |
| `QRCodeFrame` | `NONE`, `BOX_BOTTOM`, `BOX_TOP`, `BANNER_TOP`, `BANNER_BOTTOM`, `BALLOON_BOTTOM`, `BALLOON_TOP`, `CIRCULAR`, `TEXT_ONLY`, `FOCUS` |
| `TextTagPosition` | `TOP_CENTER`, `TOP_RIGHT`, `RIGHT_UPPER`, `RIGHT_CENTER`, `RIGHT_LOWER`, `BOTTOM_RIGHT`, `BOTTOM_CENTER`, `BOTTOM_LEFT`, `LEFT_LOWER`, `LEFT_CENTER`, `LEFT_UPPER`, `TOP_LEFT` |

## Development

```bash
git clone git@github.com:mobstac/mobstac-awesome-qr.git
cd mobstac-awesome-qr
npm install
```

### Build

```bash
npm run build     # tsc + webpack
```

### Test

```bash
npm test              # full suite (61 tests)
npm run testMain      # basic SVG generation
npm run testCircular  # circular frame variants
npm run testFrame     # frame style tests
npm run testLogos     # logo tests
```

Generated test SVGs are written to `src/tests/qrTests/` — open them in a browser to visually inspect.

## Architecture (v5.0.0)

v5.0.0 replaced the `svg.js` + `svgdom` dependency with a custom deterministic SVG builder:

```
src/
  svg/
    SvgElement.ts       # Base element — deterministic attribute serialization
    SvgCanvas.ts        # Chainable drawing API (<svg> root)
    SvgGradient.ts      # Content-addressable gradient <defs>
    SvgTextMetrics.ts   # Pre-computed Roboto 400 width table
    SvgNodeProxy.ts     # Minimal DOM proxy for JsBarcode
  io/
    ImageIO.ts          # Environment-agnostic image I/O interface
    NodeImageIO.ts      # Node.js: sharp + probe-image-size + fetch
    BrowserImageIO.ts   # Browser: canvas + Image + proxy pattern
```

This produces byte-for-byte identical SVG output in both Node.js and browser environments.

## License

Apache-2.0
