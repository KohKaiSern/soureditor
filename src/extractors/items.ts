import { readFileSync } from 'fs';
import reduce from './lib/reduce';

interface item {
	id: string;
	name: string;
	itemNo: number;
	category: string;
}

const items: Array<item> = [];

const names = readFileSync(
	import.meta.dirname + '/../../sourcrystal/data/items/names.asm',
	'utf-8'
).split('\n');

for (let lineNo = 0; lineNo < names.length; lineNo++) {
	if (names[lineNo].includes('NUM_ITEMS')) {
		break;
	}
	if (names[lineNo].includes('li ')) {
		if (names[lineNo].includes('TERU')) {
			continue;
		}
		items.push({
			id: reduce(names[lineNo].split('"')[1]),
			name: names[lineNo].split('"')[1],
			itemNo: lineNo - 2,
			category: ''
		});
	}
}

const attributes = readFileSync(
	import.meta.dirname + '/../../sourcrystal/data/items/attributes.asm',
	'utf-8'
).split('\n');

for (let lineNo = 0; lineNo < attributes.length; lineNo++) {
	if (attributes[lineNo].includes(';')) {
		const id = reduce(attributes[lineNo].slice(2).trim());
		const item = items.find((item) => item.id === id);
		if (item) {
			item.category = attributes[lineNo + 1].split(',').at(4)!.trim();
		}
	}
}

export default items;
