/** All required remote dependencies are referenced in this file and the required methods
 * and classes are re-exported. The dependent local modules then reference the deps.ts rather
 * than the remote dependencies. If now for example one remote dependency is used in several files,
 * upgrading to a new version of this remote dependency is much simpler as this can be done just
 * within deps.ts.
 */

export { default as cheerio } from 'https://esm.sh/cheerio@1.0.0-rc.10';

export { default as dayjs } from 'https://cdn.skypack.dev/dayjs@1.10.7?dts';
export { default as customParseFormat } from 'https://cdn.skypack.dev/dayjs/plugin/customParseFormat@1.10.7?dts';
