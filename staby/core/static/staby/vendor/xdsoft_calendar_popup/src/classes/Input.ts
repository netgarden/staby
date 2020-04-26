import IPlate from "../interfaces/IPlate";
import {dom} from "./Helpers";
import Component from "./Component";
import {TIMEOUT} from "../consts";

export default class Input extends Component implements IPlate {
    input: HTMLInputElement;
    constructor(callback: (e: KeyboardEvent, value: string) => void, className: string = 'calendar-popup-input') {
        super(className);
        this.input = <HTMLInputElement>dom('<input class="calendar-popup-form-input" type="text"/>');
        this.container.appendChild(this.input);
        let timeout = 0;
        this.on(this.input, 'keydown', (e: KeyboardEvent) => {
            clearTimeout(timeout);
            timeout = setTimeout(() => {
                callback(e, this.input.value);
            }, TIMEOUT)
        });
    }
    clear() {
        this.input.value = '';
    }
}