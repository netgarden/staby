import IPlate from "../interfaces/IPlate";
import {dom} from "./Helpers";
import DateTime from "./DateTime";
import Container from "./Container";

export default class Title extends Container implements IPlate {
    constructor(value: string|number) {
        super("calendar-popup-select_title");
        this.container.innerText = value.toString();
    }
}