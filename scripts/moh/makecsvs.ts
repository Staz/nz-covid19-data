import { join } from 'https://deno.land/std@0.127.0/path/mod.ts';
import { writeCSV } from '../csv.ts';
import { parseJsonFile } from '../utils.ts';
// import { get } from 'https://deno.land/x/lodash@4.17.15-es/lodash.js';

import { getJsonFilesInDir } from './common.ts';
import { CASE_DEMOGRAPHICS_DIRECTORY_PATH } from './constants.ts';

type CsvInputValue = string | number | null | undefined;
type CsvInputRow = { [key: string]: CsvInputValue };

interface CsvSetting {
  // Array when the table name has had multiple values over time
  table: string | Array<string>;
  otherNames?: string[];
  destPath: string;
  by: string;
  // Array when column name has had multiple values over time
  columns: Array<{ srcName: string | Array<string>; destName: string }>;
}

/* Date will always be first column. I have no doubt this config
   will have to change over time as MoH makes changes (even just renaming something!) */
const CSV_SETTINGS: Array<CsvSetting> = [
  {
    table: ['Cases by sex', 'Number of cases by sex'],
    destPath: 'community_cases_since_20210816_by_sex.csv',
    by: 'sex',
    columns: [
      {
        srcName: ['Total cases', 'Number of cases'],
        destName: 'total_cases',
      },
      {
        srcName: 'Cases who have been hospitalised',
        destName: 'total_cases_hospitalised',
      },
    ],
  },
  {
    table: ['Cases by age group', 'Number of cases by age group'],
    destPath: 'community_cases_since_20210816_by_age_group.csv',
    by: 'age_group',
    columns: [
      {
        srcName: ['Total cases', 'Number of cases'],
        destName: 'total_cases',
      },
      {
        srcName: 'Cases who have been hospitalised',
        destName: 'total_cases_hospitalised',
      },
    ],
  },
  {
    table: ['Cases by ethnicity', 'Number of cases by ethnicity'],
    destPath: 'community_cases_since_20210816_by_ethnicity.csv',
    by: 'ethnicity',
    columns: [
      {
        srcName: ['Total cases', 'Number of cases'],
        destName: 'total_cases',
      },
      {
        srcName: 'Cases who have been hospitalised',
        destName: 'total_cases_hospitalised',
      },
    ],
  },
  {
    table: [
      'Vaccination details' /* Earlier name - e.g. 2021-12-20 */,
      'Vaccination details of all August 2021 community cluster cases' /* Even earlier - e.g 2021-10-14 */,
      'Vaccination details are updated weekly on Mondays.',
    ],
    destPath: 'community_cases_since_20210816_by_vaccination_status.csv',
    by: 'vaccination_status',
    columns: [
      {
        srcName: ['Total cases', 'Number of all cases'],
        destName: 'total_cases',
      },
      {
        srcName: [
          'Cases who have been hospitalised',
          'Number of hospitalised cases',
        ],
        destName: 'total_cases_hospitalised',
      },
    ],
  },
  {
    table: 'Total cases and tests by ethnicity',
    destPath: 'total_cases_and_tests_by_ethnicity.csv',
    by: 'ethnicity',
    columns: [
      {
        srcName: 'Total cases since first NZ case',
        destName: 'total_cases',
      },
      {
        srcName: 'Total tests for COVID-19 to date',
        destName: 'total_tests',
      },
    ],
  },
  {
    table: 'Cases of COVID-19 by ethnicity',
    destPath: 'total_cases_by_ethnicity.csv',
    by: 'ethnicity',
    columns: [
      {
        srcName: 'Active (confirmed and probable)',
        destName: 'active',
      },
      {
        srcName: 'Recovered',
        destName: 'recovered',
      },
      {
        srcName: 'Deceased',
        destName: 'deceased',
      },
      {
        srcName: 'Total cases since first case',
        destName: 'total',
      },
    ],
  },
  {
    table: 'COVID-19 cases by age group',
    destPath: 'total_cases_by_age_group.csv',
    by: 'age_group',
    columns: [
      {
        srcName: 'Active (confirmed and probable)',
        destName: 'active',
      },
      {
        srcName: 'Recovered',
        destName: 'recovered',
      },
      {
        srcName: 'Deceased',
        destName: 'deceased',
      },
      {
        srcName: 'Total cases',
        destName: 'total',
      },
    ],
  },
  {
    table: 'Total cases of COVID-19 by sex',
    destPath: 'total_cases_by_sex.csv',
    by: 'sex',
    columns: [
      {
        srcName: 'Active (confirmed and probable)',
        destName: 'active',
      },
      {
        srcName: 'Recovered',
        destName: 'recovered',
      },
      {
        srcName: 'Deceased',
        destName: 'deceased',
      },
      {
        srcName: 'Total cases',
        destName: 'total',
      },
    ],
  },
  {
    table: [
      'Cases who have been in hospital and in intensive care (ICU) by age',
      'Cases in hospital and in intensive care (ICU) by age',
    ],
    destPath: 'total_hospital_and_icu_cases_by_age.csv',
    by: 'age_group',
    columns: [
      {
        srcName: 'Total people hospitalised',
        destName: 'total_hospitalised',
      },
      {
        srcName: 'Total people in ICU',
        destName: 'total_icu',
      },
    ],
  },
  {
    table: [
      'Cases who have been in hospital and in intensive care by sex',
      'Cases in hospital and in intensive care by sex',
    ],
    destPath: 'total_hospital_and_icu_cases_by_sex.csv',
    by: 'sex',
    columns: [
      {
        srcName: 'Total people hospitalised',
        destName: 'total_hospitalised',
      },
      {
        srcName: 'Total people in ICU',
        destName: 'total_icu',
      },
    ],
  },
];

const generateCSVRows = (date: string, data: any, csvSetting: CsvSetting) => {
  const rows: CsvInputRow[] = [];

  const tableNames = Array.isArray(csvSetting.table)
    ? csvSetting.table
    : [csvSetting.table];

  let tableData: any;
  for (const tableName of tableNames) {
    tableData = data[tableName];
    if (tableData) {
      break;
    }
  }

  if (!tableData) {
    return [];
  }

  for (const key of Object.keys(tableData)) {
    const rowObject: CsvInputRow = {
      date,
      [csvSetting.by]: key,
    };

    for (const column of csvSetting.columns) {
      const srcNames = Array.isArray(column.srcName)
        ? column.srcName
        : [column.srcName];

      let inputValue: CsvInputValue;

      for (const srcName of srcNames) {
        inputValue = tableData[key][srcName];
        if (inputValue != null) {
          break;
        }
      }

      rowObject[column.destName] = inputValue;
    }

    rows.push(rowObject);
  }

  return rows;
};

const generateCSVFile = async (
  jsonDirectoryPath: string,
  csvSetting: CsvSetting
) => {
  const jsons = await getJsonFilesInDir(jsonDirectoryPath);

  let rows: CsvInputRow[] = [];

  for (const json of jsons) {
    const date = json.substring(0, 10);
    const path = join(CASE_DEMOGRAPHICS_DIRECTORY_PATH, json);
    const data = await parseJsonFile(path);
    rows = rows.concat(generateCSVRows(date, data, csvSetting));
  }

  await writeCSV(csvSetting.destPath, rows);
};

for await (const csvSetting of CSV_SETTINGS) {
  generateCSVFile(CASE_DEMOGRAPHICS_DIRECTORY_PATH, csvSetting);
}
