import { readFileSync } from 'fs';
import reduce from './lib/reduce';

interface item {
	id: string;
	name: string;
	itemNo: number;
	category: string;
}

const items: Array<item> = [];

const NAMES = readFileSync(
	import.meta.dirname + '/../../sourcrystal/data/items/names.asm',
	'utf-8'
).split('\n');

for (let lineNo = 0; lineNo < NAMES.length; lineNo++) {
	if (NAMES[lineNo].includes('NUM_ITEMS')) {
		break;
	}
	if (NAMES[lineNo].includes('li ')) {
		if (NAMES[lineNo].includes('TERU')) {
			continue;
		}
		items.push({
			id: reduce(NAMES[lineNo].split('"')[1]),
			name: NAMES[lineNo].split('"')[1],
			itemNo: lineNo - 2,
			category: ''
		});
	}
}

const ATTRIBUTES = readFileSync(
	import.meta.dirname + '/../../sourcrystal/data/items/attributes.asm',
	'utf-8'
).split('\n');

for (let lineNo = 0; lineNo < ATTRIBUTES.length; lineNo++) {
	if (ATTRIBUTES[lineNo].includes(';')) {
		const id = reduce(ATTRIBUTES[lineNo].slice(2).trim());
		const item = items.find((item) => item.id === id);
		if (item) {
			item.category = ATTRIBUTES[lineNo + 1].split(',').at(4)!.trim();
		}
	}
}

export default items;
