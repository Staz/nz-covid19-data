import { dirname } from 'https://deno.land/std@0.126.0/path/mod.ts';
import { writableStreamFromWriter } from 'https://deno.land/std@0.126.0/streams/mod.ts';
import { getDataDateFromMohPage } from '../scripts/moh/common.ts';
import { scrapeTablesFromHtml } from '../scripts/moh/common.ts';
import { generateCsvFiles } from '../scripts/moh/lib/csv.ts';

const downloadFile = async (url: string, destinationPath: string) => {
  const response = await fetch(url);

  if (response.status !== 200) {
    console.error(`Response status was ${response.status} for ${url}`);
    return;
  }

  if (response.body) {
    const file = await Deno.open(destinationPath, {
      write: true,
      create: true,
    });

    const writableStream = writableStreamFromWriter(file);
    await response.body.pipeTo(writableStream);
  }
};

//system/files/documents/pages/covid_vaccinations_22_02_2022.xlsx
const VACCINATION_DATA_URL_REGEX =
  /system\/files\/documents\/pages\/covid_vaccinations_.+\.xlsx/; // relative url

const COVID_CASES_DATA_URL_REGEX =
  /system\/files\/documents\/pages\/covid_cases_.+\.csv/; // relative url

const VACCINATION_DATA_OUTPUT_FILE_PATH = './data/moh/covid_vaccinations.xlsx';
const COVID_CASES_DATA_OUTPUT_FILE_PATH = './data/moh/covid_cases.csv';

const MOH_BASE_URL = 'https://www.health.govt.nz';
const OUTPUT_FILE_DATE_FORMAT = 'YYYY-MM-DD[T]HH:mm';

const inputFile = Deno.args[0];
const html = Deno.readTextFileSync(inputFile);

if (inputFile.endsWith('covid-19-vaccine-data.html')) {
  /* Download latest vaccination data spreadsheet */
  const match = VACCINATION_DATA_URL_REGEX.exec(html);

  if (match) {
    const url = `${MOH_BASE_URL}/${match[0]}`;
    await downloadFile(url, VACCINATION_DATA_OUTPUT_FILE_PATH);
  } else {
    throw new Error('Link to vaccinations xlsx not found in page');
  }
}

const date = getDataDateFromMohPage(html, OUTPUT_FILE_DATE_FORMAT);

if (!date) {
  throw 'Unable to work out what date the data relates to: ' + inputFile;
}

const outputHtmlFilePath = `./${dirname(inputFile)}/${date}.html`;
Deno.writeTextFileSync(outputHtmlFilePath, html);

scrapeTablesFromHtml(outputHtmlFilePath);

if (inputFile.endsWith('covid-19-case-demographics.html')) {
  console.log('Generating CSVs for MoH case demographic data');
  await generateCsvFiles();
}

// Deno.remove(inputFile);
