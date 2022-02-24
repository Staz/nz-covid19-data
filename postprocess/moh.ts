/* This postprocessing script names the file based on the a string like the following in the HTML.

  "All data on this page relates to cases recorded prior to 11:59 pm 17 February 2022."
  
  The above example will become "2022-02-17.html" 
*/
import { dirname } from 'https://deno.land/std@0.126.0/path/mod.ts';
import { writableStreamFromWriter } from 'https://deno.land/std@0.126.0/streams/mod.ts';
import dayjs from 'https://cdn.skypack.dev/dayjs';
import customParseFormat from 'https://cdn.skypack.dev/dayjs/plugin/customParseFormat';
dayjs.extend(customParseFormat);

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
    Deno.close(file.rid);
  }
};

//system/files/documents/pages/covid_vaccinations_22_02_2022.xlsx
const VACCINATION_DATA_URL_REGEX =
  /system\/files\/documents\/pages\/covid_vaccinations_.+\.xlsx/; // relative url

const VACCINATION_DATA_OUTPUT_FILE_PATH = './data/moh/covid_vacciations.xlsx';

const MOH_BASE_URL = 'https://www.health.govt.nz';

const OUTPUT_FILE_DATE_FORMAT = 'YYYY-MM-DD[T]HH:mm';

const POSSIBLE_DATE_FORMATS = [
  'h:mm a D MMMM YYYY',
  'h:mma D MMMM YYYY',
  'h:mma [on] D MMMM YYYY',
];

const inputFile = Deno.args[0];
const html = Deno.readTextFileSync(inputFile);
let dateRegex: RegExp;

if (inputFile.endsWith('covid-19-current-cases.html')) {
  dateRegex =
    /All data on this page relates to cases recorded prior to (?<date>.+)\./;
} else if (inputFile.endsWith('covid-19-case-demographics.html')) {
  dateRegex =
    /All data on this page relates to cases recorded prior to (?<date>.+)\./;
} else if (inputFile.endsWith('covid-19-source-cases.html')) {
  dateRegex =
    /All data on this page relates to cases recorded prior to (?<date>.+)\./;
} else if (inputFile.endsWith('testing-covid-19.html')) {
  dateRegex =
    /All data on this page relates to tests processed prior to (?<date>.+)\./;
} else if (inputFile.endsWith('covid-19-vaccine-data.html')) {
  dateRegex = /Data in this section is as at (?<date>.+) and is updated daily/;

  /* Download latest vaccination data spreadsheet */
  const match = VACCINATION_DATA_URL_REGEX.exec(html);

  if (match) {
    const url = `${MOH_BASE_URL}/${match[0]}`;
    await downloadFile(url, VACCINATION_DATA_OUTPUT_FILE_PATH);
  } else {
    throw new Error('Link to vaccinations xlsx not found in page');
  }
} else {
  throw 'Unrecognised file: ' + inputFile;
}

const match = dateRegex.exec(html);
if (!match?.groups?.date) {
  throw 'Unable to work out what date the data relates to: ' + inputFile;
}

const dateString = match.groups.date;
const date = dayjs(dateString, POSSIBLE_DATE_FORMATS, true);

if (!date.isValid()) {
  throw 'Invalid date: ' + dateString;
}

const outputDir = dirname(inputFile);
const outputFileName = `${date.format(OUTPUT_FILE_DATE_FORMAT)}.html`;

Deno.writeTextFileSync(`./${outputDir}/${outputFileName}`, html);
Deno.remove(inputFile);
