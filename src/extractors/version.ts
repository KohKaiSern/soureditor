import { parseRead } from './utils';

function extractVersion(VERSION: string[]): { version: string } {
  const lineNo = VERSION.findIndex((line) => line === '.VersionString');
  return { version: VERSION[lineNo + 1].split('"').at(1)! };
}

const VERSION = await parseRead('engine/menus/main_menu.asm');
const version: { version: string } = extractVersion(VERSION);

export default version;
