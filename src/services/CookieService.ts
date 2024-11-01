export class CookieService {
  static setCookie(name: string, value: string, days?: number) {
    const data = new Date();
    if (days) {
      data.setTime(data.getTime() + days * 24 * 60 * 60 * 1000);
    }
    const expires = `expires=${data.toUTCString()}`;
    document.cookie = `${name}=${value};${expires};path=/`;
  }

  static getCookie(name: string): string | null {
    const nameEQ = name + "=";
    const ca = document.cookie.split(";");
    for (let i = 0; i < ca.length; i++) {
      let c = ca[i];
      while (c.charAt(0) === " ") c = c.substring(1, c.length);
      if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
    }
    return null;
  }

  static removeCookie(name: string): void {
    document.cookie = `${name}=; Max-Age=-99999999;`;
  }
}
