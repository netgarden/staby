import IPlate from "../interfaces/IPlate";
import Config from "../config";
import DateTimeParser from "./DateTimeParser";
import {animate, Animate, css, dom} from "./Helpers";
import DateTime from "./DateTime";
import Container from "./Container";
import Component from "./Component";
import {DATE_CLASS} from "../consts";

export default class Month extends Component implements IPlate {
    public datetime: DateTime;
    public config: Config;

    public wrapper: HTMLDivElement;
    public current: HTMLDivElement;

    public lastDate: Date;

    constructor(date: Date, config: Config) {
        super('calendar-popup-month');

        this.config = config;
        const out = [];

        const days = DateTimeParser.weekdaysShort(this.config.locale);


        out.push('<div class="calendar-popup-month-days-wrapper">');

        if (config.showWeekIndex) {
            out.push(`<span></span>`);
        }

        days.forEach((day, i) => {
            out.push(`<span>${days[(i + this.config.dayOfWeekStart) % 7]}</span>`);
        });
        out.push('</div>');

        out.push('<div class="calendar-popup-month-dates-wrapper">');

        out.push(this.drawMonth(date.getFullYear(), date.getMonth(), date.getDate()));


        out.push('</div>');

        this.lastDate = new Date(date.getTime());

        this.container.innerHTML = out.join('');

        this.wrapper = <HTMLDivElement>this.container.querySelector('.calendar-popup-month-dates-wrapper');

        this.current = <HTMLDivElement>this.wrapper.firstChild;

        this.on(this.container, 'click dblclick', (e: MouseEvent) => {
            const target: HTMLAnchorElement = <HTMLAnchorElement>e.target;
            if (target && target.tagName === 'A' && target.classList.contains(DATE_CLASS)) {
                const date: Date = new Date(target.getAttribute('data-date'));
                let activeElements: NodeList = this.container.querySelectorAll('a.' + DATE_CLASS + '.' + DATE_CLASS + '_active');
                if (activeElements.length) {
                    [].slice.call(activeElements).forEach((a: HTMLAnchorElement) => {
                        a.classList.remove(DATE_CLASS + '_active');
                    });
                }
                target.classList.add(DATE_CLASS + '_active');

                this.datetime.setDate(date.getDate(), date.getMonth());

                if (e.type === 'dblclick' || config.choseOnClick) {
                    this.datetime.fire('chosen');
                }
            }
        });

        if (config.mousewheel) {
            this.on(this.container, 'mousewheel', (e: MouseWheelEvent) => {
                if (e.wheelDelta < 0) {
                    this.datetime.nextMonth();
                } else {
                    this.datetime.previewMonth();
                }
                e.preventDefault();
            });
        }
    }

    drawMonth(year: number, month: number, data: number): string {
        const
            out = [],
            date: Date = new Date(year, month, 1, 0, 0, 0, 1),
            countDaysInMonth: number = DateTimeParser.countDaysInMonth(date);

        out.push(`<div class="calendar-popup-month-dates-wrapper_layer" style="z-index:0">`);
        // go to start of week event it in another month
        while (date.getDay() !== this.config.dayOfWeekStart) {
            date.setDate(date.getDate() - 1);
        }

        let count: number = 1;

        while (count <= countDaysInMonth) {
            out.push(`<div>`);
            if (this.config.showWeekIndex) {
                out.push(`<a class="calendar-popup-week-index">${DateTimeParser.getWeek(date)}</a>`);
            }
            for (let i = 0; i < 7; i += 1) {
                const classes: string[]  = [DATE_CLASS];

                if (date.getMonth() !== month) {
                    classes.push('calendar-popup-month-dates_fade');
                } else {
                    count += 1;
                    if (date.getDate() === data) {
                        classes.push('calendar-popup-month-dates_now');
                    }
                }

                if (this.config.weekEnds.indexOf(date.getDay()) !== -1) {
                    classes.push('calendar-popup-month-dates_weekend');
                }

                out.push(`<a href="javascript:void(0)" data-date="${date}" class="${classes.join(' ')}">${date.getDate()}</a>`);
                date.setDate(date.getDate() + 1);
            }
            out.push(`</div>`);

            if (count === countDaysInMonth) {
                break;
            }
        }

        out.push(`</div>`);

        return out.join('');
    }

    animate: Animate;
    redraw() {
        if (this.lastDate.getMonth() === this.datetime.get().getMonth() && this.lastDate.getFullYear() === this.datetime.get().getFullYear()) {
            let active = this.wrapper.querySelector('.calendar-popup-month-dates_active');
            if (active) {
                active.classList.remove('calendar-popup-month-dates_active');
            }
            let date = new Date(this.datetime.get().getTime());
            date.setMinutes(0);
            date.setHours(0);
            date.setSeconds(0);

            active = this.wrapper.querySelector(`[data-date="${date}"]`);
            if (active) {
                active.classList.add('calendar-popup-month-dates_active');
            }

            return;
        }

        const newMonth: HTMLDivElement = <HTMLDivElement>dom(this.drawMonth(this.datetime.get().getFullYear(), this.datetime.get().getMonth(), this.datetime.get().getDate()));
        const next: boolean = this.lastDate < this.datetime.get();
        this.lastDate = new Date(this.datetime.get().getTime());

        this.wrapper.appendChild(newMonth);
        let top = (<HTMLDivElement>this.wrapper.firstChild).offsetHeight;
        newMonth.style.top = top + 'px';
        newMonth.style.position = 'absolute';
        this.current.style.position = 'relative';

        newMonth.style.zIndex = '6';

        const full = 100;
        if (this.animate) {
            this.animate.stop();
        }

        this.animate = animate((elsapsed)=> {
            if (next) {
                newMonth.style.top = Math.round(top - top * (elsapsed/full)) + 'px';
                this.current.style.top = -Math.round(top * (elsapsed/full)) + 'px';
            } else {
                newMonth.style.top = -Math.round(top - top * (elsapsed/full)) + 'px';
                this.current.style.top = Math.round(top * (elsapsed/full)) + 'px';
            }
        }, full, () => {
            newMonth.style.position = 'static';
            this.wrapper.removeChild(this.current);
            this.current = newMonth;
            newMonth.style.zIndex = '0';
            this.datetime.fire('after_redraw');
        });
    }

    destructor() {}

    bind(datetime: DateTime) {
        this.datetime = datetime;
    }
}