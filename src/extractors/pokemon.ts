import { readFileSync, readdirSync } from 'fs';
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
	if (lineNo > 252) {
		break;
	}
	if (NAMES[lineNo].includes('db ')) {
		pokemon.push({
			id: reduce(NAMES[lineNo].split('"').at(1)!.replaceAll('@', '')),
			name: NAMES[lineNo].split('"').at(1)!.replaceAll('@', ''),
			dexNo: lineNo - 1,
			bsts: [],
			types: [],
			hasGender: true,
			growthRate: ''
		});
	}
}

const BASE_STATS_DIR = readdirSync(
	import.meta.dirname + '/../../sourcrystal/data/pokemon/base_stats'
);

for (let filename of BASE_STATS_DIR) {
	const MON = readFileSync(
		import.meta.dirname + '/../../sourcrystal/data/pokemon/base_stats/' + filename,
		'utf-8'
	).split('\n');
	for (let lineNo = 0; lineNo < MON.length; lineNo++) {
		const id = reduce(MON[0].split(' ').at(1)!);
		const mon = pokemon.find((pokemon) => pokemon.id === id);
		if (mon) {
			mon.bsts = MON[2]
				.slice(5)
				.split(',')
				.map((stat) => parseInt(stat));
			mon.types = MON[5]
				.split(' ')
				.slice(1, 3)
				.map((type) => type.replaceAll('_TYPE', ''));
			mon.types[0] = mon.types.at(0)!.slice(0, -1);
			if (MON[9].includes('GENDER_UNKNOWN')) {
				mon.hasGender = false;
			}
			mon.growthRate = MON[15].split(' ').at(1)!.replace('GROWTH_', '');
		}
	}
}

export default pokemon;
