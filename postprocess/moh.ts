/* This postprocessing script names the file based on the following string contained in the HTML.
  "All data on this page relates to cases recorded prior to 11:59 pm 17 February 2022."
  The above example will become "2022-02-17.html" 
*/
import dayjs from 'https://cdn.skypack.dev/dayjs';

const inputFile = Deno.args[0];
const html = Deno.readTextFileSync(inputFile);

const regex =
  /All data on this page relates to cases recorded prior to (?<date>.+)\./;
const match = regex.exec(html);

if (!match?.groups?.date) {
  throw 'Unable to work out what date the data relates to';
  // TODO: Save to a fail directory
}

const dateString = match.groups.date;
const date = dayjs(dateString).format('YYYY-MM-DD');

const outputFile = `./data/moh/covid-19-case-demographics/${date}.html`;
Deno.writeTextFileSync(outputFile, html);
Deno.remove(inputFile);
