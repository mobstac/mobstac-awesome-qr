import 'mocha';
import { CanvasType, DataPattern, EyeBallShape, EyeFrameShape, GradientType, QRCodeFrame, QRErrorCorrectLevel } from '../Enums';
import { QRCodeBuilder } from '../index';
import { QRCode } from '../Models';

// tslint:disable-next-line:no-var-requires
const fs = require('fs');

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
    canvasType: CanvasType.PNG,
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
    canvasType: CanvasType.PNG,
    eyeFrameShape: EyeFrameShape.ROUNDED,
    eyeBallShape: EyeBallShape.ROUNDED,
    dataPattern: DataPattern.KITE,
    colorDark: "#000000",
    colorLight: "#ffffff",
    gradientType: GradientType.RADIAL,
    frameStyle: QRCodeFrame.BOX_TOP,
    dotScale: 1,
    margin: 80,
    size: 1024,
    isVCard: false,
    logoMargin: 20,
    logoScale: 0.25,
    typeNumber: 5,
    useOpacity: true,
    correctLevel: QRErrorCorrectLevel.H
};


// frame + square qr code with size: 1024 and error correction: 2 | type: png


// frame + square qr code with v-card, with size: 1024 and error correction: 2 | type: png




// circular qr code with size: 1024 and error correction: 2 | type: png



// circular qr code with v-card, with size: 1024 and error correction: 2 | type: png



