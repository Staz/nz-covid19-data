#! /bin/bash
grep -e '^NZL,' -e '^iso_code,' "$1" > "$(dirname $1)/owid-covid-data-nz.csv"
rm "$1"