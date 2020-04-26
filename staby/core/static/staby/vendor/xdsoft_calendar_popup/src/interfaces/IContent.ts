import IPlate from "./IPlate";

export default interface IContent {
    setContent(content: IPlate|IPlate[]): void;
    getContent(): string;
}