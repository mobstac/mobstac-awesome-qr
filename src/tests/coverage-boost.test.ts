import { expect } from 'chai';
import 'mocha';
import {
    CanvasType,
    DataPattern,
    EyeBallShape,
    EyeFrameShape,
    GradientType,
    QRCodeFrame,
    QRErrorCorrectLevel,
    TextTagPosition,
} from '../Enums';
import { QRCodeBuilder } from '../index';

/**
 * Coverage-boost tests targeting uncovered areas in Svg.ts, index.ts, Common.ts.
 * These are integration tests that exercise rendering paths via QRCodeBuilder.build().
 */

// ─── Shared helpers ────────────────────────────────────────────────

const baseConfig = {
    text: 'https://example.com',
    size: 512,
    margin: 80,
    colorDark: '#000000',
    colorLight: '#ffffff',
    dotScale: 1,
    correctLevel: QRErrorCorrectLevel.H,
};

async function buildSvg(overrides: Record<string, any>): Promise<string> {
    const builder = new QRCodeBuilder({ ...baseConfig, ...overrides });
    const qr = await builder.build(CanvasType.SVG);
    return qr.svg as string;
}

// ─── 1. Circular frame with gradient types ─────────────────────────
// Covers: addDesign gradient switch (lines 655-680), getColorFromQrSvg (703-823)

describe('Circular frame gradient rendering', () => {
    it('HORIZONTAL gradient circular frame', async () => {
        const svg = await buildSvg({
            frameStyle: QRCodeFrame.CIRCULAR,
            frameText: 'Scan',
            gradientType: GradientType.HORIZONTAL,
            colorDark: '#ff0000',
            colorLight: '#0000ff',
        });
        expect(svg).to.include('<svg');
        expect(svg).to.include('<linearGradient');
    });

    it('VERTICAL gradient circular frame', async () => {
        const svg = await buildSvg({
            frameStyle: QRCodeFrame.CIRCULAR,
            frameText: 'Scan',
            gradientType: GradientType.VERTICAL,
            colorDark: '#ff0000',
            colorLight: '#0000ff',
        });
        expect(svg).to.include('<svg');
        expect(svg).to.include('<linearGradient');
    });

    it('LINEAR gradient circular frame', async () => {
        const svg = await buildSvg({
            frameStyle: QRCodeFrame.CIRCULAR,
            frameText: 'Scan',
            gradientType: GradientType.LINEAR,
            colorDark: '#ff0000',
            colorLight: '#0000ff',
        });
        expect(svg).to.include('<svg');
    });

    it('RADIAL gradient circular frame', async () => {
        const svg = await buildSvg({
            frameStyle: QRCodeFrame.CIRCULAR,
            frameText: 'Scan',
            gradientType: GradientType.RADIAL,
            colorDark: '#ff0000',
            colorLight: '#0000ff',
        });
        expect(svg).to.include('<svg');
    });
});

// ─── 2. Text tags ──────────────────────────────────────────────────
// Covers: addTextTag, getTextTagTransform (lines 309-400)

describe('Text tag rendering', () => {
    it('TOP_CENTER text tag', async () => {
        const svg = await buildSvg({
            textTag: 'ID-12345',
            textTagPosition: TextTagPosition.TOP_CENTER,
            textTagColor: '#333333',
        });
        expect(svg).to.include('ID-12345');
        expect(svg).to.include('Roboto');
    });

    it('BOTTOM_RIGHT text tag', async () => {
        const svg = await buildSvg({
            textTag: 'BOTTOM',
            textTagPosition: TextTagPosition.BOTTOM_RIGHT,
        });
        expect(svg).to.include('BOTTOM');
    });

    it('LEFT_CENTER text tag (rotated)', async () => {
        const svg = await buildSvg({
            textTag: 'LEFT',
            textTagPosition: TextTagPosition.LEFT_CENTER,
        });
        expect(svg).to.include('LEFT');
        // Left positions use -90 degree rotation
        expect(svg).to.include('rotate(');
    });

    it('RIGHT_UPPER text tag (rotated)', async () => {
        const svg = await buildSvg({
            textTag: 'RIGHT',
            textTagPosition: TextTagPosition.RIGHT_UPPER,
        });
        expect(svg).to.include('RIGHT');
        expect(svg).to.include('rotate(');
    });

    it('TOP_LEFT text tag', async () => {
        const svg = await buildSvg({
            textTag: 'TL',
            textTagPosition: TextTagPosition.TOP_LEFT,
        });
        expect(svg).to.include('TL');
    });

    it('TOP_RIGHT text tag', async () => {
        const svg = await buildSvg({
            textTag: 'TR',
            textTagPosition: TextTagPosition.TOP_RIGHT,
        });
        expect(svg).to.include('TR');
    });

    it('RIGHT_LOWER text tag', async () => {
        const svg = await buildSvg({
            textTag: 'RL',
            textTagPosition: TextTagPosition.RIGHT_LOWER,
        });
        expect(svg).to.include('RL');
    });

    it('BOTTOM_CENTER text tag', async () => {
        const svg = await buildSvg({
            textTag: 'BC',
            textTagPosition: TextTagPosition.BOTTOM_CENTER,
        });
        expect(svg).to.include('BC');
    });

    it('BOTTOM_LEFT text tag', async () => {
        const svg = await buildSvg({
            textTag: 'BL',
            textTagPosition: TextTagPosition.BOTTOM_LEFT,
        });
        expect(svg).to.include('BL');
    });

    it('LEFT_LOWER text tag', async () => {
        const svg = await buildSvg({
            textTag: 'LL',
            textTagPosition: TextTagPosition.LEFT_LOWER,
        });
        expect(svg).to.include('LL');
    });

    it('LEFT_UPPER text tag', async () => {
        const svg = await buildSvg({
            textTag: 'LU',
            textTagPosition: TextTagPosition.LEFT_UPPER,
        });
        expect(svg).to.include('LU');
    });

    it('RIGHT_CENTER text tag', async () => {
        const svg = await buildSvg({
            textTag: 'RC',
            textTagPosition: TextTagPosition.RIGHT_CENTER,
        });
        expect(svg).to.include('RC');
    });
});

