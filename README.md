
# Mobstac Awesome QR


This GitHub repository is a TypeScript library for generating QR codes. It is a comprehensive library with a wide range of features and customizations for generating QR code.


## Installation

Clone the repo

```bash
  git clone git@github.com:mobstac/mobstac-awesome-qr.git
```

Change the directory

```bash
  cd mobstac-awesome-qr
```

Before installing npm packages please switch to node version 14.

```bash
  nvm use 14
```

Install requied packages

```bash
  npm install
```

Switch to develop branch

```bash
  git checkout develop
```
## Dependecies

**@svgdotjs/svg.js** : Helper library for working with SVG\
**node-fetch** : Fetching images for logo and background\
**sharp** : Converting images between different formats ( SVG, JPEG, PNG)\
**probe-image-size**: Retrive meta data of images.

## Run Locally

Once the packages are installed we can start generating QR code locally.
Open the `index.test.ts` file and edit the QR attributes ( config ) as needed.

Sample config 

```bash
  const config = {
    text: "Sample Data",
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
    frameText: "",
    frameColor: "#724DDB",
    frameTextColor: "#FFFFFF",
    gradientType: GradientType.NONE,
    logoScale: 0.27,
    backgroundImage :'https://s3.amazonaws.com/beaconstac-content-qa/5118/890b88c1e2c2406cafa6f6eec5240287',
    logoImage : 'https://images.freeimages.com/images/previews/ac9/railway-hdr-1361893.jpg',
    size: 1024,
    margin: 80,
    correctLevel: QRErrorCorrectLevel.H,
    logoMargin : 0,
    isVCard : false

};
```

Once you have edited the config according to your requirement, run the following command

```bash
  npm run testMain
```

This will generate 3 files inside the same folder as `index.test.ts` ( `mobstac-awesome-qr/src/test/index.test.ts`). The files generated will be `test.svg`, `test.jpeg`, `test.png`. These files contain the QR code generated with the given config.





## Qr Code Config Details

```
    {
        text: String || JSON 
        logoBackground: Boolean
        backgroundColor: String ( Color in Hex )
        canvasType: CanvasType 
        dataPattern: DataPattern
        dotScale: Number between 0 to 1 ( e.g 0.1, 0.3, 1)
        colorDark: String ( Color in Hex )
        colorLight : String ( Color in Hex )
        eyeBallShape: EyeBallShape,
        eyeFrameShape: EyeFrameShape
        eyeFrameColor : String ( Color in Hex )
        eyeBallColor : String ( Color in Hex )
        frameStyle: QRCodeFrame
        frameText: String
        frameColor: String ( Color in Hex )
        frameTextColor: String ( Color in Hex )
        gradientType: GradientType
        logoScale: Ranges from 0.12 - 0.27
        backgroundImage : String ( URL to image or empty)
        logoImage : String ( URL to image or empty)
        size: 512, 1024, 2048, 4096 
        margin: Number ( Default 80)
        correctLevel: QRErrorCorrectLevel
        logoMargin : Number ( Default 10)
        isVCard : Boolean ( This is true when we set `text` as JSON )
};
```

Enums used above can be found in `enums.ts` file

```
CanvasType
DataPattern
EyeBallShape
EyeFrameShape
QRCodeFrame
GradientType
QRErrorCorrectLevel
```
## Running Tests

To run tests, run the following command

```bash
  npm run test
```

To run tests specific to different component of the QR code

```bash
  npm run testCircular    // Tests for circular QR codes
  npm run testLogos       // QR Code Logo Test
  npm run testEyes        // QR Code Eye Test
  npm run testDataPattern // QR Code Data Pattern test
  npm run testBackground  // QR Code Background test
  npm run testFrames      // QR Code Frame Test
```

The generated QR codes after testing can be found in `tests` folder.