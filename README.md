# nz-covid19-data

Some gotchas I found when playing with [Github flat data](https://github.com/marketplace/actions/flat-data)

- The directories in the `downloaded_filename` path must already exist. They aren't created by the action. I was forced to create empty directories (apart from a README.md)

- Any paths in the postprocessing scripts must be relative to the repository root.

- Can't specify an alternative authorization header (something other than `Authorization:`) **and** use secrets.

### Other Scripts

`scripts/waybackmachine/getmohpagesnapshots.sh` downloads the wayback machine archive for the [Ministry of Health COVID-19: Data and statistics webpages](https://www.health.govt.nz/covid-19-novel-coronavirus/covid-19-data-and-statistics)

`scripts/waybackmachine/processmohpagesnapshots.ts` renames each snaphot according to the date of the data contained within the page: `YYYY-MM-DDTHH:mm.html` (ISO 8601)

### Current data updated daily

NZ data from [COVID-19 Data Repository by the Center for Systems Science and Engineering (CSSE) at Johns Hopkins University](https://github.com/CSSEGISandData/COVID-19)

- `data/jhu-csse/time_series_covid19_confirmed_nz.csv`
- `data/jhu-csse/time_series_covid19_deaths_nz.csv`

NZ data from the [Our World in Data COVID-19 Dataset](https://github.com/owid/covid-19-data)

- `data/owid/owid-covid-data-nz.csv`

Snapshot of Ministry of Health COVID-19 stats pages

- [COVID-19: Current cases](https://www.health.govt.nz/covid-19-novel-coronavirus/covid-19-data-and-statistics/covid-19-current-cases)
- [COVID-19: Case demographics](https://www.health.govt.nz/covid-19-novel-coronavirus/covid-19-data-and-statistics/covid-19-case-demographics)
- [COVID-19: Source of cases](https://www.health.govt.nz/covid-19-novel-coronavirus/covid-19-data-and-statistics/covid-19-source-cases)
- [Testing for COVID-19](https://www.health.govt.nz/covid-19-novel-coronavirus/covid-19-data-and-statistics/testing-covid-19)
- [COVID-19: Vaccine data](https://www.health.govt.nz/covid-19-novel-coronavirus/covid-19-data-and-statistics/covid-19-vaccine-data)

### Coming Soon

- Data from [Stats NZ open data API](https://www.stats.govt.nz/experimental/stats-nz-open-data-api). On hold for now since limitation of Github flat data prevents me using the API key.

- Stats NZ population estimates

- NZ data from the [Human Mortality Database](https://www.mortality.org/)

- NZ data from the [World mortality dataset](https://github.com/akarlinsky/world_mortality)

### Wishlist

- Complete snapshots (HTML) for Ministry of Health stats pages. Send me a message if you can help out with this!
- Let me know what else you'd like to see here!
