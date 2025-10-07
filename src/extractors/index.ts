import { writeFileSync } from 'fs';
import items from './items';
import addresses from './addresses';

writeFileSync(import.meta.dirname + '/../lib/data/items.json', JSON.stringify(items));
writeFileSync(import.meta.dirname + '/../lib/data/addresses.json', JSON.stringify(addresses));