// for PNG
const config2 = {
    text: 'https://www.beaconstac.com',
   // backgroundImage: 'https://s3.amazonaws.com/beaconstac-content-qa/1593/9653e5dae58849b9bf523e27142f875e',
    backgroundColor: 'white',
    canvasType: CanvasType.SVG,
    eyeFrameShape: EyeFrameShape.CIRCLE,
    eyeBallShape: EyeBallShape.CIRCLE,
    dataPattern: DataPattern.CIRCLE,
   colorDark: 'yellow',
   colorLight: '#4494fc',
    dotScale: 1,
     gradientType: GradientType.LINEAR,
    frameStyle: QRCodeFrame.BOX_BOTTOM,
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
const config4 = {
    text: 'https://www.beaconstac.com',
   // backgroundImage: 'https://s3.amazonaws.com/beaconstac-content-qa/1593/9653e5dae58849b9bf523e27142f875e',
    backgroundColor: 'white',
    canvasType: CanvasType.SVG,
    eyeFrameShape: EyeFrameShape.RIGHT_LEAF,
    eyeBallShape: EyeBallShape.ROUNDED,
    dataPattern: DataPattern.LEFT_DIAMOND,
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
const config5 = {
    text: 'https://www.beaconstac.com',
   // backgroundImage: 'https://s3.amazonaws.com/beaconstac-content-qa/1593/9653e5dae58849b9bf523e27142f875e',
    backgroundColor: 'white',
    canvasType: CanvasType.SVG,
    eyeFrameShape: EyeFrameShape.LEFT_LEAF,
    eyeBallShape: EyeBallShape.LEFT_LEAF,
   colorDark: 'yellow',
   dataPattern: DataPattern.LEFT_DIAMOND,
   colorLight: '#4494fc',
    dotScale: 1,
    gradientType: GradientType.HORIZONTAL,
    frameColor: 'blue',
    frameText: 'HEY QR frame',
    frameStyle: QRCodeFrame.BANNER_TOP,
    logoMargin: 20,
    logoScale: 0.25,
    margin: 80,
    typeNumber: 5,
    size: 256,
    isVCard: true,
    useCanvas: true,
    useOpacity: true,
};
const config6 = {
    text: 'https://www.beaconstac.com',
   // backgroundImage: 'https://s3.amazonaws.com/beaconstac-content-qa/1593/9653e5dae58849b9bf523e27142f875e',
    backgroundColor: 'white',
    canvasType: CanvasType.SVG,
    eyeFrameShape: EyeFrameShape.RIGHT_LEAF,
    eyeBallShape: EyeBallShape.RIGHT_LEAF,
    dataPattern: DataPattern.RIGHT_DIAMOND,
   colorDark: 'yellow',
   colorLight: '#4494fc',
    dotScale: 1,
    gradientType: GradientType.VERTICAL,
    frameColor: 'blue',
    frameText: 'HEY QR frame',
    frameStyle: QRCodeFrame.BANNER_BOTTOM,
    logoMargin: 20,
    logoScale: 0.25,
    margin: 80,
    typeNumber: 5,
    size: 256,
    isVCard: false,
    useCanvas: false,
    useOpacity: false,
};
const config7 = {
    text: 'https://s3.amazonaws.com/beaconstac-content-qa/1593/9653e5dae58849b9bf523e27142f875e',
   // backgroundImage: 'https://s3.amazonaws.com/beaconstac-content-qa/1593/9653e5dae58849b9bf523e27142f875e',
    backgroundColor: 'white',
    canvasType: CanvasType.SVG,
    eyeFrameShape: EyeFrameShape.RIGHT_LEAF,
    eyeBallShape: EyeBallShape.LEFT_DIAMOND,
   colorDark: 'yellow',
   colorLight: '#4494fc',
    dotScale: 1,
    gradientType: GradientType.HORIZONTAL,
    frameColor: 'blue',
    frameText: 'HEY QR frame',
    logoMargin: 20,
    logoScale: 0.25,
    margin: 80,
    frameStyle: QRCodeFrame.BALLOON_BOTTOM,
    typeNumber: 5,
    size: 256,
    isVCard: false,
    useCanvas: false,
    useOpacity: false,
};
const config8 = {
    text: 'https://www.google.com/search?q=google+image&sxsrf=ALeKk01HdEjd-1kgx0opDH4z57mKAKdSfg:1619608675472&source=lnms&tbm=isch&sa=X&ved=2ahUKEwja3Zq-6KDwAhVDjOYKHeseBpQQ_AUoAXoECAEQAw&biw=1853&bih=949#imgrc=NaNXoifrEY1VZM',
   // backgroundImage: 'https://s3.amazonaws.com/beaconstac-content-qa/1593/9653e5dae58849b9bf523e27142f875e',
    backgroundColor: 'white',
    canvasType: CanvasType.SVG,
    eyeFrameShape: EyeFrameShape.RIGHT_LEAF,
    eyeBallShape: EyeBallShape.RIGHT_DIAMOND,
   colorDark: 'yellow',
   colorLight: '#4494fc',
    dotScale: 1,
    gradientType: GradientType.HORIZONTAL,
    frameColor: 'blue',
    frameText: 'HEY QR frame',
    logoMargin: 20,
    logoScale: 0.25,
    frameStyle: QRCodeFrame.BALLOON_TOP,
    margin: 80,
    typeNumber: 5,
    size: 256,
    isVCard: false,
    useCanvas: false,
    useOpacity: false,
};
const config9 = {
    backgroundColor:'white',
    canvasType: CanvasType.SVG,
    colorDark: "red",
    colorLight: "green",
    correctLevel: 2,
    dataPattern: DataPattern.KITE,
    dotScale: 0.96,
    eyeBallShape: EyeBallShape.SQUARE,
    // eyeFrameColor: "",
    eyeFrameShape: EyeFrameShape.RIGHT_LEAF,
    frameStyle: QRCodeFrame.CIRCULAR,
    frameColor: "blue",
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
const config10 = {
    canvasType: CanvasType.SVG,
    logoImage: 'https://www.tutorialspoint.com/videotutorials/images/coding_ground_home.jpg',  
    backgroundColor:'white',
    colorDark: "blue",
    colorLight: "green",
    dataPattern: DataPattern.CIRCLE,
    dotScale: 1,
    eyeBallShape: EyeBallShape.CIRCLE,
    // eyeFrameColor: "",
    eyeFrameShape: EyeFrameShape.CIRCLE,
    frameStyle: QRCodeFrame.CIRCULAR,
    frameColor: "blue",
    frameText: "Scan QR",
    gradientType: GradientType.VERTICAL,
   // imageServerURL: "https://beaconstacqa.mobstac.com/api/2.0/validate_url/",

    text: "https://www.google.com/search?q=google+image&sxsrf=ALeKk01HdEjd-1kgx0opDH4z57mKAKdSfg:1619608675472&source=lnms&tbm=isch&sa=X&ved=2ahUKEwja3Zq-6KDwAhVDjOYKHeseBpQQ_AUoAXoECAEQAw&biw=1853&bih=949#imgrc=NaNXoifrEY1VZM",
};
const config11 = {
    canvasType: CanvasType.SVG,
    colorDark: "blue",
    colorLight: "green",
    dataPattern: DataPattern.LEFT_DIAMOND,
    dotScale: 1,
    eyeBallShape: EyeBallShape.CIRCLE,
    // eyeFrameColor: "",
    eyeFrameShape: EyeFrameShape.CIRCLE,
    frameStyle: QRCodeFrame.CIRCULAR,
    frameColor: "blue",
    frameText: "Scan QR",
    gradientType: GradientType.VERTICAL,
   // imageServerURL: "https://beaconstacqa.mobstac.com/api/2.0/validate_url/",

    text: "https://google.com",
};
const config12 = {
    canvasType: CanvasType.SVG,
    colorDark: "blue",
    colorLight: "green",
    dataPattern: DataPattern.RIGHT_DIAMOND,
    dotScale: 1,
    eyeBallShape: EyeBallShape.CIRCLE,
    // eyeFrameColor: "",
    eyeFrameShape: EyeFrameShape.CIRCLE,
    frameStyle: QRCodeFrame.CIRCULAR,
    frameColor: "blue",
    frameText: "Scan QR",
    gradientType: GradientType.VERTICAL,
   // imageServerURL: "https://beaconstacqa.mobstac.com/api/2.0/validate_url/",

    text: "https://google.com",
};
const config13 = {
    canvasType: CanvasType.SVG,
    colorDark: "red",
    colorLight: "green",
    dataPattern: DataPattern.SQUARE,
    dotScale: 1,
    eyeBallShape: EyeBallShape.CIRCLE,
    // eyeFrameColor: "",
    eyeFrameShape: EyeFrameShape.CIRCLE,
    frameStyle: QRCodeFrame.CIRCULAR,
    frameColor: "blue",
    frameText: "Scan QR",
    gradientType: GradientType.VERTICAL,
   // imageServerURL: "https://beaconstacqa.mobstac.com/api/2.0/validate_url/",

    text: "https://google.com",
};
const config14 = {
    logoImage: 'https://www.tutorialspoint.com/videotutorials/images/coding_ground_home.jpg',  
    logoBackground: false,
    canvasType: CanvasType.SVG,
    colorDark: "red",
    colorLight: "green",
    dataPattern: DataPattern.SQUARE,
    dotScale: 1,
    eyeBallShape: EyeBallShape.CIRCLE,
    // eyeFrameColor: "",
    eyeFrameShape: EyeFrameShape.CIRCLE,
    frameStyle: QRCodeFrame.CIRCULAR,
    frameColor: "blue",
    frameText: "Scan QR",
    gradientType: GradientType.VERTICAL,
   // imageServerURL: "https://beaconstacqa.mobstac.com/api/2.0/validate_url/",

    text: "https://google.com",
};
const config15 = {
    text: sampleUrl,
    logoImage: 'https://www.tutorialspoint.com/videotutorials/images/coding_ground_home.jpg',  
    logoBackground: false,
    canvasType: CanvasType.PNG,
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
function prepareImageBuffer(qrCode: QRCode, name: string) {
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
    const fileName = `/qrTests/${name}` + "." + extension;

    return {
        name: fileName,
        buffer: imageBuffer
    };

}

describe('Output QR code tests', () => {
    it('QR test PNG: default', done => {
        const qrCodeGenerator = new QRCodeBuilder(config1);
        qrCodeGenerator.build(CanvasType.PNG).then(qrCode => {
            const bufferObject = prepareImageBuffer(qrCode, 'default');
            fs.writeFileSync(__dirname + bufferObject.name, bufferObject.buffer);
            done();
        }).catch(err => {
            console.error(err);
            done();
        });
    });

    it('QR test PNG: default_vcard', done => {
        const qrCodeGenerator = new QRCodeBuilder(config3);
        qrCodeGenerator.build(CanvasType.PNG).then(qrCode => {
            const bufferObject = prepareImageBuffer(qrCode, 'default_vcard');
            fs.writeFileSync(__dirname + bufferObject.name, bufferObject.buffer);
            done();
        }).catch(err => {
            console.error(err);
            done();
        });
    });
    it('QR test PNG: frame-box-circular-data', done => {
        const qrCodeGenerator = new QRCodeBuilder(config2);
        qrCodeGenerator.build(CanvasType.PNG).then(qrCode => {
            const bufferObject = prepareImageBuffer(qrCode, 'frame-box-bottom');
            fs.writeFileSync(__dirname + bufferObject.name, bufferObject.buffer);
            done();
        }).catch(err => {
            console.error(err);
            done();
        });
    });
    it('QR test PNG: frame-text greater than 12', done => {
        const qrCodeGenerator = new QRCodeBuilder(config4);
        qrCodeGenerator.build(CanvasType.PNG).then(qrCode => {
            const bufferObject = prepareImageBuffer(qrCode, 'frame-text-greater-than-12');
            fs.writeFileSync(__dirname + bufferObject.name, bufferObject.buffer);
            done();
        }).catch(err => {
            console.error(err);
            done();
        });
    });
    it('QR test PNG: frame banner top', done => {
        const qrCodeGenerator = new QRCodeBuilder(config5);
        qrCodeGenerator.build(CanvasType.PNG).then(qrCode => {
            const bufferObject = prepareImageBuffer(qrCode, 'frame-banner-top');
            fs.writeFileSync(__dirname + bufferObject.name, bufferObject.buffer);
            done();
        }).catch(err => {
            console.error(err);
            done();
        });
    });
    it('QR test PNG: frame banner bottom gradient vertical', done => {
        const qrCodeGenerator = new QRCodeBuilder(config6);
        qrCodeGenerator.build(CanvasType.PNG).then(qrCode => {
            const bufferObject = prepareImageBuffer(qrCode, 'frame-banner-bottom');
            fs.writeFileSync(__dirname + bufferObject.name, bufferObject.buffer);
            done();
        }).catch(err => {
            console.error(err);
            done();
        });
    });
    it('QR test PNG: frame banner bottom gradient horizontal', done => {
        const qrCodeGenerator = new QRCodeBuilder(config7);
        qrCodeGenerator.build(CanvasType.PNG).then(qrCode => {
            const bufferObject = prepareImageBuffer(qrCode, 'frame-banner-bottom-grad-horizontal');
            fs.writeFileSync(__dirname + bufferObject.name, bufferObject.buffer);
            done();
        }).catch(err => {
            console.error(err);
            done();
        });
    });
    it('QR test PNG: frame balloon top', done => {
        const qrCodeGenerator = new QRCodeBuilder(config8);
        qrCodeGenerator.build(CanvasType.PNG).then(qrCode => {
            const bufferObject = prepareImageBuffer(qrCode, 'frame-balloon-top');
            fs.writeFileSync(__dirname + bufferObject.name, bufferObject.buffer);
            done();
        }).catch(err => {
            console.error(err);
            done();
        });
    });
    it('QR test PNG: circular-kite', done => {
        const qrCodeGenerator = new QRCodeBuilder(config9);
        qrCodeGenerator.build(CanvasType.PNG).then(qrCode => {
            const bufferObject = prepareImageBuffer(qrCode, 'circular-kite');
            fs.writeFileSync(__dirname + bufferObject.name, bufferObject.buffer);
            done();
        }).catch(err => {
            console.error(err);
            done();
        });
    });
    it('QR test PNG: circular-circle', done => {
        const qrCodeGenerator = new QRCodeBuilder(config10);
        qrCodeGenerator.build(CanvasType.PNG).then(qrCode => {
            const bufferObject = prepareImageBuffer(qrCode, 'circular-circle');
            fs.writeFileSync(__dirname + bufferObject.name, bufferObject.buffer);
            done();
        }).catch(err => {
            console.error(err);
            done();
        });
    });
    it('QR test PNG: circular-left-diamond', done => {
        const qrCodeGenerator = new QRCodeBuilder(config11);
        qrCodeGenerator.build(CanvasType.PNG).then(qrCode => {
            const bufferObject = prepareImageBuffer(qrCode, 'circular-left-diamond');
            fs.writeFileSync(__dirname + bufferObject.name, bufferObject.buffer);
            done();
        }).catch(err => {
            console.error(err);
            done();
        });
    });
    it('QR test PNG: circular-right-diamond', done => {
        const qrCodeGenerator = new QRCodeBuilder(config12);
        qrCodeGenerator.build(CanvasType.PNG).then(qrCode => {
            const bufferObject = prepareImageBuffer(qrCode, 'circular-right-diamond');
            fs.writeFileSync(__dirname + bufferObject.name, bufferObject.buffer);
            done();
        }).catch(err => {
            console.error(err);
            done();
        });
    });
    it('QR test PNG: circular-square', done => {
        const qrCodeGenerator = new QRCodeBuilder(config13);
        qrCodeGenerator.build(CanvasType.PNG).then(qrCode => {
            const bufferObject = prepareImageBuffer(qrCode, 'circular-sqaure');
            fs.writeFileSync(__dirname + bufferObject.name, bufferObject.buffer);
            done();
        }).catch(err => {
            console.error(err);
            done();
        });
    });
    it('QR test PNG: circular-No-logobackground', done => {
        const qrCodeGenerator = new QRCodeBuilder(config14);
        qrCodeGenerator.build(CanvasType.PNG).then(qrCode => {
            const bufferObject = prepareImageBuffer(qrCode, 'circular-nologo');
            fs.writeFileSync(__dirname + bufferObject.name, bufferObject.buffer);
            done();
        }).catch(err => {
            console.error(err);
            done();
        });
    });
    it('QR test PNG: default_no_logobackground', done => {
        const qrCodeGenerator = new QRCodeBuilder(config15);
        qrCodeGenerator.build(CanvasType.PNG).then(qrCode => {
            const bufferObject = prepareImageBuffer(qrCode, 'default_no_logobackground');
            fs.writeFileSync(__dirname + bufferObject.name, bufferObject.buffer);
            done();
        }).catch(err => {
            console.error(err);
            done();
        });
    });
});





