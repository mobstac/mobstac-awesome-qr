import { ImageIO, TranscodeOptions } from './ImageIO';

// Browser globals — declared here so TypeScript does not require "dom" in tsconfig lib.
// This file is only ever executed in a browser environment; these declarations simply
// inform the compiler that the globals exist at runtime.
declare function fetch(input: string, init?: { method?: string; headers?: Record<string, string>; body?: string }): Promise<{ arrayBuffer(): Promise<ArrayBuffer> }>;
declare function btoa(data: string): string;
declare class Image {
    naturalWidth: number;
    naturalHeight: number;
    crossOrigin: string | null;
    src: string;
    onload: (() => void) | null;
    onerror: (() => void) | null;
}
declare class Blob {
    constructor(parts: ArrayLike<ArrayBuffer | ArrayBufferView | string>, options?: { type?: string });
    readonly type: string;
    arrayBuffer(): Promise<ArrayBuffer>;
}
declare class TextDecoder {
    decode(input: ArrayBufferView): string;
}
declare namespace URL {
    function createObjectURL(blob: Blob): string;
    function revokeObjectURL(url: string): void;
}
declare namespace document {
    function createElement(tag: 'canvas'): HTMLCanvasElement;
}
declare interface HTMLCanvasElement {
    width: number;
    height: number;
    getContext(contextId: '2d'): CanvasRenderingContext2D;
    toBlob(callback: (blob: Blob | null) => void, type?: string): void;
}
declare interface CanvasRenderingContext2D {
    drawImage(image: Image, dx: number, dy: number, dw: number, dh: number): void;
}

const CHUNK_SIZE = 8192;
function bytesToBinary(bytes: Uint8Array): string {
    const chunks: string[] = [];
    for (let i = 0; i < bytes.length; i += CHUNK_SIZE) {
        chunks.push(String.fromCharCode.apply(null, bytes.subarray(i, i + CHUNK_SIZE) as unknown as number[]));
    }
    return chunks.join('');
}

/**
 * BrowserImageIO — Browser/dashboard implementation.
 *
 * Uses image-server proxy pattern for cross-origin fetching.
 * Uses canvas for image transcoding.
 * isSvgUrl always returns false (matching current dashboard behavior).
 */
export class BrowserImageIO implements ImageIO {
    private imageServerURL?: string;
    private imageServerRequestHeaders?: Record<string, string>;

    constructor(imageServerURL?: string, imageServerRequestHeaders?: Record<string, string>) {
        this.imageServerURL = imageServerURL;
        this.imageServerRequestHeaders = imageServerRequestHeaders;
    }

    async fetchImage(url: string): Promise<ArrayBuffer> {
        if (this.imageServerURL) {
            const headers: Record<string, string> = {
                'Content-Type': 'application/json',
                ...(this.imageServerRequestHeaders || {}),
            };
            const response = await fetch(this.imageServerURL, {
                method: 'POST',
                headers,
                body: JSON.stringify({ url }),
            });
            return response.arrayBuffer();
        }
        const response = await fetch(url);
        return response.arrayBuffer();
    }

    async probeSize(input: Buffer | ArrayBuffer | string): Promise<{ width: number; height: number }> {
        if (typeof input === 'string' && !this.imageServerURL) {
            // Direct URL — let the browser fetch it. The server's Content-Type
            // tells the image decoder what to do; no Blob involved.
            return this.probeFromUrl(input);
        }
        const bytes: Buffer | ArrayBuffer = typeof input === 'string'
            ? await this.fetchImage(input)
            : input;
        return this.probeFromBytes(bytes);
    }

