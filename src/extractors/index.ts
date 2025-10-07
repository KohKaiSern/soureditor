import { writeFileSync } from 'fs';
import items from './items';

writeFileSync(import.meta.dirname + '/../lib/data/items.json', JSON.stringify(items));
