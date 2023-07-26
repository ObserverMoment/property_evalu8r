// https://stackoverflow.com/questions/64489395/converting-snake-case-string-to-title-case
export const convertToTitleCase = (s: string) =>
  s
    .replace(/^[-_]*(.)/, (_, c) => c.toUpperCase()) // Initial char (after -/_)
    .replace(/[-_]+(.)/g, (_, c) => " " + c.toUpperCase()); // First char after each -/_

interface Identifiable extends Object {
  id: string | number;
}

export const mapReplaceArray = <T extends Identifiable>({
  modified,
  previous,
}: {
  modified: T;
  previous: T[];
}) => previous.map((i) => (i.id === modified.id ? modified : i));

export const convertNullableBoolToNumber = (
  input: boolean | null | undefined
) => (input === true ? 1 : input === false ? -1 : 0);

export const convertNumberToNullabeBool = (input: number) =>
  input >= 1 ? true : input <= -1 ? false : null;

export const currencyFormat = (num: number, decimalPlaces: number = 0) =>
  "£" + num.toFixed(decimalPlaces).replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");

export const numberFormat = (num: number, decimalPlaces: number = 0) =>
  num.toFixed(decimalPlaces).replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");

// https://stackoverflow.com/questions/11832914/how-to-round-to-at-most-2-decimal-places-if-necessary
export const roundToFixedDecimal = (num: number, decimalPlaces: number = 2) => {
  var multiplicator = Math.pow(10, decimalPlaces);
  var n = num * multiplicator;
  return Math.round(n) / multiplicator;
};

export const secondsToMinutes = (seconds: number): number =>
  Math.round(seconds / 60);
