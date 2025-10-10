import type { BagSlot } from '$lib/types';
import { addresses, items } from '$data';

export const parseBag = (fileHex: string[]): Record<string, BagSlot> => {
	const SLOT_SIZES: Record<string, number> = {
		items: 20,
		keyItems: 25,
		balls: 12,
		berries: 17
	};
	const bag: Record<string, BagSlot> = {};
	let address = parseInt(addresses.sBackupPlayerData, 16) + 1047;
	for (const [slot, capacity] of Object.entries(SLOT_SIZES)) {
		const count = parseInt(fileHex[address], 16);
		const contents = [];
		if (slot === 'keyItems') {
			console.log(fileHex[address], address);
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
		console.log(bag);
		address += capacity * 2 + 2;
	}
	return bag;
};

//
// const BAG_CATEGORIES: Record<string, BagCategory> = {
//   items: { offset: 0, size: 20 },
//   balls: { offset: 69, size: 12 },
//   keyItems: { offset: 228, size: 25 },
//   berries: { offset: 280, size: 17 }
// };
//
// const parseBagCategory = (
//   fileHex: string[],
//   baseAddress: number,
//   offset: number,
//   size: number
// ): BagSlot => {
//   const address = baseAddress + offset;
//   const count = parseInt(fileHex[address], 16);
//   const contents = Array(size)
//     .fill(null)
//     .map(() => ({ name: '', qty: 0 }));
//
//   for (let i = 0; i < count; i++) {
//     const itemNo = parseInt(fileHex[address + 2 * i + 1], 16);
//     const name = items.find((item) => item.itemNo === itemNo)!.name;
//     const qty = parseInt(fileHex[address + 2 * (i + 1)], 16);
//     contents[i] = { name, qty };
//   }
//   return { count, contents };
// };
//
// export const parseBag = (fileHex: string[]): Record<string, BagSlot> => {
//
//   const baseAddress = parseInt(addresses.sBackupPlayerData, 16) + 1047;
//
//   return Object.fromEntries(
//     Object.entries(BAG_CATEGORIES).map(([key, { offset, size }]) => [
//       key,
//       parseBagCategory(fileHex, baseAddress, offset, size)
//     ])
//   );
// };

export default parseBag;
