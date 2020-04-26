import IDateTimeParser from "../interfaces/IDateTimeParser";
import CalendarPopup from "./CalendarPopup";

export default class DateTime {
    private parser: IDateTimeParser;
    private value: Date;
    public parent: CalendarPopup;

    constructor(parser: IDateTimeParser, parent: CalendarPopup) {
        this.parser = parser;
        this.parent = parent;
    }

    public isValid(value: string): boolean {
        return this.parser.parseFromStr(value) !== false;
    }

    public parse(value: string|Date, strict: boolean = true): Date {
        let date = this.parser.parseFromStr(value, strict);
        return date !== false ? date : new Date();
    }

    public format(value: Date): string {
        return this.parser.toString(this.value, !this.useTimeFlag);
    }


    set(value: string|Date) {
        this.value = this.parse(value);
        this.fire('update');
    }

    getString(): string {
        return this.format(this.value);
    }

    get(): Date {
        return this.value;
    }

    getMonthName(): string {
        return this.parser.getMonthName(this.value);
    }

    private hanlers: {[key: string]: Function[]} = {};
    private classSeparator = /[\s,]+/;

    on(events: string, callback: Function): DateTime {
        events.split(this.classSeparator).forEach((event: string) => {
            if (this.hanlers[event] === undefined) {
                this.hanlers[event] = [];
            }
            this.hanlers[event].push(callback);
        });
        return this;
    }

    fire(events: string, ...args): DateTime {
        events.split(this.classSeparator).forEach((event: string) => {
            if (this.hanlers[event] !== undefined) {
                this.hanlers[event].forEach((callback) => callback.apply(this, args));
            }
        });
        return this;
    }

    nextMonth() {
        this.value.setMonth(this.value.getMonth() + 1);
        this.fire('update');
    }

    previewMonth() {
        this.value.setMonth(this.value.getMonth() - 1);
        this.fire('update');
    }

    setYear(year: number) {
        this.value.setFullYear(year);
        this.fire('update');
    }

    setHours(hours: number) {
        this.value.setHours(hours);
        this.fire('update_time');
    }

    setMinutes(minutes: number) {
        this.value.setMinutes(minutes);
        this.fire('update_time');
    }

    setDate(date: number, month: number) {
        this.value.setDate(date);
        this.setMonth(month);
    }

    setMonth(month: number) {
        this.value.setMonth(month);
        this.fire('update');
    }
    plusMonth() {
        const date: Date = new Date(this.value.getTime());
        date.setMonth(date.getMonth() + 1);
        return date;
    }

    useTimeFlag: boolean = true;
    useTime(use: boolean) {
        this.useTimeFlag = use;
    }
}