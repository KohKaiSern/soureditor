import type { BagSlot } from '$lib/types';
import { addresses, items } from '$data';

interface BagCategory {
  offset: number;
  size: number;
}

const BAG_CATEGORIES: Record<string, BagCategory> = {
  items: { offset: 0, size: 75 },
  meds: { offset: 152, size: 37 },
  balls: { offset: 228, size: 25 },
  berries: { offset: 280, size: 31 }
};

const parseBagCategory = (
  fileHex: string[],
  baseAddress: number,
  offset: number,
  size: number
): BagSlot => {
  const address = baseAddress + offset;
  const count = parseInt(fileHex[address], 16);
  const contents = Array(size)
    .fill(null)
    .map(() => ({ name: '', qty: 0 }));

  for (let i = 0; i < count; i++) {
    const itemNo = parseInt(fileHex[address + 2 * i + 1], 16);
    const name = items.find((item) => item.itemNo === itemNo)!.name;
    const qty = parseInt(fileHex[address + 2 * (i + 1)], 16);
    contents[i] = { name, qty };
  }
  return { count, contents };
};

export const parseBag = (fileHex: string[]): Record<string, BagSlot> => {

  const baseAddress = parseInt(addresses.sBackupPlayerData, 16) + 1047;

  return Object.fromEntries(
    Object.entries(BAG_CATEGORIES).map(([key, { offset, size }]) => [
      key,
      parseBagCategory(fileHex, baseAddress, offset, size)
    ])
  );
};

export default parseBag;
