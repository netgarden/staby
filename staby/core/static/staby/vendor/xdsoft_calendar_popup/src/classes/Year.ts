import Select from "./Select";
import IPlate from "../interfaces/IPlate";
import Config from "../config";
import DateTime from "./DateTime";
import Option from "./Option";
import Input from "./Input";

export default class Year extends Select implements IPlate {
    inputPlate: Input;
    constructor(value: Date, options: Config) {
        const currentYear: number = value.getFullYear();
        const years = {};
        for (let year: number = currentYear - 3; year <= currentYear + 3; year += 1) {
            years[year] = year;
        }

        const input: Input = new Input((e, value: string) => {
            const year = parseInt(value, 10);
            if (year >= options.yearStart && year <= options.yearEnd) {
                this.choose(year.toString());
            }
        });

        super(value.getFullYear(), years, [input]);
        this.inputPlate = input;

        if (options.mousewheel) {
            this.on(this.container, 'mousewheel', (e: MouseWheelEvent) => {
                let value: number = this.datetime.get().getFullYear();
                value = value + (e.wheelDelta > 0 ? 1 : -1);
                this.choose(value.toString());
                e.preventDefault();
            });
        }
    }

    choose(value: string) {
        this.datetime.setYear(parseInt(value, 10));
    }

    bind(datetime: DateTime) {
        datetime.on('update', () => {
            this.titleName = datetime.get().getFullYear().toString();
        });
        super.bind(datetime);
    }

    redraw() {
        const years = {};
        const currentYear: number = this.datetime.get().getFullYear();
        for (let year: number = currentYear - 3; year <= currentYear + 3; year += 1) {
            years[Math.abs(year)] = Math.abs(year);
        }

        this.elements = years;
        this.generate();

        this.options.forEach((elm: Option) => {
            elm.selected = (elm.key === this.datetime.get().getFullYear().toString());
            elm.redraw();
        });

        this.inputPlate.clear();

        this.title.redraw();
    }
}