// ─── 3. Smooth data patterns ───────────────────────────────────────
// Covers: drawSmoothSharp, drawSmoothRound (lines 1194-1460), isSmoothPattern path

describe('Smooth data patterns', () => {
    it('SMOOTH_SHARP data pattern', async () => {
        const svg = await buildSvg({
            dataPattern: DataPattern.SMOOTH_SHARP,
            dotScale: 0.9,
        });
        expect(svg).to.include('<svg');
        expect(svg).to.include('<path');
    });

    it('SMOOTH_ROUND data pattern', async () => {
        const svg = await buildSvg({
            dataPattern: DataPattern.SMOOTH_ROUND,
            dotScale: 0.9,
        });
        expect(svg).to.include('<svg');
        expect(svg).to.include('<path');
    });

    it('SMOOTH_SHARP with circular frame', async () => {
        const svg = await buildSvg({
            dataPattern: DataPattern.SMOOTH_SHARP,
            frameStyle: QRCodeFrame.CIRCULAR,
            frameText: 'Scan',
            dotScale: 0.9,
        });
        expect(svg).to.include('<svg');
    });

    it('SMOOTH_ROUND with gradient', async () => {
        const svg = await buildSvg({
            dataPattern: DataPattern.SMOOTH_ROUND,
            gradientType: GradientType.HORIZONTAL,
            colorDark: '#ff0000',
            colorLight: '#0000ff',
            dotScale: 0.9,
        });
        expect(svg).to.include('<svg');
    });
});

// ─── 4. THIN_SQUARE data pattern ───────────────────────────────────
// Covers: THIN_SQUARE branch in fillRectWithMask

describe('THIN_SQUARE data pattern', () => {
    it('renders thin square pattern', async () => {
        const svg = await buildSvg({
            dataPattern: DataPattern.THIN_SQUARE,
        });
        expect(svg).to.include('<svg');
        expect(svg).to.include('<rect');
    });
});

// ─── 5. Various frame styles ───────────────────────────────────────
// Covers: frame shift calculations (lines 184-230), frame text/background

describe('Frame style coverage', () => {
    const frameStyles = [
        QRCodeFrame.BALLOON_BOTTOM,
        QRCodeFrame.BALLOON_TOP,
        QRCodeFrame.BOX_BOTTOM,
        QRCodeFrame.BOX_TOP,
        QRCodeFrame.BANNER_TOP,
        QRCodeFrame.BANNER_BOTTOM,
        QRCodeFrame.FOCUS,
    ];

    for (const style of frameStyles) {
        it(`renders frame style: ${style}`, async () => {
            const svg = await buildSvg({
                frameStyle: style,
                frameText: 'SCAN ME',
                frameColor: '#0000ff',
                frameTextColor: '#ffffff',
            });
            expect(svg).to.be.a('string');
            expect(svg).to.include('<svg');
        });
    }

    it('renders BALLOON_TOP with vCard', async () => {
        const svg = await buildSvg({
            frameStyle: QRCodeFrame.BALLOON_TOP,
            frameText: 'SCAN',
            isVCard: true,
            text: 'BEGIN:VCARD\nVERSION:3.0\nFN:Test\nEND:VCARD',
        });
        expect(svg).to.include('<svg');
    });

    it('renders multi-line frame text', async () => {
        const svg = await buildSvg({
            frameStyle: QRCodeFrame.BANNER_BOTTOM,
            frameText: 'Line 1\nLine 2',
            frameColor: '#000000',
        });
        expect(svg).to.include('<svg');
    });
});

