export const modifierItemNode = {
  isValidItem: (item: ItemEntry) => {
    if (item.title === undefined) return false;
    return true;
  },
};
