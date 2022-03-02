// I shouldn't have to create this but none of the deno packages did the trick for me

const quoteIfNecessary = (value: string | number) => {
  if (
    typeof value === 'string' &&
    (value.indexOf(',') !== -1 || value.indexOf('"') !== -1)
  ) {
    return `"${value}"`;
  }
  return value;
};

const escapeQuotes = (value: string | number) => {
  if (typeof value === 'string') {
    return value.replaceAll('"', '""');
  }

  return value;
};
const createCSVField = (value: string | number | null | undefined) => {
  if (value == null) {
    return '';
  } else if (typeof value === 'string') {
    // Order is important!
    const escapedValue = escapeQuotes(value);
    return quoteIfNecessary(escapedValue);
  }

  return value;
};

const getHeadingLine = (headings: string[]) => {
  return headings.map(createCSVField).join(',') + '\n';
};

type DataRow = { [key: string]: number | string | null | undefined };

const getDataLine = <T extends DataRow>(headings: string[], row: T) => {
  return headings.map(heading => createCSVField(row[heading])).join(',') + '\n';
};

export const checkInput = <T>(rows: Array<T>) => {
  if (!rows.length) {
    throw new Error('No rows to write to CSV');
  }
};

export const getCSVString = <T extends DataRow>(rows: Array<T>) => {
  checkInput(rows);

  let csvString = '';

  const headings = Object.keys(rows[0]);
  const headingLine = getHeadingLine(headings);

  csvString += headingLine;

  for (const row of rows) {
    const dataLine = getDataLine(headings, row);
    csvString += dataLine;
  }

  return csvString;
};

export const writeCSV = async <T extends DataRow>(
  path: string,
  rows: Array<T>
) => {
  const csvString = getCSVString(rows);
  await Deno.writeTextFile(path, csvString);
};
