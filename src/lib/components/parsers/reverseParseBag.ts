import type { BagSlot } from '$lib/types';
import { items, addresses } from '$data';

export const reverseParseBag = (fileHex: string[], bag: Record<string, BagSlot>): string[] => {
	const SLOT_SIZES: Record<string, number> = {
		TMsHMs: 57,
		items: 20,
		keyItems: 25,
		balls: 12,
		berries: 17
	};
	let address = parseInt(addresses.sBackupPlayerData, 16) + 990;
	for (const [slot, capacity] of Object.entries(SLOT_SIZES)) {
		if (slot === 'TMsHMs') {
			for (let i = 0; i < capacity; i++) {
				if (bag.TMsHMs.contents[i].qty === 1) {
					fileHex[address + i] = '01';
				} else {
					fileHex[address + i] = '00';
				}
			}
			address += 57;
			continue;
		}
		if (slot === 'berries') {
			address -= 503;
		}
		const count = parseInt(fileHex[address], 16);
		if (slot === 'keyItems') {
			for (let i = 0; i < count; i++) {
				fileHex[address + i + 1] = items
					.find((item) => item.name === bag.keyItems.contents[i].name)!
					.itemNo.toString(16)
					.padStart(2, '0');
			}
			address += capacity + 2;
			continue;
		}
		for (let i = 0; i < count; i++) {
			fileHex[address + 2 * i + 1] = items
				.find((item) => item.name === bag[slot].contents[i].name)!
				.itemNo.toString(16)
				.padStart(2, '0');
			fileHex[address + 2 * (i + 1)] = bag[slot].contents[i].qty.toString(16).padStart(2, '0');
		}
		address += capacity * 2 + 2;
	}
	return fileHex;
};

export default reverseParseBag;
