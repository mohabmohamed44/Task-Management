import Cookies from "js-cookie";

const TOKEN_KEY = "token";

export const TokenStorage = {
  get(): string | undefined {
    return Cookies.get(TOKEN_KEY);
  },

  set(token: string) {
    if (!token || token === "undefined" || token === "null") {
      return;
    }
    Cookies.set(TOKEN_KEY, token, {
      expires: 7,
      secure: window.location.protocol === "https:",
      sameSite: "strict",
    });
  },

  remove() {
    Cookies.remove(TOKEN_KEY);
  },
};
