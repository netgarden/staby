import IPlate from "../interfaces/IPlate";
import Component from "./Component";
import DateTime from "./DateTime";
import {css, repeat} from "./Helpers";
import Config from "../config";


export default class InputWrapper extends Component implements IPlate {
    input: HTMLInputElement;
    placeholder: HTMLSpanElement;
    maskPlaceHolder: string;
    private recalcSize() {
        css(this.placeholder, {
            font: css(this.input, 'font'),
            lineHeight: css(this.input, 'lineHeight'),
            height: css(this.input, 'height'),
            padding: css(this.input, 'padding'),
            margin: css(this.input, 'margin'),
            border: css(this.input, 'border'),
            letterSpacing: css(this.input, 'letterSpacing'),
        });
    }
    constructor(input: HTMLInputElement, placeholder: string, config: Config) {
        super('calendar-popup-input-wrapper');
        this.input = input;
        input.parentNode.insertBefore(this.container, input);

        const clear = document.createElement('span');
        const block = document.createElement('span');

        if (placeholder &&  config.showMask) {
            this.maskPlaceHolder = placeholder;
            this.placeholder = document.createElement('div');
            this.placeholder.classList.add('calendar-popup-placeholder-input');

            this.recalcSize()

            block.appendChild(this.placeholder);
        }

        block.appendChild(input);
        block.appendChild(clear);

        this.on(clear, 'click', () => {
            input.value = '';
            this.datetime.fire('update');
        });

        this.container.appendChild(block);
    }

    bind(datetime: DateTime) {
        super.bind(datetime);

        if (this.placeholder) {
            this.datetime
                .on('update_placeholder native_change update chosen after_init', () => {
                    this.recalcSize()
                    const value: string = this.datetime.parent.getNativeValue();
                    const contentLength: number = value.length;
                    let placeholder: string = this.maskPlaceHolder.substr(contentLength);

                    this.placeholder.innerHTML = `<i>${value}</i>` + placeholder;
                });
        }
    }

    destructor() {
        this.container.parentNode.insertBefore(this.input, this.container);
        this.container.parentNode.removeChild(this.container);
    }
}