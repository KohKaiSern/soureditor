import type { BoxMon, PartyMon } from "$parsers/types";
import pokemon from '$data/pokemon.json'
import items from '$data/items.json'
import moves from '$data/moves.json'
import locations from '$data/locations.json'
import { writeString, insert } from '$parsers/utils'

export function reverseParseBoxMon(file: Uint8Array, address: number, mon: BoxMon): Uint8Array {
  file = species(file, address, mon.species)
  file = heldItem(file, address + 1, mon.heldItem)
  file = moveset(file, address + 2, mon.moveset)
  file = OTID(file, address + 6, mon.OTID)
  file = exp(file, address + 8, mon.exp)
  file = statExps(file, address + 11, mon.statExps)
  file = dvs(file, address + 21, mon.dvs)
  file = BoxPPUPs(file, address + 23, mon.PPUPs)
  file = happiness(file, address + 24, mon.happiness)
  file = pokerus(file, address + 25, mon.pokerus)
  file = caughtTime(file, address + 26, mon.caughtTime)
  file = caughtLevel(file, address + 26, mon.caughtLevel)
  file = OTGender(file, address + 27, mon.OTGender)
  file = caughtLocation(file, address + 27, mon.caughtLocation)
  file = level(file, address + 28, mon.level)
  file = isEgg(file, address + 29, mon.isEgg, mon.species)
  file = writeString(file, address + 30, 10, true, mon.nickname)
  file = writeString(file, address + 40, 7, true, mon.OTNickname)
  return file
}

export function reverseParsePartyMon(file: Uint8Array, address: number, mon: PartyMon): Uint8Array {
  file = species(file, address, mon.species)
  file = heldItem(file, address + 1, mon.heldItem)
  file = moveset(file, address + 2, mon.moveset)
  file = OTID(file, address + 6, mon.OTID)
  file = exp(file, address + 8, mon.exp)
  file = statExps(file, address + 11, mon.statExps)
  file = dvs(file, address + 21, mon.dvs)
  file = PartyPPUPs(file, address + 23, mon.PPUPs)
  file = powerPoints(file, address + 23, mon.powerPoints)
  file = happiness(file, address + 27, mon.happiness)
  file = pokerus(file, address + 28, mon.pokerus)
  file = caughtTime(file, address + 29, mon.caughtTime)
  file = caughtLevel(file, address + 29, mon.caughtLevel)
  file = OTGender(file, address + 30, mon.OTGender)
  file = caughtLocation(file, address + 30, mon.caughtLocation)
  file = level(file, address + 31, mon.level)
  file = status(file, address + 32, mon.status)
  file = currentHP(file, address + 34, mon.currentHP)
  file = stats(file, address + 36, mon.stats)
  return file
}

const species = (file: Uint8Array, address: number, species: string): Uint8Array =>
  (file[address] = pokemon.find(p => p.name === species)!.index, file)

const heldItem = (file: Uint8Array, address: number, heldItem: string): Uint8Array =>
  (file[address] = items.find(i => i.name === heldItem)!.index, file)

const moveset = (file: Uint8Array, address: number, moveset: string[]): Uint8Array =>
  (file.set(moveset.map(move => moves.find(m => m.name === move)!.index), address), file);

const OTID = (file: Uint8Array, address: number, OTID: number): Uint8Array =>
  (file = insert(file, address, 2, OTID), file);

const exp = (file: Uint8Array, address: number, exp: number): Uint8Array =>
  (file = insert(file, address, 3, exp), file)

const statExps = (file: Uint8Array, address: number, statExps: number[]): Uint8Array =>
  (file.set(statExps.flatMap(s => [s >> 8, s & 0xFF]), address), file)

const dvs = (file: Uint8Array, address: number, dvs: number[]): Uint8Array =>
  (file.set([dvs[0] << 4 | dvs[1], dvs[2] << 4 | dvs[3]], address), file)

const PartyPPUPs = (file: Uint8Array, address: number, PPUPs: number[]): Uint8Array => {
  for (let i = 0; i < 4; i++) {
    file[address + i] = (file[address + i] & 0x3f) | (PPUPs[i] << 6);
  }
  return file;
};

const BoxPPUPs = (file: Uint8Array, address: number, PPUPs: number[]): Uint8Array => {
  file[address] = PPUPs.reduce((byte, value, i) =>
    byte | ((value & 0x3) << (i * 2)), 0
  );
  return file;
}

const powerPoints = (file: Uint8Array, address: number, powerPoints: number[]): Uint8Array => {
  for (let i = 0; i < 4; i++) {
    file[address + i] = (file[address + i] & 0xC0) | powerPoints[i]
  }
  return file
}

const happiness = (file: Uint8Array, address: number, happiness: number): Uint8Array =>
  (file[address] = happiness, file)

const pokerus = (file: Uint8Array, address: number, pokerus: 'NONE' | { strain: number, daysRemaining: number | 'CURED' }): Uint8Array => {
  if (pokerus === 'NONE') {
    file[address] = 0
  } else {
    if (pokerus.daysRemaining === 'CURED') {
      file[address] = pokerus.strain << 4 | 0
    } else {
      file[address] = pokerus.strain << 4 | pokerus.daysRemaining
    }
  }
  return file
}

const caughtTime = (file: Uint8Array, address: number, caughtTime: string): Uint8Array => {
  const value = ['MORNING', 'DAY', 'NIGHT'].findIndex(t => t === caughtTime);
  file[address] = value << 6 | (file[address] & 0x3F)
  return file
}

const caughtLevel = (file: Uint8Array, address: number, caughtLevel: number): Uint8Array =>
  (file[address] = (file[address] & 0xC0) | caughtLevel, file)

const OTGender = (file: Uint8Array, address: number, OTGender: 'MALE' | 'FEMALE'): Uint8Array => {
  const value = OTGender === 'MALE' ? 0 : 1;
  file[address] = (value << 7) | (file[address] & 0x7F);
  return file
}

const caughtLocation = (file: Uint8Array, address: number, caughtLocation: string): Uint8Array => {
  const value = locations.find(l => l.name === caughtLocation)!.index
  file[address] = (file[address] & 0x80) | value;
  return file
}

const level = (file: Uint8Array, address: number, level: number): Uint8Array =>
  (file[address] = level, file);

const isEgg = (file: Uint8Array, address: number, isEgg: boolean, species: string): Uint8Array =>
  (file[address] = (isEgg ? pokemon.find(p => p.id === 'EGG')!.index : pokemon.find(p => p.name === species)!.index), file)

const status = (file: Uint8Array, address: number, status: { name: string, turnsRemaining?: number }): Uint8Array => {
  if (status.name === 'NONE') {
    file[address] = 0
  } else if (status.name === 'SLEEP') {
    file[address] = status.turnsRemaining!
  } else {
    file[address] = 2 ** [null, null, null, 'POISON', 'BURN', 'FREEZE', 'PARALYSIS', 'BADLY POISONED'].findIndex(s => s === status.name)
  }
  return file
}

const currentHP = (file: Uint8Array, address: number, currentHP: number): Uint8Array =>
  (file = insert(file, address, 2, currentHP), file)

const stats = (file: Uint8Array, address: number, stats: number[]): Uint8Array =>
  (file.set(stats.flatMap(s => [s >> 8, s & 0xFF]), address), file)
