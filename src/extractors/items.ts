import { extractDescs, extractIDs, extractNames } from './common';
import type { Item } from './types';
import { parseRead } from './utils';

function extractAttrs(items: Item[], ATTRS: string[]): Item[] {
  let index = 1;
  for (let lineNo = 0; lineNo < ATTRS.length; lineNo++) {
    if (ATTRS[lineNo].includes('NUM_ITEMS')) break;
    if (!ATTRS[lineNo].startsWith('item_attribute')) continue;
    const item = items.find((i) => i.index === index);
    if (item) {
      item.category = ATTRS[lineNo].split(',').at(4)!.trim();
    }
    index++;
  }
  return items;
}

const files = await Promise.all(
  [
    'constants/item_constants.asm',
    'data/items/names.asm',
    'data/items/descriptions.asm',
    'data/items/attributes.asm'
  ].map((f) => parseRead(f))
);

const NULL_ITEM: Item = {
  id: null,
  index: -1,
  name: '',
  description: '',
  category: ''
};

let items: Item[] = [];
items = extractIDs(items, files[0], NULL_ITEM, undefined, 'DEF NUM_ITEMS');
items = extractNames(items, files[1], 1, undefined, 'NUM_ITEMS');
items = extractDescs(items, files[2], 1, undefined, 'NUM_ITEMS');
items = extractAttrs(items, files[3]);

export default items;
