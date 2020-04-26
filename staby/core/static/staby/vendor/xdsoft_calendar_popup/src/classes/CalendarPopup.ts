import IDestructor from "../interfaces/IDestructor";
import Popup from "./Popup";
import Component from "./Component";
import Config from "../config";
import {extend, trim} from "./Helpers";
import DateTime from "./DateTime";
import DateTimeParser from "./DateTimeParser";
import Month from "./Month";
import Composer from "./Composer";
import Arrow from "./Arrow";
import Year from "./Year";
import MonthsSelect from "./MonthsSelect";
import {
    TIMEOUT
} from "../consts";
import Title from "./Title";
import Button from "./Button";
import CloseTimePicker from "./CloseTimePicker";
import Hours from "./Hours";
import Minutes from "./Minutes";
import TimePickerToggler from "./TimePickerToggler";
import InputWrapper from "./InputWrapper";
import MaskCore from "./mask/Core";

declare let appVersion: string;

export default class CalendarPopup  extends Component implements IDestructor{
    static instances: {[key: string]: CalendarPopup} = {};
    static defaultOptions: Config;
    public config: Config;
    
    public value: DateTime;

    private nativeElementDefaultDisplay: string;
    private nativeElement: HTMLInputElement;

    public id: string = '';
    static tick: number = 1;

    setNativeElement(nativeElement: HTMLElement) {
        if (!(nativeElement instanceof Element)) {
            throw new Error('First argument must be Element');
        }
        if (!nativeElement.parentNode) {
            throw new Error('First argument should be in DOM');
        }

        this.nativeElement = <HTMLInputElement>nativeElement;

        if (this.nativeElement.hasAttribute('id')) {
            this.id = this.nativeElement.getAttribute('id');
        } else {
            this.id = 'calendar-popup-' + CalendarPopup.tick;
            CalendarPopup.tick += 1;
        }

    }

    afterDraw() {
        this.fire(this.nativeElement, 'calendar.afterdraw');
    }

    draw() {
        this.afterDraw();
    }

    setNativeValue(value: string){
        this.nativeElement.value = value;
    }
    getNativeValue(): string{
        return this.nativeElement.value;
    }

    public popup: Popup;
    public wrapperNativeInput: InputWrapper;

    public mask: MaskCore;

    private createPopup(){
        this.mask = new MaskCore(this.nativeElement, this.config);
        this.mask.bind(this.value);

        if (this.config.wrapSourceInput && !this.config.inlineMode) {
            this.wrapperNativeInput = new InputWrapper(this.nativeElement, this.mask.maskPlaceHolder, this.config);
            this.wrapperNativeInput.bind(this.value);
            this.popup = new Popup(this.wrapperNativeInput.container);

            this.value.on('update chosen after_init native_change', () => {
                this.wrapperNativeInput.container.classList.toggle('calendar-popup-input-wrapper-not-empty', this.getNativeValue().length ? true : false);
            });
        } else {
            this.popup = new Popup(this.nativeElement);

            if (this.config.showMask && this.mask.maskPlaceHolder && !this.nativeElement.getAttribute('placeholder')) {
                this.nativeElement.setAttribute('placeholder', this.mask.maskPlaceHolder);
                this.nativeElement.setAttribute('data-placeholder', '');
            }
        }

        if (!this.config.allowKeyBoardEdit) {
            this.nativeElement.setAttribute('readonly', "true");
        }

        this.on( this.nativeElement, 'mousedown keydown change', this.nativeChange);
    }

    private nativeChangeTimer = 0;
    private nativeChange = () => {
        clearTimeout(this.nativeChangeTimer);
        this.nativeChangeTimer = setTimeout(() => {
            if (this.value && this.value.fire) {
                this.value.fire('native_change');
            }
        });
    };

