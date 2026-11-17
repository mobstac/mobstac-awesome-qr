import { expect } from 'chai';
import 'mocha';
import { CanvasType, QRCodeFrame } from '../Enums';
import { QRCodeBuilder } from '../index';
import { BrowserImageIO } from '../io/BrowserImageIO';
import { NodeImageIO } from '../io/NodeImageIO';

/**
 * Browser adaptations ported from dashboard_version:
 * 1. In a browser, image I/O is always BrowserImageIO — bundlers swap NodeImageIO.js for
 *    BrowserImageIO.js, so falling back to `new NodeImageIO()` threw "not a constructor".
 * 2. In a browser, the root <svg> has no width/height (only a viewBox), so the QR scales to
 *    its container. Node output keeps the fixed size.
 *
 * A browser is simulated by defining a `window` global for the duration of a test.
 */

const TEXT = 'https://uniqode.com';

/** The root `<svg ...>` tag of `svg`. */
function rootTag(svg: string): string {
    const match = svg.match(/<svg\b[^>]*>/);
    return match ? match[0] : '';
}

/** Runs `fn` with a `window` global defined, removing it afterwards. */
async function inBrowser<T>(fn: () => Promise<T>): Promise<T> {
    (globalThis as any).window = {};
    try {
        return await fn();
    } finally {
        delete (globalThis as any).window;
    }
}

describe('Browser environment', () => {
    describe('image I/O', () => {
        it('uses BrowserImageIO in a browser without an image server', async () => {
            const qr = await inBrowser(() => new QRCodeBuilder({ text: TEXT }).build(CanvasType.SVG));
            expect(qr.svgDrawing.imageIO).to.be.instanceOf(BrowserImageIO);
            expect(qr.svg).to.match(/^<svg\b/);
        });

        it('passes the image server to BrowserImageIO in a browser', async () => {
            const headers = { authorization: 'Token abc' };
            const qr = await inBrowser(() =>
                new QRCodeBuilder({ text: TEXT, imageServerURL: 'https://images.example.com', imageServerRequestHeaders: headers })
                    .build(CanvasType.SVG));
            const imageIO = qr.svgDrawing.imageIO as any;
            expect(imageIO).to.be.instanceOf(BrowserImageIO);
            expect(imageIO.imageServerURL).to.equal('https://images.example.com');
            expect(imageIO.imageServerRequestHeaders).to.deep.equal(headers);
        });

        it('still prefers an explicit imageIO in a browser', async () => {
            const imageIO = new NodeImageIO();
            const qr = await inBrowser(() => new QRCodeBuilder({ text: TEXT, imageIO }).build(CanvasType.SVG));
            expect(qr.svgDrawing.imageIO).to.equal(imageIO);
        });

        it('uses NodeImageIO in Node', async () => {
            const qr = await new QRCodeBuilder({ text: TEXT }).build(CanvasType.SVG);
            expect(qr.svgDrawing.imageIO).to.be.instanceOf(NodeImageIO);
        });

        it('rejects an image server URL in Node', async () => {
            let error: unknown;
            try {
                await new QRCodeBuilder({ text: TEXT, imageServerURL: 'https://images.example.com' }).build(CanvasType.SVG);
            } catch (e) {
                error = e;
            }
            expect(String(error)).to.contain('imageServerURL requires a browser environment');
        });
    });

    describe('root size', () => {
        const FRAMES = [QRCodeFrame.NONE, QRCodeFrame.BANNER_BOTTOM, QRCodeFrame.CIRCULAR];

        FRAMES.forEach((frameStyle) => {
            it(`drops width/height and keeps the viewBox in a browser (frame: ${frameStyle})`, async () => {
                const { svg } = await inBrowser(() =>
                    new QRCodeBuilder({ text: TEXT, frameStyle, frameText: 'SCAN ME' }).build(CanvasType.SVG));
                const root = rootTag(svg);
                expect(root).not.to.match(/\swidth=/);
                expect(root).not.to.match(/\sheight=/);
                expect(root).to.match(/\sviewBox="0 0 [\d.]+ [\d.]+"/);
            });

            it(`keeps width/height in Node (frame: ${frameStyle})`, async () => {
                const { svg } = await new QRCodeBuilder({ text: TEXT, frameStyle, frameText: 'SCAN ME' }).build(CanvasType.SVG);
                const root = rootTag(svg);
                expect(root).to.match(/\swidth="[\d.]+"/);
                expect(root).to.match(/\sheight="[\d.]+"/);
            });
        });

        it('keeps the taller viewBox of a framed QR in a browser', async () => {
            const { svg } = await inBrowser(() =>
                new QRCodeBuilder({ text: TEXT, frameStyle: QRCodeFrame.BANNER_BOTTOM, frameText: 'SCAN ME' }).build(CanvasType.SVG));
            const [, , width, height] = rootTag(svg).match(/viewBox="([^"]*)"/)![1].split(' ').map(Number);
            expect(height).to.be.greaterThan(width);
        });
    });
});
