import * as fs from 'fs';
import * as path from 'path';
import { ImageIO, TranscodeOptions } from './ImageIO';

/**
 * FileSystemImageIO — filesystem-based ImageIO for build-time / CLI scripts.
 *
 * No network calls, no sharp, no probe-image-size.
 * Reads images from a configurable base directory (or absolute paths).
 * SVG dimensions extracted via regex; raster probing returns a configurable default.
 * Callers must supply pre-sized images — transcode does not resize.
 */
export class FileSystemImageIO implements ImageIO {
    private baseDir: string;
    private defaultSize: { width: number; height: number };

    constructor(baseDir: string, defaultSize: { width: number; height: number } = { width: 200, height: 200 }) {
        this.baseDir = baseDir;
        this.defaultSize = defaultSize;
    }

    private isDataUri(url: string): boolean {
        return url.startsWith('data:');
    }

    private readUrl(url: string): Buffer {
        if (this.isDataUri(url)) {
            const comma = url.indexOf(',');
            return Buffer.from(url.slice(comma + 1), 'base64');
        }
        return fs.readFileSync(path.join(this.baseDir, url));
    }

    async fetchImage(url: string): Promise<Buffer> {
        return this.readUrl(url);
    }

    async probeSize(input: Buffer | ArrayBuffer | string): Promise<{ width: number; height: number }> {
        const buf = typeof input === 'string' ? this.readUrl(input) : Buffer.from(input as ArrayBuffer);
        const str = buf.slice(0, 4096).toString('utf8');
        const wm = str.match(/width="(\d+)"/);
        const hm = str.match(/height="(\d+)"/);
        if (wm && hm) return { width: +wm[1], height: +hm[1] };
        const vb = str.match(/viewBox="[^"]*\s(\d+(?:\.\d+)?)\s(\d+(?:\.\d+)?)"/);
        if (vb) return { width: Math.round(+vb[1]), height: Math.round(+vb[2]) };
        return { ...this.defaultSize };
    }

    async transcode(input: Buffer | ArrayBuffer, opts: TranscodeOptions): Promise<Buffer> {
        if (opts.width || opts.height) {
            throw new Error(
                'FileSystemImageIO does not support image resizing. ' +
                'Pass pre-sized images or use NodeImageIO with sharp installed.'
            );
        }
        return input instanceof Buffer ? input : Buffer.from(input);
    }

    async detectFormat(input: Buffer | ArrayBuffer): Promise<string> {
        const buf = input instanceof Buffer ? input : Buffer.from(input);
        if (buf[0] === 0x89 && buf[1] === 0x50) return 'png';
        if (buf[0] === 0xFF && buf[1] === 0xD8) return 'jpeg';
        if (buf[0] === 0x52 && buf[1] === 0x49 && buf[2] === 0x46 && buf[3] === 0x46 &&
            buf.length > 11 && buf[8] === 0x57 && buf[9] === 0x45 && buf[10] === 0x42 && buf[11] === 0x50) return 'webp';
        if (buf[0] === 0x47 && buf[1] === 0x49) return 'gif';
        const str = buf.slice(0, 256).toString('utf8').trim();
        if (str.startsWith('<svg') || str.startsWith('<?xml')) return 'svg+xml';
        return 'png';
    }

    async toBase64DataUri(url: string): Promise<string> {
        if (this.isDataUri(url)) return url;
        const buf = this.readUrl(url);
        const fmt = await this.detectFormat(buf);
        const mime = fmt === 'svg+xml' ? 'image/svg+xml' : `image/${fmt}`;
        return `data:${mime};base64,${buf.toString('base64')}`;
    }

    async resizeToBase64(input: Buffer | ArrayBuffer, _width: number, _height: number): Promise<string> {
        const buf = input instanceof Buffer ? input : Buffer.from(input);
        const fmt = await this.detectFormat(buf);
        const mime = fmt === 'svg+xml' ? 'image/svg+xml' : `image/${fmt}`;
        return `data:${mime};base64,${buf.toString('base64')}`;
    }
}
