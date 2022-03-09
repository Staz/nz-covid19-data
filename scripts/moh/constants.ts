export const POSSIBLE_DATE_BLURB_REGEXES = [
  /All data on this page relates to cases recorded prior to (?<date>.+?)\./,
  /All information on this page is as at (?<date>.+?) unless otherwise stated/,
  /All data on this page is as at (?<date>.+?) unless otherwise stated/,
  /Data in this section is as at (?<date>.+?) and/, // covid-19-vaccine-data
  /All data on this page relates to tests processed prior to (?<date>.+?)\./, // testing-covid-19
];

export const POSSIBLE_DATE_FORMATS = [
  'h:mm a D MMMM YYYY', // needed?
  'h:mm a DD MMMM YYYY',
  'h:mma D MMMM YYYY',
  'h:mma DD MMMM YYYY',
  'h:mm a [on] DD MMMM YYYY',
];

export const CASE_DEMOGRAPHICS_DIRECTORY_PATH =
  'data/moh/covid-19-case-demographics';
export const CURENT_CASES_DIRECTORY_PATH = 'data/moh/covid-19-current-cases';
export const SOURCE_CASES_DIRECTORY_PATH = 'data/moh/covid-19-source-cases';
export const VACCINE_DATA_DIRECTORY_PATH = 'data/moh/covid-19-source-cases';
export const TESTING_DIRECTORY_PATH = 'data/moh/testing-covid-19';

export const TIMESERIES_DATA_DIR = 'data/moh/timeseries';
