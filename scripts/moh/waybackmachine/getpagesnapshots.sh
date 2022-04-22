#! /bin/bash

if [[ -z $1 ]] 
then
  echo "usage: getpagesnapshots.sh <FROM_DATE> where date is YYYYMMDD"
  exit 1;  
fi

FROM_DATE=$1

waybackpack -d temp/wayback/covid-19-current-cases --from-date "$FROM_DATE" --uniques-only --raw https://www.health.govt.nz/covid-19-novel-coronavirus/covid-19-data-and-statistics/covid-19-current-cases 
waybackpack -d temp/wayback/covid-19-case-demographics --from-date "$FROM_DATE" --uniques-only --raw https://www.health.govt.nz/covid-19-novel-coronavirus/covid-19-data-and-statistics/covid-19-case-demographics
waybackpack -d temp/wayback/covid-19-source-cases --from-date "$FROM_DATE" --uniques-only --raw https://www.health.govt.nz/covid-19-novel-coronavirus/covid-19-data-and-statistics/covid-19-source-cases 
waybackpack -d temp/wayback/testing-covid-19 --from-date "$FROM_DATE" --uniques-only --raw https://www.health.govt.nz/covid-19-novel-coronavirus/covid-19-data-and-statistics/testing-covid-19
waybackpack -d temp/wayback/covid-19-vaccine-data --from-date "$FROM_DATE" --uniques-only --raw https://www.health.govt.nz/covid-19-novel-coronavirus/covid-19-data-and-statistics/covid-19-vaccine-data 