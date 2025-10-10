import { pokemon, items, moves } from '$data';
import type { Mon } from '$lib/types';

export const reverseParseMon = (fileHex: string[], address: number, mon: Mon): string[] => {
	//Byte #1: Species
	fileHex[address] = pokemon
		.find((pokemon) => mon.species === pokemon.name)!
		.dexNo.toString(16)
		.padStart(2, '0');

	//Byte #2: Held Item
	if (mon.heldItem === 'NONE') {
		fileHex[address + 1] = '00';
	} else {
		fileHex[address + 1] = items
			.find((item) => mon.heldItem === item.name)!
			.itemNo.toString(16)
			.padStart(2, '0');
	}

	//Bytes #3-#6: Moves
	for (let i = 0; i < 4; i++) {
		if (mon.moves[i] === 'NONE') {
			fileHex[address + i + 2] = '00';
		} else {
			fileHex[address + i + 2] = moves
				.find((move) => mon.moves[i] === move.name)!
				.moveNo.toString(16)
				.padStart(2, '0');
		}
	}

	//Byte #7-#8: ID (Unsupported)

	//Bytes #9-#11: Experience
	fileHex[address + 8] = mon.exp.toString(16).padStart(6, '0').slice(0, 2);
	fileHex[address + 9] = mon.exp.toString(16).padStart(6, '0').slice(2, 4);
	fileHex[address + 10] = mon.exp.toString(16).padStart(6, '0').slice(4);

	//Bytes #12-#21: Stat Experience
	for (let i = 0; i < 5; i++) {
		fileHex[address + 11 + 2 * i] = mon.statExps[i].toString(16).padStart(4, '0').slice(0, 2);
		fileHex[address + 11 + (2 * i + 1)] = mon.statExps[i].toString(16).padStart(4, '0').slice(2);
	}

	//Bytes #22-#23: Determinant Values
	fileHex[address + 21] = mon.dvs[0].toString(16) + mon.dvs[1].toString(16);
	fileHex[address + 22] = mon.dvs[2].toString(16) + mon.dvs[3].toString(16);

	//Byte #24: PP Ups (Unsupported)

	//Byte #25: Happiness
	fileHex[address + 24] = mon.happiness.toString(16).padStart(2, '0');

	//Byte #26: Pokerus (Unsupported)

	//Bytes #27-#28: Caught Data (Unsupported)

	//Byte #29: Level
	fileHex[address + 28] = mon.level.toString(16).padStart(2, '0');

	return fileHex;
};

export default reverseParseMon;
