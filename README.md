# nz-covid19-data

Some gotchas I found when playing with [Github flat data](https://github.com/marketplace/actions/flat-data)

* The directories in the `downloaded_filename` path must already exist. They aren't created by the action. I was forced to create empty directories (apart from a README.md)

* Any paths in the postprocessing scripts must be relative to the repository root.

* Can't specify an alternative authorization header (something other than `Authorization:`) **and** use secrets.
