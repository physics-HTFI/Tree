export const fileName = {
  isSvgFile: (name: string) => {
    return name[0] !== "." && name.toLocaleLowerCase().endsWith(".svg");
  },
  baseName: (name: string) => {
    const match = name.match(/^(.*?)(\.[^.]+)?$/);
    return match ? match[1] : name;
  },
};
