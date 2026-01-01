import type { Base } from './types';

//This file contains common extractors for similar file formats.

export function extractIDs<T extends Base>(
  data: T[],
  IDS: string[],
  empty: T,
  start?: string,
  end?: string
): T[] {
  let lineNo = 0;
  if (start) while (!IDS[lineNo].includes(start)) lineNo++;
  //Find starting index
  while (!IDS[lineNo].includes('const_def')) lineNo++;
  const match = IDS[lineNo].match(/const_def (\d+)/);
  let index = match ? parseInt(match[1]) : 0;
  lineNo++;
  for (; lineNo < IDS.length; lineNo++) {
    if (end) if (IDS[lineNo].includes(end)) break;
    if (IDS[lineNo].startsWith('const')) {
      data.push({
        ...structuredClone(empty),
        id: IDS[lineNo].startsWith('const_skip') ? null : IDS[lineNo].match(/[A-Z_\d]+/)!.at(0)!,
        index
      });
      index++;
    }
  }
  return data;
}

export function extractNames<T extends Base & { name: string }>(
  data: T[],
  NAMES: string[],
  initial: number,
  start?: string,
  end?: string
): T[] {
  let lineNo = 0;
  if (start) while (!NAMES[lineNo].includes(start)) lineNo++;
  let index = initial;
  for (; lineNo < NAMES.length; lineNo++) {
    if (end) if (NAMES[lineNo].includes(end)) break;
    if (!NAMES[lineNo].includes('"')) continue;
    const entry = data.find((i) => i.index === index);
    if (entry) {
      entry.name = NAMES[lineNo].split('"').at(1)!;
    }
    index++;
  }
  return data;
}

export function extractDescs<T extends Base & { description: string }>(
  data: T[],
  DESCS: string[],
  initial: number,
  start?: string,
  end?: string
): T[] {
  let lineNo = 0;
  if (start) while (!DESCS[lineNo].includes(start)) lineNo++;
  let index = initial;
  for (; lineNo < DESCS.length; lineNo++) {
    if (end) if (DESCS[lineNo].includes(end)) break;
    if (!DESCS[lineNo].startsWith('dw')) continue;
    const pointer = DESCS[lineNo].slice(3) + ':';
    let descIndex = DESCS.findIndex((l) => l.startsWith(pointer))!;
    while (!DESCS[descIndex].includes('"')) descIndex++;
    let description = '';
    while (DESCS[descIndex].includes('"')) {
      description += DESCS[descIndex].split('"').at(1)!;
      if (description.at(-1)! === '-') {
        description = description.slice(0, -1);
      } else {
        description += ' ';
      }
      descIndex++;
      if (descIndex === DESCS.length) break;
    }
    const entry = data.find((i) => i.index === index);
    if (entry) {
      entry.description = description.slice(0, -1);
    }
    index++;
  }
  return data;
}
