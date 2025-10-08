import { readFileSync } from 'fs';
import reduce from './lib/reduce';

const growthRateCoefficients: Record<string, Array<number>> = {};

const GROWTH_RATES = readFileSync(
	import.meta.dirname + '/../../sourcrystal/data/growth_rates.asm',
	'utf-8'
).split('\n');

for (let lineNo = 0; lineNo < GROWTH_RATES.length; lineNo++) {
	if (GROWTH_RATES[lineNo].trim().startsWith('growth_rate')) {
		const name = reduce(GROWTH_RATES[lineNo].split(';').at(1)!.trim());
		growthRateCoefficients[name] = GROWTH_RATES[lineNo]
			.split(';')
			.at(0)!
			.slice(13)
			.split(',')
			.map((entry) => parseInt(entry.trim()));
	}
}

export default growthRateCoefficients;
