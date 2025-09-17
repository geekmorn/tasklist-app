export function isValidTitle(value: string, min: number, max: number) {
  const len = value.trim().length;
  return len >= min && len <= max;
}

export function willExceedMax(
  currentValue: string,
  insertValue: string,
  selectionStart: number | null,
  selectionEnd: number | null,
  max: number
) {
  const start = selectionStart ?? currentValue.length;
  const end = selectionEnd ?? start;
  const replacing = Math.max(0, end - start);
  const nextLength = currentValue.length - replacing + insertValue.length;
  return nextLength > max;
}


