/* This postprocessing script names the file based on the following string contained in the HTML.
  "All data on this page relates to cases recorded prior to 11:59 pm 17 February 2022."
  The above example will become "2022-02-17.html" 
*/
import dayjs from 'https://cdn.skypack.dev/dayjs';
import { dirname } from 'https://deno.land/std@0.126.0/path/mod.ts';

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
} else {
  throw 'Unrecognised file: ' + inputFile;
}

const match = dateRegex.exec(html);

if (!match?.groups?.date) {
  throw 'Unable to work out what date the data relates to: ' + inputFile;
  // TODO: Save to a fail directory
}

const dateString = match.groups.date;
const date = dayjs(dateString).format('YYYY-MM-DD');

const outputDir = dirname(inputFile);
const outputFile = `./${outputDir}/${date}.html`;

Deno.writeTextFileSync(outputFile, html);
Deno.remove(inputFile);
