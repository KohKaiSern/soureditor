import { readFileSync } from 'fs';

let version = '';

const MAIN_MENU = readFileSync(
	import.meta.dirname + '/../../sourcrystal/engine/menus/main_menu.asm',
	'utf-8'
).split('\n');

for (let lineNo = 0; lineNo < MAIN_MENU.length; lineNo++) {
	if (MAIN_MENU[lineNo].trim().startsWith('.VersionString')) {
		version = MAIN_MENU[lineNo + 1].split('"').at(1)!.slice(1, -1);
		break;
	}
}

export default version;
