Some gotchas I found when playing with [Github flat data](https://github.com/marketplace/actions/flat-data)

- The directories in the `downloaded_filename` path must already exist. They aren't created by the action. I was forced to create empty directories (apart from a README.md)

### Current data updated daily

Stats NZ

- [number_of_cases.json](/data/statsnz/number_of_cases.json)
- [tests_per_day.json](/data/statsnz/tests_per_day.json)
- [weekly_deaths_by_age_and_sex.json](/data/statsnz/weekly_deaths_by_age_and_sex.json) (all deaths, not just COVID-19!)
- [weekly_deaths_by_region.json](/data/statsnz/weekly_deaths_by_region.json) (all deaths, not just from COVID-19!)

HTML Snapshots of [Ministry of Health COVID-19 stats pages](https://www.health.govt.nz/covid-19-novel-coronavirus/covid-19-data-and-statistics) as well as JSON files resulting from scraping the tables. The files are named according to the date of the data on the page and **not** the date the page itself was updated. 
 
- [COVID-19: Current cases](/data/moh/covid-19-current-cases)
- [COVID-19: Case demographics](/data/moh/covid-19-case-demographics)
- [COVID-19: Source of cases](/data/moh/covid-19-source-cases)
- [Testing for COVID-19](/data/moh/testing-covid-19)
- [COVID-19: Vaccine data](/data/moh/covid-19-vaccine-data)

NZ data from [COVID-19 Data Repository by the Center for Systems Science and Engineering (CSSE) at Johns Hopkins University](https://github.com/CSSEGISandData/COVID-19)

- [time_series_covid19_confirmed_nz.csv](/data/jhu-csse/time_series_covid19_confirmed_nz.csv)
- [time_series_covid19_deaths_nz.csv](/data/jhu-csse/time_series_covid19_deaths_nz.csv)

NZ data from the [Our World in Data COVID-19 Dataset](https://github.com/owid/covidP19-data)

- [owid-covid-data-nz.csv](/data/owid/owid-covid-data-nz.csv)

### Other data added manually

Stats NZ

- [estimated_resident_population_by_age_and_sex.csv](/data/statsnz/estimated_resident_population_by_age_and_sex.csv)

### Scripts

`scripts/moh/mohpagetojson.ts` scrapes the tables in the supplied MOH stats page and outputs a JSON document keyed by table name. 

`scripts/waybackmachine/getmohpagesnapshots.sh` downloads the wayback machine archive for the [Ministry of Health COVID-19: Data and statistics webpages](https://www.health.govt.nz/covid-19-novel-coronavirus/covid-19-data-and-statistics)

`scripts/waybackmachine/processmohpagesnapshots.ts` renames each snaphot according to the date of the data contained within the page: `YYYY-MM-DDTHH:mm.html` (ISO 8601)

### Coming Soon

- Automatically pull down latest OWID and JHU CSSE data within 10 mins of it being updated

- NZ data from the [Human Mortality Database](https://www.mortality.org/)

- NZ data from the [World mortality dataset](https://github.com/akarlinsky/world_mortality)

### Wishlist

- Complete snapshots (HTML) for Ministry of Health stats pages. Send me a message if you can help out with this!
- Let me know what else you'd like to see here!
