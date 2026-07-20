import { ImageIO, TranscodeOptions } from './ImageIO';

const probe: any = require('probe-image-size');

const DEFAULT_TIMEOUT_MS = 30_000;

/**
 * NodeImageIO — Node.js/Lambda implementation.
 *
 * Uses native fetch (Node 18+).
 * sharp is an optional peer dependency — only required if transcode() is called.
 */
export class NodeImageIO implements ImageIO {
    private timeoutMs: number;

    constructor(timeoutMs: number = DEFAULT_TIMEOUT_MS) {
        this.timeoutMs = timeoutMs;
    }

    async fetchImage(url: string): Promise<Buffer> {
        const response = await fetch(url, { signal: AbortSignal.timeout(this.timeoutMs) });
        if (!response.ok) {
            throw new Error(`Failed to fetch image: ${response.status} ${response.statusText} (${url})`);
        }
        const arrayBuffer = await response.arrayBuffer();
        return Buffer.from(arrayBuffer);
    }

    async probeSize(input: Buffer | ArrayBuffer | string): Promise<{ width: number; height: number }> {
        if (typeof input === 'string') {
            // URL — probe directly
            const result = await probe(input);
            return { width: result.width, height: result.height };
        }
        // Buffer — probe from buffer via stream
        const buf = input instanceof Buffer ? input : Buffer.from(input);
        const { Readable } = require('stream');
        const stream = new Readable();
        stream.push(buf);
        stream.push(null);
        const result = await probe(stream);
        return { width: result.width, height: result.height };
    }

    async transcode(input: Buffer | ArrayBuffer, opts: TranscodeOptions): Promise<Buffer> {
        let sharp: any;
        try { sharp = require('sharp'); } catch {
            throw new Error('Image resizing/transcoding requires "sharp". Install it with: npm install sharp — or provide pre-sized images to avoid transcoding.');
        }
        const buf = input instanceof Buffer ? input : Buffer.from(input);
        let pipeline = sharp(buf);
        if (opts.width || opts.height) {
            pipeline = pipeline.resize({
                width: opts.width ? Math.round(opts.width) : undefined,
                height: opts.height ? Math.round(opts.height) : undefined,
                fit: (opts.fit as any) || 'fill',
            });
        }
        switch (opts.format) {
            case 'png': pipeline = pipeline.png(); break;
            case 'jpeg': pipeline = pipeline.jpeg(); break;
            case 'webp': pipeline = pipeline.webp(); break;
            default: pipeline = pipeline.png(); break;
        }
        return pipeline.toBuffer();
    }

    async detectFormat(input: Buffer | ArrayBuffer): Promise<string> {
        return this.sniffFormat(input) || 'png'; // fallback
    }

    /** Format from magic bytes, or null when no signature matches. */
    private sniffFormat(input: Buffer | ArrayBuffer): string | null {
        const buf = input instanceof Buffer ? input : Buffer.from(input);
        // Check magic bytes
        if (buf[0] === 0x89 && buf[1] === 0x50) return 'png';
        if (buf[0] === 0xFF && buf[1] === 0xD8) return 'jpeg';
        // WebP: RIFF header (bytes 0-3) + "WEBP" at bytes 8-11
        if (buf[0] === 0x52 && buf[1] === 0x49 && buf[2] === 0x46 && buf[3] === 0x46 &&
            buf.length > 11 && buf[8] === 0x57 && buf[9] === 0x45 && buf[10] === 0x42 && buf[11] === 0x50) return 'webp';
        if (buf[0] === 0x47 && buf[1] === 0x49) return 'gif';
        // Check if it's SVG (starts with < or whitespace + <)
        const str = buf.slice(0, 256).toString('utf8').trim();
        if (str.startsWith('<svg') || str.startsWith('<?xml')) return 'svg+xml';
        return null;
    }

    async isSvgUrl(url: string): Promise<boolean> {
        try {
            const response = await fetch(url, { method: 'HEAD', signal: AbortSignal.timeout(this.timeoutMs) });
            const contentType = response.headers.get('content-type') || '';
            return contentType.indexOf('svg') !== -1;
        } catch {
            return false;
        }
    }

    async toBase64DataUri(url: string): Promise<string> {
        const response = await fetch(url, { signal: AbortSignal.timeout(this.timeoutMs) });
        if (!response.ok) {
            throw new Error(`Failed to fetch image: ${response.status} ${response.statusText} (${url})`);
        }
        const arrayBuffer = await response.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        // Prefer magic bytes over the header — mismatched types (e.g. PNG bytes served as
        // "image/jpg") are tolerated by browsers but rejected by librsvg. Fall back to the
        // header (then png) only when the bytes carry no recognizable signature.
        const sniffed = this.sniffFormat(buffer);
        const headerType = (response.headers.get('content-type') || '').split(';')[0].trim();
        const mime = sniffed
            ? (sniffed === 'svg+xml' ? 'image/svg+xml' : `image/${sniffed}`)
            : (headerType || 'image/png');
        const base64 = buffer.toString('base64');
        return `data:${mime};base64,${base64}`;
    }

    async resizeToBase64(input: Buffer | ArrayBuffer, width: number, height: number): Promise<string> {
        const buffer = await this.transcode(input, {
            format: 'png',
            width,
            height,
            fit: 'fill',
        });
        const base64 = Buffer.from(buffer).toString('base64');
        return `data:image/png;base64,${base64}`;
    }
}
