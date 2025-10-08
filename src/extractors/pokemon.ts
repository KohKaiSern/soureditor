import { readFileSync } from 'fs';
import reduce from './lib/reduce';

interface mon {
	id: string;
	name: string;
	dexNo: number;
	bsts: Array<number>;
	types: Array<string>;
	hasGender: boolean;
	growthRate: string;
}

const pokemon: Array<mon> = [];

const NAMES = readFileSync(
	import.meta.dirname + '/../../sourcrystal/data/pokemon/names.asm',
	'utf-8'
).split('\n');

for (let lineNo = 0; lineNo < NAMES.length; lineNo++) {
	if (NAMES[lineNo].includes('db ')) {
		pokemon.push({
			id: reduce(NAMES[lineNo].split('"').at(1)!.replaceAll('@', '')),
			name: NAMES[lineNo].split('"').at(1)!.replaceAll('@', ''),
			dexNo: lineNo - 1,
			bsts: [],
			types: [],
			hasGender: false,
			growthRate: ''
		});
	}
}

export default pokemon;
