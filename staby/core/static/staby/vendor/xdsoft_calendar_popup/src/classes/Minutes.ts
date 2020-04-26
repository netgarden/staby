import Spinner from "./Spinner";
import IPlate from "../interfaces/IPlate";
import Config from "../config";

export default class Minutes extends Spinner implements IPlate {
    constructor(value: number, left: boolean = false, config: Config) {
        super(value, 60, left, config);
    }
    redraw() {
        this.setValue(this.datetime.get().getMinutes());
    }
    setValue(value: number) {
        super.setValue(value);
        if (this.datetime) {
            this.datetime.setMinutes(parseInt(this.input.value, 10));
        }
    }
}