import { expect } from 'chai';
import 'mocha';
import { SvgGradient, SvgGradientBuilder } from '../svg/SvgGradient';

describe('SvgGradient', () => {

    it('creates linearGradient element', () => {
        const grad = new SvgGradient('linear');
        expect(grad.element.tag).to.equal('linearGradient');
    });

    it('creates radialGradient element', () => {
        const grad = new SvgGradient('radial');
        expect(grad.element.tag).to.equal('radialGradient');
    });

    it('configurator callback works', () => {
        const grad = new SvgGradient('linear', (add) => {
            add.stop(0, 'red');
            add.stop(1, 'blue');
        });
        const svg = grad.element.serialize();
        expect(svg).to.contain('stop-color="red"');
        expect(svg).to.contain('stop-color="blue"');
    });

    it('addStop() adds <stop> with offset + stop-color', () => {
        const grad = new SvgGradient('linear');
        grad.addStop(0.5, '#00ff00');
        const svg = grad.element.serialize();
        expect(svg).to.contain('<stop');
        expect(svg).to.contain('offset="0.5"');
        expect(svg).to.contain('stop-color="#00ff00"');
    });

    it('from()/to() set x1,y1 / x2,y2', () => {
        const grad = new SvgGradient('linear');
        grad.from(0, 0).to(1, 1);
        expect(grad.element.getAttr('x1')).to.equal('0');
        expect(grad.element.getAttr('y1')).to.equal('0');
        expect(grad.element.getAttr('x2')).to.equal('1');
        expect(grad.element.getAttr('y2')).to.equal('1');
    });

    it('transform({ rotate }) sets gradientTransform', () => {
        const grad = new SvgGradient('linear');
        grad.transform({ rotate: 90 });
        expect(grad.element.getAttr('gradientTransform')).to.equal('rotate(90)');
    });

    it('same stops produce same ID (content-addressable)', () => {
        const g1 = new SvgGradient('linear', (add) => {
            add.stop(0, '#000');
            add.stop(1, '#fff');
        });
        const g2 = new SvgGradient('linear', (add) => {
            add.stop(0, '#000');
            add.stop(1, '#fff');
        });
        expect(g1.id).to.equal(g2.id);
    });

    it('different stops produce different IDs', () => {
        const g1 = new SvgGradient('linear', (add) => {
            add.stop(0, '#000');
            add.stop(1, '#fff');
        });
        const g2 = new SvgGradient('linear', (add) => {
            add.stop(0, '#f00');
            add.stop(1, '#0f0');
        });
        expect(g1.id).to.not.equal(g2.id);
    });

    it('url() returns url(#<id>)', () => {
        const grad = new SvgGradient('linear', (add) => {
            add.stop(0, 'red');
        });
        expect(grad.url()).to.equal(`url(#${grad.id})`);
        expect(grad.url()).to.match(/^url\(#lg_/);
    });

    it('radial gradient ID starts with rg_', () => {
        const grad = new SvgGradient('radial', (add) => {
            add.stop(0, 'red');
        });
        expect(grad.id).to.match(/^rg_/);
    });
});

describe('SvgGradientBuilder', () => {
    it('stop() delegates to gradient addStop', () => {
        const grad = new SvgGradient('linear');
        const builder = new SvgGradientBuilder(grad);
        builder.stop(0.25, 'green');
        const svg = grad.element.serialize();
        expect(svg).to.contain('offset="0.25"');
        expect(svg).to.contain('stop-color="green"');
    });
});
