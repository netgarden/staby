import IPlate from "../interfaces/IPlate";
import Popup from "./Popup";
import {dom} from "./Helpers";
import DateTime from "./DateTime";

export default class Option implements IPlate {
    datetime: DateTime;
    selected: boolean = false;
    key: string;
    value: string;

    container: HTMLElement;
    constructor(key: string|number, value: string|number) {
        this.container = dom(`<a data-value="${key}" href="javascript:void(0)"></a>`);

        this.container.innerText = value.toString();

        this.key = key.toString();
        this.value = value.toString();

        this.redraw();
    }

    redraw(){
        this.container.classList.toggle('calendar-popup-select-option_active', this.selected);
    }

    destructor() {}

    bind(datetime: DateTime) {
        this.datetime = datetime;
    }
}