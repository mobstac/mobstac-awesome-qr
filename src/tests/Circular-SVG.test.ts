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


const config_circle = [
    {
        backgroundColor: "#ffffff",
        backgroundImage: "",
        colorDark: "#000000",
        colorLight: "#ffffff",
        correctLevel: 1,
        dataPattern: DataPattern.SQUARE,
        dotScale: 1,
        eyeBallShape: EyeBallShape.SQUARE,
        eyeFrameShape: EyeFrameShape.SQUARE,
        frameColor: "#000000",
        frameStyle: QRCodeFrame.CIRCULAR,
        frameText: "Circular_QR",
        frameTextColor: "#ffffff",
        gradientType: GradientType.NONE,
        isVCard: false,
        logoBackground: true,
        logoHeight: 0,
        logoImage: "",
        logoMargin:10,
        logoScale: 0.15,
        logoWidth: 0,
        margin: 80,
        rectangular: true,
        size: 512,
        text: "https://www.lcbo.com/content/lcbo/en/homepage/summer-hot-list.html?utm_medium=print&utm_source=qr_instore_signage&utm_campaign=20220522_p3_tad_summerhotlist_en&utm_content=vertical_transparencyasiufkasbfkasbfkbaskfbajsbfkaskfbalsouasugayirghasbfasiyfbhaksfiyafbabfljbashfasfiasbkfhbaskfhasgfyiasfbasihfasvfhiasbfhiasfhabfifaihfbahifbhafhafyiashfhkasvfhiasfhivashfvhiasbfhabfabfbasjfbasfsbfhbfkabfaf" 
    },
    {
        backgroundColor: "#ffffff",
        backgroundImage: "",
        colorDark: "#000000",
        colorLight: "#ffffff",
        correctLevel: 0,
        dataPattern: DataPattern.CIRCLE,
        dotScale: 1,
        eyeBallShape: EyeBallShape.CIRCLE,
        eyeFrameShape: EyeFrameShape.CIRCLE,
        frameColor: "#000000",
        frameStyle: QRCodeFrame.CIRCULAR,
        frameText: "Circular_QR",
        frameTextColor: "#ffffff",
        gradientType: GradientType.NONE,
        isVCard: false,
        logoBackground: true,
        logoHeight: 0,
        logoImage: "",
        logoMargin:10,
        logoScale: 0.15,
        logoWidth: 0,
        margin: 80,
        rectangular: true,
        size: 512,
        text: "https://www.lcbo.com/content/lcbo/en/homepage/summer-hot-list.html?utm_medium=print&utm_source=qr_instore_signage&utm_campaign=20220522_p3_tad_summerhotlist_en&utm_content=vertical_transparency" 
    },
    {
        backgroundColor: "#ffffff",
        backgroundImage: "",
        colorDark: "#000000",
        colorLight: "#ffffff",
        correctLevel: 3,
        dataPattern: DataPattern.KITE,
        dotScale: 1,
        eyeBallShape: EyeBallShape.RIGHT_DIAMOND,
        eyeFrameShape: EyeFrameShape.ROUNDED,
        frameColor: "#000000",
        frameStyle: QRCodeFrame.CIRCULAR,
        frameText: "Circular_QR",
        frameTextColor: "#ffffff",
        gradientType: GradientType.NONE,
        // imageServerRequestHeaders: {authorization: 'Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI…-iDt3eWHg9ZVEUlDSU3eV_FKeecyW5hkeu0bgphW4jG4fYBsg'},
        // imageServerURL: "https://beaconstacqa.mobstac.com/api/2.0/validate_url/",
        isVCard: false,
        logoBackground: true,
        logoHeight: 0,
        logoImage: "",
        logoMargin:10,
        logoScale: 0.15,
        logoWidth: 0,
        margin: 80,
        rectangular: true,
        size: 4096,
        text: "https://www.lcbo.com/content/lcbo/en/homepage/summer-hot-list.html?utm_medium=print&utm_source=qr_instore_signage&utm_campaign=20220522_p3_tad_summerhotlist_en&utm_content=vertical_transparency" 
    },
    {
        backgroundColor: "#ffffff",
        backgroundImage: "",
        colorDark: "#000000",
        colorLight: "#ffffff",
        correctLevel: 2,
        dataPattern: DataPattern.LEFT_DIAMOND,
        dotScale: 1,
        eyeBallShape: EyeBallShape.ROUNDED,
        eyeFrameShape: EyeFrameShape.LEFT_LEAF,
        frameColor: "#000000",
        frameStyle: QRCodeFrame.CIRCULAR,
        frameText: "Circular_QR",
        frameTextColor: "#ffffff",
        gradientType: GradientType.NONE,
        // imageServerRequestHeaders: {authorization: 'Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI…-iDt3eWHg9ZVEUlDSU3eV_FKeecyW5hkeu0bgphW4jG4fYBsg'},
        // imageServerURL: "https://beaconstacqa.mobstac.com/api/2.0/validate_url/",
        isVCard: false,
        logoBackground: true,
        logoHeight: 0,
        logoImage: "",
        logoMargin:10,
        logoScale: 0.15,
        logoWidth: 0,
        margin: 80,
        rectangular: true,
        size: 512,
        text: "aryan" 
    },
    {
        backgroundColor: "#ffffff",
        backgroundImage: "",
        colorDark: "#000000",
        colorLight: "#ffffff",
        correctLevel: 2,
        dataPattern: DataPattern.RIGHT_DIAMOND,
        dotScale: 1,
        eyeBallShape: EyeBallShape.RIGHT_LEAF,
        eyeFrameShape: EyeFrameShape.CIRCLE,
        frameColor: "#000000",
        frameStyle: QRCodeFrame.CIRCULAR,
        frameText: "Circular_QR",
        frameTextColor: "#ffffff",
        gradientType: GradientType.NONE,
        // imageServerRequestHeaders: {authorization: 'Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI…-iDt3eWHg9ZVEUlDSU3eV_FKeecyW5hkeu0bgphW4jG4fYBsg'},
        // imageServerURL: "https://beaconstacqa.mobstac.com/api/2.0/validate_url/",
        isVCard: false,
        logoBackground: true,
        logoHeight: 0,
        logoImage: "",
        logoMargin:10,
        logoScale: 0.15,
        logoWidth: 0,
        margin: 80,
        rectangular: true,
        size: 512,
        text: "https://www.lcbo.com/content/lcbo/en/homepage/summer-hot-list.html?utm_medium=print&utm_source=qr_instore_signage&utm_campaign=20220522_p3_tad_summerhotlist_en&utm_content=vertical_transparency" 
    },
    {
        backgroundColor: "#ffffff",
        backgroundImage: "",
        colorDark: "#000000",
        colorLight: "#ffffff",
        correctLevel: 2,
        dataPattern: DataPattern.SQUARE,
        dotScale: 1,
        eyeBallShape: EyeBallShape.ROUNDED,
        eyeFrameShape: EyeFrameShape.SQUARE,
        frameColor: "#000000",
        frameStyle: QRCodeFrame.CIRCULAR,
        frameText: "Circular_QR",
        frameTextColor: "#ffffff",
        gradientType: GradientType.NONE,
        // imageServerRequestHeaders: {authorization: 'Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI…-iDt3eWHg9ZVEUlDSU3eV_FKeecyW5hkeu0bgphW4jG4fYBsg'},
        // imageServerURL: "https://beaconstacqa.mobstac.com/api/2.0/validate_url/",
        isVCard: false,
        logoBackground: true,
        logoHeight: 0,
        logoImage: "",
        logoMargin:10,
        logoScale: 0.15,
        logoWidth: 0,
        margin: 80,
        rectangular: true,
        size: 2048,
        text: "https://www.lcbo.com/content/lcbo/en/homepage/summer-hot-list.html?utm_medium=print&utm_source=qr_instore_signage&utm_campaign=20220522_p3_tad_summerhotlist_en&utm_content=vertical_transparency" 
    },
    {
        backgroundColor: "#ffffff",
        backgroundImage: "",
        colorDark: "#000000",
        colorLight: "#ffffff",
        correctLevel: 2,
        dataPattern: DataPattern.RIGHT_DIAMOND,
        dotScale: 1,
        eyeBallShape: EyeBallShape.SQUARE,
        eyeFrameShape: EyeFrameShape.ROUNDED,
        frameColor: "#000000",
        frameStyle: QRCodeFrame.CIRCULAR,
        frameText: "Circular_QR",
        frameTextColor: "#ffffff",
        gradientType: GradientType.NONE,
        // imageServerRequestHeaders: {authorization: 'Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI…-iDt3eWHg9ZVEUlDSU3eV_FKeecyW5hkeu0bgphW4jG4fYBsg'},
        // imageServerURL: "https://beaconstacqa.mobstac.com/api/2.0/validate_url/",
        isVCard: false,
        logoBackground: true,
        logoHeight: 0,
        logoImage: "",
        logoMargin:10,
        logoScale: 0.15,
        logoWidth: 0,
        margin: 80,
        rectangular: true,
        size: 2048,
        text: "https://www.lcbo.com/content/lcbo/en/homepage/summer-hot-list.html?utm_medium=print&utm_source=qr_instore_signage&utm_campaign=20220522_p3_tad_summerhotlist_en&utm_content=vertical_transparency" 
    },
    {
        backgroundColor: "#ffffff",
        backgroundImage: "",
        colorDark: "#000000",
        colorLight: "#ffffff",
        correctLevel: 2,
        dataPattern: DataPattern.RIGHT_DIAMOND,
        dotScale: 1,
        eyeBallShape: EyeBallShape.RIGHT_DIAMOND,
        eyeFrameShape: EyeFrameShape.RIGHT_LEAF,
        frameColor: "#000000",
        frameStyle: QRCodeFrame.CIRCULAR,
        frameText: "Circular_QR",
        frameTextColor: "#ffffff",
        gradientType: GradientType.NONE,
        // imageServerRequestHeaders: {authorization: 'Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI…-iDt3eWHg9ZVEUlDSU3eV_FKeecyW5hkeu0bgphW4jG4fYBsg'},
        // imageServerURL: "https://beaconstacqa.mobstac.com/api/2.0/validate_url/",
        isVCard: false,
        logoBackground: true,
        logoHeight: 0,
        logoImage: "",
        logoMargin:10,
        logoScale: 0.15,
        logoWidth: 0,
        margin: 80,
        rectangular: true,
        size: 512,
        text: "https://www.lcbo.com/content/lcbo/en/homepage/summer-hot-list.html?utm_medium=print&utm_source=qr_instore_signage&utm_campaign=20220522_p3_tad_summerhotlist_en&utm_content=vertical_transparencysafjkasbfbasfkaskfbabscasksbcascaskbisfasfjksakfksafsakf askfiasvfaskfaskhfvihasfkasfkhashifvashfkashfvashfkasfhasvfkhaskhfvashvfhjs" 
    },
    {
        backgroundColor: "#ffffff",
        backgroundImage: "",
        colorDark: "#000000",
        colorLight: "#ffffff",
        correctLevel: 2,
        dataPattern: DataPattern.LEFT_DIAMOND,
        dotScale: 1,
        eyeBallShape: EyeBallShape.LEFT_DIAMOND,
        eyeFrameShape: EyeFrameShape.SQUARE,
        frameColor: "#000000",
        frameStyle: QRCodeFrame.CIRCULAR,
        frameText: "Circular_QR",
        frameTextColor: "#ffffff",
        gradientType: GradientType.NONE,
        // imageServerRequestHeaders: {authorization: 'Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI…-iDt3eWHg9ZVEUlDSU3eV_FKeecyW5hkeu0bgphW4jG4fYBsg'},
        // imageServerURL: "https://beaconstacqa.mobstac.com/api/2.0/validate_url/",
        isVCard: false,
        logoBackground: true,
        logoHeight: 0,
        logoImage: "",
        logoMargin:10,
        logoScale: 0.15,
        logoWidth: 0,
        margin: 80,
        rectangular: true,
        size: 1024,
        text: "https://www.lcbo.com/content/lcbo/en/homepage/summer-hot-list.html?utm_medium=print&utm_source=qr_instore_signage&utm_campaign=20220522_p3_tad_summerhotlist_en&utm_content=vertical_transparencyfhsajfkasfkjsakf kjasbfksabfsakfkas fsabf sakf kas fhisabfk sakfsahbfsabfjksbakhfbsaf aksn fhsabfkhsakf sakf safkhsafkjbaskfbsabfsabfkjbsajkfbkhsafksabfkasbfhksbafkbska" 
    },
    {
        backgroundColor: "#ffffff",
        backgroundImage: "",
        colorDark: "#382854",
        colorLight: "#ffffff",
        correctLevel: 3,
        dataPattern: DataPattern.LEFT_DIAMOND,
        dotScale: 1,
        eyeBallShape: EyeBallShape.RIGHT_LEAF,
        eyeFrameShape: EyeFrameShape.RIGHT_LEAF,
        frameColor: "#000000",
        frameStyle: QRCodeFrame.CIRCULAR,
        frameText: "Circular_QR",
        frameTextColor: "#ffffff",
        gradientType: GradientType.NONE,
        // imageServerRequestHeaders: {authorization: 'Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI…-iDt3eWHg9ZVEUlDSU3eV_FKeecyW5hkeu0bgphW4jG4fYBsg'},
        // imageServerURL: "https://beaconstacqa.mobstac.com/api/2.0/validate_url/",
        isVCard: false,
        logoBackground: true,
        logoHeight: 0,
        logoImage: "",
        logoMargin:10,
        logoScale: 0.15,
        logoWidth: 0,
        margin: 80,
        rectangular: true,
        size: 512,
        text: "https://www.lcbo.com/content/lcbo/en/homepage/summer-hot-list.html?utm_medium=print&utm_source=qr_instore_signage&utm_campaign=20220522_p3_tad_summerhotlist_en&utm_content=vertical_transparency" 
    },
    {
        backgroundColor: "#ffffff",
        backgroundImage: "",
        colorDark: "#000000",
        colorLight: "#ffffff",
        correctLevel: 1,
        dataPattern: DataPattern.SQUARE,
        dotScale: 1,
        eyeBallShape: EyeBallShape.SQUARE,
        eyeFrameShape: EyeFrameShape.SQUARE,
        frameColor: "#000000",
        frameStyle: QRCodeFrame.CIRCULAR,
        frameText: "Circular_QR",
        frameTextColor: "#ffffff",
        gradientType: GradientType.NONE,
        isVCard: false,
        logoBackground: true,
        logoHeight: 0,
        logoImage: "",
        logoMargin:10,
        logoScale: 0.15,
        logoWidth: 0,
        margin: 80,
        rectangular: true,
        size: 1024,
        text: "https://www.lcbo" 
    }
]

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
    const fileName = `/${name}` + "." + extension;

    return {
        name: fileName,
        buffer: imageBuffer
    };

}

describe('Circular QR code tests', () => {
    for(let i=0 ; i<config_circle.length ; i++){
        it('QR test SVG', done => {
            const qrCodeGenerator = new QRCodeBuilder(config_circle[i]);

            qrCodeGenerator.build(CanvasType.SVG).then(qrCode => {
                let test = '/test' + i + '.';
                fs.writeFileSync(__dirname + '/CircularQRTests' + test + CanvasType.SVG.toLowerCase(), qrCode.toBuffer());
                done();
            }).catch(err => {
                console.error(err);
                done();
            });
        });
    }
});
