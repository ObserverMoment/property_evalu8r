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

export const currencyFormat = (num: number) =>
  "£" + num.toFixed(0).replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");
