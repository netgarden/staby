import IPlate from "../interfaces/IPlate";
import Input from "./Input";
import {dom} from "./Helpers";
import Config from "../config";

export default class Spinner extends Input implements IPlate {
    max: number = 24;

    setValue(value: number) {
        if (isNaN(value)) {
            value = 0;
        }

        if (value >= this.max) {
            value = value % this.max;
        }

        if (value < 0) {
            value = this.max - 1;
        }

        this.input.value = (value > 9 ? '' : '0') + value.toString();
    }
    constructor(value: number, max: number, left: boolean = false, config: Config) {
        super((e, value) => {
            this.setValue(parseInt(value, 10))
        }, 'calendar-popup-spinner calendar-popup-spinner_' + (!left ? 'right' : 'left'));

        this.max = max;

        const spin: HTMLSpanElement = document.createElement('span');
        const inc: HTMLAnchorElement = <HTMLAnchorElement>dom('<a href="javascript:void(0)"><i class="calendar-popup-icon"></i></a>');
        const dec: HTMLAnchorElement = <HTMLAnchorElement>dom('<a href="javascript:void(0)"><i class="calendar-popup-icon"></i></a>');

        spin.appendChild(inc);
        spin.appendChild(dec);

        if (!left) {
            this.container.insertBefore(dom('<span class="calendar-popup-icon calendar-popup-spinner_separator"></span>'), this.container.firstChild);
            this.container.appendChild(spin);
        } else {
            this.container.insertBefore(spin, this.container.firstChild);
        }

        this.setValue(value);

        this.on([inc, dec], 'click', (e: MouseEvent) => {
            let value: number = parseInt(this.input.value, 10);
            value = value + ((e.target === inc || (<HTMLSpanElement>e.target).parentNode === inc) ? 1 : -1)

            this.setValue(value);
        });

        if (config.mousewheel) {
            this.on(this.container, 'mousewheel', (e: MouseWheelEvent) => {
                let value: number = parseInt(this.input.value, 10);
                value = value + (e.wheelDelta > 0 ? 1 : -1);
                this.setValue(value);
                e.preventDefault();
            });
        }
    }
}