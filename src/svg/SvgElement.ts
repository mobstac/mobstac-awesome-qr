/**
 * SvgElement — lightweight, deterministic SVG element builder.
 *
 * Stores tag name, attributes, and children. Serializes to string with
 * alphabetically-sorted attributes so output is identical regardless of
 * insertion order.  No DOM dependency — works in Node and browsers.
 */
export class SvgElement {
    public tag: string;
    public attrs: Map<string, string>;
    public children: (SvgElement | string)[];
    private _x: number = 0;
    private _y: number = 0;
    private _width: number = 0;
    private _height: number = 0;

    constructor(tag: string) {
        this.tag = tag;
        this.attrs = new Map();
        this.children = [];
    }

    /** Set a single attribute (chainable). */
    setAttr(name: string, value: string | number): this {
        this.attrs.set(name, String(value));
        return this;
    }

    /** Set multiple attributes at once (chainable). */
    setAttrs(attrs: Record<string, string | number | undefined>): this {
        for (const [k, v] of Object.entries(attrs)) {
            if (v !== undefined) {
                this.attrs.set(k, String(v));
            }
        }
        return this;
    }

    /** Get attribute value. */
    getAttr(name: string): string | undefined {
        return this.attrs.get(name);
    }

    /** Remove an attribute. */
    removeAttr(name: string): this {
        this.attrs.delete(name);
        return this;
    }

    /** Append a child element or raw SVG/text string. */
    add(child: SvgElement | string): this {
        this.children.push(child);
        return this;
    }

    /** Insert a child at a specific index. */
    insertAt(index: number, child: SvgElement | string): this {
        this.children.splice(index, 0, child);
        return this;
    }

    /** Remove a child element. */
    remove(child: SvgElement | string): this {
        const idx = this.children.indexOf(child);
        if (idx !== -1) {
            this.children.splice(idx, 1);
        }
        return this;
    }

    /** Remove all children. */
    clear(): this {
        this.children = [];
        return this;
    }

    // ---- Chainable convenience setters (mirror svg.js API) ----

    move(x: number, y: number): this {
        this._x = x;
        this._y = y;
        if (this.tag === 'circle') {
            // <circle> uses cx/cy, not x/y
            const r = parseFloat(this.getAttr('r') || '0');
            this.setAttr('cx', x + r);
            this.setAttr('cy', y + r);
        } else if (this.tag === 'ellipse') {
            const rx = parseFloat(this.getAttr('rx') || '0');
            const ry = parseFloat(this.getAttr('ry') || '0');
            this.setAttr('cx', x + rx);
            this.setAttr('cy', y + ry);
        } else {
            this.setAttr('x', x);
            this.setAttr('y', y);
        }
        return this;
    }

    size(w: number, h?: number): this {
        this._width = w;
        this._height = h !== undefined ? h : w;
        this.setAttr('width', this._width);
        this.setAttr('height', this._height);
        return this;
    }

    fill(color: string): this {
        this.setAttr('fill', color);
        return this;
    }

    stroke(opts: Record<string, string | number> | string): this {
        if (typeof opts === 'string') {
            this.setAttr('stroke', opts);
        } else {
            if (opts.color !== undefined) this.setAttr('stroke', String(opts.color));
            if (opts.width !== undefined) this.setAttr('stroke-width', String(opts.width));
            if (opts.linejoin !== undefined) this.setAttr('stroke-linejoin', String(opts.linejoin));
            if (opts.linecap !== undefined) this.setAttr('stroke-linecap', String(opts.linecap));
        }
        return this;
    }

    attr(attrs: Record<string, string | number>): this {
        return this.setAttrs(attrs);
    }

    font(opts: Record<string, string | number>): this {
        if (opts.family !== undefined) this.setAttr('font-family', String(opts.family));
        if (opts.size !== undefined) this.setAttr('font-size', String(opts.size));
        if (opts.fill !== undefined) this.setAttr('fill', String(opts.fill));
        if (opts.leading !== undefined) { /* ignore — no DOM equivalent */ }
        if (opts.anchor !== undefined) this.setAttr('text-anchor', String(opts.anchor));
        return this;
    }

    radius(r: number, ry?: number): this {
        if (this.tag === 'rect') {
            this.setAttr('rx', r);
            this.setAttr('ry', ry !== undefined ? ry : r);
        } else if (this.tag === 'circle') {
            this.setAttr('r', r);
        } else if (this.tag === 'ellipse') {
            this.setAttr('rx', r);
            this.setAttr('ry', ry !== undefined ? ry : r);
        }
        return this;
    }

    transform(opts: Record<string, string | number>): this {
        const parts: string[] = [];
        if (opts.rotate !== undefined) parts.push(`rotate(${opts.rotate})`);
        if (opts.translate !== undefined) parts.push(`translate(${opts.translate})`);
        if (opts.scale !== undefined) parts.push(`scale(${opts.scale})`);
        if (parts.length) {
            this.setAttr('transform', parts.join(' '));
        }
        return this;
    }

    rotate(angle: number, cx?: number, cy?: number): this {
        if (cx !== undefined && cy !== undefined) {
            this.setAttr('transform', `rotate(${angle}, ${cx}, ${cy})`);
        } else {
            this.setAttr('transform', `rotate(${angle})`);
        }
        return this;
    }

    x(): number { return this._x; }
    y(): number { return this._y; }

    getWidth(): number { return this._width; }
    getHeight(): number { return this._height; }

    // ---- Serialization ----

    /** Serialize this element and all children to an SVG string. */
    serialize(): string {
        const attrStr = this.serializeAttrs();
        const open = attrStr ? `<${this.tag} ${attrStr}` : `<${this.tag}`;

        if (this.children.length === 0) {
            return `${open}/>`;
        }

        const inner = this.children.map(c =>
            typeof c === 'string' ? c : c.serialize()
        ).join('');

        return `${open}>${inner}</${this.tag}>`;
    }

    /** Serialize attributes in alphabetical order for deterministic output. */
    private serializeAttrs(): string {
        const keys = Array.from(this.attrs.keys()).sort();
        return keys.map(k => {
            const v = this.attrs.get(k)!;
            return `${k}="${escapeAttr(v)}"`;
        }).join(' ');
    }
}

/** Escape XML attribute value. */
function escapeAttr(value: string): string {
    return value
        .replace(/&/g, '&amp;')
        .replace(/"/g, '&quot;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;');
}

/**
 * Sanitize raw SVG strings by stripping dangerous elements and event handlers.
 * Removes: <script>, <iframe>, <object>, <embed>, <foreignObject>, and on* attributes.
 */
export function sanitizeSvg(svg: string): string {
    if (!svg) return '';
    // Strip dangerous elements (with their content)
    let clean = svg.replace(/<\s*(script|iframe|object|embed|foreignObject)\b[^>]*>[\s\S]*?<\s*\/\s*\1\s*>/gi, '');
    // Strip self-closing dangerous elements
    clean = clean.replace(/<\s*(script|iframe|object|embed|foreignObject)\b[^>]*\/?\s*>/gi, '');
    // Strip on* event handler attributes
    clean = clean.replace(/\s+on\w+\s*=\s*(?:"[^"]*"|'[^']*'|[^\s>]+)/gi, '');
    return clean;
}
