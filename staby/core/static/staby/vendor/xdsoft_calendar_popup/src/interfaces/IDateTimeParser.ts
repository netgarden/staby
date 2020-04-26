export default interface IDateTimeParser {
    parseFromStr(value: string|Date, strict?: boolean): Date|false;
    toString(value: Date, withoutTime: boolean): string;
    getMonthName(value: Date): string;
}