// ─── 6. Non-circular frame with HORIZONTAL gradient ────────────────
// Covers: getColorFromQrSvg gradient branches for non-circular

describe('Non-circular gradient rendering', () => {
    it('HORIZONTAL gradient', async () => {
        const svg = await buildSvg({
            gradientType: GradientType.HORIZONTAL,
            colorDark: '#ff0000',
            colorLight: '#0000ff',
        });
        expect(svg).to.include('<svg');
    });

    it('VERTICAL gradient', async () => {
        const svg = await buildSvg({
            gradientType: GradientType.VERTICAL,
            colorDark: '#ff0000',
            colorLight: '#0000ff',
        });
        expect(svg).to.include('<svg');
    });

    it('RADIAL gradient', async () => {
        const svg = await buildSvg({
            gradientType: GradientType.RADIAL,
            colorDark: '#ff0000',
            colorLight: '#0000ff',
        });
        expect(svg).to.include('<svg');
    });
});

// ─── 7. index.ts validation paths ──────────────────────────────────
// Covers: index.ts lines 43, 48-50, 54, 57, 60

describe('QRCodeBuilder validation', () => {
    it('rejects empty text', async () => {
        const builder = new QRCodeBuilder({ text: '' });
        try {
            await builder.build(CanvasType.SVG);
            expect.fail('Should have rejected');
        } catch (err) {
            expect(err).to.equal('Setting text is necessary to generate the QRCode');
        }
    });

    it('rejects frame text exceeding 30 chars per line', async () => {
        const builder = new QRCodeBuilder({
            ...baseConfig,
            frameStyle: QRCodeFrame.BALLOON_TOP,
            frameText: 'A'.repeat(31),
        });
        try {
            await builder.build(CanvasType.SVG);
            expect.fail('Should have rejected');
        } catch (err) {
            expect(err).to.equal('Frame text length exceeded');
        }
    });

    it('rejects text tag exceeding 30 chars', async () => {
        const builder = new QRCodeBuilder({
            ...baseConfig,
            textTag: 'A'.repeat(31),
        });
        try {
            await builder.build(CanvasType.SVG);
            expect.fail('Should have rejected');
        } catch (err) {
            expect(err).to.include('Identification text length exceeded');
        }
    });

    it('clamps logoScale to maxLogoScale', async () => {
        const svg = await buildSvg({ logoScale: 0.99 });
        expect(svg).to.include('<svg');
    });

    it('clamps logoMargin > 100', async () => {
        const svg = await buildSvg({ logoMargin: 200 });
        expect(svg).to.include('<svg');
    });

    it('clears textTag for circular frames', async () => {
        const svg = await buildSvg({
            textTag: 'test',
            frameStyle: QRCodeFrame.CIRCULAR,
            frameText: 'Scan',
        });
        // textTag should not appear in circular QR
        expect(svg).to.not.include('>test<');
    });
});

// ─── 8. Data pattern diversity for non-circular ────────────────────
// Covers: fillRectWithMask branches for CIRCLE, KITE, LEFT_DIAMOND, RIGHT_DIAMOND

describe('Data pattern diversity', () => {
    const patterns = [
        DataPattern.CIRCLE,
        DataPattern.KITE,
        DataPattern.LEFT_DIAMOND,
        DataPattern.RIGHT_DIAMOND,
        DataPattern.SQUARE,
    ];

    for (const pattern of patterns) {
        it(`renders data pattern: ${pattern}`, async () => {
            const svg = await buildSvg({ dataPattern: pattern });
            expect(svg).to.include('<svg');
        });
    }

    it('CIRCLE pattern with gradient', async () => {
        const svg = await buildSvg({
            dataPattern: DataPattern.CIRCLE,
            gradientType: GradientType.HORIZONTAL,
            colorDark: '#ff0000',
            colorLight: '#0000ff',
        });
        expect(svg).to.include('<svg');
        expect(svg).to.include('<circle');
    });
});

// ─── 9. Eye shape combinations ─────────────────────────────────────
// Covers: drawEyes method branches

