import Container from "./Container";

export default class Component extends Container{
    private classSeparator = /[\s,]+/;

    on(element: Element|Window|Element[], events: string, callback: (e: Event|KeyboardEvent|any) => void|false): Component {
        if (Array.isArray(element)) {
            element.forEach((elm) => {
                this.on(elm, events, callback);
            });
            return this;
        }

        events.split(this.classSeparator).forEach((event: string) => {
            element.addEventListener(event, callback, false);
        });

        return this;
    }

    off(element: Element|Window|Element[], events: string, callback?: (e: Event|KeyboardEvent|any) => void|false): Component {
        if (Array.isArray(element)) {
            element.forEach((elm) => {
                this.off(elm, events, callback);
            });
            return this;
        }

        events.split(this.classSeparator).forEach((event: string) => {
            element.removeEventListener(event, callback);
        });

        return this;
    }

    fire(element: Element, event: string|Event|{type: string, bubbles: boolean, cancelable: boolean, which?: number}): Component {
        let evt: Event = document.createEvent('HTMLEvents');

        if (typeof event === 'string') {
            evt.initEvent(event, true, true);
        } else {
            evt.initEvent(event.type, event.bubbles, event.cancelable);

            ['screenX', 'screenY', 'clientX', 'clientY', 'target', 'srcElement', 'currentTarget', 'timeStamp', 'which', 'keyCode'].forEach((property) => {
                if (event[property] !== undefined) {
                    Object.defineProperty(evt, property, {value: event[property], enumerable: true});
                }
            });

            Object.defineProperty(evt, 'originalEvent', {value: event, enumerable: true});
        }

        element.dispatchEvent(evt);
        return this;
    }
}