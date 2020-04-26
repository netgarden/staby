import Component from "../Component";
import Config from "../../config";
import {
    _KEY0, AKEY, ARROWDOWN, ARROWLEFT, ARROWRIGHT, ARROWUP, BACKSPACE, CKEY, CTRLKEY, DEL, ENTER, ESC, F5, KEY0, TAB,
    VKEY,
    YKEY,
    ZKEY,
    TIMEOUT, KEY9, _KEY9, XKEY
} from "../../consts";
import {repeat, trim} from "../Helpers";


export default class MaskCore extends Component{
    private ctrlDown: boolean = false;
    private ctrlKeyDown = (e: KeyboardEvent) => {
        if (e.keyCode === CTRLKEY) {
            this.ctrlDown = true;
        }
    };
    private ctrlKeyUp = (e: KeyboardEvent) => {
        if (e.keyCode === CTRLKEY) {
            this.ctrlDown = false;
        }
    };

    public maskPlaceHolder: string = '';
    private mask: Array<(valueChar: string, previewsChar: string, simulate: boolean) => number|string> = [];

    private calculateMask() {
        if (this.config.mask === false) {
            return;
        }

        let counter: number = 0, lastChar: string;

        this.mask = this.config.format.split('').map((char: string, index: number) => {
            if (lastChar !== char) {
                counter = 0;
            } else {
                counter++;
            }

            lastChar = char;

            return (function (indexInGroup: number, self: MaskCore, index: number) {
                return (valueChar: string, previewsChar: string, simulate: boolean = false) => {
                    let value: number|string = parseInt(valueChar, 10);
                    if (isNaN(value)) {
                        value = 0;
                    }

                    value = (function () {
                        switch (char) {
                            case '/':
                            case ':':
                            case ' ':
                                return char + (self.mask[index + 1] ? self.mask[index + 1](valueChar, char, simulate) : '');
                            case 's':
                            case 'm':
                                if (indexInGroup === 0) {
                                    return value >= 5 ? 5 : value;
                                }

                                return value;
                            case 'h':
                            case 'H':
                                if (indexInGroup === 0) {
                                    return value >= 2 ? 2 : value;
                                }

                                if (previewsChar === '2') {
                                    return value <= 3 ? value : 3;
                                }

                                return value;
                            case 'M':
                                if (indexInGroup === 0) {
                                    return value >= 1 ? 1 : 0;
                                }

                                if (previewsChar === '1') {
                                    return value <= 2 ? value : 2;
                                }

                                return value;
                            case 'Y':
                                if (indexInGroup === 0) {
                                    return value >= 3 ? 3 : value;
                                }

                                return value;
                            case 'D':
                                if (indexInGroup === 0) {
                                    return value >= 3 ? 3 : value;
                                }

                                if (previewsChar === '3') {
                                    return value <= 1 ? value : 1;
                                }

                                return value;
                            default:
                                return valueChar;
                        }
                    } ());

                    if (!simulate && ['/', ':', ' '].indexOf(self.config.format[index + 1]) !== -1) {
                        value += self.config.format[index + 1];
                    }

                    return value;
                };
            }(counter, this, index));
        });

        this.maskPlaceHolder = this.config.format.replace(/[MYDHm]/g, '_');
    }

    private config: Config;
    private input: HTMLInputElement;

    constructor(input: HTMLInputElement, config: Config) {
        super(false);
        this.input = input;
        this.config = config;

        this.calculateMask();

        if (this.config.mask === false) {
            return;
        }

        this.on(this.config.ownerDocument.body, 'keydown', this.ctrlKeyDown)
            .on(this.config.ownerDocument.body, 'keyup', this.ctrlKeyUp)
            .on(this.input, 'keydown', this.onMaskKeyDown)
            .on(this.input, 'paste', this.onPaste)
            .on(this.input, 'cut', this.onCut)
    }

    destructor() {
        this.off(this.config.ownerDocument.body, 'keydown', this.ctrlKeyDown)
            .off(this.config.ownerDocument.body, 'keyup', this.ctrlKeyUp)
            .off(this.input, 'keydown', this.onMaskKeyDown)
            .off(this.input, 'paste', this.onPaste)
            .off(this.input, 'cut', this.onCut)

    }

