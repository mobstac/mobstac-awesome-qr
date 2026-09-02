import { expect } from 'chai';
import 'mocha';
import { SvgTextMetrics } from '../svg/SvgTextMetrics';

describe('SvgTextMetrics', () => {

    it('empty string returns 0', () => {
        expect(SvgTextMetrics.measureText('', 16)).to.equal(0);
    });

    it('non-empty string returns positive width', () => {
        const width = SvgTextMetrics.measureText('Hello', 16);
        expect(width).to.be.greaterThan(0);
    });

    it('double fontSize doubles width (linear scaling)', () => {
        const w1 = SvgTextMetrics.measureText('Test', 10);
        const w2 = SvgTextMetrics.measureText('Test', 20);
        expect(w2).to.be.closeTo(w1 * 2, 0.001);
    });

    it('W is wider than i', () => {
        const wW = SvgTextMetrics.measureText('W', 100);
        const wi = SvgTextMetrics.measureText('i', 100);
        expect(wW).to.be.greaterThan(wi);
    });

    it('space has non-zero width', () => {
        const width = SvgTextMetrics.measureText(' ', 100);
        expect(width).to.be.greaterThan(0);
    });

    it('unknown chars use fallback width', () => {
        // Use a character outside the Roboto table (e.g., emoji/CJK)
        const unknownWidth = SvgTextMetrics.measureText('\u4e00', 100); // CJK character
        const dollarWidth = SvgTextMetrics.measureText('$', 100); // '$' has width 53.4 (same as default)
        expect(unknownWidth).to.equal(dollarWidth);
    });

    it('multi-char width equals sum of individual char widths', () => {
        const combined = SvgTextMetrics.measureText('AB', 100);
        const a = SvgTextMetrics.measureText('A', 100);
        const b = SvgTextMetrics.measureText('B', 100);
        expect(combined).to.be.closeTo(a + b, 0.001);
    });

    it('handles extended ASCII', () => {
        // Characters in ASCII printable range should have specific widths
        const width = SvgTextMetrics.measureText('~', 100);
        expect(width).to.equal(58.5); // Known Roboto width for ~
    });
});
