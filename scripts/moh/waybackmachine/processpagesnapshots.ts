import { join } from 'https://deno.land/std@0.127.0/path/mod.ts';

import { getDataDateFromMohPage } from '../common.ts';
import { cleanHtml, exists } from '../../utils.ts';

const OUTPUT_FILE_DATE_FORMAT = 'YYYY-MM-DD[T]HH[:]mm';

const processWaybackFile = (path: string, outputDir: string) => {
  const htmlString = cleanHtml(Deno.readTextFileSync(path));

  if (!htmlString) {
    console.warn('Skipping empty file: ' + path);
    return;
  }

  const dateString = getDataDateFromMohPage(
    htmlString,
    OUTPUT_FILE_DATE_FORMAT
  );

  if (!dateString) {
    throw new Error(
      'Could not work out what date the data relates to: ' + path
    );
  }

  const outputFileName = `${dateString}.html`;
  Deno.writeTextFileSync(join(outputDir, outputFileName), htmlString);
};

const processWaybackDirectory = (path: string, outputDir: string) => {
  const contents = Deno.readDirSync(path);

  for (const item of contents) {
    if (item.isDirectory) {
      processWaybackDirectory(join(path, item.name), outputDir);
    } else {
      processWaybackFile(join(path, item.name), outputDir);
    }
  }
};

const inputDir = Deno.args[0];
const outputDir = Deno.args[1] ?? join(inputDir, 'processed');

if (!exists(outputDir)) {
  Deno.mkdirSync(outputDir);
}

processWaybackDirectory(inputDir, outputDir);
