import { Gradient } from '@svgdotjs/svg.js';
import 'mocha';
import { CanvasType, DataPattern, EyeBallShape, EyeFrameShape, GradientType, QRCodeFrame, QRErrorCorrectLevel } from '../Enums';
import { QRCodeBuilder } from '../index';
import { QRCode } from '../Models';

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
    // text: vCardSampleData,
    text: "https://qrcodes.pro/scan/p",
    logoBackground: true,
    backgroundColor: "#ffffff",
    canvasType: CanvasType.SVG,
    dataPattern: DataPattern.SQUARE,
    dotScale: 1,
    colorDark: "#000000",
    colorLight : '#00FFFF',
    eyeBallShape: EyeBallShape.SQUARE,
    eyeFrameShape: EyeFrameShape.SQUARE,
    eyeFrameColor : '#000000',
    eyeBallColor : '#000000',
    frameStyle: QRCodeFrame.NONE,
    frameText: "LINE 1 LINE 1 LINE 1 \n LINE 2 LINE 2 \n LINE 3",
    frameColor: "#724DDB",
    frameTextColor: "#FFFFFF",
    gradientType: GradientType.NONE,
    logoScale: 0.3,
    backgroundImage :'https://s3.amazonaws.com/beaconstac-content-qa/5118/890b88c1e2c2406cafa6f6eec5240287',
    logoImage : 'https://images.freeimages.com/images/previews/ac9/railway-hdr-1361893.jpg',
    size: 1024,
    margin: 80,
    correctLevel: QRErrorCorrectLevel.Q,
    logoMargin : 0,
    // isVCard : true
};

describe('QR code main tests', () => {
    it('QR main test SVG', done => {
        const qrCodeGenerator = new QRCodeBuilder(config);

        qrCodeGenerator.build(CanvasType.SVG).then(async qrCode => {
            await fs.writeFileSync(__dirname + '/test.' + CanvasType.SVG.toLowerCase(), qrCode.svg);
            done();
        }).catch(err => {
            console.error(err);
            done();
        });
    });
});
