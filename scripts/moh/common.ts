import { cheerio } from '../deps.ts';
import { dayjs, customParseFormat } from '../deps.ts';

dayjs.extend(customParseFormat);

import {
  POSSIBLE_DATE_BLURB_REGEXES,
  POSSIBLE_DATE_FORMATS,
} from './constants.ts';
import { scrapeTable } from './tablescraper.ts';

export const getJsonFilesInDir = async (path: string) => {
  const jsons = [];
  for await (const file of Deno.readDir(path)) {
    if (file.name.endsWith('.json')) {
      jsons.push(file.name);
    }
  }

  return jsons.sort();
};

export const getLatestDataDate = async (path: string) => {
  const jsons = await getJsonFilesInDir(path);

  if (!jsons.length) {
    return null;
  }

  const latestFile = jsons[jsons.length - 1];
  const dateString = latestFile.slice(0, latestFile.indexOf('.'));
  return dateString;
};

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

const SKIP_TABLES = [
  'Where to go for help',
  'Definitions',
  'In the Chart above', // On covid-19-vaccine-data page (the table underneath is tricky to parse)
];

const shouldSkipTable = (tableName: string) => {
  return SKIP_TABLES.some(skipName => tableName.startsWith(skipName));
};

const cleanCaption = (caption: string) => {
  return caption.trim().replace(/\s{2,}/g, ' ');
};

export const scrapeTablesFromHtml = (path: string) => {
  const htmlString = Deno.readTextFileSync(path);
  const $ = cheerio.load(htmlString);

  const results: { [key: string]: any } = {};

  const tables = $('table');

  tables.each((_i, table) => {
    let tableName: string | null = null;
    const caption = $(table).find('caption');

    if (caption.length) {
      tableName = cleanCaption(caption.text());
      if (shouldSkipTable(tableName)) {
        return;
      }
      console.log('Caption: ' + tableName);
    } else {
      const previous = $(table)
        .prevAll('p,h6,h5,h4,h3,h2,h1')
        .filter((_i, el) => $(el).text().trim() !== '')
        .first();

      if (previous.length) {
        tableName = cleanCaption(previous.text());
        if (shouldSkipTable(tableName)) {
          return;
        }

        console.log('Previous: ' + tableName);
      }
    }

    if (!tableName) {
      throw new Error("Couldn't find table name");
    }

    results[tableName] = scrapeTable(cheerio.html(table));
  });

  const jsonFilePath = path.replace('.html', '.json');
  Deno.writeTextFile(jsonFilePath, JSON.stringify(results, null, 2));
};
