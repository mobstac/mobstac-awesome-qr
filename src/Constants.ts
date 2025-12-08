export const PATTERN_POSITION_TABLE = [
    [],
    [6, 18],
    [6, 22],
    [6, 26],
    [6, 30],
    [6, 34],
    [6, 22, 38],
    [6, 24, 42],
    [6, 26, 46],
    [6, 28, 50],
    [6, 30, 54],
    [6, 32, 58],
    [6, 34, 62],
    [6, 26, 46, 66],
    [6, 26, 48, 70],
    [6, 26, 50, 74],
    [6, 30, 54, 78],
    [6, 30, 56, 82],
    [6, 30, 58, 86],
    [6, 34, 62, 90],
    [6, 28, 50, 72, 94],
    [6, 26, 50, 74, 98],
    [6, 30, 54, 78, 102],
    [6, 28, 54, 80, 106],
    [6, 32, 58, 84, 110],
    [6, 30, 58, 86, 114],
    [6, 34, 62, 90, 118],
    [6, 26, 50, 74, 98, 122],
    [6, 30, 54, 78, 102, 126],
    [6, 26, 52, 78, 104, 130],
    [6, 30, 56, 82, 108, 134],
    [6, 34, 60, 86, 112, 138],
    [6, 30, 58, 86, 114, 142],
    [6, 34, 62, 90, 118, 146],
    [6, 30, 54, 78, 102, 126, 150],
    [6, 24, 50, 76, 102, 128, 154],
    [6, 28, 54, 80, 106, 132, 158],
    [6, 32, 58, 84, 110, 136, 162],
    [6, 26, 54, 82, 110, 138, 166],
    [6, 30, 58, 86, 114, 142, 170],
];
export const G15 = (1 << 10) | (1 << 8) | (1 << 5) | (1 << 4) | (1 << 2) | (1 << 1) | (1 << 0);
export const G18 = (1 << 12) | (1 << 11) | (1 << 10) | (1 << 9) | (1 << 8) | (1 << 5) | (1 << 2) | (1 << 0);
export const G15_MASK = (1 << 14) | (1 << 12) | (1 << 10) | (1 << 4) | (1 << 1);

export interface LogoSize {
    maxLogoSize: number;
    maxLogoWidth: number;
    maxLogoHeight: number;
}

// ER L
const ERL_QR10: LogoSize = { maxLogoSize: 15, maxLogoHeight: 13, maxLogoWidth: 19 } ;
const ERL_QR9: LogoSize = { maxLogoSize: 15, maxLogoHeight: 11, maxLogoWidth: 17 } ;
const ERL_QR8: LogoSize = { maxLogoSize: 13, maxLogoHeight: 11, maxLogoWidth: 15 } ;
const ERL_QR7: LogoSize = { maxLogoSize: 11, maxLogoHeight: 9, maxLogoWidth: 15 } ;
const ERL_QR6: LogoSize = { maxLogoSize: 9, maxLogoHeight: 7, maxLogoWidth: 11 } ;
const ERL_QR5: LogoSize = { maxLogoSize: 9, maxLogoHeight: 5, maxLogoWidth: 11 } ;
const ERL_QR4: LogoSize = { maxLogoSize: 7, maxLogoHeight: 5, maxLogoWidth: 11 } ;
const ERL_QR3: LogoSize = { maxLogoSize: 5, maxLogoHeight: 5, maxLogoWidth: 7 } ;
const ERL_QR2: LogoSize = { maxLogoSize: 5, maxLogoHeight: 3, maxLogoWidth: 5 } ;
const ERL_QR1: LogoSize = { maxLogoSize: 5, maxLogoHeight: 3, maxLogoWidth: 5 } ;

export let maxLogoSizeConfigERL = new Map<number, LogoSize>([
    [10, ERL_QR10],
    [9, ERL_QR9],
    [8, ERL_QR8],
    [7, ERL_QR7],
    [6, ERL_QR6],
    [5, ERL_QR5],
    [4, ERL_QR4],
    [3, ERL_QR3],
    [2, ERL_QR2],
    [1, ERL_QR1]
]) ;

// ER M
const ERM_QR10: LogoSize = { maxLogoSize: 15, maxLogoHeight: 13, maxLogoWidth: 19 } ;
const ERM_QR9: LogoSize = { maxLogoSize: 15, maxLogoHeight: 11, maxLogoWidth: 17 } ;
const ERM_QR8: LogoSize = { maxLogoSize: 13, maxLogoHeight: 11, maxLogoWidth: 15 } ;
const ERM_QR7: LogoSize = { maxLogoSize: 11, maxLogoHeight: 9, maxLogoWidth: 15 } ;
const ERM_QR6: LogoSize = { maxLogoSize: 9, maxLogoHeight: 7, maxLogoWidth: 11 } ;
const ERM_QR5: LogoSize = { maxLogoSize: 9, maxLogoHeight: 5, maxLogoWidth: 11 } ;
const ERM_QR4: LogoSize = { maxLogoSize: 7, maxLogoHeight: 5, maxLogoWidth: 11 } ;
const ERM_QR3: LogoSize = { maxLogoSize: 5, maxLogoHeight: 5, maxLogoWidth: 7 } ;
const ERM_QR2: LogoSize = { maxLogoSize: 5, maxLogoHeight: 3, maxLogoWidth: 7 } ;
const ERM_QR1: LogoSize = { maxLogoSize: 5, maxLogoHeight: 3, maxLogoWidth: 5 } ;

