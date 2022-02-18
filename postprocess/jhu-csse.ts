let script: string;
if (Deno.args[0].includes('deaths')) {
  script = 'jhu-csse-deaths.sh';
} else {
  script = 'jhu-csse-cases.sh';
}

const bash_run = Deno.run({
  cmd: [`./postprocess/${script}`].concat(Deno.args),
});

await bash_run.status();
