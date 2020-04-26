import Spinner from "./Spinner";
import IPlate from "../interfaces/IPlate";
import Config from "../config";

export default class Hours extends Spinner implements IPlate {
    constructor(value: number, left: boolean = false, config: Config) {
        super(value, 24, left, config);
    }

    redraw() {
        this.setValue(this.datetime.get().getHours());
    }

    setValue(value: number) {
        super.setValue(value);
        if (this.datetime) {
            this.datetime.setHours(parseInt(this.input.value, 10));
        }
    }
}