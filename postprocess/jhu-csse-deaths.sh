#! /bin/bash
grep -e '^,New Zealand' -e '^Province/State' "$1" > "$(dirname $1)/time_series_covid19_deaths_nz.csv"
rm "$1"