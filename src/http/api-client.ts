import ky from "ky";

export const api = ky.create({
  prefixUrl: "https://de1.api.radio-browser.info",
  headers: {
    "Content-Type": "application/json",
  },
});
