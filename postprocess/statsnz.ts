import { readJSON, writeJSON } from 'https://deno.land/x/flat@0.0.15/mod.ts';

const inputFileName = Deno.args[0];
const json = await readJSON(inputFileName);

await writeJSON(inputFileName, json.value);
