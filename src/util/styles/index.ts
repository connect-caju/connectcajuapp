
export type Colors  = {
    primary: string;
    secondary: string;
};

enum COLORS_SCHEME {
    LIGHT = 'light',
    DARK = 'dark',
}

const COLORS_LIGHT : Colors = {
    secondary: "#212427",
    primary: '#F5F5F5',
};

const COLORS_DARK : Colors = {
    secondary: "#F5F5F5",
    primary: '#212427',
};

export const THEME_COLORS = {
    [COLORS_SCHEME.LIGHT]: COLORS_LIGHT,
    [COLORS_SCHEME.DARK]: COLORS_DARK,
}