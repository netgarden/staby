
import IDestructor from "../interfaces/IDestructor";
import IToggle from "../interfaces/IToggle";
import IContent from "../interfaces/IContent";
import {css, forEachAncestorOf, offset} from "./Helpers";
import Component from "./Component";
import IPlate from "../interfaces/IPlate";

export default class Popup extends Component implements IDestructor, IToggle, IContent {
    public container: HTMLElement;
    public content: HTMLElement;
    private element: HTMLElement;
    static containerClass: string = 'calendar-popup-container';
    public atTop: boolean = false

    constructor(element: HTMLElement, atTop: boolean = false) {
        super(Popup.containerClass);
        this.element = element;
        this.atTop = atTop;

        this.content = document.createElement('div');
        this.container.appendChild(this.content);

        if (!atTop) {
            this.on(window, 'scroll resize', this.calcPosition);
        }

        this.on(this.container, 'mousedown', (e) => {
            e.stopPropagation();
        });

        this.appendPopupToBody();
    }

    destructor() {
        this.off(window, 'scroll resize', this.calcPosition);
        if (this.container.parentNode) {
            this.container.parentNode.removeChild(this.container);
        }
    }

    private appendPopupToBody() {
        if (!this.container.parentNode && this.atTop) {
            if (this.element.nextSibling) {
                this.element.parentNode.insertBefore(this.container, this.element.nextSibling);
            } else {
                this.element.parentNode.insertBefore(this.container, this.element.nextSibling);
            }
        } else {
            document.body.appendChild(this.container);
        }
    }

    public isShown: boolean = false;

    calcPosition = () => {
        const
            dateInputOffset: {x: number, y: number, h: number, w: number} = offset(this.element),
            windowWidth: number = document.documentElement.clientWidth,
            windowHeight: number = window.innerHeight,
            windowScrollTop: number = window.pageYOffset || window.document.documentElement.scrollTop || document.body.scrollTop;

        if (this.atTop) {
            return;
        }

        let
            verticalPosition: number = dateInputOffset.y + dateInputOffset.h,
            left: number = dateInputOffset.x,
            position: string = "absolute",
            verticalAnchorEdge: string = 'top';



        if ((document.documentElement.clientWidth - dateInputOffset.x) < this.container.offsetWidth) {
            left = left - (this.container.offsetWidth - this.element.offsetWidth);
        }

        if (css(this.container, 'direction') === 'rtl') {
            left -= (this.container.offsetWidth - this.element.offsetWidth);
        }


        let dateInputHasFixedAncestor: boolean = false;

        forEachAncestorOf(this.element, (ancestorNode) => {
            if (window.getComputedStyle(ancestorNode).getPropertyValue('position') === 'fixed') {
                dateInputHasFixedAncestor = true;
                return false;
            }
        });

        if (dateInputHasFixedAncestor) {
            position = 'fixed';

            //If the picker won't fit entirely within the viewport then display it above the date input.
            if (verticalPosition + this.container.offsetHeight > windowHeight + windowScrollTop) {
                verticalAnchorEdge = 'bottom';
                verticalPosition = (windowHeight + windowScrollTop) - dateInputOffset.y;
            } else {
                verticalPosition -= windowScrollTop;
            }
        } else {
            if (verticalPosition + this.container.offsetHeight > windowHeight + windowScrollTop) {
                verticalPosition = dateInputOffset.y - this.container.offsetHeight;
            }
        }

        if (verticalPosition < 0) {
            verticalPosition = 0;
        }

        if (left + dateInputOffset.w > windowWidth) {
            left = windowWidth - dateInputOffset.w;
        }


        forEachAncestorOf(this.container, (ancestorNode) => {
            let ancestorNodePosition;

            ancestorNodePosition = css(ancestorNode, 'position');

            if (ancestorNodePosition === 'relative') {
                if (windowWidth >= ancestorNode.offsetWidth) {
                    left = left - ((windowWidth - ancestorNode.offsetWidth) / 2);
                }
                return false;
            }
        });

        const datetimepickerCss = {
            position,
            left: Math.round(left),
            top: '',  //Initialize to prevent previous values interfering with new ones.
            bottom: ''  //Initialize to prevent previous values interfering with new ones.
        };

        datetimepickerCss[verticalAnchorEdge] = Math.round(verticalPosition);

        css(this.container, datetimepickerCss);
    };

    show = () => {
        if (this.isShown === false) {
            this.isShown = true;
            this.container.classList.add(Popup.containerClass + '_active');
            this.calcPosition();
        }
    };

    hide = () => {
        if (this.isShown === true) {
            this.isShown = false;
            this.container.classList.remove(Popup.containerClass + '_active');
        }
    };

    toggle = (show?: boolean) => {
        if (show === true) {
            this.show();
        }
        if (show === false) {
            this.hide();
        }
        if (show === undefined) {
            this.isShown ? this.hide() : this.show();
        }
    };
    setContent(content: IPlate|IPlate[]): void {
        this.content.innerHTML = '';
        if (!Array.isArray(content)) {
            content = [content];
        }
        content.forEach((plate: IPlate) => {
            this.content.appendChild(plate.container)
        })
    }
    getContent(): string {
        return this.content.innerHTML;
    }
}