import DateTime from "./DateTime";

export default class {
    datetime: DateTime;
    container: HTMLElement;
    constructor(className: string|false, tag: string = 'div') {
        if (className !== false) {
            this.container = document.createElement(tag);
            this.container.className = className;
        }
    }
    redraw() {}
    destructor() {}
    bind(datetime: DateTime) {
        this.datetime = datetime;
    }
}