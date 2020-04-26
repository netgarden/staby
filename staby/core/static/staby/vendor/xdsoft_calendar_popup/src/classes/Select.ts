import IPlate from "../interfaces/IPlate";
import Popup from "./Popup";
import Option from "./Option";
import Component from "./Component";
import {dom} from "./Helpers";
import Title from "./Title";
import Composer from "./Composer";
import DateTime from "./DateTime";

export default class Select extends Component implements IPlate {
    protected extra: IPlate[] = [];
    container: HTMLElement;
    popup: Popup;
    title: Title;
    input: HTMLSpanElement;
    options: IPlate[] = [];
    datetime: DateTime;
    titleName: string = '';
    elements: Array<number|string>|{[key: string]: string};

    protected updateTitle(date: Date) {
        this.title.container.innerText = this.titleName;
        this.input.innerText = this.titleName;
    }

    constructor(value: string|number, elements: Array<number|string>|{[key: string]: string}, extra: IPlate[] = []) {
        super('calendar-popup-select');
        this.extra = extra;
        this.elements = elements;
        this.input = dom('<a class="calendar-popup-select_header calendar-popup-icon" href="javascript:void(0)"></a>');

        this.titleName = value.toString();

        this.container.appendChild(this.input);
        this.popup = new Popup(this.input, true);
        this.title = new Title(this.titleName);

        this.on(this.popup.container, 'mousedown', (e: MouseEvent) => {
            if (e.target) {
                const target: HTMLElement = <HTMLElement>e.target;
                if (target.tagName === 'A') {
                    this.choose(target.getAttribute('data-value'));
                    e.preventDefault();
                }
            }

            // this.popup.hide();

            e.stopPropagation();
            return false;
        });

        this.on(this.container, 'mousedown', (e: MouseEvent) => {
            this.datetime.fire('close_popup');
            this.popup.show();
            e.preventDefault();
            e.stopPropagation();
            return false;
        });


        this.on(window, 'mousedown', this.popup.hide);

        this.updateTitle(new Date());
        this.generate();
    }

    bind(datetime: DateTime) {
        this.datetime = datetime;
        this.options.forEach((elm: IPlate) => elm.bind(datetime));
        datetime.on('update', () => {
            this.popup.hide();
            this.updateTitle(this.datetime.get());
        });
        datetime.on('close_popup', this.popup.hide);

        this.redraw();
    }

    redraw() {}

    generate() {
        this.options.length = 0;

        Object.keys(this.elements).forEach((key) => {
            this.options.push(new Option(key, this.elements[key]));
        });

        this.popup.setContent(new Composer(
            'select_content',
            this.title,
            new Composer('selecr_variants', ...this.options, ...this.extra)
        ));

        this.options.forEach((elm: IPlate) => elm.redraw());
        this.title.redraw();
    }

    choose(value) {

    }

    destructor() {
        this.options.forEach((elm: IPlate) => elm.destructor());
        this.off(window, 'mousedown', this.popup.hide);
    }
}