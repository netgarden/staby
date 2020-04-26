import IPlate from "../interfaces/IPlate";
import {dom} from "./Helpers";
import IDestructor from "../interfaces/IDestructor";
import DateTime from "./DateTime";

export default class Composer implements IPlate, IDestructor{
    datetime: DateTime;
    public container: HTMLDivElement;
    public plates: IPlate[];

    constructor(className: string, ...plates: Array<IPlate|null>) {
        this.container = document.createElement('div');
        this.container.className = 'calendar-popup-composer calendar-popup-composer_' + className;

        plates.forEach((elm: IPlate|null) => {
            if (elm) {
                this.container.appendChild(elm.container)
            }
        });

        this.plates = plates.filter((elm) => elm);
    }

    bind(datetime: DateTime) {
        datetime.on('update', () => {
            this.redraw();
        });
        this.plates.forEach((elm: IPlate) => elm.bind(datetime));
    }

    redraw() {
        this.plates.forEach((elm: IPlate) => elm.redraw());
    }
    destructor(){
        if (this.container.parentNode) {
            this.container.parentNode.removeChild(this.container);
        }
        this.plates.forEach((elm: IPlate) => (elm.destructor && elm.destructor()));
    }
}