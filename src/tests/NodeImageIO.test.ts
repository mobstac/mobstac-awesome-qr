import { expect } from 'chai';
import 'mocha';
import { NodeImageIO } from '../io/NodeImageIO';

describe('NodeImageIO', () => {
    let io: NodeImageIO;

    before(() => {
        io = new NodeImageIO();
    });

    describe('detectFormat', () => {
        it('PNG magic bytes → png', async () => {
            const buf = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);
            const fmt = await io.detectFormat(buf);
            expect(fmt).to.equal('png');
        });

        it('JPEG magic bytes → jpeg', async () => {
            const buf = Buffer.from([0xFF, 0xD8, 0xFF, 0xE0, 0x00, 0x10]);
            const fmt = await io.detectFormat(buf);
            expect(fmt).to.equal('jpeg');
        });

        it('WebP full RIFF+WEBP → webp', async () => {
            // RIFF....WEBP
            const buf = Buffer.alloc(12);
            buf[0] = 0x52; buf[1] = 0x49; buf[2] = 0x46; buf[3] = 0x46; // RIFF
            buf[4] = 0x00; buf[5] = 0x00; buf[6] = 0x00; buf[7] = 0x00; // size
            buf[8] = 0x57; buf[9] = 0x45; buf[10] = 0x42; buf[11] = 0x50; // WEBP
            const fmt = await io.detectFormat(buf);
            expect(fmt).to.equal('webp');
        });

        it('GIF magic bytes → gif', async () => {
            const buf = Buffer.from([0x47, 0x49, 0x46, 0x38, 0x39, 0x61]);
            const fmt = await io.detectFormat(buf);
            expect(fmt).to.equal('gif');
        });

        it('<?xml prefix → svg+xml', async () => {
            const buf = Buffer.from('<?xml version="1.0"?><svg></svg>');
            const fmt = await io.detectFormat(buf);
            expect(fmt).to.equal('svg+xml');
        });

        it('<svg prefix → svg+xml', async () => {
            const buf = Buffer.from('<svg xmlns="http://www.w3.org/2000/svg"></svg>');
            const fmt = await io.detectFormat(buf);
            expect(fmt).to.equal('svg+xml');
        });

        it('RIFF-only (WAV) → NOT webp (B-8 regression guard)', async () => {
            // RIFF....WAVE (not WEBP)
            const buf = Buffer.alloc(12);
            buf[0] = 0x52; buf[1] = 0x49; buf[2] = 0x46; buf[3] = 0x46; // RIFF
            buf[4] = 0x00; buf[5] = 0x00; buf[6] = 0x00; buf[7] = 0x00;
            buf[8] = 0x57; buf[9] = 0x41; buf[10] = 0x56; buf[11] = 0x45; // WAVE
            const fmt = await io.detectFormat(buf);
            expect(fmt).to.not.equal('webp');
        });

        it('unknown bytes → png fallback', async () => {
            const buf = Buffer.from([0x00, 0x00, 0x00, 0x00]);
            const fmt = await io.detectFormat(buf);
            expect(fmt).to.equal('png');
        });
    });

    describe('probeSize', () => {
        it('probes dimensions from a PNG buffer', async () => {
            // Create a minimal 1x1 PNG using sharp
            const sharp = require('sharp');
            const pngBuf = await sharp({
                create: { width: 1, height: 1, channels: 4, background: { r: 0, g: 0, b: 0, alpha: 1 } }
            }).png().toBuffer();
            const size = await io.probeSize(pngBuf);
            expect(size.width).to.equal(1);
            expect(size.height).to.equal(1);
        });
    });

    describe('transcode', () => {
        it('transcodes and resizes buffer', async () => {
            const sharp = require('sharp');
            const srcBuf = await sharp({
                create: { width: 100, height: 100, channels: 4, background: { r: 255, g: 0, b: 0, alpha: 1 } }
            }).png().toBuffer();
            const result = await io.transcode(srcBuf, { format: 'png', width: 50, height: 50 });
            expect(result).to.be.instanceOf(Buffer);
            expect(result.length).to.be.greaterThan(0);
            // Verify resized dimensions
            const size = await io.probeSize(result);
            expect(size.width).to.equal(50);
            expect(size.height).to.equal(50);
        });
    });
});
