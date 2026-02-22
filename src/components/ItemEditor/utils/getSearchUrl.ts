export function getSearchUrl(settings: AppSettings, item: ItemData) {
  return settings.searchExpression && item.title
    ? settings.searchExpression.replace(
        "{{key}}",
        item.title.replace(".svg", ""),
      )
    : null;
}
