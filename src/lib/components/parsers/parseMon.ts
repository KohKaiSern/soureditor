import type { Mon } from "$lib/types";
import { pokemon, items, moves } from "$data";

export const parseMon = (fileHex: string[], address: number): Mon => {

  //Byte #1: Species
  const species = pokemon[parseInt(fileHex[address], 16) - 1].name

  //Byte #2: Held Item
  const heldItem = fileHex[address + 1] === '00' ? 'None' : items[parseInt(fileHex[address + 1], 16) - 1].name

  //Bytes #3-#6: Moves
  const moveset = []
  for (let i = 2; i < 6; i++) {
    moveset.push(
      fileHex[address + i] === '00' ? 'None' : moves[parseInt(fileHex[address + i], 16) - 1].name
    )
  }

  //Byte #7-#8: ID (Unsupported)

  //Bytes #9-#11: Experience
  const exp = parseInt(fileHex[address + 8] + fileHex[address + 9] + fileHex[address + 10], 16)

  //Bytes #12-#21: Stat Experience
  const statExps = []
  for (let i = 0; i < 5; i++) {
    statExps.push(
      parseInt(fileHex[address + 11 + (2 * i)] + fileHex[address + 11 + (2 * i + 1)], 16)
    )
  }

  //Bytes #22-#23: Determinant Values
  const dvs = []
  dvs.push(parseInt(fileHex[address + 21].at(0)!, 16))
  dvs.push(parseInt(fileHex[address + 21].at(1)!, 16))
  dvs.push(parseInt(fileHex[address + 22].at(0)!, 16))
  dvs.push(parseInt(fileHex[address + 22].at(1)!, 16))

  //Byte #24: PP Ups (Unsupported)

  //Byte #25: Happiness
  const happiness = parseInt(fileHex[address + 24], 16)

  //Byte #26: Pokerus (Unsupported)

  //Bytes #27-#28: Caught Data (Unsupported) 

  //Byte #29: Level
  const level = parseInt(fileHex[address + 28], 16)

  return {
    species,
    heldItem,
    moves: moveset,
    exp,
    level,
    statExps,
    dvs,
    happiness
  }
}

export default parseMon
