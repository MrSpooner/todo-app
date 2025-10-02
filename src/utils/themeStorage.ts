const themeKey = 'themeStorage';

export type ThemeName = 'light' | 'dark';

export function loadTheme(): ThemeName | null {
    const data = localStorage.getItem(themeKey);

    if (data === 'light' || data === 'dark') {
        return data
    } else {
        return null
    }
}

export function saveTheme(theme: ThemeName): void {
    localStorage.setItem(themeKey, theme);
}