import { SvgElement } from './SvgElement';

export interface GradientStop {
    offset: number;
    color: string;
}

/**
 * SvgGradient — builds <linearGradient> or <radialGradient> elements.
 *
 * Content-addressable: identical stop configurations produce the same ID
 * so duplicate <defs> entries are avoided.
 */
export class SvgGradient {
    public readonly element: SvgElement;
    public readonly id: string;
    private stops: GradientStop[] = [];

    constructor(type: 'linear' | 'radial', configurator?: (add: SvgGradientBuilder) => void) {
        const tag = type === 'linear' ? 'linearGradient' : 'radialGradient';
        this.element = new SvgElement(tag);

        if (configurator) {
            const builder = new SvgGradientBuilder(this);
            configurator(builder);
        }

        // Generate content-addressable ID from stops
        this.id = this.generateId(type);
        this.element.setAttr('id', this.id);
    }

    addStop(offset: number, color: string): this {
        this.stops.push({ offset, color });
        const stop = new SvgElement('stop');
        stop.setAttr('offset', String(offset));
        stop.setAttr('stop-color', color);
        this.element.add(stop);
        return this;
    }

    from(x: number, y: number): this {
        this.element.setAttr('x1', String(x));
        this.element.setAttr('y1', String(y));
        return this;
    }

    to(x: number, y: number): this {
        this.element.setAttr('x2', String(x));
        this.element.setAttr('y2', String(y));
        return this;
    }

    transform(opts: Record<string, string | number>): this {
        if (opts.rotate !== undefined) {
            this.element.setAttr('gradientTransform', `rotate(${opts.rotate})`);
        }
        return this;
    }

    /** Returns `url(#id)` for use in fill/stroke attributes. */
    url(): string {
        return `url(#${this.id})`;
    }

    private generateId(type: string): string {
        // Content-addressable: hash stops to generate stable IDs
        const stopsKey = this.stops.map(s => `${s.offset}:${s.color}`).join('|');
        // Simple hash to keep IDs short but deterministic
        let hash = 0;
        for (let i = 0; i < stopsKey.length; i++) {
            hash = ((hash << 5) - hash + stopsKey.charCodeAt(i)) | 0;
        }
        const hashStr = Math.abs(hash).toString(36);
        return `${type[0]}g_${hashStr}`;
    }
}

/** Builder passed to gradient configurator callbacks (mirrors svg.js API). */
export class SvgGradientBuilder {
    private gradient: SvgGradient;

    constructor(gradient: SvgGradient) {
        this.gradient = gradient;
    }

    stop(offset: number, color: string): void {
        this.gradient.addStop(offset, color);
    }
}
