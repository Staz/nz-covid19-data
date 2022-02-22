import { join } from 'path';
import { readdirSync, readFileSync, writeFileSync } from 'fs';

const dayjs = require('dayjs');
const customParseFormat = require('dayjs/plugin/customParseFormat');
dayjs.extend(customParseFormat);

const POSSIBLE_DATE_BLURB_REGEXES = [
  /All data on this page relates to cases recorded prior to (?<date>.+?)\./,
  /All information on this page is as at (?<date>.+?) unless otherwise stated/,
  /All data on this page is as at (?<date>.+?) unless otherwise stated/,
  /Data in this section is as at (?<date>.+?) and/, // covid-19-vaccine-data
  /All data on this page relates to tests processed prior to (?<date>.+?)/, // testing-covid-19
];

const POSSIBLE_DATE_FORMATS = [
  'h:mm a D MMMM YYYY',
  'h:mma D MMMM YYYY',
  'h:mma [on] D MMMM YYYY',
];

const OUTPUT_FILE_DATE_FORMAT = 'YYYY-MM-DD[T]HH[:]mm';

const getDataDate = (input: string): string | null => {
  for (let regex of POSSIBLE_DATE_BLURB_REGEXES) {
    const match = regex.exec(input);

    if (match && match.groups.date) {
      const dateString = match.groups.date;
      const date = dayjs(dateString, POSSIBLE_DATE_FORMATS, true);

      if (!date.isValid()) {
        throw new Error('Failed to parse date: ' + dateString);
      }

      return date.format(OUTPUT_FILE_DATE_FORMAT);
    }
  }

  return null;
};

const cleanHtml = (inputHtml: string) => {
  // Sigh, some MOH pages are riddled with these leading my regex to break
  return inputHtml.replace(/&nbsp;/g, ' ');
};

const processWaybackFile = (path: string) => {
  const htmlString = cleanHtml(readFileSync(path, { encoding: 'utf-8' }));

  if (!htmlString) {
    console.warn('Skipping empty file: ' + path);
    return;
  }

  const dateString = getDataDate(htmlString);

  if (!dateString) {
    throw new Error(
      'Could not work out what date the data relates to: ' + path
    );
  }

  const outputFileName = `${dateString}.html`;
  writeFileSync(join(inputDir, outputFileName), htmlString);
};

const processWaybackDirectory = (path: string) => {
  const contents = readdirSync(path, { withFileTypes: true });

  for (let item of contents) {
    if (item.isDirectory()) {
      processWaybackDirectory(join(path, item.name));
    } else {
      processWaybackFile(join(path, item.name));
    }
  }
};

const inputDir = process.argv[2];
processWaybackDirectory(inputDir);
