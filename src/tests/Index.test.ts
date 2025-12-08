import { Gradient } from '@svgdotjs/svg.js';
import 'mocha';
import { CanvasType, DataPattern, EyeBallShape, EyeFrameShape, GradientType, QRCodeFrame, QRErrorCorrectLevel, TextTagPosition } from '../Enums';
import { QRCodeBuilder } from '../index';
import { QRCode } from '../Models';
const sharp = require("sharp")

// tslint:disable-next-line:no-var-requires
const fs =  require('fs');

const vCardSampleData = `BEGIN:VCARD
VERSION:3.0
N:fgdgdfg;dfdagfsg;;
FN:dfdagfsg fgdgdfg
ORG:fgfdgdfgdf;
TITLE:fdgdfg
TEL;TYPE=work:213213
TEL;TYPE=mobile:523355
TEL;TYPE=home:342524
EMAIL:demo@mobstac.com
ADR;TYPE=WORK:;;eafe, thgsh;Bangalore;KA;560008;India
URL:mobstac.com
REV:2008-04-24T19:52:43Z
END:VCARD`;



const config = {
    "text" : "https://q.qrcodes.pro/kUnfwz",
    // "text" : vCardSampleData,
    "color": "#000000",
    "margin": 80,
    "isVCard": false,
    "textTag": "ADITYAAAAAAAA",
    "dotScale": 1,
    "colorDark": "#000000",
    "frameText": "",
    "logoImage": "",
    "logoScale": 0.2,
    "logoWidth": 0,
    "watermark": {
        "showWatermark": false
    },
    "colorLight": "#8f00ff",
    "frameColor": "#000000",
    "frameStyle": QRCodeFrame.NONE,
    "logoHeight": 0,
    "logoMargin": 10,
    "barcodeText": "",
    "barcodeType": "CODE128",
    "dataPattern": DataPattern.SQUARE,
    "rectangular": true,
    "showBarcode": false,
    "barcodeValue": "",
    "eyeBallColor": "#000000",
    "eyeBallShape": EyeBallShape.SQUARE,
    "gradientType": GradientType.NONE,
    "textTagColor": "#000000",
    "eyeFrameColor": "#000000",
    "eyeFrameShape": EyeFrameShape.SQUARE,
    "frameTextColor": "#000000",
    "logoBackground": true,
    "backgroundColor": "#ffffff",
    "backgroundImage": "",
    "textTagFontSize": 40,
    "textTagPosition": TextTagPosition.TOP_CENTER,
    "showBarcodeValue": false,
    "primaryIdentifierValue": "",
    "size": 1024
}

describe('QR code main tests', () => {
    it('QR main test SVG', done => {
        const qrCodeGenerator = new QRCodeBuilder(config);

        qrCodeGenerator.build(CanvasType.SVG).then(async qrCode => {
            await fs.writeFileSync(__dirname + '/test.' + CanvasType.SVG.toLowerCase(), qrCode.svg);
            let jpeg  = await sharp(__dirname + '/test.svg').toFile(__dirname + '/test.jpeg' );
            // console.log(jpeg)
            await sharp(__dirname + '/test.svg').toFile(__dirname + '/test.png' );
            // console.log(jpeg)
            done();
        }).catch(err => {
            console.error(err);
            done();
        });
    });
});
