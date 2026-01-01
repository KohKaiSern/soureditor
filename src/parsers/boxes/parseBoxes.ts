import type { Box } from "$parsers/types";
import parseBoxAddresses from '$parsers/boxes/parseBoxAddresses'
import { parseBoxMon } from "$parsers/mon/parseMon";
import { readString } from "$parsers/utils";
import addresses from '$data/addresses.json'
import boxThemes from '$data/boxThemes.json'

function parseBoxes(file: Uint8Array): Box[] {
  const names = parseBoxNames(file);
  const themes = parseBoxThemes(file);
  const addresses = parseBoxAddresses(file);
  const mons = Array(16)
    .fill(null)
    .map(() => Array(20).fill(null));
  for (let box = 0; box < 16; box++) {
    for (let i = 0; i < 20; i++) {
      if (!addresses[box][i]) continue;
      mons[box][i] = parseBoxMon(file, addresses[box][i]);
    }
  }
  const boxes: Box[] = [];
  for (let box = 0; box < 16; box++) {
    boxes.push({
      name: names[box],
      theme: themes[box],
      mons: mons[box]
    });
  }
  return boxes;
}

function parseBoxNames(file: Uint8Array): string[][] {
  const names: string[][] = [];
  for (let box = 0; box < 16; box++) {
    const address = addresses.sBackupNewBox1 + 33 * box + 23;
    names.push(readString(file, address, 9, false));
  }
  return names;
}

function parseBoxThemes(file: Uint8Array): string[] {
  const themes: string[] = [];
  for (let box = 0; box < 16; box++) {
    themes.push(boxThemes.find(b => b.index === file[addresses.sBackupNewBox1 + 33 * box + 32])!.name);
  }
  return themes;
}

export default parseBoxes
