import { expect } from 'chai';
import 'mocha';
import { SvgNodeProxy } from '../svg/SvgNodeProxy';
import { SvgElement } from '../svg/SvgElement';

// We need access to ProxyNode and ProxyDocument for unit testing.
// They're not exported, so we test them through SvgNodeProxy's public API
// and through the document/node properties.

describe('SvgNodeProxy', () => {

    describe('ProxyNode (via SvgNodeProxy.node)', () => {
        it('setAttribute/getAttribute round-trip', () => {
            const proxy = new SvgNodeProxy(100, 100);
            proxy.node.setAttribute('data-test', 'hello');
            expect(proxy.node.getAttribute('data-test')).to.equal('hello');
        });

        it('getAttribute returns null for missing attribute', () => {
            const proxy = new SvgNodeProxy(100, 100);
            expect(proxy.node.getAttribute('nonexistent')).to.equal(null);
        });

        it('appendChild adds child', () => {
            const proxy = new SvgNodeProxy(100, 100);
            const child = proxy.document.createElement('rect');
            proxy.node.appendChild(child);
            expect(proxy.node.childNodes).to.have.lengthOf(1);
            expect(proxy.node.childNodes[0]).to.equal(child);
        });

        it('appendChild sets parentNode', () => {
            const proxy = new SvgNodeProxy(100, 100);
            const child = proxy.document.createElement('rect');
            proxy.node.appendChild(child);
            expect(child.parentNode).to.equal(proxy.node);
        });

        it('removeChild removes child and clears parent', () => {
            const proxy = new SvgNodeProxy(100, 100);
            const child = proxy.document.createElement('rect');
            proxy.node.appendChild(child);
            proxy.node.removeChild(child);
            expect(proxy.node.childNodes).to.have.lengthOf(0);
            expect(child.parentNode).to.equal(null);
        });

        it('firstChild returns first child or null', () => {
            const proxy = new SvgNodeProxy(100, 100);
            expect(proxy.node.firstChild).to.equal(null);
            const child = proxy.document.createElement('g');
            proxy.node.appendChild(child);
            expect(proxy.node.firstChild).to.equal(child);
        });

        it('toSvgElement() converts to SvgElement', () => {
            const proxy = new SvgNodeProxy(100, 100);
            const child = proxy.document.createElement('rect');
            child.setAttribute('width', '50');
            child.setAttribute('height', '30');
            proxy.node.appendChild(child);

            const el = proxy.toSvgElement();
            expect(el).to.be.instanceOf(SvgElement);
            expect(el.tag).to.equal('svg');
            expect(el.children).to.have.lengthOf(1);
            const rectChild = el.children[0] as SvgElement;
            expect(rectChild.tag).to.equal('rect');
            expect(rectChild.getAttr('width')).to.equal('50');
        });

        it('#text node toSvgElement() returns string', () => {
            const proxy = new SvgNodeProxy(100, 100);
            const textNode = proxy.document.createTextNode('Hello');
            // textNode.toSvgElement() should return a string
            const result = textNode.toSvgElement();
            expect(result).to.equal('Hello');
        });
    });

    describe('ProxyDocument (via SvgNodeProxy.document)', () => {
        it('createElementNS creates node with correct tag', () => {
            const proxy = new SvgNodeProxy(100, 100);
            const node = proxy.document.createElementNS('http://www.w3.org/2000/svg', 'rect');
            expect(node.tagName).to.equal('rect');
        });

        it('createElement creates node with correct tag', () => {
            const proxy = new SvgNodeProxy(100, 100);
            const node = proxy.document.createElement('circle');
            expect(node.tagName).to.equal('circle');
        });

        it('createTextNode creates #text node', () => {
            const proxy = new SvgNodeProxy(100, 100);
            const node = proxy.document.createTextNode('test text');
            expect(node.tagName).to.equal('#text');
            expect(node.textContent).to.equal('test text');
        });
    });

    describe('SvgNodeProxy', () => {
        it('constructor creates svg root with width/height', () => {
            const proxy = new SvgNodeProxy(200, 150);
            expect(proxy.node.tagName).to.equal('svg');
            expect(proxy.node.getAttribute('width')).to.equal('200');
            expect(proxy.node.getAttribute('height')).to.equal('150');
        });

        it('serialize() returns string starting with <svg', () => {
            const proxy = new SvgNodeProxy(100, 100);
            const svg = proxy.serialize();
            expect(svg).to.match(/^<svg /);
        });

        it('serialize() returns valid SVG string', () => {
            const proxy = new SvgNodeProxy(100, 50);
            const rect = proxy.document.createElement('rect');
            rect.setAttribute('width', '80');
            rect.setAttribute('height', '40');
            rect.setAttribute('fill', 'red');
            proxy.node.appendChild(rect);
            const svg = proxy.serialize();
            expect(svg).to.contain('<rect');
            expect(svg).to.contain('fill="red"');
        });

        it('toSvgElement() returns SvgElement', () => {
            const proxy = new SvgNodeProxy(100, 100);
            const el = proxy.toSvgElement();
            expect(el).to.be.instanceOf(SvgElement);
            expect(el.tag).to.equal('svg');
        });

        it('complex tree serializes correctly', () => {
            const proxy = new SvgNodeProxy(100, 100);
            const g = proxy.document.createElement('g');
            const rect = proxy.document.createElement('rect');
            rect.setAttribute('width', '10');
            g.appendChild(rect);
            const text = proxy.document.createElement('text');
            const textNode = proxy.document.createTextNode('Hello');
            text.appendChild(textNode);
            g.appendChild(text);
            proxy.node.appendChild(g);

            const svg = proxy.serialize();
            expect(svg).to.contain('<g>');
            expect(svg).to.contain('<rect');
            expect(svg).to.contain('<text>Hello</text>');
        });
    });
});
