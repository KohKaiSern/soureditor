import { parseRead } from './utils';

function extractCharmap(CHARMAP: string[]): Record<string, string> {
  const charmap: Record<string, string> = {};
  let lineNo = 0;
  while (!CHARMAP[lineNo].includes('$80')) lineNo++;
  for (; lineNo < CHARMAP.length; lineNo++) {
    if (CHARMAP[lineNo].includes('$18')) break;
    if (!CHARMAP[lineNo].startsWith('charmap')) continue;
    const char = CHARMAP[lineNo].split('"').at(1);
    const key = CHARMAP[lineNo].split('$').at(1);
    if (char && key) {
      if (parseInt(key, 16) < 127) continue;
      charmap[key.slice(0, 2).toUpperCase()] = char;
    }
  }
  return charmap;
}

const CHARMAP = await parseRead('constants/charmap.asm');

const charmap = extractCharmap(CHARMAP);

export default charmap;
