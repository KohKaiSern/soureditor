import { writeFileSync } from 'fs';
import items from './items';
import addresses from './addresses';
import moves from './moves';
import pokemon from './pokemon';

writeFileSync(import.meta.dirname + '/../lib/data/items.json', JSON.stringify(items));
writeFileSync(import.meta.dirname + '/../lib/data/addresses.json', JSON.stringify(addresses));
writeFileSync(import.meta.dirname + '/../lib/data/moves.json', JSON.stringify(moves));
writeFileSync(import.meta.dirname + '/../lib/data/pokemon.json', JSON.stringify(pokemon));
