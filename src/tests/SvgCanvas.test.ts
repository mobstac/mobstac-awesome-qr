import { expect } from 'chai';
import 'mocha';
import { SvgCanvas } from '../svg/SvgCanvas';
import { SvgElement } from '../svg/SvgElement';

describe('SvgCanvas', () => {

    describe('constructor', () => {
        it('creates <svg> with xmlns, width, height', () => {
            const canvas = new SvgCanvas(200, 100);
            const svg = canvas.serialize();
            expect(svg).to.contain('xmlns="http://www.w3.org/2000/svg"');
            expect(svg).to.contain('width="200"');
            expect(svg).to.contain('height="100"');
        });

        it('root element has svg tag', () => {
            const canvas = new SvgCanvas(100, 100);
            expect(canvas.root.tag).to.equal('svg');
        });
    });

    describe('size / viewbox', () => {
        it('size() updates dimensions', () => {
            const canvas = new SvgCanvas(100, 100);
            canvas.size(300, 200);
            expect(canvas.width()).to.equal(300);
            expect(canvas.height()).to.equal(200);
            const svg = canvas.serialize();
            expect(svg).to.contain('width="300"');
            expect(svg).to.contain('height="200"');
        });

        it('viewbox() sets viewBox', () => {
            const canvas = new SvgCanvas(100, 100);
            canvas.viewbox(0, 0, 200, 200);
            expect(canvas.serialize()).to.contain('viewBox="0 0 200 200"');
        });

        it('width()/height() return current dimensions', () => {
            const canvas = new SvgCanvas(512, 256);
            expect(canvas.width()).to.equal(512);
            expect(canvas.height()).to.equal(256);
        });
    });

    describe('drawing primitives', () => {
        it('rect creates correct element', () => {
            const canvas = new SvgCanvas(100, 100);
            const r = canvas.rect(50, 30);
            expect(r.tag).to.equal('rect');
            expect(r.getAttr('width')).to.equal('50');
            expect(r.getAttr('height')).to.equal('30');
        });

        it('circle creates correct element', () => {
            const canvas = new SvgCanvas(100, 100);
            const c = canvas.circle(40);
            expect(c.tag).to.equal('circle');
            expect(c.getAttr('r')).to.equal('20');
            expect(c.getAttr('cx')).to.equal('20');
            expect(c.getAttr('cy')).to.equal('20');
        });

        it('circle with no diameter', () => {
            const canvas = new SvgCanvas(100, 100);
            const c = canvas.circle();
            expect(c.tag).to.equal('circle');
            expect(c.getAttr('r')).to.equal(undefined);
        });

        it('ellipse creates correct element', () => {
            const canvas = new SvgCanvas(100, 100);
            const e = canvas.ellipse(60, 40);
            expect(e.tag).to.equal('ellipse');
            expect(e.getAttr('rx')).to.equal('30');
            expect(e.getAttr('ry')).to.equal('20');
        });

        it('path creates correct element', () => {
            const canvas = new SvgCanvas(100, 100);
            const p = canvas.path('M0 0 L10 10');
            expect(p.tag).to.equal('path');
            expect(p.getAttr('d')).to.equal('M0 0 L10 10');
        });

        it('plain creates text element with content', () => {
            const canvas = new SvgCanvas(100, 100);
            const t = canvas.plain('Hello');
            expect(t.tag).to.equal('text');
            expect(t.children[0]).to.equal('Hello');
        });

        it('text(string) creates text with content', () => {
            const canvas = new SvgCanvas(100, 100);
            const t = canvas.text('World');
            expect(t.tag).to.equal('text');
            expect(t.children[0]).to.equal('World');
        });

        it('text(callback) creates tspan children', () => {
            const canvas = new SvgCanvas(100, 100);
            const t = canvas.text((add) => {
                add.tspan('Line 1');
                add.tspan('Line 2');
            });
            expect(t.tag).to.equal('text');
            expect(t.children).to.have.lengthOf(2);
            const ts = t.children[0] as SvgElement;
            expect(ts.tag).to.equal('tspan');
            expect(ts.children[0]).to.equal('Line 1');
        });

        it('image creates correct element', () => {
            const canvas = new SvgCanvas(100, 100);
            const img = canvas.image('data:image/png;base64,abc');
            expect(img.tag).to.equal('image');
            expect(img.getAttr('href')).to.equal('data:image/png;base64,abc');
        });

        it('line creates correct element', () => {
            const canvas = new SvgCanvas(100, 100);
            const l = canvas.line(0, 0, 50, 50);
            expect(l.tag).to.equal('line');
            expect(l.getAttr('x1')).to.equal('0');
            expect(l.getAttr('y2')).to.equal('50');
        });

        it('polygon creates correct element', () => {
            const canvas = new SvgCanvas(100, 100);
            const p = canvas.polygon([[0, 0], [50, 0], [25, 50]]);
            expect(p.tag).to.equal('polygon');
            expect(p.getAttr('points')).to.equal('0,0 50,0 25,50');
        });

        it('polyline creates correct element', () => {
            const canvas = new SvgCanvas(100, 100);
            const p = canvas.polyline([0, 0, 10, 20, 30, 40]);
            expect(p.tag).to.equal('polyline');
            expect(p.getAttr('points')).to.equal('0,0 10,20 30,40');
            expect(p.getAttr('fill')).to.equal('none');
        });

        // Mirrors the call shape used by drawDiamond / drawSmoothRound /
        // drawSmoothSharp in Svg.ts — path coords start at the local origin
        // and rely on .move() to land the dot at the cell's true position.
        it('path(...).move() emits transform=translate in serialized output', () => {
            const canvas = new SvgCanvas(100, 100);
            canvas.path('M0 0 h10 v10 h-10 z').fill('#000').move(40, 60);
            const out = canvas.serialize();
            expect(out).to.contain('<path');
            expect(out).to.contain('transform="translate(40, 60)"');
            // The serializer must not have written stray x/y attrs on the path.
            expect(out).to.not.match(/<path[^>]*\sx="/);
            expect(out).to.not.match(/<path[^>]*\sy="/);
        });

        it('polygon(...).move() emits transform=translate in serialized output', () => {
            const canvas = new SvgCanvas(100, 100);
            canvas.polygon([[0, 0], [10, 0], [5, 10]]).fill('#000').move(20, 30);
            const out = canvas.serialize();
            expect(out).to.contain('<polygon');
            expect(out).to.contain('transform="translate(20, 30)"');
            expect(out).to.not.match(/<polygon[^>]*\sx="/);
        });

        it('group creates <g> element', () => {
            const canvas = new SvgCanvas(100, 100);
            const g = canvas.group();
            expect(g.tag).to.equal('g');
        });

        it('all primitives are added as children of root', () => {
            const canvas = new SvgCanvas(100, 100);
            canvas.rect(10, 10);
            canvas.circle(5);
            canvas.path('M0 0');
            expect(canvas.children).to.have.lengthOf(3);
        });
    });

    describe('nested', () => {
        it('creates child SvgCanvas, strips xmlns', () => {
            const canvas = new SvgCanvas(100, 100);
            const nested = canvas.nested();
            const nestedSvg = nested.serialize();
            expect(nestedSvg).to.not.contain('xmlns=');
            expect(nestedSvg).to.not.contain('xmlns:xlink');
            // Nested should be a child of parent
            expect(canvas.children).to.have.lengthOf(1);
            expect((canvas.children[0] as SvgElement).tag).to.equal('svg');
        });
    });

    describe('defs and gradients', () => {
        it('defs() creates <defs> as first child', () => {
            const canvas = new SvgCanvas(100, 100);
            canvas.rect(50, 50); // add something first
            canvas.defs();
            const firstChild = canvas.root.children[0];
            expect(firstChild).to.be.instanceOf(SvgElement);
            expect((firstChild as SvgElement).tag).to.equal('defs');
        });

        it('defs().style() adds <style> inside defs', () => {
            const canvas = new SvgCanvas(100, 100);
            canvas.defs().style('.cls { fill: red; }');
            const svg = canvas.serialize();
            expect(svg).to.contain('<style>');
            expect(svg).to.contain('.cls { fill: red; }');
        });

        it('gradient() creates gradient in defs, returns url()', () => {
            const canvas = new SvgCanvas(100, 100);
            const grad = canvas.gradient('linear', (add) => {
                add.stop(0, '#000');
                add.stop(1, '#fff');
            });
            const url = grad.url();
            expect(url).to.match(/^url\(#lg_/);
            const svg = canvas.serialize();
            expect(svg).to.contain('<linearGradient');
            expect(svg).to.contain('stop-color="#000"');
        });

        it('clipPath() creates <clipPath>, returns url(#id)', () => {
            const canvas = new SvgCanvas(100, 100);
            const shape = new SvgElement('circle');
            shape.setAttr('r', '50');
            const url = canvas.clipPath('myClip', shape);
            expect(url).to.equal('url(#myClip)');
            const svg = canvas.serialize();
            expect(svg).to.contain('<clipPath id="myClip"');
        });
    });

    describe('fill', () => {
        it('adds background rect 100%x100%', () => {
            const canvas = new SvgCanvas(100, 100);
            canvas.fill('#ffffff');
            const svg = canvas.serialize();
            expect(svg).to.contain('<rect');
            expect(svg).to.contain('fill="#ffffff"');
            expect(svg).to.contain('height="100%"');
            expect(svg).to.contain('width="100%"');
        });

        it('inserts background rect after defs', () => {
            const canvas = new SvgCanvas(100, 100);
            canvas.defs().style('.x{}');
            canvas.fill('#000');
            const defs = canvas.root.children[0] as SvgElement;
            const bgRect = canvas.root.children[1] as SvgElement;
            expect(defs.tag).to.equal('defs');
            expect(bgRect.tag).to.equal('rect');
        });
    });

    describe('child management', () => {
        it('add(element)', () => {
            const canvas = new SvgCanvas(100, 100);
            const el = new SvgElement('circle');
            canvas.add(el);
            expect(canvas.children).to.include(el);
        });

        it('add(string)', () => {
            const canvas = new SvgCanvas(100, 100);
            canvas.add('<raw/>');
            expect(canvas.children).to.include('<raw/>');
        });

        it('children getter returns root children', () => {
            const canvas = new SvgCanvas(100, 100);
            canvas.rect(10, 10);
            expect(canvas.children).to.have.lengthOf(1);
        });

        it('clear() preserves defs', () => {
            const canvas = new SvgCanvas(100, 100);
            canvas.defs().style('.x{}');
            canvas.rect(10, 10);
            canvas.clear();
            expect(canvas.children).to.have.lengthOf(1);
            expect((canvas.children[0] as SvgElement).tag).to.equal('defs');
        });
    });

    describe('serialization', () => {
        it('svg() and serialize() return same string', () => {
            const canvas = new SvgCanvas(100, 100);
            canvas.rect(50, 50).fill('red');
            expect(canvas.svg()).to.equal(canvas.serialize());
        });

        it('output starts with <svg', () => {
            const canvas = new SvgCanvas(100, 100);
            const svg = canvas.serialize();
            expect(svg).to.match(/^<svg /);
        });

        it('non-empty canvas ends with </svg>', () => {
            const canvas = new SvgCanvas(100, 100);
            canvas.rect(10, 10);
            const svg = canvas.serialize();
            expect(svg).to.match(/<\/svg>$/);
        });

        it('empty canvas self-closes', () => {
            const canvas = new SvgCanvas(100, 100);
            const svg = canvas.serialize();
            expect(svg).to.match(/\/>$/);
        });
    });

    describe('attr pass-through', () => {
        it('attr() sets attributes on root', () => {
            const canvas = new SvgCanvas(100, 100);
            canvas.attr({ opacity: 0.5 });
            expect(canvas.root.getAttr('opacity')).to.equal('0.5');
        });
    });

    describe('move', () => {
        it('move() sets x/y on root', () => {
            const canvas = new SvgCanvas(100, 100);
            canvas.move(10, 20);
            expect(canvas.root.getAttr('x')).to.equal('10');
            expect(canvas.root.getAttr('y')).to.equal('20');
        });
    });
});
