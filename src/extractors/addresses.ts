import { readdirSync, readFileSync } from 'fs';

const SYMBOLS = [
	'sNewBoxMons1',
	'sNewBoxMons2',
	'sBackupNewBox1',
	'sBackupPlayerData',
	'sChecksum',
	'sBackupChecksum',
	'sBackupGameData',
	'sBackupGameDataEnd'
];
const addresses: Record<string, string> = {};

let ADDRESSES: Array<string> = [];
for (const filename of readdirSync(import.meta.dirname + '/../../')) {
	if (filename.endsWith('.sym')) {
		ADDRESSES = readFileSync(import.meta.dirname + '/../../' + filename, 'utf-8').split('\n');
	}
}

//Converts wRAM address to sRAM
const wToSRAM = (address: string): string => {
	//M = (0x2000 * PP) + (QQQQ - 0xA000), where the original memory address was PP:QQQQ
	return (8192 * parseInt(address.slice(0, 2), 16) + (parseInt(address.slice(2), 16) - 40960))
		.toString(16)
		.padStart(4, '0');
};

for (const entry of SYMBOLS) {
	const address = ADDRESSES.find((address) => address.includes(entry))!;
	addresses[entry] = wToSRAM(address.split(' ').at(0)!.replace(':', ''));
}

export default addresses;
