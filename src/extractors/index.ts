import { writeJSON } from './utils';
import addresses from './addresses';
import boxThemes from './boxThemes';
import charmap from './charmap';
import growthRates from './growthRates';
import items from './items';
import keyboards from './keyboards';
import locations from './locations';
import moves from './moves';
import pokemon from './pokemon';
import tmhms from './tmhms';
import version from './version';

for (const [name, obj] of Object.entries({
  addresses,
  boxThemes,
  charmap,
  growthRates,
  items,
  keyboards,
  locations,
  moves,
  pokemon,
  tmhms,
  version
})) {
  writeJSON(name, obj);
}
