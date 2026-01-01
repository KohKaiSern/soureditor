import addresses from '$data/addresses.json';

const parseBoxIndexes = (file: Uint8Array): number[][] => {
  const indexes = Array(16)
    .fill(null)
    .map(() => Array(20).fill(null));
  for (let box = 0; box < 16; box++) {
    for (let i = 0; i < 20; i++) {
      indexes[box][i] =
        file[addresses.sBackupNewBox1 + 33 * box + i] - 1;
    }
  }
  return indexes;
};

const parseBoxFlags = (file: Uint8Array): number[][] => {
  const flags = Array(16)
    .fill(null)
    .map(() => Array(20).fill(0));
  for (let box = 0; box < 16; box++) {
    for (let i = 0; i < 20; i++) {
      flags[box][i] = (file[addresses.sBackupNewBox1 + 33 * box + 20 + Math.floor(i / 8)] >> i % 8) & 1;
    }
  }
  return flags;
};

export const parseBoxAddresses = (file: Uint8Array): number[][] => {
  const data = Array(16)
    .fill(null)
    .map(() => Array(20).fill(null));
  const indexes = parseBoxIndexes(file);
  const flags = parseBoxFlags(file);
  for (let box = 0; box < 16; box++) {
    for (let i = 0; i < 20; i++) {
      if (indexes[box][i] === -1) continue;
      data[box][i] = addresses[`sNewBoxMons${flags[box][i] + 1}` as keyof typeof addresses] + indexes[box][i] * 47;
    }
  }
  return data;
};

export default parseBoxAddresses;
