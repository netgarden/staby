const class2type = {};
const hasOwn = class2type.hasOwnProperty;
export const isWindow = (obj): boolean => {
    return obj !== null && obj === obj.window;
};
export const isPlainObject = (obj): boolean => {
    if (typeof obj !== "object" || obj.nodeType || isWindow(obj)) {
        return false;
    }

    return !(obj.constructor && !hasOwn.call(obj.constructor.prototype, "isPrototypeOf"));
};

/**
 * Normalize value to CSS meters
 * @method normalizeSize
 * @param {string|int} value Input string
 * @return {string}
 */
export const normalizeSize = (value: string|number): string => {
    if ((/^[0-9]+$/).test(value.toString())) {
        return value + 'px';
    }
    return value.toString();
};
export const normilizeCSSValue = (key: string, value: string|number): string|number => {
    switch (key) {
        case "font-weight":
            return value === 'bold' ? 700 : value;
    }
    return value;
};

export const camelCase = (key: string): string => {
    return key.replace(/-(.)/g, (m, letter) => {
        return letter.toUpperCase();
    });
};

export const fromCamelCase = (key: string): string => {
    return key.replace(/([A-Z]+)/g, function (m, letter) {
        return '-' + letter.toLowerCase();
    });
};

/**
 * Get the value of a computed style property for the first element in the set of matched elements or set one or more CSS properties for every matched element
 * @param {HTMLElement} element
 * @param {string|object} key An object of property-value pairs to set. A CSS property name.
 * @param {string|int} value A value to set for the property.
 */
export const css = (element: HTMLElement, key: string|{[key: string]: number|string}, value?: string|number) => {
    const numberFieldsReg = /^left|top|bottom|right|width|min|max|height|margin|padding|font-size/i;



    if (isPlainObject(key) || value !== undefined) {
        const setValue = (elm, _key, _value) => {
            if (_value !== undefined && _value !== null && numberFieldsReg.test(_key) && /^[\-+]?[0-9.]+$/.test(_value.toString())) {
                _value = parseInt(_value, 10) + 'px';
            }
            if (css(elm, _key) != normilizeCSSValue(_key, _value)) {
                elm.style[_key] = _value;
            }
        };

        if (isPlainObject(key)) {
            let keys = Object.keys(key), j;
            for (j = 0; j < keys.length; j += 1) {
                setValue(element, camelCase(keys[j]), key[keys[j]]);
            }
        } else {
            setValue(element, camelCase(<string>key), value);
        }

        return;
    }

    const key2 = <string>fromCamelCase(<string>key),
        doc  = element.ownerDocument,
        win = doc ? doc.defaultView || doc['parentWindow'] : false;

    let result = (element.style[<string>key] !== undefined && element.style[<string>key] !== '') ? element.style[<string>key] : (win ? win.getComputedStyle(element).getPropertyValue(key2) : '');

    if (numberFieldsReg.test(<string>key) && /^[\-+]?[0-9\.]+px$/.test(result.toString())) {
        result = parseInt(result, 10);
    }

    return normilizeCSSValue(<string>key, result);
};
/**
 * Return global element position, it contains window.scrollTop
 * @param {Element} element
 * @return {object}
 */
export const offset = (element: Element): {x: number, y: number, h: number, w: number} => {
    const rect: ClientRect = element.getBoundingClientRect(),
        doc: Document = element.ownerDocument,
        body: HTMLElement = doc.body,
        docElem: HTMLElement = doc.documentElement,
        win: Window = doc.defaultView || doc['parentWindow'],
        scrollTop: number = win.pageYOffset || docElem.scrollTop || body.scrollTop,
        scrollLeft: number = win.pageXOffset || docElem.scrollLeft || body.scrollLeft,
        clientTop: number = docElem.clientTop || body.clientTop || 0,
        clientLeft: number = docElem.clientLeft || body.clientLeft || 0;

    const top = rect.top +  scrollTop - clientTop;
    const left = rect.left + scrollLeft - clientLeft;

    return {
        x: left,
        y: top,
        h: rect.height,
        w: rect.width,
    };
};

export const forEachAncestorOf = (node, callback) => {
    do {
        node = node.parentNode;

        if (!node || callback(node) === false) {
            break;
        }
    } while (node.nodeName !== 'HTML');
};

export const type = (obj): string => {
    if (obj === null) {
        return 'null';
    }
    return typeof obj === "object" || typeof obj === "function" ? class2type[toString.call(obj)] || "object" : typeof obj;
};

export const extend = (...args) => {
    let options,
        name,
        src,
        copy,
        copyIsArray,
        clone,
        target = args[0] || {},
        i = 1,
        j,
        length = args.length,
        keys,
        deep = false;

    if (typeof target === "boolean") {
        deep = target;
        target = args[i] || {};
        i += 1;
    }

    if (typeof target !== "object" && type(target) === 'function') {
        target = {};
    }

    if (i === length) {
        target = this;
        i += 1;
    }

    for (i; i < length; i += 1) {
        options = args[i];
        if (options !== null && options !== undefined) {
            keys = Object.keys(options);
            for (j = 0; j < keys.length; j += 1) {
                name = keys[j];
                src = target[name];
                copy = options[name];
                if (target === copy) {
                    continue;
                }
                if (deep && copy && (isPlainObject(copy) || Array.isArray(copy))) {
                    copyIsArray = Array.isArray(copy);
                    if (copyIsArray) {
                        copyIsArray = false;
                        clone = src && Array.isArray(src) ? src : [];
                    } else {
                        clone = src && isPlainObject(src) ? src : {};

                    }
                    target[name] = extend(deep, clone, copy);
                } else if (copy !== undefined) {
                    target[name] = copy;
                }
            }
        }
    }
    return target;
};

/**
 * Create DOM element from HTML text
 *
 * @param {string|HTMLElement} html
 * @param {HTMLDocument} [doc=document]
 *
 * @return HTMLElement
 */
export const dom = (html: string|HTMLElement, doc: Document = document): HTMLElement => {
    if (html instanceof (<any>doc.defaultView).HTMLElement) {
        return <HTMLElement>html;
    }

    const div = doc.createElement('div');
    div.innerHTML = <string>html;

    return div.firstChild !== div.lastChild ? div : <HTMLElement>div.firstChild;
};

export type Animate = {
    stop: Function;
}

export const animate = (draw: Function, duration: number, callback?: false|Function): Animate => {
    const start = performance.now();

    let stop = false,
        timer = requestAnimationFrame(function animate(time) {
            if (stop) {
                return;
            }

            let timePassed = time - start;

            // возможно небольшое превышение времени, в этом случае зафиксировать конец
            if (timePassed > duration) timePassed = duration;

            // нарисовать состояние анимации в момент timePassed
            draw(timePassed);

            if ((timePassed === duration && callback)) {
                callback();
                callback = false;
                return;
            }

            // если время анимации не закончилось - запланировать ещё кадр
            if (timePassed < duration) {
                timer = requestAnimationFrame(animate);
            }

        });

    return {
        stop: () => {
            cancelAnimationFrame(timer);
            stop = true;
            if (callback) {
                callback();
                callback = false;
            }
        }
    };
};

export const trim = (str: string): string =>(str
    .replace(/^[\s\n\r\t]+/gm, '')
    .replace(/[\s\n\r\t]+$/gm, '')
);

export const repeat = (str: string, count: number): string => {
    const result = [];
    for (let i = 0; i < count; i++) {
        result.push(str);
    }
    return result.join('');
};