    public composer: Composer;
    constructor(elementOrSelector: string|HTMLElement, config?: {[key: string]: number|string}) {
        super(false);

        if (typeof elementOrSelector === 'string') {
            elementOrSelector = <HTMLElement>document.querySelector(elementOrSelector);
        }

        this.setNativeElement(<HTMLElement>elementOrSelector);

        const OptionsDefault = function () {};
        OptionsDefault.prototype = CalendarPopup.defaultOptions;

        this.config = <Config>(new OptionsDefault());

        if (config !== undefined && typeof config === 'object') {
            Object.keys(config).forEach((key) => {
                if (typeof CalendarPopup.defaultOptions[key] === 'object' && !Array.isArray(CalendarPopup.defaultOptions[key])) {
                    this.config[key] = extend(true, {}, CalendarPopup.defaultOptions[key], config[key]);
                } else {
                    this.config[key] = config[key];
                }
            })
        }

        this.value = new DateTime(new DateTimeParser(this.config), this);
        this.value.set(this.getNativeValue());
        this.value.on('chosen', () => {
            this.setNativeValue(this.value.getString());
            this.close();
        });

        this.createPopup();

        this.composer = new Composer('main' + (this.config.inlineMode ? ' calendar-popup-composer_inline' : ''),
            this.config.datepicker ?
            new Composer(
                'header',
                new Arrow(false),
                new Composer(
                    'header_selectors',
                    new MonthsSelect(this.value.get(), this.config),
                    new Year(this.value.get(), this.config),
                ),
                new Arrow(true),
            ) : null,

            this.config.datepicker ? new Month(this.value.get(), this.config) : null,

            this.config.timepicker ?
            new Composer('calendar-popup-timepicker',
                new TimePickerToggler(this.i18n('Select time')),
                new Composer('calendar-popup-timepicker_wrap',
                    new Title(this.i18n('Time')),
                    new Hours(this.value.get().getHours(), true, this.config),
                    new Minutes(this.value.get().getMinutes(), false, this.config),
                    new CloseTimePicker()
                )
            ): null,

            this.config.choseButton || this.config.closeButton ?

            new Composer('calendar-popup-buttons',
                this.config.choseButton ? new Button(this.i18n('Chose'), () => {
                    this.value.fire('chosen');
                }): null,
                this.config.closeButton ? new Button(this.i18n('Close'), () => {
                    this.close();
                }): null,
            ): null,
        );

        this.composer.bind(this.value);

        this.value.on('update after_redraw', this.popup.calcPosition);

        if (!this.config.inlineMode) {
            this.popup.setContent(this.composer);
            this.on(this.nativeElement, 'focus', this.open);
        } else {
            this.nativeElementDefaultDisplay = this.nativeElement.style.display;
            this.nativeElement.style.display = 'none';
            this.nativeElement.parentNode.insertBefore(this.composer.container, this.nativeElement)
        }

        CalendarPopup.instances[this.id] = this;
        this.value.fire('after_init', this.getNativeValue());
    }

    open = () => {
        if (this.config.inlineMode) {
            return;
        }
        this.value.set(this.getNativeValue());
        this.popup.show();
        this.draw();
        this.on(window, 'mousedown', this.close);
    };

    close = () => {
        if (this.nativeElement !== document.activeElement) {
            this.popup.hide();
        }
        this.off(window, 'mousedown', this.close);
        setTimeout(() => {
            if (this.nativeElement !== document.activeElement) {
                this.popup.hide();
                if (this.config.validateOnBlur) {
                    this.onValidateBlur();
                }
            }
        }, TIMEOUT)
    };

     private onValidateBlur = () => {
         if (this.config.allowBlank && !trim(this.getNativeValue()).length) {
             this.setNativeValue('');
         } else {
             const d: Date = this.value.parse(this.getNativeValue());
             if (d) { // parseDate() may skip some invalid parts like date or time, so make it clear for user: show parsed date/time
                 this.setNativeValue(this.value.format(d));
             } else {
                 const splittedHours   = +([this.getNativeValue()[0], this.getNativeValue()[1]].join('')),
                     splittedMinutes = +([this.getNativeValue()[2], this.getNativeValue()[3]].join(''));

                 // parse the numbers as 0312 => 03:12
                 if (!this.config.datepicker && this.config.timepicker && splittedHours >= 0 && splittedHours < 24 && splittedMinutes >= 0 && splittedMinutes < 60) {
                     this.setNativeValue([splittedHours, splittedMinutes].map((item) => {
                         return item > 9 ? item : '0' + item;
                     }).join(':'));
                 } else {
                     this.setNativeValue(this.value.format(new Date()));
                 }
             }
             this.value.fire('chosen');
         }

     };

    private __alreadyDestructed: boolean = false;
    destructor() {
        if (this.__alreadyDestructed) {
            return;
        }

        this
            .off(this.nativeElement, 'focus', this.open)
            .off( this.nativeElement, 'mousedown keydown change', this.nativeChange)
            .off(window, 'mousedown', this.close)

        if (this.config.inlineMode) {
            this.nativeElement.style.display = this.nativeElementDefaultDisplay;
        }

        if (this.nativeElement.hasAttribute('data-placeholder')) {
            this.nativeElement.removeAttribute('data-placeholder');
            this.nativeElement.removeAttribute('placeholder');
        }

        this.composer.destructor();
        this.popup.destructor();

        if (this.wrapperNativeInput) {
            this.wrapperNativeInput.destructor();
        }
        // delete this.popup;
        delete this.value;

        this.__alreadyDestructed = true;

        delete CalendarPopup.instances[this.id];
    }

    version: string = appVersion; // from webpack.config.js
    /**
     * Return current version
     *
     * @method getVersion
     * @return {string}
     */
    getVersion = () => {
        return this.version;
    }

    i18n(text: string): string {
        if (this.config.i18n[this.config.locale] !== undefined && this.config.i18n[this.config.locale][text] !== undefined) {
            return this.config.i18n[this.config.locale][text];
        }
        return text;
    }
}

CalendarPopup.defaultOptions = new Config();
