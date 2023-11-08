export function camelize(str: string): string {
  return str.replaceAll("-","")
    .replace(/(?:^\w|[A-Z]|\b\w)/g, function (word, index) {
      return index === 0 ? word.toLowerCase() : word.toUpperCase();
    })
    .replace(/\s+/g, "");
}

export function capitalize(str: string) {
  return str[0].toUpperCase() + str.slice(1);
}

export function isUrl(str: string): boolean {
  return str.startsWith("http");
}
