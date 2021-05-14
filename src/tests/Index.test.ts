import { expect } from 'chai';
import 'mocha';
import { CanvasType, DataPattern, EyeBallShape, EyeFrameShape, GradientType, QRCodeFrame, QRErrorCorrectLevel } from '../Enums';
import { QRCodeBuilder } from '../index';

const vCardSampleData = `BEGIN:VCARD
VERSION:3.0
N:fgdgdfg;dfdagfsg;;
FN:dfdagfsg fgdgdfg
ORG:fgfdgdfgdf;
TITLE:fdgdfg
TEL;TYPE=work:213213
TEL;TYPE=mobile:523355
TEL;TYPE=home:342524
EMAIL:souro.com@gmail.com
ADR;TYPE=WORK:;;eafe, thgsh;Bangalore;KA;560008;India
URL:souro.comf
REV:2008-04-24T19:52:43Z
END:VCARD`;

const config = {
    text: 'https://www.beaconstac.com',
   // logoImage: 'https://i.pinimg.com/474x/d4/48/2b/d4482ba4e7ebdbff7b8ba73e7d39aceb.jpg',
   // backgroundImage: 'https://i.pinimg.com/474x/d4/48/2b/d4482ba4e7ebdbff7b8ba73e7d39aceb.jpg',
 // backgroundImage:'https://www.fnordware.com/superpng/pnggrad16rgb.png',
 // backgroundImage:'https://png.pngtree.com/png-clipart/20200721/original/pngtree-design-scene-prototype-renderings-logo-sample-material-png-image_4913697.jpg',
 backgroundImage:'https://www.tutorialspoint.com/videotutorials/images/coding_ground_home.jpg',  
 backgroundColor: 'white',
    canvasType: CanvasType.SVG,
    eyeFrameShape: EyeFrameShape.CIRCLE,
    eyeBallShape: EyeBallShape.CIRCLE,
    dataPattern: DataPattern.SQUARE,
    dotScale: 1,
     gradientType: GradientType.NONE,
    frameStyle: QRCodeFrame.CIRCULAR,
    frameColor: 'blue',
    frameText: 'HEY QR',
    logoMargin: 20,
    logoScale: 0.25,
    margin: 80,


};

describe('QR code tests', () => {
    // it('Main test SVG', done => {
    //     const qrCodeGenerator = new QRCodeBuilder(config);
    //
    //     qrCodeGenerator.build(CanvasType.SVG).then(qrCode => {
    //         const fs = require('fs');
    //         fs.writeFileSync(__dirname + '/test.' + CanvasType.SVG.toLowerCase(), qrCode.toBuffer());
    //         done();
    //     }).catch(err => {
    //         console.error(err);
    //         done();
    //     });
    // });

    it('Main test QR 1', done => {
        const qrCodeGenerator = new QRCodeBuilder(config);

        qrCodeGenerator.build(CanvasType.PNG).then(qrCode => {
            
            const fs = require('fs');
            const dataUrl = qrCode.canvas.toDataURL('image/png');
            const matches: any = dataUrl.match(
                    /^data:([A-Za-z-+\/]+);base64,(.+)$/
                  ),
                response: any  ={};
            response.type = matches[1];
            response.data = Buffer.from(matches[2], "base64");
            const decodedImg = response;
            const imageBuffer = decodedImg.data;
            const extension ='png';
            const fileName = '/test' + "." + extension;
            fs.writeFileSync(__dirname+fileName, imageBuffer);
            // console.log(dataUrl.substr(0,200));
            // fs.writeFileSync(__dirname + '/test.' + CanvasType.SVG.toLowerCase(), qrCode.toBuffer());
            done();
            
            
            // const fs = require('fs');
            // fs.writeFileSync(__dirname + '/test.' + CanvasType.SVG.toLowerCase(), qrCode.toBuffer());
            // done();
        }).catch(err => {
            done();
        });
    });
});
