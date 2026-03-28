import { ImageIO, TranscodeOptions } from './ImageIO';

// Browser globals — declared here so TypeScript does not require "dom" in tsconfig lib.
// This file is only ever executed in a browser environment; these declarations simply
// inform the compiler that the globals exist at runtime.
declare function fetch(input: string, init?: { headers?: Record<string, string> }): Promise<{ arrayBuffer(): Promise<ArrayBuffer> }>;
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
    constructor(parts: ArrayLike<ArrayBuffer | ArrayBufferView | string>);
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
        const fetchUrl = this.imageServerURL
            ? `${this.imageServerURL}?url=${encodeURIComponent(url)}`
            : url;
        const headers = this.imageServerRequestHeaders || {};
        const response = await fetch(fetchUrl, { headers });
        return response.arrayBuffer();
    }

    async probeSize(input: Buffer | ArrayBuffer | string): Promise<{ width: number; height: number }> {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.onload = () => resolve({ width: img.naturalWidth, height: img.naturalHeight });
            img.onerror = () => reject(new Error('Failed to load image for dimension probing'));

            if (typeof input === 'string') {
                // URL
                img.crossOrigin = 'anonymous';
                img.src = this.imageServerURL
                    ? `${this.imageServerURL}?url=${encodeURIComponent(input)}`
                    : input;
            } else {
                // ArrayBuffer — convert to blob URL
                const blob = new Blob([input]);
                img.src = URL.createObjectURL(blob);
            }
        });
    }

    async transcode(input: Buffer | ArrayBuffer, opts: TranscodeOptions): Promise<ArrayBuffer> {
        const blob = new Blob([input]);
        const bitmapUrl = URL.createObjectURL(blob);

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
        const bytes = new Uint8Array(arrayBuffer);
        let binary = '';
        for (let i = 0; i < bytes.length; i++) {
            binary += String.fromCharCode(bytes[i]);
        }
        const base64 = btoa(binary);
        return `data:image/${format};base64,${base64}`;
    }

    async resizeToBase64(input: Buffer | ArrayBuffer, width: number, height: number): Promise<string> {
        const transcoded = await this.transcode(input, {
            format: 'png',
            width,
            height,
        });
        const bytes = new Uint8Array(transcoded);
        let binary = '';
        for (let i = 0; i < bytes.length; i++) {
            binary += String.fromCharCode(bytes[i]);
        }
        const base64 = btoa(binary);
        return `data:image/png;base64,${base64}`;
    }
}
