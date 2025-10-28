import reduce from './lib/reduce';
import { readFileSync } from 'fs';
import moves from '../lib/data/moves.json';

const tmhm: Record<string, string> = {};

const TMHM = readFileSync(
  import.meta.dirname + '/../../sourcrystal/constants/item_constants.asm',
  'utf-8'
)
  .replaceAll('PSYCHIC_M', 'PSYCHIC')
  .split('\n');

let tmNo = 1;
let hmNo = 1;
for (let lineNo = 0; lineNo < TMHM.length; lineNo++) {
  if (TMHM[lineNo].includes('add_tm ')) {
    tmhm[`TM${tmNo.toString().padStart(2, '0')}`] = moves.find(
      (move) => move.id === reduce(TMHM[lineNo].match(/[A-Z][A-Z_]+/)!.at(0)!)
    )!.name;
    tmNo++;
  }
  if (TMHM[lineNo].includes('add_hm ')) {
    tmhm[`HM0${hmNo.toString()}`] = moves.find(
      (move) => move.id === reduce(TMHM[lineNo].match(/[A-Z][A-Z_]+/)!.at(0)!)
    )!.name;
    hmNo++;
  }
}

export default tmhm;
