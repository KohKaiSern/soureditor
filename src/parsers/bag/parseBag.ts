import type { Bag, Item } from "$parsers/types";
import items from '$data/items.json'
import addresses from "$data/addresses.json";
import { retrieve } from "$parsers/utils";

function parseBag(file: Uint8Array): Bag {

  const bag: Bag = {}

  const parseCountedSlot = (address: number): Item[] => {
    const count = file[address]
    const contents: Item[] = [];
    for (let i = 0; i < count; i++) {
      contents.push({
        name: items.find((item) => item.index === file[address + 1 + i * 2])!
          .name,
        qty: file[address + 2 + i * 2]
      })
    }
    return contents;
  };

  bag.items = parseCountedSlot(addresses.wNumItems);
  bag.balls = parseCountedSlot(addresses.wNumBalls);
  bag.berries = parseCountedSlot(addresses.wNumBerries);

  bag.keyItems = [];
  const count = file[addresses.wNumKeyItems]
  for (let i = 0; i < count; i++) {
    bag.keyItems.push({
      name: items.find(
        (item) => item.index === file[addresses.wNumKeyItems + 1 + i])!.name,
      qty: 1
    });
  }

  bag.TMsHMs = [];
  for (let i = 0; i < 57; i++) {
    bag.TMsHMs.push({
      name: i > 49 ? `HM0${i - 49}` : `TM${(i + 1).toString().padStart(2, '0')}`,
      qty: file[addresses.wTMsHMs + i]
    });
  }

  bag.coins = [{
    name: 'Game Corner Coins',
    qty: retrieve(file, addresses.wCoins, 2)
  }]

  bag.blueCard = [{
    name: 'Blue Card Points',
    qty: file[addresses.wBlueCardBalance]
  }]

  return bag
}

export default parseBag
