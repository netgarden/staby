import IDateTimeParser from "../interfaces/IDateTimeParser";
import * as moment from 'moment';
import Config from "../config";

if (process.env.VARIANT === 'full') {
    require('moment/min/locales.min');
}

declare let require: any;
declare let process: any;

export default class DateTimeParser implements IDateTimeParser {
    config: Config;
    constructor(config: Config) {
        this.config = config;
    }

    parseFromStr(value: string|Date, strict: boolean = true): Date|false {
        moment.locale(this.config.locale);
        const date = typeof value === 'string' ? moment(value, strict ? this.config.format : undefined) : moment(new Date(value.getTime()));
        return date.isValid() ? date.toDate() : false;
    }

    static getWeek(value: Date): string {
        return moment(value).format('w');
    }

    getMonthName(value: Date): string {
        moment.locale(this.config.locale);
        return moment(value).format('MMMM');
    }

    toString(value: Date, withoutTime: boolean = false): string {
        moment.locale(this.config.locale);
        return moment(value).format((withoutTime && this.config.allowNotFillTime && this.config.datepicker) ? this.config.formatWithoutTime: this.config.format);
    }

    static weekdaysShort(locale: string): string[] {
        moment.locale(locale);
        return moment.weekdaysShort();
    }

    static months(locale: string): string[] {
        moment.locale(locale);
        return moment.months();
    }
    static countDaysInMonth = (value: Date) => {
        return new Date(value.getFullYear(), value.getMonth() + 1, 0).getDate();
    }
}