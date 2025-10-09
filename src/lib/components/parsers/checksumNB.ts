//This is the file responsible for taking the edited save file and re-calculating & applying all the NewBox checksums.
import { parseMonAddresses } from '$lib/components/parsers';
import { hex2bin } from '$lib/utils';

//Details of the checksum system can be found at:
//https://github.com/SoupPotato/sourcrystal/blob/master/docs/newbox_format.md

//This function calculates and applies the checksum on the save for one pokemon
const calcChecksum = (fileHex: string[], address: number): string[] => {
	//Start with 127
	let x: number | string = 127;
	//For bytes 0-29, add the value times (byte + 1)
	for (let byte = 0; byte <= 29; byte++) {
		x += parseInt(fileHex[address + byte], 16) * (byte + 1);
	}
	//For bytes 30-46, add the value of the lower 7 bits times (byte + 2)
	for (let byte = 30; byte <= 46; byte++) {
		x += parseInt(hex2bin(fileHex[address + byte]).slice(1), 2) * (byte + 2);
	}
	//Clamp to two bytes
	x = x & 0xffff;
	//Treat the two bytes as a series of bits
	x = x.toString(2).padStart(16, '0');
	//Write the most significant bit to byte 30's MSB
	//Continue with the 2nd most significant bit to byte 31's MSB
	//So on and so forth
	for (let byte = 30; byte <= 45; byte++) {
		let newByte = hex2bin(fileHex[address + byte]);
		newByte = x.at(byte - 30) + newByte.slice(1);
		fileHex[address + byte] = parseInt(newByte, 2).toString(16).padStart(2, '0');
	}
	return fileHex;
};

//This function finds all of the addresses to apply calcChecksum to.
export const checksumNB = (fileHex: string[]): string[] => {
	//Get 20x20 Array of Addresses
	const monAddresses = parseMonAddresses(fileHex);
	//Loop through every address and apply the checksum function.
	for (let box = 0; box < 16; box++) {
		for (let i = 0; i < 20; i++) {
			if (monAddresses[box][i] === null) {
				continue;
			}
			fileHex = calcChecksum(fileHex, monAddresses[box][i]);
		}
	}
	return fileHex;
};

export default checksumNB;
