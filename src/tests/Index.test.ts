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
    logoImage: 'https://i.pinimg.com/474x/d4/48/2b/d4482ba4e7ebdbff7b8ba73e7d39aceb.jpg',
    backgroundImage: 'https://i.pinimg.com/474x/d4/48/2b/d4482ba4e7ebdbff7b8ba73e7d39aceb.jpg',
    backgroundColor: 'white',
    canvasType: CanvasType.SVG,
    eyeFrameShape: EyeFrameShape.ROUNDED,
    eyeBallShape: EyeBallShape.ROUNDED,
   colorDark: 'yellow',
   colorLight: '#4494fc',
    dotScale: 1,
     gradientType: GradientType.HORIZONTAL,
    frameStyle: QRCodeFrame.BALLOON_TOP,
    frameColor: 'blue',
    frameText: 'HEY QR',
    logoMargin: 20,
    logoScale: 0.25,
    margin: 80,
    typeNumber: 5,
    size: 1024,
    isVCard: false,
    useCanvas: false,
    useOpacity: true,
};
const config2 = {
    text: 'https://www.beaconstac.com',
   // backgroundImage: 'https://s3.amazonaws.com/beaconstac-content-qa/1593/9653e5dae58849b9bf523e27142f875e',
    backgroundColor: 'white',
    canvasType: CanvasType.SVG,
    eyeFrameShape: EyeFrameShape.ROUNDED,
    eyeBallShape: EyeBallShape.ROUNDED,
   colorDark: 'yellow',
   colorLight: '#4494fc',
    dotScale: 1,
     gradientType: GradientType.HORIZONTAL,
    frameStyle: QRCodeFrame.BANNER_BOTTOM,
    frameColor: 'blue',
    frameText: 'HEY QR',
    logoMargin: 20,
    logoScale: 0.25,
    margin: 80,
    typeNumber: 5,
    size: 512,
    isVCard: false,
    useCanvas: false,
    useOpacity: true,
};
const config3 = {
    text: 'https://www.beaconstac.com',
   backgroundImage: 'https://s3.amazonaws.com/beaconstac-content-qa/1593/9653e5dae58849b9bf523e27142f875e',
   imageServerURL: 'https://s3.amazonaws.com/beaconstac-content-qa/1593/9653e5dae58849b9bf523e27142f875e',
    backgroundColor: 'white',
    canvasType: CanvasType.SVG,
    eyeFrameShape: EyeFrameShape.ROUNDED,
    eyeBallShape: EyeBallShape.ROUNDED,
   colorDark: 'yellow',
   colorLight: '#4494fc',
    dotScale: 1,
     gradientType: GradientType.HORIZONTAL,
    frameStyle: QRCodeFrame.BANNER_BOTTOM,
    frameColor: 'blue',
    frameText: 'HEY QR',
    logoMargin: 20,
    logoScale: 0.25,
    margin: 80,
    typeNumber: 5,
    size: 256,
    isVCard: false,
    useCanvas: false,
    useOpacity: true,
};
const config4 = {
    text: 'https://www.beaconstac.com',
   // backgroundImage: 'https://s3.amazonaws.com/beaconstac-content-qa/1593/9653e5dae58849b9bf523e27142f875e',
    backgroundColor: 'white',
    canvasType: CanvasType.SVG,
    eyeFrameShape: EyeFrameShape.ROUNDED,
    eyeBallShape: EyeBallShape.ROUNDED,
   colorDark: 'yellow',
   colorLight: '#4494fc',
    dotScale: 1,
    gradientType: GradientType.HORIZONTAL,
    frameColor: 'blue',
    frameText: 'HEY QR frame text len greater than twelve',
    logoMargin: 20,
    logoScale: 0.25,
    margin: 80,
    typeNumber: 5,
    size: 256,
    isVCard: false,
    useCanvas: false,
    useOpacity: true,
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

    it('Main test QR', done => {
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
    it('Main test QR 2', done => {
        const qrCodeGenerator = new QRCodeBuilder(config2);

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
            const fileName = '/test2' + "." + extension;
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
    it('Main test QR 3', done => {
        const qrCodeGenerator = new QRCodeBuilder(config3);

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
            const fileName = '/test3' + "." + extension;
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
    it('Main test QR 4', done => {
        const qrCodeGenerator = new QRCodeBuilder(config4);

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
            const fileName = '/test4' + "." + extension;
            fs.writeFileSync(__dirname+fileName, imageBuffer);
            // console.log(dataUrl.substr(0,200));
            // fs.writeFileSync(__dirname + '/test.' + CanvasType.SVG.toLowerCase(), qrCode.toBuffer());
            done();
            
            
            // const fs = require('fs');
            // fs.writeFileSync(__dirname + '/test.' + CanvasType.SVG.toLowerCase(), qrCode.toBuffer());
            // done();
        }).catch(err => {
            expect(err).to.equal('Frame text length exceeded');
            done();
        });
    });
});
