import { extractIDs } from './common';
import type { GrowthRate } from './types';
import { parseRead } from './utils';

function extractCFs(growthRates: GrowthRate[], CFS: string[]): GrowthRate[] {
  let index = 0;
  for (let lineNo = 0; lineNo < CFS.length; lineNo++) {
    if (!CFS[lineNo].startsWith('growth_rate')) continue;
    growthRates.find((g) => g.index === index)!.coefficients = CFS[lineNo]
      .match(/-?\d+/g)!
      .slice(0, 5)
      .map(Number);
    index++;
  }
  return growthRates;
}

const files = await Promise.all(
  ['constants/pokemon_data_constants.asm', 'data/growth_rates.asm'].map((f) => parseRead(f))
);

const NULL_GROWTHRATE: GrowthRate = {
  id: null,
  index: -1,
  coefficients: []
};

let growthRates: GrowthRate[] = [];
growthRates = extractIDs(
  growthRates,
  files[0],
  NULL_GROWTHRATE,
  'DEF GENDER_UNKNOWN',
  'NUM_GROWTH_RATES'
);
growthRates = extractCFs(growthRates, files[1]);

export default growthRates;
