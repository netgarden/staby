import * as consts from "./consts";

export default class Config {
    ownerDocument: Document = document;
    ownerWindow: Window = window;

    locale: string = 'en';
    format: string = 'YYYY/MM/DD HH:mm';
    dayOfWeekStart: number = consts.DAY_SUNDAY;
    weekEnds: number[] = [consts.DAY_SUNDAY, consts.DAY_SATURDAY];
    yearStart: number = 1950;
    yearEnd: number = 2050;

    mousewheel: boolean = true;
    closeButton: boolean = true;
    choseButton: boolean = true;
    timepicker: boolean = true;
    datepicker: boolean = true;

    mask: boolean = true;
    showMask: boolean = true;

    validateOnBlur: boolean = true;
    allowBlank: boolean = true;

    showWeekIndex: boolean = false;

    choseOnClick: boolean = false;

    allowNotFillTime: boolean = true;
    formatWithoutTime: string = 'YYYY/MM/DD';

    disableDates: Array<Date|string|number>|((value: Date) => boolean) = [];
    disableDateFormat: string = 'DD/MM';

    i18n: {[key: string]: {[key: string]: string}} = {
        ru: {
            "Time": "Время",
            "Select time": "Выбрать время",
            "Chose": "Выбрать",
            "Close": "Закрыть",
        }
    }

    inlineMode: boolean = false;
    wrapSourceInput: boolean = true;
    allowKeyBoardEdit: boolean = true;
}