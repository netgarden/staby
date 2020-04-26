import Select from "./Select";
import IPlate from "../interfaces/IPlate";
import Config from "../config";
import DateTimeParser from "./DateTimeParser";
import DateTime from "./DateTime";
import Option from "./Option";

export default class MonthsSelect extends Select implements IPlate {
    months: string[];

    constructor(value: Date, options: Config) {
        const months = DateTimeParser.months(options.locale)
        super(months[value.getMonth()], months);
        this.months = months;

        this.updateTitle(value);
    }

    choose(value) {
        this.datetime.setMonth(value);
    }

    bind(datetime: DateTime) {
        datetime.on('update', () => {
            this.titleName = this.months[datetime.get().getMonth()];
        });
        super.bind(datetime);
    }

    redraw() {
        this.options.forEach((elm: Option) => {
            elm.selected = (elm.key === this.datetime.get().getMonth().toString());
            elm.redraw();
        });
        this.title.redraw();
    }
}