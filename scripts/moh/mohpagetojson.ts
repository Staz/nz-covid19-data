import cheerio from 'cheerio';
import {
  existsSync,
  lstatSync,
  readdirSync,
  readFileSync,
  writeFileSync,
} from 'fs';
import { join } from 'path';
import { scrapeTable } from './tablescraper';

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
    var stat = lstatSync(path);
    return stat.isDirectory();
  } catch (e) {
    // lstatSync throws an error if path doesn't exist
    return false;
  }
};

// const findTable = (caption: string, tableInfo: TableInfo, $: CheerioAPI) => {
//   const selectors = Array.isArray(tableInfo.selector)
//     ? tableInfo.selector
//     : [tableInfo.selector];

//   for (let selector of selectors) {
//     selector = selector.replace('{{caption}}', caption);
//     console.log(selector);
//     let table = $(selector);

//     // @ts-ignore (tagName does exist!)
//     if (table.length && table.get(0).tagName !== 'table') {
//       table = $(selector).closest('table');
//     }

//     if (table.length) {
//       return table;
//     }
//   }

//   return null;
// };

const processHtmlFile = (path: string) => {
  // directory name contains the page name
  //const directoryName = basename(dirname(path));

  //const htmlName = `${directoryName}.html`;

  // const pageSettings = parseSettings[htmlName];

  // if (!pageSettings) {
  //   throw Error('No parse settings found for : ' + htmlName);
  // }

  // console.log(pageSettings);

  const htmlString = readFileSync(path, { encoding: 'utf-8' });
  const $ = cheerio.load(htmlString);

  const results: { [key: string]: any } = {};

  const tables = $('table');

  tables.each((i, table) => {
    let tableName: string;
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
        .filter((i, el) => $(el).text().trim() !== '')
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

  // Get each table
  // for (let [caption, tableInfo] of Object.entries(pageSettings)) {
  //   const table = findTable(caption, tableInfo, $);

  //   if (!table) {
  //     throw new Error(`Couldn't find table "${caption}" in ${path}`);
  //   }

  //   const tableHtml = cheerio.html(table);

  //   if (tableInfo.structure === TableStructure.ColumnHeaders) {
  //     results[caption] = processTableWithColumnHeaders(tableHtml);
  //   } else if (tableInfo.structure === TableStructure.RowAndColumnHeaders) {
  //     results[caption] = processTableWithColumnAndRowHeaders(tableHtml);
  //   } else if (tableInfo.structure === TableStructure.RowHeaders) {
  //     results[caption] = processTableWithRowHeaders(tableHtml);
  //   }
  // }

  const jsonFilePath = path.replace('.html', '.json');
  writeFileSync(jsonFilePath, JSON.stringify(results, null, 2));
};

if (process.argv.length < 2) {
  console.error('No argument provided');
  process.exit(1);
}

const inputPath = process.argv[2];

if (!existsSync(inputPath)) {
  console.error('Input file/directory does not exist');
  process.exit(1);
}

// Just handle dirs for now
if (isDirectory(inputPath)) {
  const directoryContents = readdirSync(inputPath, { withFileTypes: true });

  for (let item of directoryContents) {
    const itemPath = join(inputPath, item.name);
    if (item.name.endsWith('.html')) {
      processHtmlFile(itemPath);
      console.log('-------------');
    }
  }
} else {
  processHtmlFile(inputPath);
}
