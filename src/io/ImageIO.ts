/**
 * ImageIO — environment-agnostic interface for image I/O operations.
 *
 * Node implementation uses sharp + fetch.
 * Browser implementation uses image-server proxy + canvas/FileReader.
 */
export interface ImageIO {
    /** Fetch raw image bytes from a URL. */
    fetchImage(url: string): Promise<Buffer | ArrayBuffer>;

    /** Probe image dimensions without fully decoding. */
    probeSize(input: Buffer | ArrayBuffer | string): Promise<{ width: number; height: number }>;

    /** Resize/transcode image to the given format (e.g. 'png'). */
    transcode(input: Buffer | ArrayBuffer, opts: TranscodeOptions): Promise<Buffer | ArrayBuffer>;

    /** Detect the image format (e.g. 'png', 'jpeg', 'svg+xml'). */
    detectFormat(input: Buffer | ArrayBuffer): Promise<string>;

    /** Check if a URL points to an SVG resource. */
    isSvgUrl?(url: string): Promise<boolean>;

    /** Fetch image and return as base64 data URI. */
    toBase64DataUri(url: string): Promise<string>;

    /** Resize image and return as base64 data URI. */
    resizeToBase64(input: Buffer | ArrayBuffer, width: number, height: number): Promise<string>;
}

export interface TranscodeOptions {
    format: string;
    width?: number;
    height?: number;
    fit?: string;
}
