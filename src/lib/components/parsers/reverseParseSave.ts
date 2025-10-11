import { parseMonAddresses, reverseParseMon, checksumNB, reverseParseBag } from '$lib/components/parsers';
import type { Mon, BagSlot } from '$lib/types';

export const reverseParseSave = (
  fileHex: string[],
  mons: Mon[][],
  bag: Record<string, BagSlot>
): string[] => {
  const monAddresses = parseMonAddresses(fileHex);
  for (let box = 0; box < 16; box++) {
    for (let i = 0; i < 20; i++) {
      if (mons[box][i] === null) {
        continue;
      }
      fileHex = reverseParseMon(fileHex, monAddresses[box][i], mons[box][i]);
    }
  }

  fileHex = reverseParseBag(checksumNB(fileHex), bag)

  return fileHex;
};

export default reverseParseSave;
