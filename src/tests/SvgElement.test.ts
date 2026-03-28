import { expect } from 'chai';
import 'mocha';
import { SvgElement } from '../svg/SvgElement';

describe('SvgElement', () => {

    describe('constructor', () => {
        it('creates element with correct tag', () => {
            const el = new SvgElement('rect');
            expect(el.tag).to.equal('rect');
        });

        it('starts with empty attrs and children', () => {
            const el = new SvgElement('g');
            expect(el.attrs.size).to.equal(0);
            expect(el.children).to.eql([]);
        });
    });

    describe('attributes', () => {
        it('setAttr/getAttr round-trip', () => {
            const el = new SvgElement('rect');
            el.setAttr('width', '100');
            expect(el.getAttr('width')).to.equal('100');
        });

        it('setAttr converts number to string', () => {
            const el = new SvgElement('rect');
            el.setAttr('width', 42);
            expect(el.getAttr('width')).to.equal('42');
        });

        it('setAttrs sets multiple, skips undefined', () => {
            const el = new SvgElement('rect');
            el.setAttrs({ width: '10', height: undefined, fill: 'red' });
            expect(el.getAttr('width')).to.equal('10');
            expect(el.getAttr('height')).to.equal(undefined);
            expect(el.getAttr('fill')).to.equal('red');
        });

        it('removeAttr deletes attribute', () => {
            const el = new SvgElement('rect');
            el.setAttr('fill', 'blue');
            el.removeAttr('fill');
            expect(el.getAttr('fill')).to.equal(undefined);
        });

        it('attr() alias works', () => {
            const el = new SvgElement('rect');
            el.attr({ x: 5, y: 10 });
            expect(el.getAttr('x')).to.equal('5');
            expect(el.getAttr('y')).to.equal('10');
        });
    });

    describe('children', () => {
        it('add() appends element', () => {
            const parent = new SvgElement('g');
            const child = new SvgElement('rect');
            parent.add(child);
            expect(parent.children).to.have.lengthOf(1);
            expect(parent.children[0]).to.equal(child);
        });

        it('add() appends string', () => {
            const el = new SvgElement('text');
            el.add('Hello');
            expect(el.children).to.have.lengthOf(1);
            expect(el.children[0]).to.equal('Hello');
        });

        it('insertAt() inserts at index', () => {
            const parent = new SvgElement('g');
            const a = new SvgElement('rect');
            const b = new SvgElement('circle');
            const c = new SvgElement('path');
            parent.add(a).add(c);
            parent.insertAt(1, b);
            expect(parent.children[0]).to.equal(a);
            expect(parent.children[1]).to.equal(b);
            expect(parent.children[2]).to.equal(c);
        });

        it('remove() removes child', () => {
            const parent = new SvgElement('g');
            const child = new SvgElement('rect');
            parent.add(child);
            parent.remove(child);
            expect(parent.children).to.have.lengthOf(0);
        });

        it('remove() no-ops for missing child', () => {
            const parent = new SvgElement('g');
            const child = new SvgElement('rect');
            parent.remove(child); // should not throw
            expect(parent.children).to.have.lengthOf(0);
        });

        it('clear() removes all children', () => {
            const parent = new SvgElement('g');
            parent.add(new SvgElement('rect'));
            parent.add(new SvgElement('circle'));
            parent.clear();
            expect(parent.children).to.have.lengthOf(0);
        });
    });

    describe('chainable methods', () => {
        it('move() sets x/y for rect', () => {
            const el = new SvgElement('rect');
            el.move(10, 20);
            expect(el.getAttr('x')).to.equal('10');
            expect(el.getAttr('y')).to.equal('20');
        });

        it('move() sets cx/cy for circle', () => {
            const el = new SvgElement('circle');
            el.setAttr('r', '5');
            el.move(10, 20);
            expect(el.getAttr('cx')).to.equal('15');
            expect(el.getAttr('cy')).to.equal('25');
        });

        it('move() sets cx/cy for ellipse', () => {
            const el = new SvgElement('ellipse');
            el.setAttr('rx', '10');
            el.setAttr('ry', '5');
            el.move(20, 30);
            expect(el.getAttr('cx')).to.equal('30');
            expect(el.getAttr('cy')).to.equal('35');
        });

        it('size() sets width and height', () => {
            const el = new SvgElement('rect');
            el.size(100, 50);
            expect(el.getAttr('width')).to.equal('100');
            expect(el.getAttr('height')).to.equal('50');
        });

        it('size() with single arg uses it for both', () => {
            const el = new SvgElement('rect');
            el.size(100);
            expect(el.getAttr('width')).to.equal('100');
            expect(el.getAttr('height')).to.equal('100');
        });

        it('fill() sets fill attribute', () => {
            const el = new SvgElement('rect');
            el.fill('#ff0000');
            expect(el.getAttr('fill')).to.equal('#ff0000');
        });

        it('stroke(string) sets stroke color', () => {
            const el = new SvgElement('rect');
            el.stroke('blue');
            expect(el.getAttr('stroke')).to.equal('blue');
        });

        it('stroke(object) sets stroke attributes', () => {
            const el = new SvgElement('rect');
            el.stroke({ color: 'red', width: 2, linejoin: 'round', linecap: 'butt' });
            expect(el.getAttr('stroke')).to.equal('red');
            expect(el.getAttr('stroke-width')).to.equal('2');
            expect(el.getAttr('stroke-linejoin')).to.equal('round');
            expect(el.getAttr('stroke-linecap')).to.equal('butt');
        });

        it('font() sets font attributes', () => {
            const el = new SvgElement('text');
            el.font({ family: 'Arial', size: 16, fill: 'black', anchor: 'middle' });
            expect(el.getAttr('font-family')).to.equal('Arial');
            expect(el.getAttr('font-size')).to.equal('16');
            expect(el.getAttr('fill')).to.equal('black');
            expect(el.getAttr('text-anchor')).to.equal('middle');
        });

        it('radius() for rect sets rx/ry', () => {
            const el = new SvgElement('rect');
            el.radius(5, 10);
            expect(el.getAttr('rx')).to.equal('5');
            expect(el.getAttr('ry')).to.equal('10');
        });

        it('radius() for rect defaults ry to r', () => {
            const el = new SvgElement('rect');
            el.radius(5);
            expect(el.getAttr('rx')).to.equal('5');
            expect(el.getAttr('ry')).to.equal('5');
        });

        it('radius() for circle sets r', () => {
            const el = new SvgElement('circle');
            el.radius(15);
            expect(el.getAttr('r')).to.equal('15');
        });

        it('radius() for ellipse sets rx/ry', () => {
            const el = new SvgElement('ellipse');
            el.radius(10, 20);
            expect(el.getAttr('rx')).to.equal('10');
            expect(el.getAttr('ry')).to.equal('20');
        });

        it('transform() sets transform attribute', () => {
            const el = new SvgElement('g');
            el.transform({ rotate: 45, translate: '10,20' });
            expect(el.getAttr('transform')).to.equal('rotate(45) translate(10,20)');
        });

        it('rotate() sets transform with angle', () => {
            const el = new SvgElement('rect');
            el.rotate(90);
            expect(el.getAttr('transform')).to.equal('rotate(90)');
        });

        it('rotate() with cx/cy', () => {
            const el = new SvgElement('rect');
            el.rotate(45, 100, 200);
            expect(el.getAttr('transform')).to.equal('rotate(45, 100, 200)');
        });

        it('all methods return this', () => {
            const el = new SvgElement('rect');
            expect(el.move(0, 0)).to.equal(el);
            expect(el.size(10, 10)).to.equal(el);
            expect(el.fill('red')).to.equal(el);
            expect(el.stroke('blue')).to.equal(el);
            expect(el.font({ family: 'Arial' })).to.equal(el);
            expect(el.radius(5)).to.equal(el);
            expect(el.transform({ rotate: 0 })).to.equal(el);
            expect(el.rotate(0)).to.equal(el);
            expect(el.setAttr('x', '0')).to.equal(el);
            expect(el.setAttrs({})).to.equal(el);
            expect(el.removeAttr('x')).to.equal(el);
            expect(el.add('text')).to.equal(el);
            expect(el.clear()).to.equal(el);
        });

        it('x() and y() return position', () => {
            const el = new SvgElement('rect');
            el.move(15, 25);
            expect(el.x()).to.equal(15);
            expect(el.y()).to.equal(25);
        });

        it('getWidth() and getHeight() return size', () => {
            const el = new SvgElement('rect');
            el.size(100, 200);
            expect(el.getWidth()).to.equal(100);
            expect(el.getHeight()).to.equal(200);
        });
    });

    describe('serialize', () => {
        it('self-closing tag for no children', () => {
            const el = new SvgElement('rect');
            el.setAttr('width', '10');
            expect(el.serialize()).to.equal('<rect width="10"/>');
        });

        it('tag with children', () => {
            const el = new SvgElement('g');
            const child = new SvgElement('rect');
            el.add(child);
            expect(el.serialize()).to.equal('<g><rect/></g>');
        });

        it('attributes alphabetically sorted', () => {
            const el = new SvgElement('rect');
            el.setAttr('z', '1');
            el.setAttr('a', '2');
            el.setAttr('m', '3');
            const svg = el.serialize();
            expect(svg).to.equal('<rect a="2" m="3" z="1"/>');
        });

        it('escapes & " < > in values', () => {
            const el = new SvgElement('text');
            el.setAttr('data', 'a&b"c<d>e');
            el.add('test');
            const svg = el.serialize();
            expect(svg).to.contain('a&amp;b&quot;c&lt;d&gt;e');
        });

        it('nested elements serialize recursively', () => {
            const g = new SvgElement('g');
            const inner = new SvgElement('g');
            const rect = new SvgElement('rect');
            inner.add(rect);
            g.add(inner);
            expect(g.serialize()).to.equal('<g><g><rect/></g></g>');
        });

        it('string children serialize as-is', () => {
            const el = new SvgElement('text');
            el.add('Hello World');
            expect(el.serialize()).to.equal('<text>Hello World</text>');
        });

        it('empty tag with no attrs', () => {
            const el = new SvgElement('g');
            expect(el.serialize()).to.equal('<g/>');
        });
    });
});

