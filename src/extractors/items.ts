import { readFileSync } from 'fs';
import reduce from './lib/reduce';

interface item {
	id: string;
	name: string;
	itemNo: number;
	category: string;
	description: string;
}

const items: Array<item> = [];

const NAMES = readFileSync(
	import.meta.dirname + '/../../sourcrystal/data/items/names.asm',
	'utf-8'
).split('\n');

let itemNo = 1;
for (let lineNo = 0; lineNo < NAMES.length; lineNo++) {
	if (NAMES[lineNo].includes('li ')) {
		if (NAMES[lineNo].includes('TERU') || NAMES[lineNo].includes('?')) {
			itemNo += 1;
			continue;
		}
		items.push({
			id: reduce(NAMES[lineNo].split('"')[1]),
			name: NAMES[lineNo].split('"')[1],
			itemNo: itemNo,
			category: '',
			description: ''
		});
		itemNo += 1;
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

const DESCS = readFileSync(
	import.meta.dirname + '/../../sourcrystal/data/items/descriptions.asm',
	'utf-8'
).split('\n');

for (let lineNo = 0; lineNo < DESCS.length; lineNo++) {
	if (DESCS[lineNo].includes('Desc:')) {
		const id = reduce(DESCS[lineNo].replace('Desc:', ''));
		let description = '';
		lineNo++;
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
		description = description.slice(0, -2).replaceAll('#', 'POKé');
		const item = items.find((item) => item.id === id);
		if (item) {
			item.description = description;
		}
	}
}
export default items;
