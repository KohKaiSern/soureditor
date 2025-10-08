import { writeFileSync } from 'fs';
import items from './items';
import addresses from './addresses';
import moves from './moves';
import pokemon from './pokemon';
import version from './version';
import growthRateCoefficients from './growthRateCoefficients';

writeFileSync(import.meta.dirname + '/../lib/data/items.json', JSON.stringify(items));
writeFileSync(import.meta.dirname + '/../lib/data/addresses.json', JSON.stringify(addresses));
writeFileSync(import.meta.dirname + '/../lib/data/moves.json', JSON.stringify(moves));
writeFileSync(import.meta.dirname + '/../lib/data/pokemon.json', JSON.stringify(pokemon));
writeFileSync(import.meta.dirname + '/../lib/data/version.json', JSON.stringify(version));
writeFileSync(
	import.meta.dirname + '/../lib/data/growthRateCoefficients.json',
	JSON.stringify(growthRateCoefficients)
);
