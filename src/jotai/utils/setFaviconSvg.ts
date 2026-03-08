export function setFaviconSvg(href?: string) {
  let link = document.querySelector("link[rel*='icon']") as
    | HTMLLinkElement
    | undefined;
  if (!link) {
    link = document.createElement("link");
    link.rel = "icon";
    link.type = "image/svg+xml";
    document.head.appendChild(link);
  }
  link.href = href ?? "";
}
