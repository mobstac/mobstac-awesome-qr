export enum QRMode {
    MODE_NUMBER = 1 << 0,
    MODE_ALPHA_NUM = 1 << 1,
    MODE_8BIT_BYTE = 1 << 2,
    MODE_KANJI = 1 << 3,
}

export enum QRErrorCorrectLevel {
    L = 1,
    M = 0,
    Q = 3,
    H = 2,
}

export enum QRMaskPattern {
    PATTERN000 = 0,
    PATTERN001,
    PATTERN010,
    PATTERN011,
    PATTERN100,
    PATTERN101,
    PATTERN110,
    PATTERN111,
}

export enum CanvasType {
    SVG = 'svg',
}

/**
 * Module type encoding: bit 0 = dark flag, bits 1-4 = region.
 * Use `type & 1` to check dark/light, `type & ~1` to get region.
 */
export enum ModuleType {
    LIGHT_DATA       = 0b00000,  // 0
    DARK_DATA        = 0b00001,  // 1
    LIGHT_FINDER     = 0b00010,  // 2
    DARK_FINDER      = 0b00011,  // 3
    LIGHT_FINDER_CENTER = 0b00100, // 4
    DARK_FINDER_CENTER  = 0b00101, // 5
    LIGHT_ALIGNMENT  = 0b00110,  // 6
    DARK_ALIGNMENT   = 0b00111,  // 7
    LIGHT_ALIGNMENT_CENTER = 0b01000, // 8
    DARK_ALIGNMENT_CENTER  = 0b01001, // 9
    LIGHT_TIMING     = 0b01010,  // 10
    DARK_TIMING      = 0b01011,  // 11
    LIGHT_FORMAT     = 0b01100,  // 12
    DARK_FORMAT      = 0b01101,  // 13
    LIGHT_VERSION    = 0b01110,  // 14
    DARK_VERSION     = 0b01111,  // 15
}

export enum EyeFrameShape {
    SQUARE = 'square',
    CIRCLE = 'circle',
    ROUNDED = 'rounded',
    LEFT_LEAF = 'left-leaf',
    RIGHT_LEAF = 'right-leaf',
}

export enum EyeBallShape {
    SQUARE = 'square',
    CIRCLE = 'circle',
    ROUNDED = 'rounded',
    LEFT_LEAF = 'left-leaf',
    RIGHT_LEAF = 'right-leaf',
    LEFT_DIAMOND = 'left-diamond',
    RIGHT_DIAMOND = 'right-diamond',
}

export enum DataPattern {
    SQUARE = 'square',
    CIRCLE = 'circle',
    KITE = 'kite',
    LEFT_DIAMOND = 'left-diamond',
    RIGHT_DIAMOND = 'right-diamond',
    THIN_SQUARE = 'thin-square',
    SMOOTH_ROUND = 'smooth-round',
    SMOOTH_SHARP = 'smooth-sharp'

}

export enum GradientType {
    NONE = 'none',
    LINEAR = 'linear',
    RADIAL = 'radial',
    VERTICAL = 'vertical',
    HORIZONTAL = 'horizontal',
}

export enum QRCodeFrame {
    NONE = 'none',
    BOX_BOTTOM = 'box-bottom',
    BOX_TOP = 'box-top',
    BANNER_TOP = 'banner-top',
    BANNER_BOTTOM = 'banner-bottom',
    BALLOON_BOTTOM = 'balloon-bottom',
    BALLOON_TOP = 'balloon-top',
    CIRCULAR = 'circular',
    TEXT_ONLY = 'text-only',
    FOCUS = 'focus'
    // BOX_LIGHT = 'box-light',
}


export enum TextTagPosition {
    TOP_CENTER    = 'top-center',
    TOP_RIGHT     = 'top-right',
    RIGHT_UPPER   = 'right-upper',
    RIGHT_CENTER  = 'right-center',
    RIGHT_LOWER   = 'right-lower',
    BOTTOM_RIGHT  = 'bottom-right',
    BOTTOM_CENTER = 'bottom-center',
    BOTTOM_LEFT   = 'bottom-left',
    LEFT_LOWER    = 'left-lower',
    LEFT_CENTER   = 'left-center',
    LEFT_UPPER    = 'left-upper',
    TOP_LEFT      = 'top-left'
}
 

