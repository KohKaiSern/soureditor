import { parseRead } from './utils';
import moves from './moves';

const TMHMS = await parseRead('constants/item_constants.asm');
const tmhms: Record<string, string> = {};

let tmNo = 1;
let hmNo = 1;
for (let lineNo = 0; lineNo < TMHMS.length; lineNo++) {
  if (TMHMS[lineNo].includes('add_tm ')) {
    tmhms[`TM${tmNo.toString().padStart(2, '0')}`] = moves.find(
      (m) => m.id === TMHMS[lineNo].match(/[A-Z][A-Z_]+/)!.at(0)!
    )!.name;
    tmNo++;
  }
  if (TMHMS[lineNo].includes('add_hm ')) {
    tmhms[`HM0${hmNo.toString()}`] = moves.find(
      (m) => m.id === TMHMS[lineNo].match(/[A-Z][A-Z_]+/)!.at(0)!
    )!.name;
    hmNo++;
  }
}

export default tmhms;
