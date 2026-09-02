import { expect } from 'chai';
import 'mocha';
import { CanvasType, DataPattern, EyeBallShape, EyeFrameShape, GradientType, ModuleType, QRCodeFrame, QRErrorCorrectLevel } from '../Enums';
const { NodeImageIO } = require('../io/NodeImageIO');
import { QRCodeBuilder } from '../index';
import { QRCode } from '../Models';
import { QRMatrix } from '../Types';

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
EMAIL:test.com@gmail.com
ADR;TYPE=WORK:;;eafe, thgsh;Bangalore;KA;560008;India
URL:test.comf
REV:2008-04-24T19:52:43Z
END:VCARD`;

const sampleUrl = 'https://www.beaconstac.com';
// 1. basic square qr code with size: 1024 and error correction: 2 | type: png
const config1 = {
    text: sampleUrl,
    canvasType: CanvasType.SVG,
    dataPattern: DataPattern.SQUARE,
    colorDark: "#000000",
    colorLight: "#ffffff",
    dotScale: 1,
    margin: 80,
    size: 1024,
    isVCard: false,
    useOpacity: true,
    correctLevel: QRErrorCorrectLevel.H
};

// 2. basic square qr code with size: 1024 and error correction: 2 | type: svg
const config2 = {
    text: sampleUrl,
    canvasType: CanvasType.SVG,
    dataPattern: DataPattern.SQUARE,
    colorDark: "#000000",
    colorLight: "#ffffff",
    dotScale: 1,
    margin: 80,
    size: 1024,
    isVCard: false,
    useOpacity: true,
    correctLevel: QRErrorCorrectLevel.H
};


// 3. basic square qr code with v-card, with size: 1024 and error correction: 2 | type: png
const config3 = {
    text: vCardSampleData,
    canvasType: CanvasType.SVG,
    dataPattern: DataPattern.SQUARE,
    colorDark: "#000000",
    colorLight: "#ffffff",
    dotScale: 1,
    margin: 80,
    size: 1024,
    isVCard: false,
    useOpacity: true,
    correctLevel: QRErrorCorrectLevel.H
};

// 4. basic square qr code with v-card, with size: 1024 and error correction: 2 | type: svg
const config4 = {
    text: vCardSampleData,
    canvasType: CanvasType.SVG,
    dataPattern: DataPattern.SQUARE,
    colorDark: "#000000",
    colorLight: "#ffffff",
    dotScale: 1,
    margin: 80,
    size: 1024,
    isVCard: false,
    useOpacity: true,
    correctLevel: QRErrorCorrectLevel.H
};

// circular qr code with size: 1024 and error correction: 2 | type: png
const config5 = {
    text: 'https://www.beaconstac.com',
   // backgroundImage: 'https://s3.amazonaws.com/beaconstac-content-qa/1593/9653e5dae58849b9bf523e27142f875e',
    backgroundColor: 'white',
    canvasType: CanvasType.SVG,
    eyeFrameShape: EyeFrameShape.RIGHT_LEAF,
    eyeBallShape: EyeBallShape.ROUNDED,
    dataPattern: DataPattern.LEFT_DIAMOND,
   colorDark: '#ffff00',
   colorLight: '#4494fc',
    dotScale: 1,
    frameStyle: QRCodeFrame.CIRCULAR,
    gradientType: GradientType.HORIZONTAL,
    frameColor: '#0005F5',
    frameText: 'HEY QR',
    logoMargin: 20,
    logoScale: 0.25,
    margin: 80,
    typeNumber: 5,
    size: 1024,
    correctLevel: QRErrorCorrectLevel.H,
    isVCard: false,
    useCanvas: false,
    useOpacity: true,
};

// circular qr code with size: 1024 and error correction: 2 | type: svg
const config6 = {
    text: 'https://www.beaconstac.com',
   backgroundImage: 'https://s3.amazonaws.com/beaconstac-content-qa/1593/9653e5dae58849b9bf523e27142f875e',
    canvasType: CanvasType.SVG,
    eyeFrameShape: EyeFrameShape.RIGHT_LEAF,
    eyeBallShape: EyeBallShape.ROUNDED,
    dataPattern: DataPattern.LEFT_DIAMOND,
   colorDark: '#ffff00',
   colorLight: '#4494fc',
    dotScale: 1,
    frameStyle: QRCodeFrame.CIRCULAR,
    gradientType: GradientType.HORIZONTAL,
    frameColor: '#0005F5',
    frameText: 'HEY QR',
    logoMargin: 20,
    logoScale: 0.25,
    margin: 80,
    typeNumber: 5,
    size: 1024,
    correctLevel: QRErrorCorrectLevel.H,
    isVCard: false,
    useCanvas: false,
    useOpacity: true,
};

// circular qr code with v-card, with size: 1024 and error correction: 2 | type: png
const config7 = {
    text: vCardSampleData,
   // backgroundImage: 'https://s3.amazonaws.com/beaconstac-content-qa/1593/9653e5dae58849b9bf523e27142f875e',
    backgroundColor: 'white',
    canvasType: CanvasType.SVG,
    frameStyle: QRCodeFrame.CIRCULAR,
    dotScale: 1,
    frameColor: '#0005F5',
    frameText: 'HEY QR',
    logoMargin: 20,
    logoScale: 0.25,
    margin: 80,
    typeNumber: 5,
    size: 1024,
    correctLevel: QRErrorCorrectLevel.H,
    isVCard: true,
};

// circular qr code with v-card, with size: 1024 and error correction: 2 | type: svg
const config8 = {
    text: vCardSampleData,
   backgroundImage: 'https://s3.amazonaws.com/beaconstac-content-qa/1593/9653e5dae58849b9bf523e27142f875e',
   frameStyle: QRCodeFrame.CIRCULAR,
    canvasType: CanvasType.SVG,
    dotScale: 1,
    frameColor: '#0005F5',
    frameText: 'HEY QR',
    logoMargin: 20,
    logoScale: 0.25,
    margin: 80,
    typeNumber: 5,
    size: 1024,
    correctLevel: QRErrorCorrectLevel.H,
    isVCard: true,
};

// frame + square qr code with size: 1024 and error correction: 2 | type: png
const config9 = {
    text: sampleUrl,
    canvasType: CanvasType.SVG,
    frameStyle: QRCodeFrame.BALLOON_BOTTOM,
    dataPattern: DataPattern.SQUARE,
    colorDark: "#000000",
    colorLight: "#ffffff",
    dotScale: 1,
    margin: 80,
    size: 1024,
    isVCard: false,
    useOpacity: true,
    correctLevel: QRErrorCorrectLevel.H
};

// frame + square qr code with size: 1024 and error correction: 2 | type: svg

const config10 = {
    text: sampleUrl,
    logoImage: 'https://www.tutorialspoint.com/videotutorials/images/coding_ground_home.jpg',
    canvasType: CanvasType.SVG,
    frameStyle: QRCodeFrame.BALLOON_BOTTOM,
    dataPattern: DataPattern.SQUARE,
    colorDark: "#000000",
    colorLight: "#ffffff",
    dotScale: 1,
    margin: 80,
    size: 1024,
    isVCard: false,
    useOpacity: true,
    correctLevel: QRErrorCorrectLevel.H
};
// frame + square qr code with v-card, with size: 1024 and error correction: 2 | type: png
const config11 = {
    text: vCardSampleData,
    canvasType: CanvasType.SVG,
    frameStyle: QRCodeFrame.BOX_TOP,
    dataPattern: DataPattern.SQUARE,
    colorDark: "#000000",
    colorLight: "#ffffff",
    dotScale: 1,
    margin: 80,
    size: 1024,
    isVCard: true,
    useOpacity: true,
    correctLevel: QRErrorCorrectLevel.H
};

// frame + square qr code with v-card, with size: 1024 and error correction: 2 | type: svg
const config12 = {
    text: vCardSampleData,
    canvasType: CanvasType.SVG,
    frameStyle: QRCodeFrame.BANNER_BOTTOM,
    dataPattern: DataPattern.SQUARE,
    colorDark: "#000000",
    colorLight: "#ffffff",
    dotScale: 1,
    margin: 80,
    size: 1024,
    isVCard: true,
    useOpacity: true,
    correctLevel: QRErrorCorrectLevel.H
};
const config13 = {
    text: vCardSampleData,
    logoImage: 'https://www.tutorialspoint.com/videotutorials/images/coding_ground_home.jpg',
    logoBackground: false,
    canvasType: CanvasType.SVG,
    frameStyle: QRCodeFrame.BANNER_BOTTOM,
    dataPattern: DataPattern.SQUARE,
    colorDark: "#000000",
    colorLight: "#ffffff",
    dotScale: 1,
    margin: 80,
    size: 1024,
    isVCard: true,
    useOpacity: true,
    correctLevel: QRErrorCorrectLevel.H
};

const configCase2 = {
    backgroundColor:'white',
    canvasType: CanvasType.SVG,
    colorDark: "#ff0000",
    colorLight: "#00FF00",
    correctLevel: 2,
    dataPattern: DataPattern.SQUARE,
    dotScale: 0.96,
    eyeBallShape: EyeBallShape.CIRCLE,
    // eyeFrameColor: "",
    eyeFrameShape: EyeFrameShape.CIRCLE,
    frameStyle: QRCodeFrame.BALLOON_TOP,
    frameColor: "#0005F5",
    frameText: "",
    gradientType: GradientType.LINEAR,
   // imageServerURL: "https://beaconstacqa.mobstac.com/api/2.0/validate_url/",
    isVCard: false,
    logoScale: 0.2,
    margin: 40,
    maskedDots: false,
   moduleSize: 27,
   nSize: 27,
   rawSize: 1051,
   size: 1024,
    text: "https://qr.getwifireapp.com/zy9t9e",
   typeNumber: 4,
   useCanvas: false,
   useOpacity: true,
   viewportSize: 891,
};
const configCase3 = {
    backgroundColor:'white',
    canvasType: CanvasType.SVG,
    colorDark: "#ff0000",
    colorLight: "#00FF00",
    correctLevel: 2,
    dataPattern: DataPattern.CIRCLE,
    dotScale: 0.96,
    eyeBallShape: EyeBallShape.LEFT_LEAF,
    // eyeFrameColor: "",
    eyeFrameShape: EyeFrameShape.ROUNDED,
    frameStyle: QRCodeFrame.BANNER_BOTTOM,
    frameColor: "#0005F5",
    frameText: "",
    gradientType: GradientType.RADIAL,
   // imageServerURL: "https://beaconstacqa.mobstac.com/api/2.0/validate_url/",
    isVCard: true,
    logoCornerRadius: 8,
    logoMargin: 11,
    logoScale: 0.2,
    margin: 80,
    maskedDots: false,
   moduleSize: 27,
   nSize: 27,
   rawSize: 1051,
   size: 1051,
    text: "https://qr.getwifireapp.com/zy9t9e",
   typeNumber: 4,
   useCanvas: false,
   useOpacity: true,
   viewportSize: 891,
};

const configCase4 = {
    backgroundColor:'white',
    canvasType: CanvasType.SVG,
    colorDark: "#ff0000",
    colorLight: "#00FF00",
    correctLevel: 2,
    dataPattern: DataPattern.LEFT_DIAMOND,
    dotScale: 0.96,
    eyeBallShape: EyeBallShape.LEFT_DIAMOND,
    // eyeFrameColor: "",
    eyeFrameShape: EyeFrameShape.LEFT_LEAF,
    frameStyle: QRCodeFrame.BOX_TOP,
    frameColor: "#0005F5",
    frameText: "",
    gradientType: GradientType.HORIZONTAL,
   // imageServerURL: "https://beaconstacqa.mobstac.com/api/2.0/validate_url/",
    isVCard: true,
    logoCornerRadius: 8,
    logoMargin: 11,
    logoScale: 0.2,
    margin: 80,
    maskedDots: true,
   moduleSize: 27,
   nSize: 27,
   rawSize: 1051,
   size: 1051,
    text: "https://qr.getwifireapp.com/zy9t9e",
   typeNumber: 4,
   useCanvas: true,
   useOpacity: true,
   viewportSize: 891,
};
const configCase5 = {
    backgroundColor:'white',
    canvasType: CanvasType.SVG,
    colorDark: "#ff0000",
    colorLight: "#00FF00",
    correctLevel: 2,
    dataPattern: DataPattern.RIGHT_DIAMOND,
    dotScale: 0.96,
    eyeBallShape: EyeBallShape.RIGHT_DIAMOND,
    // eyeFrameColor: "",
    eyeFrameShape: EyeFrameShape.RIGHT_LEAF,
    frameStyle: QRCodeFrame.BALLOON_TOP,
    frameColor: "#0005F5",
    frameText: "Scan QR",
    gradientType: GradientType.VERTICAL,
   // imageServerURL: "https://beaconstacqa.mobstac.com/api/2.0/validate_url/",
    isVCard: false,
    logoCornerRadius: 8,
    logoMargin: 11,
    logoScale: 0.26,
    margin: 80,
    maskedDots: false,
   moduleSize: 27,
   nSize: 27,
   rawSize: 1051,
   size: 1051,
    text: "https://www.google.com/search?q=google+image&sxsrf=ALeKk01HdEjd-1kgx0opDH4z57mKAKdSfg:1619608675472&source=lnms&tbm=isch&sa=X&ved=2ahUKEwja3Zq-6KDwAhVDjOYKHeseBpQQ_AUoAXoECAEQAw&biw=1853&bih=949#imgrc=NaNXoifrEY1VZM",
   typeNumber: 4,
   useCanvas: false,
   useOpacity: false,
   viewportSize: 891,
};
const configCase6 = {
   backgroundColor:'#ffffff',
    canvasType: CanvasType.SVG,
    colorDark: "#ff0000",
    colorLight: "#00FF00",
    correctLevel: 2,
    dataPattern: DataPattern.KITE,
    dotScale: 0.96,
    eyeBallShape: EyeBallShape.SQUARE,
    // eyeFrameColor: "",
    eyeFrameShape: EyeFrameShape.RIGHT_LEAF,
    frameStyle: QRCodeFrame.CIRCULAR,
    frameColor: "#0005F5",
    frameText: "Scan QR",
    gradientType: GradientType.RADIAL,
   // imageServerURL: "https://beaconstacqa.mobstac.com/api/2.0/validate_url/",
    isVCard: false,
    logoCornerRadius: 8,
    logoMargin: 11,
    logoScale: 0.26,
    margin: 80,
    maskedDots: false,
   size: 1051,
    text: "https://www.google.com/search?q=google+image&sxsrf=ALeKk01HdEjd-1kgx0opDH4z57mKAKdSfg:1619608675472&source=lnms&tbm=isch&sa=X&ved=2ahUKEwja3Zq-6KDwAhVDjOYKHeseBpQQ_AUoAXoECAEQAw&biw=1853&bih=949#imgrc=NaNXoifrEY1VZM",
   typeNumber: 4,
   useCanvas: false,
   useOpacity: false,
   viewportSize: 891,
};
const configCase7 = {
    canvasType: CanvasType.SVG,
    backgroundColor:'white',
    colorDark: "#0005F5",
    colorLight: "#00FF00",
    dataPattern: DataPattern.KITE,
    dotScale: 1,
    eyeBallShape: EyeBallShape.CIRCLE,
    // eyeFrameColor: "",
    eyeFrameShape: EyeFrameShape.CIRCLE,
    frameStyle: QRCodeFrame.CIRCULAR,
    frameColor: "#0005F5",
    frameText: "Scan QR",
    gradientType: GradientType.VERTICAL,
   // imageServerURL: "https://beaconstacqa.mobstac.com/api/2.0/validate_url/",

    text: "https://www.google.com/search?q=google+image&sxsrf=ALeKk01HdEjd-1kgx0opDH4z57mKAKdSfg:1619608675472&source=lnms&tbm=isch&sa=X&ved=2ahUKEwja3Zq-6KDwAhVDjOYKHeseBpQQ_AUoAXoECAEQAw&biw=1853&bih=949#imgrc=NaNXoifrEY1VZM",
};
const configCase8 = {
    canvasType: CanvasType.SVG,
    backgroundColor:'white',
    colorDark: "#0005F5",
    colorLight: "#00FF00",
    dataPattern: DataPattern.LEFT_DIAMOND,
    dotScale: 1,
    eyeBallShape: EyeBallShape.CIRCLE,
    // eyeFrameColor: "",
    eyeFrameShape: EyeFrameShape.CIRCLE,
    frameStyle: QRCodeFrame.CIRCULAR,
    frameColor: "#0005F5",
    frameText: "Scan QR",
    gradientType: GradientType.VERTICAL,
   // imageServerURL: "https://beaconstacqa.mobstac.com/api/2.0/validate_url/",

    text: "https://google.com",
};
const configCase9 = {
    canvasType: CanvasType.SVG,
    backgroundColor:'white',
    colorDark: "#0005F5",
    colorLight: "#00FF00",
    dataPattern: DataPattern.RIGHT_DIAMOND,
    dotScale: 1,
    eyeBallShape: EyeBallShape.CIRCLE,
    // eyeFrameColor: "",
    eyeFrameShape: EyeFrameShape.CIRCLE,
    frameStyle: QRCodeFrame.CIRCULAR,
    frameColor: "#0005F5",
    frameText: "Scan QR",
    gradientType: GradientType.VERTICAL,
   // imageServerURL: "https://beaconstacqa.mobstac.com/api/2.0/validate_url/",

    text: "https://google.com",
};
const configCase10 = {
    canvasType: CanvasType.SVG,
    colorDark: "#ff0000",
    backgroundColor:'white',
    colorLight: "#00FF00",
    dataPattern: DataPattern.SQUARE,
    dotScale: 1,
    eyeBallShape: EyeBallShape.CIRCLE,
    // eyeFrameColor: "",
    eyeFrameShape: EyeFrameShape.CIRCLE,
    frameStyle: QRCodeFrame.CIRCULAR,
    frameColor: "#0005F5",
    frameText: "Scan QR",
    gradientType: GradientType.VERTICAL,
   // imageServerURL: "https://beaconstacqa.mobstac.com/api/2.0/validate_url/",

    text: "https://google.com",
};




describe('Output QR code tests', () => {
    it('QR test SVG: default', done => {
        const qrCodeGenerator = new QRCodeBuilder(config2);

        qrCodeGenerator.build(CanvasType.SVG).then(qrCode => {
            fs.writeFileSync(__dirname + '/qrTests/default.' + CanvasType.SVG.toLowerCase(), qrCode.toBuffer());
            done();
        }).catch(err => {
            console.error(err);
            done();
        });
    });

    it('QR test SVG: default_vcard', done => {
        const qrCodeGenerator = new QRCodeBuilder(config4);

        qrCodeGenerator.build(CanvasType.SVG).then(qrCode => {
            fs.writeFileSync(__dirname + '/qrTests/default_vcard.' + CanvasType.SVG.toLowerCase(), qrCode.toBuffer());
            done();
        }).catch(err => {
            console.error(err);
            done();
        });
    });
    it('QR test SVG: defualt_circular', done => {
        const qrCodeGenerator = new QRCodeBuilder(config6);

        qrCodeGenerator.build(CanvasType.SVG).then(qrCode => {
            fs.writeFileSync(__dirname + '/qrTests/default_circular.' + CanvasType.SVG.toLowerCase(), qrCode.toBuffer());
            done();
        }).catch(err => {
            console.error(err);
            done();
        });
    });
    it('QR test SVG: circular_vcard', done => {
        const qrCodeGenerator = new QRCodeBuilder(config8);

        qrCodeGenerator.build(CanvasType.SVG).then(qrCode => {
            fs.writeFileSync(__dirname + '/qrTests/circular_vcard.' + CanvasType.SVG.toLowerCase(), qrCode.toBuffer());
            done();
        }).catch(err => {
            console.error(err);
            done();
        });
    });
    it('QR test SVG: frame-plus-square', function(done) {
        this.timeout(30000);
        const qrCodeGenerator = new QRCodeBuilder(config10);

        qrCodeGenerator.build(CanvasType.SVG).then(qrCode => {
            fs.writeFileSync(__dirname + '/qrTests/frame-plus-square.' + CanvasType.SVG.toLowerCase(), qrCode.toBuffer());
            done();
        }).catch(err => {
            console.error(err);
            done();
        });
    });
    it('QR test SVG: frame-plus-square-vcard', function(done) {
        this.timeout(30000);
        const qrCodeGenerator = new QRCodeBuilder(config12);

        qrCodeGenerator.build(CanvasType.SVG).then(qrCode => {
            fs.writeFileSync(__dirname + '/qrTests/frame-plus-square-vcard.' + CanvasType.SVG.toLowerCase(), qrCode.toBuffer());
            done();
        }).catch(err => {
            console.error(err);
            done();
        });
    });
    it('QR test SVG: logo-no-background', function(done) {
        this.timeout(30000);
        const qrCodeGenerator = new QRCodeBuilder(config13);

        qrCodeGenerator.build(CanvasType.SVG).then(qrCode => {
            fs.writeFileSync(__dirname + '/qrTests/logo_no_background.' + CanvasType.SVG.toLowerCase(), qrCode.toBuffer());
            done();
        }).catch(err => {
            console.error(err);
            done();
        });
    });
    it('Main test SVG 2', done => {
        const qrCodeGenerator = new QRCodeBuilder(configCase2);
        qrCodeGenerator.build(CanvasType.SVG).then(qrCode => {

            fs.writeFileSync(__dirname + '/qrTests/default-svg2.' + CanvasType.SVG.toLowerCase(), qrCode.toBuffer());
            done();
        }).catch(err => {
           console.error(err);
            done();
        });
    });
    it('Main test SVG 3', done => {
        const qrCodeGenerator = new QRCodeBuilder(configCase3);

        qrCodeGenerator.build(CanvasType.SVG).then(qrCode => {

            fs.writeFileSync(__dirname + '/qrTests/default-svg3.' + CanvasType.SVG.toLowerCase(), qrCode.toBuffer());
            done();
        }).catch(err => {
           console.error(err);
            done();
        });
    });
    it('Main test SVG 4', done => {
        const qrCodeGenerator = new QRCodeBuilder(configCase4);

        qrCodeGenerator.build(CanvasType.SVG).then(qrCode => {

            fs.writeFileSync(__dirname + '/qrTests/default-svg4.' + CanvasType.SVG.toLowerCase(), qrCode.toBuffer());
            done();
        }).catch(err => {
           console.error(err);
            done();
        });
    });
    it('Main test SVG 5', done => {
        const qrCodeGenerator = new QRCodeBuilder(configCase5);

        qrCodeGenerator.build(CanvasType.SVG).then(qrCode => {

            fs.writeFileSync(__dirname + '/qrTests/default-svg5.' + CanvasType.SVG.toLowerCase(), qrCode.toBuffer());
            done();
        }).catch(err => {
           console.error(err);
            done();
        });
    });
    it('Main test SVG 6 circular', done => {
        const qrCodeGenerator = new QRCodeBuilder(configCase6);

        qrCodeGenerator.build(CanvasType.SVG).then(qrCode => {

            fs.writeFileSync(__dirname + '/qrTests/circular-kite.' + CanvasType.SVG.toLowerCase(), qrCode.toBuffer());
            done();
        }).catch(err => {
           console.error(err);
            done();
        });
    });
    it('Main test SVG 7 circular with large text', done => {
        const qrCodeGenerator = new QRCodeBuilder(configCase7);

        qrCodeGenerator.build(CanvasType.SVG).then(qrCode => {

            fs.writeFileSync(__dirname + '/qrTests/circular-circle.' + CanvasType.SVG.toLowerCase(), qrCode.toBuffer());
            done();
        }).catch(err => {
           console.error(err);
            done();
        });
    });
    it('Main test SVG 8 circular', done => {
        const qrCodeGenerator = new QRCodeBuilder(configCase8);

        qrCodeGenerator.build(CanvasType.SVG).then(qrCode => {

            fs.writeFileSync(__dirname + '/qrTests/circular-leftdiamond.' + CanvasType.SVG.toLowerCase(), qrCode.toBuffer());
            done();
        }).catch(err => {
           console.error(err);
            done();
        });
    });
    it('Main test SVG 9 circular', done => {
        const qrCodeGenerator = new QRCodeBuilder(configCase9);

        qrCodeGenerator.build(CanvasType.SVG).then(qrCode => {

            fs.writeFileSync(__dirname + '/qrTests/circular-rightdiamond.' + CanvasType.SVG.toLowerCase(), qrCode.toBuffer());
            done();
        }).catch(err => {
           console.error(err);
            done();
        });
    });
    it('Main test SVG 10 circular', done => {
        const qrCodeGenerator = new QRCodeBuilder(configCase10);

        qrCodeGenerator.build(CanvasType.SVG).then(qrCode => {

            fs.writeFileSync(__dirname + '/qrTests/circular-sqaure.' + CanvasType.SVG.toLowerCase(), qrCode.toBuffer());
            done();
        }).catch(err => {
           console.error(err);
            done();
        });
    });
});

describe('SVG output compliance', () => {
    const sizes = [256, 1024];
    const configs = [
        { name: 'square', base: config2 },
        { name: 'circular', base: config6 },
    ];

    for (const { name, base } of configs) {
        for (const size of sizes) {
            it(`${name} (${size}px): uses attributes not inline styles for dimensions`, async () => {
                const builder = new QRCodeBuilder({ ...base, size });
                const qrCode = await builder.build(CanvasType.SVG);
                const svg = qrCode.svg as string;
                const openTag = svg.substring(0, svg.indexOf('>') + 1);

                // Must have width/height as attributes
                expect(openTag).to.match(/\bwidth="[\d.]+"/);
                expect(openTag).to.match(/\bheight="[\d.]+"/);

                // Must have viewBox
                expect(openTag).to.match(/\bviewBox="/);

                // Must NOT have inline style with width/height
                const styleMatch = openTag.match(/\bstyle="([^"]*)"/);
                if (styleMatch) {
                    expect(styleMatch[1]).to.not.match(/\bwidth\s*:/);
                    expect(styleMatch[1]).to.not.match(/\bheight\s*:/);
                }
            });
        }
    }
});

describe('QRCodeBuilder.computeMatrix()', () => {
    it('returns a valid QRMatrix for a simple URL', () => {
        const matrix = QRCodeBuilder.computeMatrix('https://example.com');
        expect(matrix).to.have.property('version').that.is.a('number').greaterThan(0);
        expect(matrix).to.have.property('moduleCount').that.equals(matrix.version * 4 + 17);
        expect(matrix).to.have.property('modules').that.is.instanceOf(Uint8Array);
        expect(matrix.modules.length).to.equal(matrix.moduleCount * matrix.moduleCount);
        expect(matrix).to.have.property('patternPositions').that.is.an('array');
    });

    it('produces deterministic output for same input', () => {
        const m1 = QRCodeBuilder.computeMatrix('https://example.com');
        const m2 = QRCodeBuilder.computeMatrix('https://example.com');
        expect(m1.version).to.equal(m2.version);
        expect(m1.moduleCount).to.equal(m2.moduleCount);
        expect(Buffer.from(m1.modules).equals(Buffer.from(m2.modules))).to.be.true;
    });

    it('different text produces different matrix', () => {
        const m1 = QRCodeBuilder.computeMatrix('https://example.com');
        const m2 = QRCodeBuilder.computeMatrix('https://uniqode.com/different');
        expect(Buffer.from(m1.modules).equals(Buffer.from(m2.modules))).to.be.false;
    });

    it('all modules have a valid ModuleType', () => {
        const matrix = QRCodeBuilder.computeMatrix('https://example.com');
        const validTypes = new Set(Object.values(ModuleType).filter(v => typeof v === 'number'));
        for (let i = 0; i < matrix.modules.length; i++) {
            expect(validTypes.has(matrix.modules[i]),
                `module[${i}] has invalid type ${matrix.modules[i]}`).to.be.true;
        }
    });

    it('dark flag encoded in bit 0', () => {
        const matrix = QRCodeBuilder.computeMatrix('https://example.com');
        const n = matrix.moduleCount;
        // Top-left finder corner (0,0) is dark → bit 0 should be 1
        expect(matrix.modules[0] & 1).to.equal(1);
        // Inside finder gap (1,1) is light → bit 0 should be 0
        expect(matrix.modules[1 * n + 1] & 1).to.equal(0);
    });

    it('finder patterns are at the three corners', () => {
        const matrix = QRCodeBuilder.computeMatrix('https://example.com');
        const n = matrix.moduleCount;
        const at = (r: number, c: number) => matrix.modules[r * n + c];

        // Top-left finder inner (center at 3,3) — dark
        expect(at(3, 3)).to.equal(ModuleType.DARK_FINDER_CENTER);
        // Top-left finder outer (frame) — dark
        expect(at(0, 0)).to.equal(ModuleType.DARK_FINDER);
        expect(at(0, 6)).to.equal(ModuleType.DARK_FINDER);
        expect(at(6, 0)).to.equal(ModuleType.DARK_FINDER);
        // Inside finder gap — light
        expect(at(1, 1)).to.equal(ModuleType.LIGHT_FINDER);

        // Bottom-left finder
        expect(at(n - 4, 3)).to.equal(ModuleType.DARK_FINDER_CENTER);
        expect(at(n - 7, 0)).to.equal(ModuleType.DARK_FINDER);

        // Top-right finder
        expect(at(3, n - 4)).to.equal(ModuleType.DARK_FINDER_CENTER);
        expect(at(0, n - 7)).to.equal(ModuleType.DARK_FINDER);
    });

    it('timing patterns on row 6 and col 6 with correct dark/light', () => {
        const matrix = QRCodeBuilder.computeMatrix('https://example.com');
        const n = matrix.moduleCount;
        const at = (r: number, c: number) => matrix.modules[r * n + c];

        for (let i = 8; i < n - 8; i++) {
            const expectedDark = i % 2 === 0;
            const expected = expectedDark ? ModuleType.DARK_TIMING : ModuleType.LIGHT_TIMING;
            expect(at(6, i)).to.equal(expected, `timing at row 6, col ${i}`);
            expect(at(i, 6)).to.equal(expected, `timing at row ${i}, col 6`);
        }
    });

    it('accepts custom error correction level', () => {
        const matrixL = QRCodeBuilder.computeMatrix('https://example.com', QRErrorCorrectLevel.L);
        const matrixH = QRCodeBuilder.computeMatrix('https://example.com', QRErrorCorrectLevel.H);
        // L uses fewer error correction bytes → may produce smaller version
        expect(matrixL.version).to.be.at.most(matrixH.version);
    });

    it('throws on empty text', () => {
        expect(() => QRCodeBuilder.computeMatrix('')).to.throw('text is required');
    });

    it('long text produces higher version', () => {
        const short = QRCodeBuilder.computeMatrix('hi');
        const long = QRCodeBuilder.computeMatrix('https://the-qrcode-generator.com/very/long/path?with=many&query=parameters&that=force&a=higher&qr=version&number=to&be=used');
        expect(long.version).to.be.greaterThan(short.version);
    });

    it('matrix is compact: Uint8Array size matches moduleCount^2', () => {
        const matrix = QRCodeBuilder.computeMatrix('https://example.com');
        expect(matrix.modules.byteLength).to.equal(matrix.moduleCount * matrix.moduleCount);
    });
});

describe('QRCodeBuilder.buildFromMatrix()', () => {
    it('produces identical SVG to build() for same config', async () => {
        const text = 'https://example.com';
        const config = {
            text,
            size: 512,
            colorDark: '#1a5276',
            colorLight: '#ffffff',
            backgroundColor: '#ffffff',
            dataPattern: DataPattern.CIRCLE,
            eyeBallShape: EyeBallShape.CIRCLE,
            eyeFrameShape: EyeFrameShape.ROUNDED,
            imageIO: new NodeImageIO(),
        };

        const builderA = new QRCodeBuilder(config);
        const resultA = await builderA.build(CanvasType.SVG);

        const matrix = QRCodeBuilder.computeMatrix(text);
        const builderB = new QRCodeBuilder(config);
        const resultB = await builderB.buildFromMatrix(matrix, CanvasType.SVG);

        expect(resultA.svg).to.equal(resultB.svg);
    });

    it('renders different styles from same matrix', async () => {
        const text = 'https://example.com';
        const matrix = QRCodeBuilder.computeMatrix(text);

        const builderA = new QRCodeBuilder({
            text,
            size: 512,
            colorDark: '#000000',
            dataPattern: DataPattern.SQUARE,
            imageIO: new NodeImageIO(),
        });
        const resultA = await builderA.buildFromMatrix(matrix, CanvasType.SVG);

        const builderB = new QRCodeBuilder({
            text,
            size: 512,
            colorDark: '#ff0000',
            dataPattern: DataPattern.CIRCLE,
            imageIO: new NodeImageIO(),
        });
        const resultB = await builderB.buildFromMatrix(matrix, CanvasType.SVG);

        expect(resultA.svg).to.not.equal(resultB.svg);
        expect(resultA.svg).to.be.a('string').with.length.greaterThan(0);
        expect(resultB.svg).to.be.a('string').with.length.greaterThan(0);
    });

    it('is faster than build() for repeated style changes', async () => {
        const text = 'https://the-qrcode-generator.com/benchmark';
        const matrix = QRCodeBuilder.computeMatrix(text);
        const colors = ['#000000', '#ff0000', '#00ff00', '#0000ff', '#ff00ff'];

        const startFull = process.hrtime.bigint();
        for (const color of colors) {
            const b = new QRCodeBuilder({ text, size: 1024, colorDark: color, imageIO: new NodeImageIO() });
            await b.build(CanvasType.SVG);
        }
        const fullTime = Number(process.hrtime.bigint() - startFull) / 1e6;

        const startMatrix = process.hrtime.bigint();
        for (const color of colors) {
            const b = new QRCodeBuilder({ text, size: 1024, colorDark: color, imageIO: new NodeImageIO() });
            await b.buildFromMatrix(matrix, CanvasType.SVG);
        }
        const matrixTime = Number(process.hrtime.bigint() - startMatrix) / 1e6;

        expect(matrixTime).to.be.lessThan(fullTime);
    });
});

