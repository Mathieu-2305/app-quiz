export function isInMsalPopup() {
  return typeof window !== "undefined"
    && !!window.opener
    && typeof window.name === "string"
    && window.name.toLowerCase().includes("msal");
}