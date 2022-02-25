import { join } from 'path';
import { readdirSync, readFileSync, writeFileSync } from 'fs';
import {
  POSSIBLE_DATE_BLURB_REGEXES,
  POSSIBLE_DATE_FORMATS,
} from '../constants.ts';
import { cleanHtml } from '../../utils.ts';

const dayjs = require('dayjs');
const customParseFormat = require('dayjs/plugin/customParseFormat');
dayjs.extend(customParseFormat);

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
