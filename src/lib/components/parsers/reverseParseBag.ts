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
		fileHex[address] = bag[slot].count!.toString(16).padStart(2, '0');
		if (slot === 'keyItems') {
			for (let i = 0; i < capacity; i++) {
				if (i < bag[slot].count!) {
					fileHex[address + i + 1] = items
						.find((item) => item.name === bag.keyItems.contents[i].name)!
						.itemNo.toString(16)
						.padStart(2, '0');
				} else {
					fileHex[address + i + 1] = 'FF';
					for (let j = 1; j < capacity - bag[slot].count!; j++) {
						fileHex[address + i + 1 + j] = '00';
					}
					break;
				}
			}
			address += capacity + 2;
			if (bag[slot].count! === capacity) {
				fileHex[address - 1] = 'FF';
			}
			continue;
		}
		for (let i = 0; i < capacity; i++) {
			if (i < bag[slot].count!) {
				fileHex[address + 2 * i + 1] = items
					.find((item) => item.name === bag[slot].contents[i].name)!
					.itemNo.toString(16)
					.padStart(2, '0');
				fileHex[address + 2 * (i + 1)] = bag[slot].contents[i].qty.toString(16).padStart(2, '0');
			} else {
				fileHex[address + 2 * i + 1] = 'FF';
				for (let j = 1; j < capacity - bag[slot].count!; j++) {
					fileHex[address + 2 * i + 1 + j] = '00';
				}
				break;
			}
		}
		address += capacity * 2 + 2;
		if (bag[slot].count! === capacity) {
			fileHex[address - 1] = 'FF';
		}
	}
	return fileHex;
};

export default reverseParseBag;
