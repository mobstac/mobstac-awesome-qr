import { SvgElement } from './SvgElement';

/**
 * SvgNodeProxy — minimal DOM-like interface for JsBarcode compatibility.
 *
 * JsBarcode's SVG renderer expects a DOM node with createElement,
 * appendChild, setAttribute, and a few other methods. This proxy
 * implements just enough of the DOM API to make JsBarcode work,
 * then serializes the result into an SvgElement tree.
 *
 * Usage:
 *   const proxy = new SvgNodeProxy(width, height);
 *   JsBarcode(proxy.node, value, { xmlDocument: proxy.document, ... });
 *   const svgString = proxy.serialize();
 */

class ProxyNode {
    public tagName: string;
    public childNodes: ProxyNode[] = [];
    public parentNode: ProxyNode | null = null;
    public textContent: string = '';
    private attrs: Map<string, string> = new Map();

    constructor(tagName: string) {
        this.tagName = tagName;
    }

    setAttribute(name: string, value: string): void {
        this.attrs.set(name, String(value));
    }

    getAttribute(name: string): string | null {
        return this.attrs.get(name) || null;
    }

    appendChild(child: ProxyNode): ProxyNode {
        child.parentNode = this;
        this.childNodes.push(child);
        return child;
    }

    removeChild(child: ProxyNode): ProxyNode {
        const idx = this.childNodes.indexOf(child);
        if (idx !== -1) {
            this.childNodes.splice(idx, 1);
            child.parentNode = null;
        }
        return child;
    }

    get firstChild(): ProxyNode | null {
        return this.childNodes.length > 0 ? this.childNodes[0] : null;
    }

    /** Convert this proxy node tree to an SvgElement tree. */
    toSvgElement(): SvgElement | string {
        // Text nodes (#text) should be serialized as plain strings, not elements
        if (this.tagName === '#text') {
            return this.textContent;
        }
        const el = new SvgElement(this.tagName);
        this.attrs.forEach((v, k) => {
            el.setAttr(k, v);
        });
        if (this.textContent) {
            el.add(this.textContent);
        }
        for (const child of this.childNodes) {
            el.add(child.toSvgElement());
        }
        return el;
    }

    /** Serialize this proxy node tree directly to SVG string. */
    serialize(): string {
        const result = this.toSvgElement();
        return typeof result === 'string' ? result : result.serialize();
    }
}

class ProxyDocument {
    createElementNS(_ns: string, tagName: string): ProxyNode {
        return new ProxyNode(tagName);
    }

    createElement(tagName: string): ProxyNode {
        return new ProxyNode(tagName);
    }

    createTextNode(text: string): ProxyNode {
        const node = new ProxyNode('#text');
        node.textContent = text;
        return node;
    }
}

export class SvgNodeProxy {
    public readonly node: ProxyNode;
    public readonly document: ProxyDocument;

    constructor(width: number, height: number) {
        this.document = new ProxyDocument();
        this.node = new ProxyNode('svg');
        this.node.setAttribute('width', String(width));
        this.node.setAttribute('height', String(height));
    }

    /** Serialize the entire barcode SVG to string. */
    serialize(): string {
        return this.node.serialize();
    }

    /** Convert to an SvgElement for injection into an SvgCanvas tree. */
    toSvgElement(): SvgElement {
        // Root node is always <svg>, never a text node
        return this.node.toSvgElement() as SvgElement;
    }
}
