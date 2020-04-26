export default interface IToggle {
    show: () => void;
    hide: () => void;
    toggle: (show?: boolean) => void;
    isShown: boolean;
}