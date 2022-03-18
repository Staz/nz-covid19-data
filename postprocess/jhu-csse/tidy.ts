/* Unfortunately I don't have types */
import * as aq from 'https://jspm.dev/arquero@4';

import dayjs from 'https://cdn.skypack.dev/dayjs';
import customParseFormat from 'https://cdn.skypack.dev/dayjs/plugin/customParseFormat';
dayjs.extend(customParseFormat);

const CONFIRMED_CASES_DATA_PATH =
  'data/jhu-csse/raw-data/time_series_covid19_confirmed_nz.csv';
const DEATHS_DATA_PATH =
  'data/jhu-csse/raw-data/time_series_covid19_deaths_nz.csv';
const COMBINED_DATA_PATH = 'data/jhu-csse/covid19_nz.csv';

const tidyData = (t: any, valueColumnName: string) => {
  return (
    t
      .select(aq.range(4, t.numCols() - 1))

      // Fold date columns into a single date column
      .fold(aq.all(), { as: ['date', valueColumnName] })

      // Fix the date format
      .derive({
        date: aq.escape((d: any) =>
          dayjs(d.date, 'M/D/YY').format('YYYY-MM-DD')
        ),
      })
  );
};

// Province/State,Country/Region,Lat,Long,1/22/20,..
const confirmedCases = tidyData(
  await aq.fromCSV(await Deno.readTextFile(CONFIRMED_CASES_DATA_PATH)),
  'total_confirmed_cases'
);

// Province/State,Country/Region,Lat,Long,1/22/20,...
const deaths = tidyData(
  await aq.fromCSV(await Deno.readTextFile(DEATHS_DATA_PATH)),
  'total_deaths'
);

const combined = confirmedCases.join(deaths, 'date');
await Deno.writeTextFile(COMBINED_DATA_PATH, combined.toCSV());
