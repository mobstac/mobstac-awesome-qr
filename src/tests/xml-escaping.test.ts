import { expect } from 'chai';
import 'mocha';
import { SvgCanvas } from '../svg/SvgCanvas';
import { escapeText, stripRootSizeAttrs } from '../svg/SvgElement';

/**
 * Regression tests for two defects that produced malformed SVG.
 *
 * In both cases the SVG/PDF/EPS paths returned HTTP 200 with an unparseable
 * file and only PNG/JPEG failed, because the rasteriser is the first
 * component that actually parses the document:
 *
 *   {"error":"Input file has corrupt header: glib: XML parse error:
 *    Error domain 1 code 68 ... xmlParseEntityRef: no name"}
 */

/** An '&' that does not begin a valid entity reference. */
const BARE_AMPERSAND = /&(?!amp;|lt;|gt;|quot;|apos;|#\d+;|#x[0-9a-fA-F]+;)/;

/** An attribute name left with no value, e.g. `<rect ... r fill="#000">`. */
const VALUELESS_ATTR =
    /<[a-zA-Z][\w:-]*[^>]*\s(?:r|x|y|rx|ry|cx|cy|width|height)\s+[a-zA-Z][\w:-]*\s*=/;

describe('text content is XML-escaped', () => {

    describe('escapeText()', () => {
        it('escapes a bare ampersand', () => {
            expect(escapeText('Bar & Grill')).to.equal('Bar &amp; Grill');
        });

        it('escapes angle brackets', () => {
            expect(escapeText('a <b> c')).to.equal('a &lt;b&gt; c');
        });

        it('leaves quotes alone (legal inside character data)', () => {
            expect(escapeText('say "hi"')).to.equal('say "hi"');
            expect(escapeText("it's fine")).to.equal("it's fine");
        });

        it('leaves already-safe text untouched', () => {
            expect(escapeText('SCAN ME')).to.equal('SCAN ME');
        });

        it('escapes every ampersand, not just the first', () => {
            expect(escapeText('A & B & C')).to.equal('A &amp; B &amp; C');
        });
    });

    describe('serialized output', () => {
        it('a caption containing & does not emit a bare ampersand', () => {
            const canvas = new SvgCanvas(100, 100);
            canvas.plain('Bar & Grill');
            const svg = canvas.serialize();
            expect(svg).to.contain('&amp;');
            expect(BARE_AMPERSAND.test(svg), 'bare & in output').to.equal(false);
        });

        it('reproduces the reported production input safely', () => {
            // frameText of "QA2 frame - frameText-special" (QR 3705078), which
            // returned 400 for PNG/JPEG and corrupt SVG for the other formats
            const canvas = new SvgCanvas(100, 100);
            canvas.plain('"quote" & <b>bold</b> \'x\' \\/');
            const svg = canvas.serialize();
            expect(BARE_AMPERSAND.test(svg), 'bare & in output').to.equal(false);
            expect(svg).to.not.contain('<b>');
            expect(svg).to.contain('&lt;b&gt;');
        });

        it('escapes multi-line frame text (each line is a separate plain())', () => {
            const canvas = new SvgCanvas(100, 100);
            'Tom & Jerry\nQ&A'.split('\n').forEach(line => canvas.plain(line));
            expect(BARE_AMPERSAND.test(canvas.serialize()), 'bare & in output').to.equal(false);
        });

        it('escapes text passed through text()', () => {
            const canvas = new SvgCanvas(100, 100);
            canvas.text('Health & Safety');
            expect(BARE_AMPERSAND.test(canvas.serialize())).to.equal(false);
        });

        it('escapes text passed through tspan()', () => {
            const canvas = new SvgCanvas(100, 100);
            canvas.text(add => { add.tspan('R&D'); });
            const svg = canvas.serialize();
            expect(svg).to.contain('R&amp;D');
            expect(BARE_AMPERSAND.test(svg)).to.equal(false);
        });

        it('does NOT escape raw markup added via add() (inline SVG logos rely on this)', () => {
            const canvas = new SvgCanvas(100, 100);
            canvas.root.add('<circle cx="5" cy="5" r="2"/>');
            const svg = canvas.serialize();
            expect(svg).to.contain('<circle cx="5" cy="5" r="2"/>');
            expect(svg).to.not.contain('&lt;circle');
        });
    });
});

describe('stripRootSizeAttrs() - inlining an SVG logo', () => {

    // the logo that triggered the corruption: a rounded square using rx
    const LOGO =
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100" height="100">' +
        '<rect width="100" height="100" rx="18" fill="#8f00ff"/>' +
        '<path d="M30 62 L50 28 L70 62 Z" fill="#ffffff"/>' +
        '<circle cx="50" cy="72" r="7" fill="#ffffff"/></svg>';

    it('removes width and height from the root tag', () => {
        const head = stripRootSizeAttrs(LOGO).split('>')[0];
        expect(head).to.not.match(/\swidth=/);
        expect(head).to.not.match(/\sheight=/);
    });

    it('keeps rx on a child element (the reported corruption)', () => {
        expect(stripRootSizeAttrs(LOGO)).to.contain('rx="18"');
    });

    it('leaves no valueless attribute behind', () => {
        const out = stripRootSizeAttrs(LOGO);
        expect(VALUELESS_ATTR.test(out), 'attribute with no value: ' + out).to.equal(false);
        expect(out).to.not.contain(' r fill=');
    });

    it('keeps viewBox, whose name ends in the letters it strips', () => {
        expect(stripRootSizeAttrs(LOGO)).to.contain('viewBox="0 0 100 100"');
    });

    it('keeps child cx / cy / r', () => {
        const out = stripRootSizeAttrs(LOGO);
        expect(out).to.contain('cx="50"');
        expect(out).to.contain('cy="72"');
        expect(out).to.contain('r="7"');
    });

    it('does not strip width/height from children', () => {
        const out = stripRootSizeAttrs(LOGO);
        expect((out.match(/width="100"/g) || []).length).to.equal(1);
        expect((out.match(/height="100"/g) || []).length).to.equal(1);
    });

    it('removes root x and y when present', () => {
        const head = stripRootSizeAttrs('<svg x="4" y="9" viewBox="0 0 8 8"><rect x="1" y="2"/></svg>')
            .split('>')[0];
        expect(head).to.not.match(/\sx=/);
        expect(head).to.not.match(/\sy=/);
    });

    it('keeps x/y on children while removing them from the root', () => {
        const out = stripRootSizeAttrs('<svg x="4" y="9"><rect x="1" y="2"/></svg>');
        expect(out).to.contain('<rect x="1" y="2"/>');
    });

    it('handles single quotes and spaces around the equals sign', () => {
        const head = stripRootSizeAttrs("<svg width = '10' height='20' viewBox='0 0 1 1'><rect/></svg>")
            .split('>')[0];
        expect(head).to.not.match(/\swidth\s*=/);
        expect(head).to.not.match(/\sheight\s*=/);
        expect(head).to.contain('viewBox');
    });

    it('returns the input unchanged when there is no tag to rewrite', () => {
        expect(stripRootSizeAttrs('not markup')).to.equal('not markup');
        expect(stripRootSizeAttrs('')).to.equal('');
    });
});
