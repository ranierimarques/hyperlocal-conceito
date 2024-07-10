export const tw = (strings: TemplateStringsArray, ...values: any[]): string =>
  String.raw({ raw: strings }, ...values);
