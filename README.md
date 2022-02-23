# nz-covid19-data

Some gotchas I found when playing with [Github flat data](https://github.com/marketplace/actions/flat-data)

- The directories in the `downloaded_filename` path must already exist. They aren't created by the action. I was forced to create empty directories (apart from a README.md)

- Any paths in the postprocessing scripts must be relative to the repository root.

- Can't specify an alternative authorization header (something other than `Authorization:`) **and** use secrets.

### Other Scripts

`scripts/waybackmachine/getmohpagesnapshots.sh` downloads the wayback machine archive for the [Ministry of Health COVID-19: Data and statistics webpages](https://www.health.govt.nz/covid-19-novel-coronavirus/covid-19-data-and-statistics)

`scripts/waybackmachine/processmohpagesnapshots.ts` renames each snaphot according to the date of the data contained within the page: `YYYY-MM-DDTHH:mm.html` (ISO 8601)

### Current data updated daily

COVID-19 data from [Stats NZ open data API](https://www.stats.govt.nz/experimental/covid-19-data-portal)

- [number_of_cases.json](/data/statsnz/number_of_cases.json)
- [tests_per_day.json](/data/statsnz/tests_per_day.json)
- [weekly_deaths_by_age_and_sex.json](/data/statsnz/weekly_deaths_by_age_and_sex.json)
- [weekly_deaths_by_region.json](/data/statsnz/weekly_deaths_by_region.json)

Snapshot of [Ministry of Health COVID-19 stats pages](https://www.health.govt.nz/covid-19-novel-coronavirus/covid-19-data-and-statistics)

- [COVID-19: Current cases](/moh/covid-19-current-cases)
- [COVID-19: Case demographics](/moh/covid-19-case-demographics)
- [COVID-19: Source of cases](covid-19-source-cases)
- [Testing for COVID-19](testing-covid-19)
- [COVID-19: Vaccine data](covid-19-vaccine-data)

NZ data from [COVID-19 Data Repository by the Center for Systems Science and Engineering (CSSE) at Johns Hopkins University](https://github.com/CSSEGISandData/COVID-19)

- [time_series_covid19_confirmed_nz.csv](/data/jhu-csse/time_series_covid19_confirmed_nz.csv)
- [time_series_covid19_deaths_nz.csv](/data/jhu-csse/time_series_covid19_deaths_nz.csv)

NZ data from the [Our World in Data COVID-19 Dataset](https://github.com/owid/covidP19-data)

- [owid-covid-data-nz.csv](/data/owid/owid-covid-data-nz.csv)

### Coming Soon

- Stats NZ population estimates

- NZ data from the [Human Mortality Database](https://www.mortality.org/)

- NZ data from the [World mortality dataset](https://github.com/akarlinsky/world_mortality)

### Wishlist

- Complete snapshots (HTML) for Ministry of Health stats pages. Send me a message if you can help out with this!
- Let me know what else you'd like to see here!
