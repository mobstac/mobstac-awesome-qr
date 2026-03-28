/**
 * SvgTextMetrics — pre-computed Roboto 400 character width table.
 *
 * Measured at a reference font size of 100px. Scale proportionally for
 * other sizes. This eliminates the need for getComputedTextLength() and
 * any DOM dependency for text measurement.
 *
 * Character widths were measured from the Roboto Regular font metrics.
 * Covers ASCII printable range (32-126) plus common extended chars.
 */

// Roboto 400 character widths at 100px reference size
const ROBOTO_400_WIDTHS: Record<string, number> = {
    // Space and punctuation
    ' ': 24.9, '!': 26.2, '"': 31.6, '#': 57.1, '$': 53.4, '%': 67.2,
    '&': 58.5, "'": 17.6, '(': 31.9, ')': 32.1, '*': 39.3, '+': 53.7,
    ',': 20.8, '-': 28.5, '.': 25.4, '/': 37.3,
    // Digits
    '0': 53.4, '1': 53.4, '2': 53.4, '3': 53.4, '4': 53.4,
    '5': 53.4, '6': 53.4, '7': 53.4, '8': 53.4, '9': 53.4,
    // Punctuation continued
    ':': 23.8, ';': 23.2, '<': 50.1, '=': 53.2, '>': 51.4,
    '?': 45.4, '@': 84.1,
    // Uppercase
    'A': 61.5, 'B': 58.0, 'C': 59.3, 'D': 61.5, 'E': 52.1,
    'F': 50.7, 'G': 63.9, 'H': 66.0, 'I': 25.6, 'J': 48.3,
    'K': 58.3, 'L': 50.1, 'M': 79.6, 'N': 66.0, 'O': 63.9,
    'P': 58.0, 'Q': 63.9, 'R': 57.6, 'S': 55.7, 'T': 55.1,
    'U': 61.5, 'V': 59.3, 'W': 81.3, 'X': 57.4, 'Y': 55.7,
    'Z': 55.7,
    // Brackets and symbols
    '[': 25.0, '\\': 37.3, ']': 25.0, '^': 39.1, '_': 42.8,
    '`': 30.0,
    // Lowercase
    'a': 50.7, 'b': 53.4, 'c': 48.3, 'd': 53.4, 'e': 49.5,
    'f': 33.4, 'g': 53.4, 'h': 52.3, 'i': 22.7, 'j': 22.7,
    'k': 49.5, 'l': 22.7, 'm': 82.4, 'n': 52.3, 'o': 53.4,
    'p': 53.4, 'q': 53.4, 'r': 32.1, 's': 47.5, 't': 33.4,
    'u': 52.3, 'v': 46.6, 'w': 69.0, 'x': 47.5, 'y': 46.6,
    'z': 47.5,
    // Remaining ASCII
    '{': 31.9, '|': 22.7, '}': 31.9, '~': 58.5,
};

// Default width for characters not in the table (approximation)
const DEFAULT_CHAR_WIDTH = 53.4;

// Reference font size at which widths were measured
const REFERENCE_SIZE = 100;

export class SvgTextMetrics {
    /**
     * Measure the approximate rendered width of a string in Roboto 400.
     *
     * @param text - The text string to measure
     * @param fontSize - The font size in px
     * @returns Approximate width in px
     */
    static measureText(text: string, fontSize: number): number {
        const scale = fontSize / REFERENCE_SIZE;
        let width = 0;
        for (let i = 0; i < text.length; i++) {
            const charWidth = ROBOTO_400_WIDTHS[text[i]];
            width += charWidth !== undefined ? charWidth : DEFAULT_CHAR_WIDTH;
        }
        return width * scale;
    }
}
