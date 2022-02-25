import cheerio from 'https://esm.sh/cheerio';
import { join } from 'https://deno.land/std@0.127.0/path/mod.ts';

import { scrapeTable } from './tablescraper.ts';
import { exists } from '../utils.ts';

const SKIP_TABLES = [
  'Where to go for help',
  'Definitions',
  'In the Chart above', // On covid-19-vaccine-data page (the table underneath is tricky to parse)
];

const shouldSkipTable = (tableName: string) => {
  return SKIP_TABLES.some(skipName => tableName.startsWith(skipName));
};

const isDirectory = (path: string) => {
  try {
    const stat = Deno.statSync(path);
    return stat.isDirectory;
  } catch {
    return false;
  }
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
      tableName = caption.text().trim();
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
        tableName = previous.text().trim();
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

if (Deno.args.length < 1) {
  console.error('No argument provided');
  Deno.exit(1);
}

const inputPath = Deno.args[0];

if (!(await exists(inputPath))) {
  console.error('Input file/directory does not exist');
  Deno.exit(1);
}

if (isDirectory(inputPath)) {
  const directoryContents = Deno.readDirSync(inputPath);

  for (const item of directoryContents) {
    const itemPath = join(inputPath, item.name);
    if (item.name.endsWith('.html')) {
      scrapeTablesFromHtml(itemPath);
      console.log('-------------');
    }
  }
} else {
  scrapeTablesFromHtml(inputPath);
}