export let maxLogoSizeConfigERM = new Map<number, LogoSize>([
    [10, ERM_QR10],
    [9, ERM_QR9],
    [8, ERM_QR8],
    [7, ERM_QR7],
    [6, ERM_QR6],
    [5, ERM_QR5],
    [4, ERM_QR4],
    [3, ERM_QR3],
    [2, ERM_QR2],
    [1, ERM_QR1]
]) ;

// ER Q
const ERQ_QR10: LogoSize = { maxLogoSize: 25, maxLogoHeight: 23, maxLogoWidth: 27 } ;
const ERQ_QR9: LogoSize = { maxLogoSize: 21, maxLogoHeight: 19, maxLogoWidth: 25 } ;
const ERQ_QR8: LogoSize = { maxLogoSize: 21, maxLogoHeight: 19, maxLogoWidth: 23 } ;
const ERQ_QR7: LogoSize = { maxLogoSize: 17, maxLogoHeight: 17, maxLogoWidth: 21 } ;
const ERQ_QR6: LogoSize = { maxLogoSize: 17, maxLogoHeight: 15, maxLogoWidth: 19 } ;
const ERQ_QR5: LogoSize = { maxLogoSize: 13, maxLogoHeight: 11, maxLogoWidth: 19 } ;
const ERQ_QR4: LogoSize = { maxLogoSize: 13, maxLogoHeight: 11, maxLogoWidth: 15 } ;
const ERQ_QR3: LogoSize = { maxLogoSize: 9, maxLogoHeight: 9, maxLogoWidth: 11 } ;
const ERQ_QR2: LogoSize = { maxLogoSize: 7, maxLogoHeight: 7, maxLogoWidth: 9 } ;
const ERQ_QR1: LogoSize = { maxLogoSize: 7, maxLogoHeight: 5, maxLogoWidth: 9 } ;

export let maxLogoSizeConfigERQ = new Map<number, LogoSize>([
    [10, ERQ_QR10],
    [9, ERQ_QR9],
    [8, ERQ_QR8],
    [7, ERQ_QR7],
    [6, ERQ_QR6],
    [5, ERQ_QR5],
    [4, ERQ_QR4],
    [3, ERQ_QR3],
    [2, ERQ_QR2],
    [1, ERQ_QR1]
]) ;

// ER H
const ERH_QR10: LogoSize = { maxLogoSize: 25, maxLogoHeight: 23, maxLogoWidth: 27 } ;
const ERH_QR9: LogoSize = { maxLogoSize: 21, maxLogoHeight: 19, maxLogoWidth: 25 } ;
const ERH_QR8: LogoSize = { maxLogoSize: 21, maxLogoHeight: 19, maxLogoWidth: 23 } ;
const ERH_QR7: LogoSize = { maxLogoSize: 17, maxLogoHeight: 17, maxLogoWidth: 21 } ;
const ERH_QR6: LogoSize = { maxLogoSize: 17, maxLogoHeight: 15, maxLogoWidth: 19 } ;
const ERH_QR5: LogoSize = { maxLogoSize: 13, maxLogoHeight: 11, maxLogoWidth: 19 } ;
const ERH_QR4: LogoSize = { maxLogoSize: 13, maxLogoHeight: 11, maxLogoWidth: 15 } ;
const ERH_QR3: LogoSize = { maxLogoSize: 9, maxLogoHeight: 9, maxLogoWidth: 11 } ;
const ERH_QR2: LogoSize = { maxLogoSize: 7, maxLogoHeight: 7, maxLogoWidth: 9 } ;
const ERH_QR1: LogoSize = { maxLogoSize: 7, maxLogoHeight: 5, maxLogoWidth: 9 } ;

export let maxLogoSizeConfigERH = new Map<number, LogoSize>([
    [10, ERH_QR10],
    [9, ERH_QR9],
    [8, ERH_QR8],
    [7, ERH_QR7],
    [6, ERH_QR6],
    [5, ERH_QR5],
    [4, ERH_QR4],
    [3, ERH_QR3],
    [2, ERH_QR2],
    [1, ERH_QR1]
]) ;

export const DEFAULT_TEXT_TAG_FONT_SIZE = 30;
export const DEFAULT_CANVAS_SIZE = 1024;
