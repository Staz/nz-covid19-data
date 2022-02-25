import {
  POSSIBLE_DATE_BLURB_REGEXES,
  POSSIBLE_DATE_FORMATS,
} from './constants.ts';

import dayjs from 'https://cdn.skypack.dev/dayjs';
import customParseFormat from 'https://cdn.skypack.dev/dayjs/plugin/customParseFormat';
dayjs.extend(customParseFormat);

export const getDataDateFromMohPage = (
  input: string,
  outputFormat: string
): string | null => {
  for (const regex of POSSIBLE_DATE_BLURB_REGEXES) {
    const match = regex.exec(input);
    if (match?.groups?.date) {
      const dateString = match.groups.date;
      const date = dayjs(dateString, POSSIBLE_DATE_FORMATS, true);

      if (!date.isValid()) {
        throw new Error('Failed to parse date: ' + dateString);
      }

      return date.format(outputFormat);
    }
  }

  return null;
};

export const cleanHtml = (inputHtml: string) => {
  // Sigh, some MOH pages are riddled with these leading my regex to break
  return inputHtml.replace(/&nbsp;/g, ' ');
};
