import type { Box } from "$parsers/types";
import parseBoxAddresses from "$parsers/boxes/parseBoxAddresses";
import { reverseParseBoxMon } from '$parsers/mon/reverseParseMon'
import checksumBoxMon from "$parsers/boxes/checksumBoxMon";
import { writeString } from "$parsers/utils";
import addresses from '$data/addresses.json'
import boxThemes from '$data/boxThemes.json'

function reverseParseBoxes(file: Uint8Array, boxes: Box[]): Uint8Array {
  file = reverseParseBoxNames(file, boxes);
  file = reverseParseBoxThemes(file, boxes);
  file = reverseParseBoxAddresses(file, boxes);
  const addresses = parseBoxAddresses(file);
  for (let box = 0; box < 16; box++) {
    for (let i = 0; i < 20; i++) {
      if (boxes[box].mons[i]) {
        file = reverseParseBoxMon(file, addresses[box][i], boxes[box].mons[i]!);
        file = checksumBoxMon(file, addresses[box][i]);
      }
    }
  }
  return file
}

function reverseParseBoxNames(file: Uint8Array, boxes: Box[]): Uint8Array {
  for (let box = 0; box < 16; box++) {
    file = writeString(file, addresses.sBackupNewBox1 + 33 * box + 23, 9, false, boxes[box].name);
  }
  return file
}

function reverseParseBoxThemes(file: Uint8Array, boxes: Box[]): Uint8Array {
  for (let box = 0; box < 16; box++) {
    file[addresses.sBackupNewBox1 + 33 * box + 32] = boxThemes.find(b => b.name === boxes[box].theme)!.index
  }
  return file
}

//For convenience:
//Bitflags will always be unset from Boxes 1-8, and set for Boxes 9-16.
function reverseParseBoxAddresses(file: Uint8Array, boxes: Box[]): Uint8Array {
  let index = 1
  for (let box = 0; box < 16; box++) {
    //Indexes
    for (let i = 0; i < 20; i++) {
      if (index === 161) index = 1;
      if (!boxes[box].mons[i]) {
        file[addresses.sBackupNewBox1 + 33 * box + i] = 0;
      } else {
        file[addresses.sBackupNewBox1 + 33 * box + i] = index;
        index++;
      }
    }
    //Bitflags
    if (box < 8) {
      file.set([0, 0, 0], addresses.sBackupNewBox1 + 33 * box + 20)
    } else {
      file.set([0xFF, 0xFF, 0x0F], addresses.sBackupNewBox1 + 33 * box + 20)
    }
  }
  return file
};

export default reverseParseBoxes
