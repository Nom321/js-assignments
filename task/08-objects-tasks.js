'use strict';

/**************************************************************************************************
 *                                                                                                *
 * Plese read the following tutorial before implementing tasks:                                   *
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Object_initializer *
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object        *
 *                                                                                                *
 **************************************************************************************************/

/**
 * Returns the rectagle object with width and height parameters and getArea() method
 *
 * @param {number} width
 * @param {number} height
 * @return {Object}
 *
 * @example
 *    var r = new Rectangle(10,20);
 *    console.log(r.width);       // => 10
 *    console.log(r.height);      // => 20
 *    console.log(r.getArea());   // => 200
 */
function Rectangle(width, height) {
    this.width = width;
    this.height = height;
    this.getArea = function () {
        return this.width * this.height;
    };
}

/**
 * Returns the JSON representation of specified object
 *
 * @param {object} obj
 * @return {string}
 *
 * @example
 *    [1,2,3]   =>  '[1,2,3]'
 *    { width: 10, height : 20 } => '{"height":10,"width":20}'
 */
function getJSON(obj) {
    return JSON.stringify(obj);
}

/**
 * Returns the object of specified type from JSON representation
 *
 * @param {Object} proto
 * @param {string} json
 * @return {object}
 *
 * @example
 *    var r = fromJSON(Rectangle.prototype, '{"width":10, "height":20}');
 *
 */
function fromJSON(proto, json) {
    const obj = Object.create(proto);
    Object.assign(obj, JSON.parse(json));
    return obj;
}

/**
 * Css selectors builder
 *
 * Each complex selector can consists of type, id, class, attribute, pseudo-class and pseudo-element selectors:
 *
 *    element#id.class[attr]:pseudoClass::pseudoElement
 *              \----/\----/\----------/
 *              Can be several occurences
 *
 * All types of selectors can be combined using the combinators ' ','+','~','>' .
 *
 * The task is to design a single class, independent classes or classes hierarchy and implement the functionality
 * to build the css selectors using the provided cssSelectorBuilder.
 * Each selector should have the stringify() method to output the string repsentation according to css specification.
 *
 * Provided cssSelectorBuilder should be used as facade only to create your own classes,
 * for example the first method of cssSelectorBuilder can be like this:
 *   element: function(value) {
 *       return new MySuperBaseElementSelector(...)...
 *   },
 *
 * The design of class(es) is totally up to you, but try to make it as simple, clear and readable as possible.
 *
 * @example
 *
 *  var builder = cssSelectorBuilder;
 *
 *  builder.id('main').class('container').class('editable').stringify()  => '#main.container.editable'
 *
 *  builder.element('a').attr('href$=".png"').pseudoClass('focus').stringify()  => 'a[href$=".png"]:focus'
 *
 *  builder.combine(
 *      builder.element('div').id('main').class('container').class('draggable'),
 *      '+',
 *      builder.combine(
 *          builder.element('table').id('data'),
 *          '~',
 *           builder.combine(
 *               builder.element('tr').pseudoClass('nth-of-type(even)'),
 *               ' ',
 *               builder.element('td').pseudoClass('nth-of-type(even)')
 *           )
 *      )
 *  ).stringify()        =>    'div#main.container.draggable + table#data ~ tr:nth-of-type(even)   td:nth-of-type(even)'
 *
 *  For more examples see unit tests.
 */
class CssSelector {
    constructor() {
        this.parts = {
            element: null,
            id: null,
            classes: [],
            attrs: [],
            pseudoClasses: [],
            pseudoElement: null
        };
        this.order = ['element', 'id', 'classes', 'attrs', 'pseudoClasses', 'pseudoElement'];
    }

    element(value) {
        if (this.parts.element) throw new Error('Element, id and pseudo-element should be selected only once');
        this.parts.element = value;
        return this;
    }

    id(value) {
        if (this.parts.id) throw new Error('Element, id and pseudo-element should be selected only once');
        this.parts.id = `#${value}`;
        return this;
    }

    class(value) {
        this.parts.classes.push(`.${value}`);
        return this;
    }

    attr(value) {
        this.parts.attrs.push(`[${value}]`);
        return this;
    }

    pseudoClass(value) {
        this.parts.pseudoClasses.push(`:${value}`);
        return this;
    }

    pseudoElement(value) {
        if (this.parts.pseudoElement) throw new Error('Element, id and pseudo-element should be selected only once');
        this.parts.pseudoElement = `::${value}`;
        return this;
    }

    stringify() {
        return this.order.reduce((str, key) => {
            if (key === 'classes' || key === 'attrs' || key === 'pseudoClasses') {
                return str + (this.parts[key] ? this.parts[key].join('') : '');
            }
            return str + (this.parts[key] || '');
        }, '');
    }
}

class CombinedCssSelector {
    constructor(selector1, combinator, selector2) {
        this.selector1 = selector1;
        this.combinator = combinator;
        this.selector2 = selector2;
    }

    stringify() {
        return `${this.selector1.stringify()} ${this.combinator} ${this.selector2.stringify()}`;
    }
}

const cssSelectorBuilder = {
    element(value) {
        return new CssSelector().element(value);
    },

    id(value) {
        return new CssSelector().id(value);
    },

    class(value) {
        return new CssSelector().class(value);
    },

    attr(value) {
        return new CssSelector().attr(value);
    },

    pseudoClass(value) {
        return new CssSelector().pseudoClass(value);
    },

    pseudoElement(value) {
        return new CssSelector().pseudoElement(value);
    },

    combine(selector1, combinator, selector2) {
        return new CombinedCssSelector(selector1, combinator, selector2);
    },
};

module.exports = {
    Rectangle,
    getJSON,
    fromJSON,
    cssSelectorBuilder
};