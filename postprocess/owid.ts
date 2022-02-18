const bash_run = Deno.run({
  cmd: ['./postprocess/owid.sh'].concat(Deno.args),
});

await bash_run.status();
