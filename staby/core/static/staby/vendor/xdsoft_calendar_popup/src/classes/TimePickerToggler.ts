import IPlate from "../interfaces/IPlate";
import Container from "./Container";

export default class TimePickerToggler extends Container implements IPlate {
    constructor(value: string|number) {
        super("calendar-popup-timepicker_toggler");
        this.container.innerHTML = '<i class="calendar-popup-icon"></i>' + value.toString();
        this.container.addEventListener('click', (e: MouseEvent) => {
            (<HTMLDivElement>this.container.parentNode).classList.remove('calendar-popup-timepicker_closed');
            this.datetime.useTime(true);
        }, false);
    }
}