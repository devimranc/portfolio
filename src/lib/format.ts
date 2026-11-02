export const padIndex = (value: number): string =>
  String(value).padStart(2, "0");

export const formatCounter = (index: number, total: number): string =>
  `${padIndex(index + 1)} / ${padIndex(total)}`;
