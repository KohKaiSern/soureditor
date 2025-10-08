import { readFileSync } from 'fs';
import reduce from './lib/reduce';

interface move {
	id: string;
	name: string;
	moveNo: number;
	description: string;
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
			description: '',
			basePower: -1,
			accuracy: -1,
			powerPoints: -1,
			effectChance: -1
		});
	}
}

const DESCS = readFileSync(
	import.meta.dirname + '/../../sourcrystal/data/moves/descriptions.asm',
	'utf-8'
).split('\n');

for (let lineNo = 0; lineNo < DESCS.length; lineNo++) {
	if (DESCS[lineNo].endsWith('Description:')) {
		const id = reduce(DESCS[lineNo].replace('Description:', ''));
		lineNo++;
		let description = '';
		while (DESCS[lineNo].includes('"')) {
			description += DESCS[lineNo].split('"').at(1)!;
			if (description.endsWith('-')) {
				description = description.slice(0, -1);
				lineNo++;
				continue;
			}
			description += ' ';
			lineNo++;
		}
		description = description.slice(0, -2);
		const move = moves.find((move) => move.id === id);
		if (move) {
			move.description = description;
		}
	}
}

export default moves;
