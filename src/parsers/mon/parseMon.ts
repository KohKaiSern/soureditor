import type { BoxMon, PartyMon } from '$parsers/types';
import pokemon from '$data/pokemon.json';
import items from '$data/items.json';
import moves from '$data/moves.json';
import locations from '$data/locations.json';
import { readString, retrieve } from '$parsers/utils';

export function parseBoxMon(
  file: Uint8Array,
  address: number
): BoxMon {
  return {
    species: species(file, address),
    heldItem: heldItem(file, address + 1),
    moveset: moveset(file, address + 2),
    OTID: OTID(file, address + 6),
    exp: exp(file, address + 8),
    statExps: statExps(file, address + 11),
    dvs: dvs(file, address + 21),
    PPUPs: BoxPPUPs(file, address + 23),
    happiness: happiness(file, address + 24),
    pokerus: pokerus(file, address + 25),
    caughtTime: caughtTime(file, address + 26),
    caughtLevel: caughtLevel(file, address + 26),
    OTGender: OTGender(file, address + 27),
    caughtLocation: caughtLocation(file, address + 27),
    level: level(file, address + 28),
    isEgg: isEgg(file, address + 29),
    nickname: readString(file, address + 30, 10, true),
    OTNickname: readString(file, address + 40, 7, true),
  }
}

export function parsePartyMon(
  file: Uint8Array,
  address: number
): PartyMon {
  return {
    species: species(file, address),
    heldItem: heldItem(file, address + 1),
    moveset: moveset(file, address + 2),
    OTID: OTID(file, address + 6),
    exp: exp(file, address + 8),
    statExps: statExps(file, address + 11),
    dvs: dvs(file, address + 21),
    PPUPs: PartyPPUPs(file, address + 23),
    powerPoints: powerPoints(file, address + 23),
    happiness: happiness(file, address + 27),
    pokerus: pokerus(file, address + 28),
    caughtTime: caughtTime(file, address + 29),
    caughtLevel: caughtLevel(file, address + 29),
    OTGender: OTGender(file, address + 30),
    caughtLocation: caughtLocation(file, address + 30),
    level: level(file, address + 31),
    status: status(file, address + 32),
    currentHP: currentHP(file, address + 34),
    stats: stats(file, address + 36),
    isEgg: true,
    OTNickname: [],
    nickname: []
  };
}

const species = (file: Uint8Array, address: number): string =>
  pokemon.find((p) => p.index === file[address])!.name;

const heldItem = (file: Uint8Array, address: number): string => {
  if (file[address] === 0) {
    return 'NONE'
  }
  return items.find((i) => i.index === file[address])!.name;
}

const moveset = (file: Uint8Array, address: number): string[] =>
  Array.from({ length: 4 }, (_, i) => {
    if (file[address + i] === 0) {
      return 'NONE'
    }
    return moves.find((m) => m.index === file[address + i])!.name
  });

const OTID = (file: Uint8Array, address: number): number =>
  retrieve(file, address, 2)

const exp = (file: Uint8Array, address: number): number =>
  retrieve(file, address, 3)

const statExps = (file: Uint8Array, address: number): number[] =>
  Array.from({ length: 5 }, (_, i) => retrieve(file, address + i * 2, 2));

const dvs = (file: Uint8Array, address: number): number[] =>
  Array.from(
    { length: 4 },
    (_, i) => (file[address + Math.floor(i / 2)] >> (4 * (1 - (i % 2)))) & 0xf
  );

const BoxPPUPs = (file: Uint8Array, address: number): number[] =>
  Array.from({ length: 4 }, (_, i) =>
    file[address] >> i * 2 & 0x3
  )

const PartyPPUPs = (file: Uint8Array, address: number): number[] =>
  Array.from({ length: 4 }, (_, i) => file[address + i] >> 6);

const powerPoints = (file: Uint8Array, address: number): number[] =>
  Array.from({ length: 4 }, (_, i) => file[address + i] & 0x3f);

const happiness = (file: Uint8Array, address: number): number => file[address];

const pokerus = (
  file: Uint8Array,
  address: number
): {
  strain: number | 'NONE';
  daysRemaining?: number | 'CURED';
} => {
  if (file[address] >> 4 === 0) return { strain: 'NONE' };
  return {
    strain: file[address] & 0xf0,
    daysRemaining: (file[address] & 0xf) === 0 ? 'CURED' : file[address] & 0xf
  };
};

const caughtTime = (file: Uint8Array, address: number): string =>
  ['MORNING', 'DAY', 'NIGHT'].at(file[address] >> 6)!;

const caughtLevel = (file: Uint8Array, address: number): number => file[address] & 0x3f;

const OTGender = (file: Uint8Array, address: number): 'MALE' | 'FEMALE' =>
  (file[address] >> 7) === 0 ? 'MALE' : 'FEMALE';

const caughtLocation = (file: Uint8Array, address: number): string =>
  locations.find((l) => l.index === (file[address] & 0x7f))!.name;

const level = (file: Uint8Array, address: number): number => file[address];

const isEgg = (file: Uint8Array, address: number): boolean =>
  file[address] === pokemon.find(p => p.id === 'EGG')!.index

const status = (
  file: Uint8Array,
  address: number
): {
  name: string;
  turnsRemaining?: number;
} => {
  if (file[address] === 0) return { name: 'NONE' };
  const name = [
    'SLEEP',
    'SLEEP',
    'SLEEP',
    'POISON',
    'BURN',
    'FREEZE',
    'PARALYSIS',
    'BADLY POISONED'
  ].at(Math.floor(Math.log2(file[address])))!;
  if (name === 'SLEEP') {
    return {
      name,
      turnsRemaining: file[address] & 0x7
    };
  } else {
    return {
      name
    };
  }
};

const currentHP = (file: Uint8Array, address: number): number =>
  retrieve(file, address, 2)

const stats = (file: Uint8Array, address: number): number[] =>
  Array.from({ length: 6 }, (_, i) => retrieve(file, address + i * 2, 2));
