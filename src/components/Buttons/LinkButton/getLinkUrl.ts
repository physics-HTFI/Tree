export function getLinkUrl(settings: AppSettings, item: ItemData | null) {
  if (!settings.linkExpression || !item?.title) return null;
  return settings.linkExpression.replace("{{key}}", item.title);
}
