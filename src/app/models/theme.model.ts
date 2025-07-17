export interface Theme {
    name: string;
    rootClass: string;
    backgroundClass: string;
    textClass: string;
    buttonClass: string;
    iconButtonClass: string;
    focusRingClass: string;
    ringColor: string;
    progressColor: string;
    progressTrackClass: string;
    progressFillClass: string;
    modalBackgroundClass: string;
    badgeSet: { emoji: string; name: string }[];
    confettiColors: string[];
    selectBackgroundClass: string;
}
