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
    text: "https://qr.beaconstac.com/qwertyj",
    logoBackground: true,
    backgroundColor: "rgba(256,256,256,0)",
    canvasType: CanvasType.SVG,
    dataPattern: DataPattern.SQUARE,
    dotScale: 1,
    colorDark: "#000000",
    colorLight : '#0000ff',
    eyeBallShape: EyeBallShape.SQUARE,
    eyeFrameShape: EyeFrameShape.SQUARE,
    eyeFrameColor : '#000000',
    eyeBallColor : '#000000',
    frameStyle: QRCodeFrame.CIRCULAR,
    frameText: "THIS IS THIRTY CHARACTERS LONG",
    frameColor: "#000000",
    frameTextColor: "#ffffff",
    gradientType: GradientType.NONE,
    logoScale: 1,
    backgroundImage :'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b6/Image_created_with_a_mobile_phone.png/640px-Image_created_with_a_mobile_phone.png',
    logoImage : 'https://static.beaconstac.com/assets/img/qr-code-logos/gmail.svg',
    size: 512,
    margin: 40,
    correctLevel: QRErrorCorrectLevel.Q,
    rectangular : false,
    imageServerRequestHeaders : { Authorization : 'token e62435a78e67ec98bba3b879ba00448650032557' , 'Content-Type': 'application/json'},
    imageServerURL : 'https://beaconstacqa.mobstac.com/api/2.0/validate_url/'
    // isVcard : true

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
