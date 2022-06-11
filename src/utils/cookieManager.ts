/**
 * Set the cookie in the browser
 * @param name Name of the cookie
 * @param val Value of the cookie
 * @param expires Expires of the cookie in days
 */
export function setCookie(name: string, val: string, expires = 1): void {
  const date = new Date();
  const value = val;

  // Set it expire in expires day
  date.setTime(date.getTime() + expires * 24 * 60 * 60 * 1000);

  // Set it
  document.cookie =
    name + "=" + value + "; expires=" + date.toUTCString() + "; path=/";
}

export function getCookie(name: string): string {
  if (typeof window !== "undefined") {
    const value = "; " + document.cookie;
    const parts = value.split("; " + name + "=");
    if (parts.length == 2) {
      return parts.pop().split(";").shift();
    }
  }
}

export function deleteCookie(name: string): void {
  document.cookie = name + "=; expires=Thu, 01 Jan 1970 00:00:01 GMT; path=/";
}
