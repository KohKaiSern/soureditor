import { addresses } from "$data"

const getIndexes = (fileHex: Array<string>): number[][] => {
  let indexes = Array(16)
    .fill(null)
    .map(() => Array(20).fill(null));
  for (let box = 0; box < 16; box++) {
    for (let i = 0; i < 20; i++) {
      indexes[box][i] =
        parseInt(fileHex[parseInt(addresses['sBackupNewBox1'], 16) + (33 * box + i)], 16) - 1;
    }
  }
  return indexes
}

const getFlags = (fileHex: Array<string>): string[][] => {
  let flags = Array(16)
    .fill(null)
    .map(() => Array(20).fill(null));
  for (let box = 0; box < 16; box++) {
    //Grab the three relevant bytes
    let flagArr: string[] | string = [
      fileHex[parseInt(addresses.sBackupNewBox1, 16) + 33 * box + 20],
      fileHex[parseInt(addresses.sBackupNewBox1, 16) + 33 * box + 21],
      fileHex[parseInt(addresses.sBackupNewBox1, 16) + 33 * box + 22]
    ];
    //Convert into binary
    flagArr = flagArr
      .map((byte) => {
        byte = parseInt(byte, 16).toString(2).padStart(8, '0').split('').reverse().join('');
        return byte;
      })
      .join('');

    //Get flag bit
    for (let i = 0; i < 20; i++) {
      flags[box][i] = flagArr[i];
    }
  }
  return flags
}

export const parseMonAddresses = (fileHex: Array<string>): number[][] => {
  let data = Array(16)
    .fill(null)
    .map(() => Array(20).fill(null));

  const indexes = getIndexes(fileHex)
  const flags = getFlags(fileHex)

  for (let box = 0; box < 16; box++) {
    for (let i = 0; i < 20; i++) {
      if (indexes[box][i] === -1) {
        continue
      }
      if (flags[box][i] === '0') {
        data[box][i] = parseInt(addresses.sNewBoxMons1, 16) + indexes[box][i] * 47
      }
      else {
        data[box][i] = parseInt(addresses.sNewBoxMons2, 16) + indexes[box][i] * 47
      }
    }
  }
  return data
}

export default parseMonAddresses
