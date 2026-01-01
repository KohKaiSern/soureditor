import charmap from '$data/charmap.json';

//This function accesses a subset of bytes and interprets them as one number in big endian format.
export function retrieve(file: Uint8Array, address: number, bytes: number): number {
  let result = 0;
  for (let i = 0; i < bytes; i++) {
    result = (result << 8) | file[address + i];
  }
  return result;
}

//This function takes a number and inserts it into a buffer array in big endian format.
export function insert(file: Uint8Array, address: number, bytes: number, x: number): Uint8Array {
  for (let i = 0; i < bytes; i++) {
    file[address + i] = (x >> ((bytes - i - 1) * 8)) & 0xff;
  }
  return file;
}

export function readString(
  file: Uint8Array,
  address: number,
  maxLen: number,
  hasChecksum: boolean
): string[] {
  const str = [];
  for (let i = 0; i < maxLen; i++) {
    //Strings including checksums in their MSBs will always have their MSBs set for decoding.
    if (hasChecksum) {
      file[address + i] |= 1 << 7;
    }
    //Terminators (0x50 if there's no checksum, 0xC7 if there is)
    if (file[address + i] === 0x50 || file[address + i] === 0xc7) break;
    //Space (0x7F if there's no checksum, 0xC6 if there is)
    if (file[address + i] === 0x7f || file[address + i] === 0xc6) {
      str.push(' ');
      continue;
    }
    //Zero (0x00 if there's no checksum, 0xC8 if there is)
    if (file[address + i] === 0 || file[address + i] === 0xc8) {
      str.push('0');
      continue;
    }
    str.push(charmap[file[address + i].toString(16).toUpperCase() as keyof typeof charmap]);
  }
  return str;
}

export function writeString(
  file: Uint8Array,
  address: number,
  maxLen: number,
  hasChecksum: boolean,
  str: string[]
): Uint8Array {
  for (let i = 0; i < str.length; i++) {
    //Space (0x7F if there's no checksum, 0xC6 if there is)
    if (str[i] === ' ') {
      file[address + i] = hasChecksum ? 0xC6 : 0x7F;
      continue;
    }
    //Zero (0x00 if there's no checksum, 0xC8 if there is)
    if (str[i] === '0' && hasChecksum) {
      file[address + i] = 0xC8;
      continue;
    }
    file[address + i] = parseInt(Object.keys(charmap).find(
      (c) => charmap[c as keyof typeof charmap] === str[i]
    )!, 16);
    continue;
  }
  //Once we finish the str, we should add the terminator,
  //...unless it's max length already.
  if (maxLen === str.length) return file;
  file[address + str.length] = hasChecksum ? 0xC7 : 0x50;
  return file
}
