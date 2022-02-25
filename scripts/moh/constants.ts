export const POSSIBLE_DATE_BLURB_REGEXES = [
  /All data on this page relates to cases recorded prior to (?<date>.+?)\./,
  /All information on this page is as at (?<date>.+?) unless otherwise stated/,
  /All data on this page is as at (?<date>.+?) unless otherwise stated/,
  /Data in this section is as at (?<date>.+?) and/, // covid-19-vaccine-data
  /All data on this page relates to tests processed prior to (?<date>.+?)/, // testing-covid-19
];

export const POSSIBLE_DATE_FORMATS = [
  'h:mm a D MMMM YYYY',
  'h:mma D MMMM YYYY',
  'h:mma [on] D MMMM YYYY',
];