    isValidValue(value: string): boolean {
        return true;
    }

    setCaretPos(start: number) {
        if (this.input.setSelectionRange) {
            this.input.setSelectionRange(start, start);
            return true;
        }

        return false;
    }
    private onCut = (e: ClipboardEvent) => {

        // this.onMaskKeyDown({
        //     which: BACKSPACE,
        // }, true);
    };
    private onPaste = (e: ClipboardEvent) => {
        const clipboardData = e.clipboardData || window['clipboardData'];
        let chars: string = clipboardData.getData('Text');

        if (!this.input.value.length) {
            const date: Date = this.datetime.parse(chars, false);
            if (date) {
                chars = this.datetime.format(date);
            }
        }

        chars.split('').forEach((char: string) => {
            this.onMaskKeyDown({
                which: char.charCodeAt(0),
                shiftKey: false
            });
        });
        e.preventDefault()
    };
    private onMaskKeyDown = (event: KeyboardEvent|{which: number, shiftKey?: boolean, preventDefault?: () => void}, simulate: boolean = false): false|void => {
        let val: string = this.input.value,
            key: number = event.which;

        const start: number = this.input.selectionStart;
        const end: number = this.input.selectionEnd;

        if ((key >= KEY0 && key <= KEY9) || (key >= _KEY0 && key <= _KEY9)) {
            let digit: string = String.fromCharCode((_KEY0 <= key && key <= _KEY9) ? key - KEY0 : key);

            if (this.mask[start] !== undefined) {
                digit = this.mask[start](digit, val[start - 1], simulate).toString();
            } else {
                event.preventDefault && event.preventDefault();
                return false
            }

            val = val.substr(0, start) + val.substr(end); // cut selected value
            val = val.substr(0, start) + digit + val.substr(start + digit.length);
            this.input.value = val;
            this.setCaretPos(start + digit.length);
        } else {
            switch (key) {
                case ARROWUP:
                case ARROWDOWN:
                    if (event.shiftKey) {
                        return;
                    }

                    let char: string = val[start - 1],
                        delta: number,
                        isNeedChange: boolean = false;
                    if (char !== undefined && !isNaN(parseInt(char, 10))) {
                        this.setCaretPos(start - 1);
                        isNeedChange = true;
                    } else {
                        char = val[start]
                        if (char !== undefined && !isNaN(parseInt(char, 10))) {
                            isNeedChange = true;
                        }
                    }

                    if (isNeedChange) {
                        delta = parseInt(char, 10) + (ARROWUP === key ? 1 : -1);
                        if (delta < 0) {
                            delta = 0;
                        }

                        this.onMaskKeyDown({
                            which: delta.toString().charCodeAt(0),
                            shiftKey: false,
                        }, true);

                        event.preventDefault && event.preventDefault();
                        return false;
                    }
                    break;
                case ARROWLEFT:
                case ARROWRIGHT:
                    if (event.shiftKey) {
                        return;
                    }
                    this.setCaretPos(start + (key === ARROWLEFT ? -1 : 1));
                    break;
                case DEL:
                case BACKSPACE:
                    let newStart: number = start + (key === DEL ? 1 : -1);
                    if (!val.substr(end).length) {
                        val = val.substr(0, newStart) + val.substr(end);
                    } else {
                        val = val.substr(0, newStart) + repeat(' ', end - newStart) + val.substr(end);
                    }

                    this.input.value = trim(val);
                    this.setCaretPos(newStart);
                    break;
            }

            if (([AKEY, CKEY, VKEY, ZKEY, YKEY, XKEY].indexOf(key) !== -1 && this.ctrlDown) || [ESC, ARROWUP, ARROWDOWN, ARROWLEFT, ARROWRIGHT, F5, CTRLKEY, TAB, ENTER].indexOf(key) !== -1) {
                return;
            }
        }

        if (this.datetime.isValid(this.input.value)) {
            this.datetime.set(this.input.value);
        }

        this.datetime.fire('update_placeholder');
        event.preventDefault && event.preventDefault();
        return false;
    }
}