    private probeFromUrl(url: string): Promise<{ width: number; height: number }> {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.crossOrigin = 'anonymous';
            img.onload = () => resolve({ width: img.naturalWidth, height: img.naturalHeight });
            img.onerror = () => reject(new Error(`Failed to load image for dimension probing: ${url}`));
            img.src = url;
        });
    }

    private async probeFromBytes(bytes: Buffer | ArrayBuffer): Promise<{ width: number; height: number }> {
        // Browsers will not render SVG from a Blob URL without an explicit
        // image/svg+xml MIME type — they content-sniff binary formats but not
        // SVG. Set the type explicitly via detectFormat so any format works.
        const blobUrl = await this.toTypedBlobUrl(bytes);
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.onload = () => {
                URL.revokeObjectURL(blobUrl);
                resolve({ width: img.naturalWidth, height: img.naturalHeight });
            };
            img.onerror = () => {
                URL.revokeObjectURL(blobUrl);
                reject(new Error('Failed to load image for dimension probing'));
            };
            img.src = blobUrl;
        });
    }

    private async toTypedBlobUrl(bytes: Buffer | ArrayBuffer): Promise<string> {
        const format = await this.detectFormat(bytes);
        const blob = new Blob([bytes], { type: `image/${format}` });
        return URL.createObjectURL(blob);
    }

    async transcode(input: Buffer | ArrayBuffer, opts: TranscodeOptions): Promise<ArrayBuffer> {
        // Set MIME type so SVG (and other formats) decode correctly from the Blob URL.
        const bitmapUrl = await this.toTypedBlobUrl(input);

        return new Promise((resolve, reject) => {
            const img = new Image();
            img.onload = () => {
                const canvas = document.createElement('canvas');
                canvas.width = opts.width || img.naturalWidth;
                canvas.height = opts.height || img.naturalHeight;
                const ctx = canvas.getContext('2d')!;
                ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
                URL.revokeObjectURL(bitmapUrl);

                const mimeType = opts.format === 'jpeg' ? 'image/jpeg'
                    : opts.format === 'webp' ? 'image/webp'
                    : 'image/png';

                canvas.toBlob(async (resultBlob: Blob | null) => {
                    if (resultBlob) {
                        resolve(await resultBlob.arrayBuffer());
                    } else {
                        reject(new Error('Canvas toBlob failed'));
                    }
                }, mimeType);
            };
            img.onerror = () => {
                URL.revokeObjectURL(bitmapUrl);
                reject(new Error('Failed to load image for transcoding'));
            };
            img.src = bitmapUrl;
        });
    }

    async detectFormat(input: Buffer | ArrayBuffer): Promise<string> {
        const bytes = new Uint8Array(input instanceof ArrayBuffer ? input : input.buffer);
        if (bytes[0] === 0x89 && bytes[1] === 0x50) return 'png';
        if (bytes[0] === 0xFF && bytes[1] === 0xD8) return 'jpeg';
        // WebP: RIFF header (bytes 0-3) + "WEBP" at bytes 8-11
        if (bytes[0] === 0x52 && bytes[1] === 0x49 && bytes[2] === 0x46 && bytes[3] === 0x46 &&
            bytes.length > 11 && bytes[8] === 0x57 && bytes[9] === 0x45 && bytes[10] === 0x42 && bytes[11] === 0x50) return 'webp';
        if (bytes[0] === 0x47 && bytes[1] === 0x49) return 'gif';
        // Check SVG
        const str = new TextDecoder().decode(bytes.slice(0, 256)).trim();
        if (str.startsWith('<svg') || str.startsWith('<?xml')) return 'svg+xml';
        return 'png';
    }

    async isSvgUrl(_url: string): Promise<boolean> {
        // In browser, we don't do HEAD requests — matches dashboard behavior
        return false;
    }

    async toBase64DataUri(url: string): Promise<string> {
        const arrayBuffer = await this.fetchImage(url);
        const format = await this.detectFormat(arrayBuffer);
        const base64 = btoa(bytesToBinary(new Uint8Array(arrayBuffer)));
        return `data:image/${format};base64,${base64}`;
    }

    async resizeToBase64(input: Buffer | ArrayBuffer, width: number, height: number): Promise<string> {
        const transcoded = await this.transcode(input, {
            format: 'png',
            width,
            height,
        });
        const base64 = btoa(bytesToBinary(new Uint8Array(transcoded)));
        return `data:image/png;base64,${base64}`;
    }
}
