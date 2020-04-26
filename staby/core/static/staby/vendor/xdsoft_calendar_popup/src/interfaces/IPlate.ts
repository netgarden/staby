import DateTime from "../classes/DateTime";

export default interface IPlate {
    datetime: DateTime;
    container: HTMLElement
    redraw(): void;
    destructor(): void;
    bind(datetime: DateTime): void;
}