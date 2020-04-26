import 'classlist-polyfill';
import './styles/index.less'

declare let require: any;

declare let module: { id: string, exports: Function };

const CalendarPopup = require('./classes/CalendarPopup').default;

module.exports = CalendarPopup;

if (window['jQuery'] !== undefined) {
    (function ($) {
        $.fn.CalendarPopup = function (options) {
            return this.each(function () {
                if (!$(this).data('calendar-popup')) {
                    const calendar = new CalendarPopup(this, options);
                    $(this).data('calendar-popup', calendar);
                }
            });
        }
    } (window['jQuery']));
}


