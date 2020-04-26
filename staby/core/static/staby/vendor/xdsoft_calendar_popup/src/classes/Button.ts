import IPlate from "../interfaces/IPlate";
import {dom} from "./Helpers";
import Container from "./Container";

export default class Button  extends Container implements IPlate {
    constructor(title: string, callback: (e: MouseEvent) => void) {
        super(false);
        const button: HTMLAnchorElement = <HTMLAnchorElement>dom('<a href="javascript:void(0)" class="calendar-popup-button">' +
            '<i class="calendar-popup-icon"></i>' +
            '<i class="calendar-popup-icon calendar-popup-button_text">' + title + '</i>' +
            '<i class="calendar-popup-icon"></i>' +
            '</a>');

        this.container = button;
        this.container.addEventListener('click', callback);
    }
}