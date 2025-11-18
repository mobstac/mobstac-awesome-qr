import { CanvasType, DataPattern, EyeBallShape, EyeFrameShape, GradientType, QRCodeFrame, QRErrorCorrectLevel } from './Enums';

export interface Watermark {
    showWatermark: boolean;
    watermark: string;
    opacity: number;
    width: number;
    height: number;
}

/**
 * Configuration interface for adding stickers to QR codes.
 * Note: Stickers are not displayed when the QR code has a frame, barcode, or barcode value.
 */
export interface Sticker {
    /** 
     * URL or path to the sticker image file.
     * Supports common image formats: PNG, JPEG, SVG, etc.
     */
    imageUrl: string;
    
    /** 
     * X coordinate position of the QR code within the sticker.
     * If not provided, defaults to centered position.
     * @default (stickerSize - qrCodeSize) / 2
     */
    qrCodeX?: number;
    
    /** 
     * Y coordinate position of the QR code within the sticker.
     * If not provided, defaults to centered position.
     * @default (stickerSize - qrCodeSize) / 2
     */
    qrCodeY?: number;
    
    /** 
     * Scale factor for the QR code size within the sticker.
     * Value between 0 and 1, where 1 = full sticker size, 0.5 = half size, etc.
     * @default 0.3
     * @minimum 0
     * @maximum 1
     */
    qrCodeScale?: number;
    
    /** 
     * Rotation angle for the QR code within the sticker in degrees.
     * Positive values rotate clockwise, negative values rotate counter-clockwise.
     * Any numeric value is accepted (e.g., 45, -90, 720 for 2 full rotations).
     * @default 0
     */
    qrCodeRotate?: number;
}

export interface QRCodeConfig {
    binarizeThreshold?: string;
    binarize?: boolean;
    size: number;
    margin: number;
    typeNumber: number;
    colorDark: string;
    colorLight: string;
    correctLevel: QRErrorCorrectLevel;
    backgroundImage?: string;
    backgroundDimming: string;
    logoImage?: string;
    logoScale: number;
    logoMargin: number;
    logoCornerRadius: number;
    logoBackground?: boolean;
    whiteMargin?: boolean;
    dotScale: number;
    rectangular?: boolean;
    logoWidth?: number;
    logoHeight?: number;
    autoColor?: boolean;
    text: string;
    maskedDots: boolean;
    canvasType?: CanvasType;
    eyeBallShape?: EyeBallShape;
    eyeFrameShape?: EyeFrameShape;
    eyeBallColor?: string;
    eyeFrameColor?: string;
    dataPattern?: DataPattern;
    gradientType?: GradientType;
    backgroundColor?: string;
    frameStyle?: QRCodeFrame;
    frameColor?: string;
    frameText?: string;
    frameTextColor?: string;
    isVCard?: boolean;
    useCanvas?: boolean;
    useOpacity?: boolean;
    imageServerURL?: string,
    imageServerRequestHeaders?: object,
    sticker?: Sticker;

    [key: string]: any;
}

export interface QRDrawingConfig {
    size: number;
    text: string;
    nSize: number;
    rawSize: number;
    viewportSize: number;
    margin: number;
    whiteMargin?: boolean;
    autoColor?: boolean;
    dotScale: number;
    rectangular?: boolean;
    logoWidth?: number;
    logoHeight?: number;
    moduleSize: number;
    backgroundDimming: string;
    backgroundImage?: string;
    colorDark: string;
    colorLight: string;
    logoImage?: string;
    logoScale: number;
    logoMargin: number;
    logoCornerRadius: number;
    logoBackground?: boolean;
    maskedDots: boolean;
    canvasType?: CanvasType;
    eyeBallShape?: EyeBallShape;
    eyeFrameShape?: EyeFrameShape;
    eyeBallColor?: string;
    eyeFrameColor?: string;
    dataPattern?: DataPattern;
    gradientType?: GradientType;
    backgroundColor?: string;
    frameStyle?: QRCodeFrame;
    frameColor?: string;
    frameText?: string;
    frameTextColor?: string;
    isVCard?: boolean;
    useCanvas?: boolean;
    useOpacity?: boolean;
    imageServerURL?: string,
    imageServerRequestHeaders?: object
    showBarcodeValue?: boolean;
    barcodeValue?: string;
    showBarcode?: boolean;
    barcodeType?: string;
    barcodeText?: string;
    primaryIdentifierValue?: string;
    watermark?: Watermark;
    sticker?: Sticker;
    skipImageValidation?: boolean;
}
