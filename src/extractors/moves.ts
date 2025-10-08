import { readFileSync } from 'fs';
import reduce from './lib/reduce';

interface move {
	id: string;
	name: string;
	moveNo: number;
	description: string;
	basePower: number;
	type: string;
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
			type: '',
			accuracy: -1,
			powerPoints: -1,
			effectChance: -1
		});
	}
}

const DESCS = readFileSync(
	import.meta.dirname + '/../../sourcrystal/data/moves/descriptions.asm',
	'utf-8'
)
	.replaceAll('#MON', 'POKéMON')
	.split('\n');

for (let lineNo = 0; lineNo < DESCS.length; lineNo++) {
	if (DESCS[lineNo].endsWith('Description:')) {
		let id = reduce(DESCS[lineNo].replace('Description:', ''));
		if (id === 'psychicm') {
			id = 'psychic';
		}
		if (id === 'faintattack') {
			id = 'feintattack';
		}
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

const MOVES = readFileSync(
	import.meta.dirname + '/../../sourcrystal/data/moves/moves.asm',
	'utf-8'
).split('\n');

for (let lineNo = 0; lineNo < MOVES.length; lineNo++) {
	if (MOVES[lineNo].startsWith('\tmove ')) {
		const MOVE_DATA = MOVES[lineNo].split(',').map((entry) => entry.trim());
		let id = MOVE_DATA.at(0)!.slice(5);
		if (id.endsWith('_M')) {
			id = id.slice(0, -2);
		}
		id = reduce(id);
		const move = moves.find((move) => move.id === id);
		if (move) {
			move.basePower = parseInt(MOVE_DATA.at(2)!);
			move.type = MOVE_DATA.at(3)!.replace('_TYPE', '');
			move.accuracy = parseInt(MOVE_DATA.at(4)!);
			move.powerPoints = parseInt(MOVE_DATA.at(5)!);
			move.effectChance = parseInt(MOVE_DATA.at(6)!);
		}
	}
}

export default moves;
