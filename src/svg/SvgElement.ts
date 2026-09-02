/**
 * SvgElement — lightweight, deterministic SVG element builder.
 *
 * Stores tag name, attributes, and children. Serializes to string with
 * alphabetically-sorted attributes so output is identical regardless of
 * insertion order.  No DOM dependency — works in Node and browsers.
 */

// SVG element tags that have no x/y attributes per the SVG spec — they
// must be positioned via the transform attribute.
const TRANSFORM_POSITIONED_TAGS: ReadonlySet<string> = new Set([
    'path', 'polygon', 'polyline', 'line', 'g',
]);

// SVG element tags positioned by their center (cx/cy) offset from a radius.
const CENTER_POSITIONED_TAGS: ReadonlySet<string> = new Set(['circle', 'ellipse']);

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

        if (CENTER_POSITIONED_TAGS.has(this.tag)) {
            this.moveByCenter(x, y);
        } else if (TRANSFORM_POSITIONED_TAGS.has(this.tag)) {
            this.moveByTransform(x, y);
        } else {
            this.setAttr('x', x);
            this.setAttr('y', y);
        }
        return this;
    }

    private moveByCenter(x: number, y: number): void {
        // <circle> has only `r`; <ellipse> has `rx`/`ry`. Fall back to `r`
        // so the same helper serves both without a per-tag branch.
        const rx = parseFloat(this.getAttr('rx') || this.getAttr('r') || '0');
        const ry = parseFloat(this.getAttr('ry') || this.getAttr('r') || '0');
        this.setAttr('cx', x + rx);
        this.setAttr('cy', y + ry);
    }

    private moveByTransform(x: number, y: number): void {
        // svg.js positions elements by bounding-box top-left, not by raw
        // translate. Paths whose `d` extends into negative space (e.g. the
        // smooth-sharp/smooth-round outer-corner fillers, which use commands
        // like `L -size/4 0`) and polygons with negative point coords (e.g. the
        // balloon-frame triangle: `[[0, 0], [size/24, …], [-size/24, …]]`) get
        // visibly offset if we translate by (x, y) directly. Match svg.js by
        // shifting the translate so the element's bbox-min lands at (x, y).
        let translateX = x;
        let translateY = y;
        if (this.tag === 'path') {
            const d = this.getAttr('d');
            if (d) {
                const { minX, minY } = computePathBboxMin(d);
                translateX = x - minX;
                translateY = y - minY;
            }
        } else if (this.tag === 'polygon' || this.tag === 'polyline') {
            const points = this.getAttr('points');
            if (points) {
                const { minX, minY } = computePointsBboxMin(points);
                translateX = x - minX;
                translateY = y - minY;
            }
        }
        // Replace any prior translate() so move() stays idempotent, while
        // preserving rotate/scale/etc. clauses the caller may have set.
        const others = this.transformWithoutClause('translate');
        const translate = `translate(${translateX}, ${translateY})`;
        this.setAttr('transform', others ? `${translate} ${others}` : translate);
    }

    private transformWithoutClause(clause: string): string {
        const existing = this.getAttr('transform') || '';
        const pattern = new RegExp(`\\b${clause}\\([^)]*\\)\\s*`, 'g');
        return existing.replace(pattern, '').trim();
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
 * Escape XML text content (character data).
 *
 * Attribute values already go through escapeAttr(); text nodes were being
 * emitted verbatim, so a caption such as `Bar & Grill` produced a bare `&`
 * and the document was not well-formed. Renderers that actually parse the
 * SVG (librsvg, used for PNG/JPEG) reject it with
 * "xmlParseEntityRef: no name", while SVG/PDF/EPS pass the broken file
 * through unnoticed.
 *
 * Quotes are legal inside character data and are deliberately left alone.
 */
export function escapeText(value: string): string {
    return value
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;');
}

/**
 * Remove x / y / width / height from an SVG root element's opening tag.
 *
 * Used when inlining an SVG logo, whose own size/position must be dropped so
 * the caller can place it. Two rules matter:
 *
 *  - only the ROOT opening tag is rewritten, so child attributes are safe;
 *  - attribute names must be preceded by whitespace, so `rx`, `ry`, `cx`,
 *    `cy` and `viewBox` are never partially matched.
 *
 * The previous implementation tested `head.indexOf('x=')` — which matches
 * `viewBox=` — and then ran the replacement across the whole document, so the
 * first `x="..."` it found was often `rx="18"` on a child element. Removing
 * that left a bare `r` attribute and produced malformed XML.
 */
export function stripRootSizeAttrs(svgText: string): string {
    const end = svgText.indexOf('>');
    if (end === -1) {
        return svgText;
    }
    const head = svgText
        .substring(0, end + 1)
        .replace(/\s+(?:x|y|width|height)\s*=\s*("[^"]*"|'[^']*')/g, '');
    return head + svgText.substring(end + 1);
}

/**
 * Compute the minimum x/y of a path's `d` attribute, considering M, L, and A
 * endpoints. This is the subset of commands the QR builder emits — paths use
 * only absolute M, L, and A, and arcs are quarter-circles that bulge inward
 * toward their chord midpoint, so endpoint-minima capture the bbox tightly.
 *
 * Returned origin matches svg.js's bbox-top-left semantics so .move(x, y)
 * lands the path's leftmost-topmost extent at (x, y).
 */
/**
 * Compute the minimum x/y of a polygon/polyline `points` attribute. Points are
 * encoded as `x1,y1 x2,y2 …` (commas or whitespace as separators in either
 * position — SVG accepts both).
 */
function computePointsBboxMin(points: string): { minX: number; minY: number } {
    let minX = Infinity;
    let minY = Infinity;
    const nums = points.trim().split(/[\s,]+/).map(Number).filter(n => !isNaN(n));
    for (let i = 0; i + 1 < nums.length; i += 2) {
        if (nums[i] < minX) minX = nums[i];
        if (nums[i + 1] < minY) minY = nums[i + 1];
    }
    if (!isFinite(minX)) minX = 0;
    if (!isFinite(minY)) minY = 0;
    return { minX, minY };
}

function computePathBboxMin(d: string): { minX: number; minY: number } {
    let minX = Infinity;
    let minY = Infinity;
    const tokens = d.match(/[MLA][^MLAmla]*/gi) || [];
    for (const tok of tokens) {
        const cmd = tok[0].toUpperCase();
        const nums = tok.slice(1).trim().split(/[\s,]+/).map(Number).filter(n => !isNaN(n));
        if (cmd === 'M' || cmd === 'L') {
            for (let i = 0; i + 1 < nums.length; i += 2) {
                if (nums[i] < minX) minX = nums[i];
                if (nums[i + 1] < minY) minY = nums[i + 1];
            }
        } else if (cmd === 'A') {
            // Arc: rx ry x-axis-rot large-arc sweep x y — only the endpoint
            // contributes to the bbox-min for the paths this builder emits.
            for (let i = 0; i + 6 < nums.length; i += 7) {
                if (nums[i + 5] < minX) minX = nums[i + 5];
                if (nums[i + 6] < minY) minY = nums[i + 6];
            }
        }
    }
    if (!isFinite(minX)) minX = 0;
    if (!isFinite(minY)) minY = 0;
    return { minX, minY };
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