describe('sanitizeSvg', () => {
    // Import the sanitizer (we'll add it to SvgElement.ts or a utility)
    let sanitizeSvg: (svg: string) => string;

    before(() => {
        // Dynamic import to get the sanitizer
        sanitizeSvg = require('../svg/SvgElement').sanitizeSvg;
    });

    it('strips <script> tags', () => {
        const dirty = '<svg><script>alert("xss")</script><rect/></svg>';
        const clean = sanitizeSvg(dirty);
        expect(clean).to.not.contain('<script');
        expect(clean).to.not.contain('alert');
        expect(clean).to.contain('<rect');
    });

    it('strips <script> tags case-insensitively', () => {
        const dirty = '<svg><SCRIPT>alert("xss")</SCRIPT><rect/></svg>';
        const clean = sanitizeSvg(dirty);
        expect(clean).to.not.contain('<SCRIPT');
        expect(clean).to.not.contain('alert');
    });

    it('strips <iframe> tags', () => {
        const dirty = '<svg><iframe src="evil.html"></iframe><rect/></svg>';
        const clean = sanitizeSvg(dirty);
        expect(clean).to.not.contain('<iframe');
    });

    it('strips <object> tags', () => {
        const dirty = '<svg><object data="evil.swf"></object><rect/></svg>';
        const clean = sanitizeSvg(dirty);
        expect(clean).to.not.contain('<object');
    });

    it('strips <embed> tags', () => {
        const dirty = '<svg><embed src="evil.swf"/><rect/></svg>';
        const clean = sanitizeSvg(dirty);
        expect(clean).to.not.contain('<embed');
    });

    it('strips <foreignObject> tags', () => {
        const dirty = '<svg><foreignObject><div>html</div></foreignObject><rect/></svg>';
        const clean = sanitizeSvg(dirty);
        expect(clean).to.not.contain('<foreignObject');
    });

    it('strips on* event handler attributes', () => {
        const dirty = '<svg><rect onclick="alert(1)" onload="alert(2)" fill="red"/></svg>';
        const clean = sanitizeSvg(dirty);
        expect(clean).to.not.contain('onclick');
        expect(clean).to.not.contain('onload');
        expect(clean).to.contain('fill');
    });

    it('strips on* attributes case-insensitively', () => {
        const dirty = '<svg><rect ONMOUSEOVER="alert(1)" fill="red"/></svg>';
        const clean = sanitizeSvg(dirty);
        expect(clean).to.not.contain('ONMOUSEOVER');
        expect(clean).to.not.contain('onmouseover');
    });

    it('preserves safe SVG content', () => {
        const safe = '<svg viewBox="0 0 100 100"><rect width="50" height="50" fill="blue"/><circle r="10" cx="50" cy="50"/></svg>';
        const clean = sanitizeSvg(safe);
        expect(clean).to.contain('<rect');
        expect(clean).to.contain('<circle');
        expect(clean).to.contain('viewBox');
    });

    it('returns empty string for empty input', () => {
        expect(sanitizeSvg('')).to.equal('');
    });
});
