#! /bin/bash
waybackpack -d temp/wayback/covid-19-current-cases --uniques-only --raw https://www.health.govt.nz/covid-19-novel-coronavirus/covid-19-data-and-statistics/covid-19-current-cases 
waybackpack -d temp/wayback/covid-19-case-demographics --uniques-only --raw https://www.health.govt.nz/our-work/diseases-and-conditions/covid-19-novel-coronavirus/covid-19-data-and-statistics/covid-19-case-demographics 
waybackpack -d temp/wayback/covid-19-source-cases --uniques-only --raw https://www.health.govt.nz/covid-19-novel-coronavirus/covid-19-data-and-statistics/covid-19-source-cases 
waybackpack -d temp/wayback/testing-covid-19 --uniques-only --raw https://www.health.govt.nz/covid-19-novel-coronavirus/covid-19-data-and-statistics/testing-covid-19
waybackpack -d temp/wayback/covid-19-vaccine-data --uniques-only --raw https://www.health.govt.nz/covid-19-novel-coronavirus/covid-19-data-and-statistics/covid-19-vaccine-data 