import IPlate from "../interfaces/IPlate";
import Container from "./Container";
import {dom} from "./Helpers";

export default class CloseTimePicker extends Container implements IPlate {
    constructor() {
        super(false);
        const button: HTMLAnchorElement = <HTMLAnchorElement>dom('<a href="javascript:void(0)" class="calendar-popup-close"><i class="calendar-popup-icon"></i></a>');
        this.container = button;
        this.container.addEventListener('click', (e: MouseEvent) => {
            (<HTMLDivElement>this.container.parentNode.parentNode).classList.add('calendar-popup-timepicker_closed');
            this.datetime.useTime(false);
        }, false);
    }
}