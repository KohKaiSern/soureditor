import { extractIDs } from './common';
import { parseRead } from './utils';
import type { Location } from './types';

function extractNames(locations: Location[], NAMES: string[]): Location[] {
  let index = 0;
  for (let lineNo = 0; lineNo < NAMES.length; lineNo++) {
    if (!NAMES[lineNo].startsWith('landmark')) continue;
    const ptr = NAMES[lineNo].split(',').at(-1)!.trim() + ':';
    const name = NAMES.find((line) => line.startsWith(ptr))!
      .split('"')
      .at(1)!;
    const location = locations.find((l) => l.index === index);
    if (location) {
      location.name = name;
    }
    index++;
  }
  return locations;
}

const files = await Promise.all(
  ['constants/landmark_constants.asm', 'data/maps/landmarks.asm'].map((f) => parseRead(f))
);

const NULL_LOCATION: Location = {
  id: null,
  index: -1,
  name: ''
};
let locations: Location[] = [];
locations = extractIDs(locations, files[0], NULL_LOCATION, undefined, 'NUM_LANDMARKS');
locations = extractNames(locations, files[1]);
//Special: Event & Gift Pokemon
locations.push({
  id: 'LANDMARK_EVENT',
  index: 0x7F,
  name: 'EVENT'
})
locations.push({
  id: 'LANDMARK_GIFT',
  index: 0x7E,
  name: 'GIFT'
})

export default locations;
