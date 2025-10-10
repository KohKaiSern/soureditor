import { type Mon, type BagSlot } from '$lib/types';
import { parseMonAddresses, parseMon, parseBag } from '$lib/components/parsers';

export const parseSave = (fileHex: Array<string>): [Mon[][], Record<string, BagSlot>] => {
	const monAddresses = parseMonAddresses(fileHex);

	const mons: Mon[][] = Array(16)
		.fill(null)
		.map(() => Array(20).fill(null));

	for (let box = 0; box < 16; box++) {
		for (let i = 0; i < 20; i++) {
			if (monAddresses[box][i] === null) {
				continue;
			}
			mons[box][i] = parseMon(fileHex, monAddresses[box][i]);
		}
	}

	const bag: Record<string, BagSlot> = parseBag(fileHex);

	return [mons, bag];
};

export default parseSave;
