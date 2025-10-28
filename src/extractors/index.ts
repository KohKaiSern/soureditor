import { writeFileSync } from 'fs';
import items from './items';
import addresses from './addresses';
import moves from './moves';
import pokemon from './pokemon';
import version from './version';
import growthRateCoefficients from './growthRateCoefficients';
import tmhm from './tmhm';

const PATH = import.meta.dirname + '/../../src/lib/data/';

writeFileSync(PATH + 'items.json', JSON.stringify(items));
writeFileSync(PATH + 'addresses.json', JSON.stringify(addresses));
writeFileSync(PATH + 'moves.json', JSON.stringify(moves));
writeFileSync(PATH + 'pokemon.json', JSON.stringify(pokemon));
writeFileSync(PATH + 'version.json', JSON.stringify(version));
writeFileSync(PATH + 'growthRateCoefficients.json', JSON.stringify(growthRateCoefficients));
writeFileSync(PATH + 'tmhm.json', JSON.stringify(tmhm));
