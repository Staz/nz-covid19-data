import { getDataDateFromMohPage } from './common.ts';

const URL_TO_CHECK =
  'https://www.health.govt.nz/covid-19-novel-coronavirus/covid-19-data-and-statistics/covid-19-case-demographics';

//const LATEST_DATE =

const OUTPUT_FILE_DATE_FORMAT = 'YYYY-MM-DD[T]HH:mm';
const response = await fetch(URL_TO_CHECK);
const html = await response.text();

const date = getDataDateFromMohPage(html, OUTPUT_FILE_DATE_FORMAT);
