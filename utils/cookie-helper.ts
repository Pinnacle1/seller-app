// Cookie helpers

export const COOKIE_ACCESS_TOKEN = "accessToken";

export const getCookie = (name: string): string | null => {
    if (typeof document === "undefined") return null;
    const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
    if (match) return match[2];
    return null;
};

export const setCookie = (name: string, value: string, days: number = 7) => {
    if (typeof document === "undefined") return;
    const date = new Date();
    date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
    document.cookie = `${name}=${value};expires=${date.toUTCString()};path=/;SameSite=Strict`;
};

export const removeCookie = (name: string) => {
    if (typeof document === "undefined") return;
    document.cookie = `${name}=; Max-Age=0; path=/`;
};