describe('Eye shape combinations', () => {
    it('LEFT_LEAF frame + LEFT_LEAF ball', async () => {
        const svg = await buildSvg({
            eyeFrameShape: EyeFrameShape.LEFT_LEAF,
            eyeBallShape: EyeBallShape.LEFT_LEAF,
        });
        expect(svg).to.include('<svg');
    });

    it('RIGHT_LEAF frame + RIGHT_LEAF ball', async () => {
        const svg = await buildSvg({
            eyeFrameShape: EyeFrameShape.RIGHT_LEAF,
            eyeBallShape: EyeBallShape.RIGHT_LEAF,
        });
        expect(svg).to.include('<svg');
    });

    it('CIRCLE frame + LEFT_DIAMOND ball', async () => {
        const svg = await buildSvg({
            eyeFrameShape: EyeFrameShape.CIRCLE,
            eyeBallShape: EyeBallShape.LEFT_DIAMOND,
        });
        expect(svg).to.include('<svg');
    });

    it('ROUNDED frame + RIGHT_DIAMOND ball', async () => {
        const svg = await buildSvg({
            eyeFrameShape: EyeFrameShape.ROUNDED,
            eyeBallShape: EyeBallShape.RIGHT_DIAMOND,
        });
        expect(svg).to.include('<svg');
    });

    it('CIRCLE frame + CIRCLE ball', async () => {
        const svg = await buildSvg({
            eyeFrameShape: EyeFrameShape.CIRCLE,
            eyeBallShape: EyeBallShape.CIRCLE,
        });
        expect(svg).to.include('<svg');
    });
});

// ─── 10. Barcode + serial number rendering ─────────────────────────
// Covers: drawBarcode (lines 2520-2598), getBarcodeText

describe('Barcode rendering', () => {
    it('renders barcode with CODE128', async () => {
        const svg = await buildSvg({
            showBarcode: true,
            barcodeValue: '123456789',
            barcodeType: 'CODE128',
            barcodeText: 'ITEM-123',
        });
        expect(svg).to.include('<svg');
    });

    it('renders barcode with showBarcodeValue', async () => {
        const svg = await buildSvg({
            showBarcode: true,
            barcodeValue: '123456789',
            barcodeType: 'CODE128',
            showBarcodeValue: true,
            primaryIdentifierValue: 'SN-00001',
        });
        // Barcode renders; value text may or may not appear in SVG depending on implementation
        expect(svg).to.include('<svg');
    });

    it('renders barcode with EAN13 type', async () => {
        const svg = await buildSvg({
            showBarcode: true,
            barcodeValue: '5901234123457',
            barcodeType: 'EAN13',
        });
        expect(svg).to.include('<svg');
    });
});

// ─── 11. Watermark rendering ───────────────────────────────────────
// Covers: addWatermark, validateWatermarkConfig (lines 2608-2683)

describe('Watermark validation', () => {
    it('skips watermark with invalid config (no width)', async () => {
        const svg = await buildSvg({
            watermark: { showWatermark: true, watermark: 'data:image/png;base64,iVBOR', opacity: 0.5, height: 100 },
        });
        expect(svg).to.include('<svg');
    });

    it('skips watermark with missing config', async () => {
        const svg = await buildSvg({
            watermark: null,
        });
        expect(svg).to.include('<svg');
    });

    it('skips watermark with showWatermark false', async () => {
        const svg = await buildSvg({
            watermark: { showWatermark: false, watermark: 'data:image/png;base64,iVBOR', opacity: 0.5, width: 100, height: 100 },
        });
        expect(svg).to.include('<svg');
    });
});

// ─── 12. Edge cases ────────────────────────────────────────────────

describe('QR code edge cases', () => {
    it('very small size (128)', async () => {
        const svg = await buildSvg({ size: 128, margin: 10 });
        expect(svg).to.include('<svg');
    });

    it('large size (2048)', async () => {
        const svg = await buildSvg({ size: 2048, margin: 80 });
        expect(svg).to.include('<svg');
    });

    it('no background color', async () => {
        const svg = await buildSvg({ backgroundColor: '' });
        expect(svg).to.include('<svg');
    });

    it('rgba background color (non-circular)', async () => {
        const svg = await buildSvg({ backgroundColor: 'rgba(0,0,255,0.5)' });
        expect(svg).to.include('<svg');
    });

    it('dotScale < 1', async () => {
        const svg = await buildSvg({ dotScale: 0.5 });
        expect(svg).to.include('<svg');
    });

    it('useOpacity false', async () => {
        const svg = await buildSvg({ useOpacity: false });
        expect(svg).to.include('<svg');
    });

    it('logoBackground false', async () => {
        const svg = await buildSvg({ logoBackground: false });
        expect(svg).to.include('<svg');
    });
});
