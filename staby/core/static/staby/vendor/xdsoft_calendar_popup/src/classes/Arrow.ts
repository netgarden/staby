import IPlate from "../interfaces/IPlate";
import Component from "./Component";
import DateTime from "./DateTime";

export default class Arrow extends Component implements IPlate {
    container: HTMLElement;
    datetime: DateTime;
    constructor(next: boolean) {
        super('calendar-popup-arrow', 'a');

        this.container.classList.add('calendar-popup-icon');
        this.container.classList.add('calendar-popup-arrow_' + (next ? 'next' : 'preview'));
        this.on(this.container, 'mousedown', (e: MouseEvent) => {
            if (next) {
                this.datetime.nextMonth();
            } else {
                this.datetime.previewMonth();
            }

            e.preventDefault();
            e.stopPropagation();
        });
    }
    redraw() {}
    destructor() {}
    bind(datetime: DateTime) {
        this.datetime = datetime;
    }
}