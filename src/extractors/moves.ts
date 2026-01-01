import { extractDescs, extractIDs, extractNames } from './common';
import type { Move } from './types';
import { parseRead } from './utils';

function extractAttrs(moves: Move[], ATTRS: string[]): Move[] {
  let index = 1;
  for (let lineNo = 0; lineNo < ATTRS.length; lineNo++) {
    if (!ATTRS[lineNo].startsWith('move')) continue;
    const move = moves.find((m) => m.index === index);
    const attrs = ATTRS[lineNo]
      .split(',')
      .slice(2)
      .map((s) => s.trim());
    if (move) {
      move.basePower = parseInt(attrs[0]);
      move.type = attrs[1];
      move.accuracy = parseInt(attrs[2]);
      move.powerPoints = parseInt(attrs[3]);
      move.effectChance = parseInt(attrs[4]);
    }
    index++;
  }
  return moves;
}

const files = await Promise.all(
  [
    'constants/move_constants.asm',
    'data/moves/names.asm',
    'data/moves/descriptions.asm',
    'data/moves/moves.asm'
  ].map((f) => parseRead(f))
);

const NULL_MOVE: Move = {
  id: null,
  index: -1,
  name: '',
  description: '',
  basePower: -1,
  type: '',
  accuracy: -1,
  powerPoints: -1,
  effectChance: -1
};

let moves: Move[] = [];
moves = extractIDs(moves, files[0], NULL_MOVE, undefined, 'DEF NUM_ATTACKS');
moves = extractNames(moves, files[1], 1);
moves = extractDescs(moves, files[2], 1);
moves = extractAttrs(moves, files[3]);

export default moves;
