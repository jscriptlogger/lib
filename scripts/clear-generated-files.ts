import fs from 'fs';
import * as glob from 'glob';
import path from 'path';

for (const f of [
  ...glob.sync([
    path.resolve(__dirname, '../src/**/*.{js,map,d.ts}'),
    path.resolve(__dirname, '../test/**/*.{js,map,d.ts}'),
  ]),
  path.resolve(__dirname, '../src/tsconfig.tsbuildinfo'),
  path.resolve(__dirname, '../test/tsconfig.tsbuildinfo'),
]) {
  if (fs.existsSync(f)) {
    console.log('removing: %s', f);
    fs.unlinkSync(f);
  }
}
