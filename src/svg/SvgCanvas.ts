import { SvgElement } from './SvgElement';
import { SvgGradient } from './SvgGradient';

/**
 * SvgCanvas — top-level <svg> element with chainable drawing API.
 *
 * Mirrors the svg.js API surface used in Svg.ts so the rewrite is
 * mostly 1:1 method name replacements. No DOM dependency — builds
 * a tree of SvgElement nodes and serializes to deterministic SVG strings.
 */
export class SvgCanvas {
    public root: SvgElement;
    private _defs: SvgElement | null = null;
    private _width: number;
    private _height: number;
    private gradients: Map<string, SvgGradient> = new Map();

    constructor(width: number, height: number) {
        this._width = width;
        this._height = height;
        this.root = new SvgElement('svg');
        this.root.setAttr('xmlns', 'http://www.w3.org/2000/svg');
        this.root.setAttr('xmlns:xlink', 'http://www.w3.org/1999/xlink');
        this.root.setAttr('width', String(width));
        this.root.setAttr('height', String(height));
    }

    // ---- Size and viewbox ----

    size(w: number, h: number): this {
        this._width = w;
        this._height = h;
        this.root.setAttr('width', String(w));
        this.root.setAttr('height', String(h));
        return this;
    }

    viewbox(x: number, y: number, w: number, h: number): this {
        this.root.setAttr('viewBox', `${x} ${y} ${w} ${h}`);
        return this;
    }

    width(): number {
        return this._width;
    }

    height(): number {
        return this._height;
    }

    fill(color: string): this {
        // Add a background rect covering the entire canvas.
        // CSS 'background' on <svg> is not rendered by librsvg (used by sharp),
        // so we use a full-size rect as the first child after defs.
        const bgRect = new SvgElement('rect');
        bgRect.setAttr('width', '100%');
        bgRect.setAttr('height', '100%');
        bgRect.setAttr('fill', color);
        // Insert after defs (index 0 if defs exists, else index 0)
        const insertIdx = this._defs ? 1 : 0;
        this.root.insertAt(insertIdx, bgRect);
        return this;
    }

    move(x: number, y: number): this {
        this.root.setAttr('x', String(x));
        this.root.setAttr('y', String(y));
        return this;
    }

    // ---- Drawing primitives (return SvgElement for chaining) ----

    rect(w: number, h: number): SvgElement {
        const el = new SvgElement('rect');
        el.setAttr('width', String(w));
        el.setAttr('height', String(h));
        el.size(w, h);
        this.root.add(el);
        return el;
    }

    circle(diameter?: number): SvgElement {
        const el = new SvgElement('circle');
        if (diameter !== undefined) {
            const r = diameter / 2;
            el.setAttr('r', String(r));
            el.setAttr('cx', String(r));
            el.setAttr('cy', String(r));
        }
        this.root.add(el);
        return el;
    }

    ellipse(w: number, h: number): SvgElement {
        const el = new SvgElement('ellipse');
        el.setAttr('rx', String(w / 2));
        el.setAttr('ry', String(h / 2));
        this.root.add(el);
        return el;
    }

    path(d: string): SvgElement {
        const el = new SvgElement('path');
        el.setAttr('d', d);
        this.root.add(el);
        return el;
    }

    /** Create a plain text element (mirrors svg.js `plain()`). */
    plain(text: string): SvgElement {
        const el = new SvgElement('text');
        el.add(text);
        this.root.add(el);
        return el;
    }

    /** Create a text element with tspan children. */
    text(content: string | ((add: { tspan: (t: string) => SvgElement }) => void)): SvgElement {
        const el = new SvgElement('text');
        if (typeof content === 'string') {
            el.add(content);
        } else {
            content({
                tspan: (t: string) => {
                    const ts = new SvgElement('tspan');
                    ts.add(t);
                    el.add(ts);
                    return ts;
                }
            });
        }
        this.root.add(el);
        return el;
    }

    image(href: string): SvgElement {
        const el = new SvgElement('image');
        if (href) {
            el.setAttr('href', href);
        }
        this.root.add(el);
        return el;
    }

