import type { BagSlot } from '$lib/types';
import { addresses, items } from '$data';

export const parseBag = (fileHex: string[]): Record<string, BagSlot> => {
	const SLOT_SIZES: Record<string, number> = {
		TMsHMs: 57,
		items: 20,
		keyItems: 25,
		balls: 12,
		berries: 17
	};
	const bag: Record<string, BagSlot> = {};
	let address = parseInt(addresses.sBackupPlayerData, 16) + 990;
	for (const [slot, capacity] of Object.entries(SLOT_SIZES)) {
		const contents = [];
		if (slot === 'TMsHMs') {
			for (let i = 0; i < capacity; i++) {
				contents.push({
					name: i > 49 ? `HM0${i - 49}` : `TM${(i + 1).toString().padStart(2, '0')}`,
					qty: fileHex[address + i] === '01' ? 1 : 0
				});
			}
			bag[slot] = { contents };
			address += 57;
			continue;
		}
		if (slot === 'berries') {
			address -= 503;
		}
		const count = parseInt(fileHex[address], 16);
		if (slot === 'keyItems') {
			for (let i = 0; i < count; i++) {
				contents.push({
					name: items.find((item) => item.itemNo === parseInt(fileHex[address + i + 1], 16))!.name,
					qty: 1
				});
			}
			bag[slot] = { count, contents };
			address += capacity + 2;
			continue;
		}
		for (let i = 0; i < count; i++) {
			contents.push({
				name: items.find((item) => item.itemNo === parseInt(fileHex[address + 2 * i + 1], 16))!
					.name,
				qty: parseInt(fileHex[address + 2 * (i + 1)], 16)
			});
		}
		bag[slot] = { count, contents };
		address += capacity * 2 + 2;
	}
	return bag;
};

export default parseBag;
