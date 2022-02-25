import { join } from 'https://deno.land/std@0.127.0/path/mod.ts';
import { exists } from '../utils.ts';
import { scrapeTablesFromHtml } from './common.ts';

const isDirectory = (path: string) => {
  try {
    const stat = Deno.statSync(path);
    return stat.isDirectory;
  } catch {
    return false;
  }
};

if (Deno.args.length < 1) {
  console.error('No argument provided');
  Deno.exit(1);
}

const inputPath = Deno.args[0];

if (!(await exists(inputPath))) {
  console.error('Input file/directory does not exist');
  Deno.exit(1);
}

if (isDirectory(inputPath)) {
  const directoryContents = Deno.readDirSync(inputPath);

  for (const item of directoryContents) {
    const itemPath = join(inputPath, item.name);
    if (item.name.endsWith('.html')) {
      scrapeTablesFromHtml(itemPath);
      console.log('-------------');
    }
  }
} else {
  scrapeTablesFromHtml(inputPath);
}