    line(x1: number, y1: number, x2: number, y2: number): SvgElement {
        const el = new SvgElement('line');
        el.setAttrs({ x1: String(x1), y1: String(y1), x2: String(x2), y2: String(y2) });
        this.root.add(el);
        return el;
    }

    polygon(coords: number[][]): SvgElement {
        const el = new SvgElement('polygon');
        const points = coords.map(c => c.join(',')).join(' ');
        el.setAttr('points', points);
        this.root.add(el);
        return el;
    }

    polyline(coords: number[]): SvgElement {
        const el = new SvgElement('polyline');
        el.setAttr('fill', 'none');
        // Coords come as flat array [x1, y1, x2, y2, ...]
        const pairs: string[] = [];
        for (let i = 0; i < coords.length; i += 2) {
            pairs.push(`${coords[i]},${coords[i + 1]}`);
        }
        el.setAttr('points', pairs.join(' '));
        this.root.add(el);
        return el;
    }

    /** Create a <g> group element. */
    group(): SvgElement {
        const el = new SvgElement('g');
        this.root.add(el);
        return el;
    }

    /** Create a nested <svg> element (mirrors svg.js `nested()`). */
    nested(): SvgCanvas {
        const nested = new SvgCanvas(this._width, this._height);
        // Remove xmlns from nested — it's inherited
        nested.root.removeAttr('xmlns');
        nested.root.removeAttr('xmlns:xlink');
        this.root.add(nested.root);
        return nested;
    }

    // ---- Defs and gradients ----

    defs(): SvgCanvasDefs {
        if (!this._defs) {
            this._defs = new SvgElement('defs');
            // Insert defs as first child
            this.root.insertAt(0, this._defs);
        }
        return new SvgCanvasDefs(this._defs);
    }

    gradient(type: 'linear' | 'radial', configurator: (add: { stop: (offset: number, color: string) => void }) => void): SvgGradient {
        const grad = new SvgGradient(type, configurator);
        this.gradients.set(grad.id, grad);
        // Add to defs
        if (!this._defs) {
            this._defs = new SvgElement('defs');
            this.root.insertAt(0, this._defs);
        }
        this._defs.add(grad.element);
        return grad;
    }

    /** Create a clipPath element in defs. */
    clipPath(id: string, shape: SvgElement): string {
        if (!this._defs) {
            this._defs = new SvgElement('defs');
            this.root.insertAt(0, this._defs);
        }
        const cp = new SvgElement('clipPath');
        cp.setAttr('id', id);
        cp.add(shape);
        this._defs.add(cp);
        return `url(#${id})`;
    }

    // ---- Child management ----

    /** Add raw SVG string or SvgElement as child of root. */
    add(child: string | SvgElement): this {
        this.root.add(child);
        return this;
    }

    /** Get all child elements. */
    get children(): (SvgElement | string)[] {
        return this.root.children;
    }

    /** Remove all children from root. */
    clear(): this {
        this.root.clear();
        // Re-add defs if it existed
        if (this._defs) {
            this.root.insertAt(0, this._defs);
        }
        return this;
    }

    // ---- Serialization ----

    /** Serialize to SVG string (mirrors svg.js `svg()` method). */
    svg(): string {
        return this.root.serialize();
    }

    /** Alias for svg() — preferred in new code. */
    serialize(): string {
        return this.svg();
    }

    // ---- Attribute pass-through (for compatibility) ----

    attr(attrs: Record<string, string | number>): this {
        this.root.setAttrs(attrs);
        return this;
    }
}

/**
 * Wrapper for the <defs> element to support the `.style()` chainable call
 * pattern used in the existing codebase (e.g., `canvas.defs().style(...)`).
 */
class SvgCanvasDefs {
    private defsEl: SvgElement;

    constructor(defsEl: SvgElement) {
        this.defsEl = defsEl;
    }

    style(css: string): this {
        const styleEl = new SvgElement('style');
        styleEl.add(css.trim());
        this.defsEl.add(styleEl);
        return this;
    }

    add(child: SvgElement): this {
        this.defsEl.add(child);
        return this;
    }
}
