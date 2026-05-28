import {
    CanvasType,
    QRCodeFrame,
    QRErrorCorrectLevel,
} from './Enums';
import { QRCode } from './Models';
import { QRCodeConfig, QRMatrix } from './Types';
import { maxLogoScale } from './Common';
import { getLengthOfLongestText } from './Util';

export class QRCodeBuilder {
    private config: QRCodeConfig;

    private static readonly DEFAULT_CONFIG: QRCodeConfig = {
        size: 800,
        margin: 800/12,
        typeNumber: 4,
        colorDark: '#000000',
        colorLight: '#ffffff',
        correctLevel: QRErrorCorrectLevel.H,
        backgroundDimming: 'rgba(0,0,0,0)',
        logoScale: 0.15,
        logoMargin: 800/12/4,
        logoCornerRadius: 8,
        rectangular: false,
        logoWidth: 0,
        logoHeight: 0,
        dotScale: 0.35,
        text: '',
        maskedDots: false,
        isVCard: false,
        useCanvas: false,
        useOpacity: true,
        logoBackground: true
    };

    public constructor(config?: Partial<QRCodeConfig>) {
        this.config = Object.assign({}, QRCodeBuilder.DEFAULT_CONFIG, config);
    }

    public static computeMatrix(text: string, correctLevel: QRErrorCorrectLevel = QRErrorCorrectLevel.H): QRMatrix {
        if (!text) {
            throw new Error('text is required to compute a QR matrix');
        }
        const config: QRCodeConfig = {
            ...QRCodeBuilder.DEFAULT_CONFIG,
            text,
            correctLevel,
        };
        const qrCode = new QRCode(-1, config);
        return qrCode.toMatrix();
    }

    public async build(format?: CanvasType): Promise<QRCode | never> {
        this.config.canvasType = format ? format : CanvasType.SVG;
        if (!this.config.text) {
            return Promise.reject('Setting text is necessary to generate the QRCode');
        }
        if (this.config.frameText && this.config.frameText.length > 30) {

            // Calculations for multiline text
            const textLineMaxLength = getLengthOfLongestText(this.config.frameText);
            if ( textLineMaxLength > 30 ) {
                return Promise.reject('Frame text length exceeded');
            }
        }
        if (this.config.logoScale > maxLogoScale) {
            this.config.logoScale = maxLogoScale ;
        }
        if (this.config.logoMargin > 100) {
            this.config.logoMargin = 50;
        }
        if ( this.config.textTag && this.config.textTag.length > 30) {
            return Promise.reject('Identification text length exceeded 30 characters');
        }
        if ( this.config.frameStyle === QRCodeFrame.CIRCULAR) {
            this.config.textTag = '';
        }
        const qrCode: QRCode = new QRCode(-1, this.config);

        qrCode.svg = await qrCode.svgDrawing.drawSVG();
        return Promise.resolve(qrCode);

    }
}
