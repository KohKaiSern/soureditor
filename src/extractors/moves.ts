import { readFileSync } from 'fs';
import reduce from './lib/reduce';

interface move {
	id: string;
	name: string;
	moveNo: number;
	basePower: number;
	accuracy: number;
	powerPoints: number;
	effectChance: number;
}

const moves: Array<move> = [];

const NAMES = readFileSync(
	import.meta.dirname + '/../../sourcrystal/data/moves/names.asm',
	'utf-8'
).split('\n');

for (let lineNo = 0; lineNo < NAMES.length; lineNo++) {
	if (NAMES[lineNo].includes('li ')) {
		moves.push({
			id: reduce(NAMES[lineNo].slice(5, -1)),
			name: NAMES[lineNo].slice(5, -1),
			moveNo: lineNo - 1,
			basePower: -1,
			accuracy: -1,
			powerPoints: -1,
			effectChance: -1
		});
	}
}

export default moves;
