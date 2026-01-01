import type { Bag, Item } from "$parsers/types"
import items from '$data/items.json'
import addresses from '$data/addresses.json'
import { insert } from "$parsers/utils";

function reverseParseBag(file: Uint8Array, bag: Bag): Uint8Array {

  file = reverseParseCountedSlot(file, addresses.wNumItems, bag.items);
  file = reverseParseCountedSlot(file, addresses.wNumBalls, bag.balls);
  file = reverseParseCountedSlot(file, addresses.wNumBerries, bag.berries);

  file[addresses.wNumKeyItems] = bag.keyItems.length;
  for (let i = 0; i < bag.keyItems.length; i++) {
    file[addresses.wNumKeyItems + 1 + i] = items.find(item => item.name === bag.keyItems[i].name)!.index
  }
  file[addresses.wNumKeyItems + 1 + bag.keyItems.length] = 0xFF;

  for (let i = 0; i < 57; i++) {
    file[addresses.wTMsHMs + i] = bag.TMsHMs[i].qty;
  }

  file = insert(file, addresses.wCoins, 2, bag.coins[0].qty)

  file[addresses.wBlueCardBalance] = bag.blueCard[0].qty;

  return file
}

const reverseParseCountedSlot = (file: Uint8Array, address: number, slot: Item[]): Uint8Array => {
  file[address] = slot.length;
  for (let i = 0; i < slot.length; i++) {
    file[address + 1 + i * 2] = items.find(item => item.name === slot[i].name)!.index
    file[address + 2 + i * 2] = slot[i].qty
  }
  file[address + 1 + slot.length * 2] = 0xFF;
  return file
};

export default reverseParseBag
