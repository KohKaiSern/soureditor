//A collection of utility functions

import type { Pokemon } from "$extractors/types";
import type { BoxMon, PartyMon } from "$parsers/types";

export function isShiny(mon: PartyMon | BoxMon): boolean {
  return mon.dvs[1] === 10 && mon.dvs[2] === 10 && mon.dvs[3] === 10 && [2, 3, 6, 7, 10, 11, 14, 15].includes(mon.dvs[0])
}

export function hpDV(mon: PartyMon | BoxMon): number {
  return mon.dvs.reduce((a, b) => (a << 1) | (b & 1))
}

export function fixStats(mon: PartyMon, species: Pokemon): PartyMon {
  for (let i = 0; i < 6; i++) {
    //HP DV is calculated from the others. Special Attack & Special Defense share a DV value.
    const basePlusDV = (): number => {
      let dv = -1
      if (i === 0) {
        dv = hpDV(mon)
      } else if (i > 3) {
        dv = mon.dvs[3]
      } else {
        dv = mon.dvs[i - 1]
      }
      return dv + species.bsts[i]
    }

    //Special Attack & Special Defense share a StatExp value
    const sqrtStatExpFloorDiv4 = (): number => {
      let statExp = -1;
      if (i > 3) {
        statExp = mon.statExps[4]
      }
      else {
        statExp = mon.statExps[i]
      }
      return Math.floor((statExp ** 0.5) / 4)
    }

    const numerator = (basePlusDV() * 2 + sqrtStatExpFloorDiv4()) * mon.level
    const stat = Math.floor(numerator / 100) + 5

    //HP Stat has more stuff tacked on
    if (i === 0) {
      mon.stats[i] = stat + mon.level + 5
    } else {
      mon.stats[i] = stat
    }
  }
  //Fix Current HP
  if (mon.currentHP > mon.stats[0]) {
    mon.currentHP = mon.stats[0]
  }
  return mon
}

export function gender(mon: PartyMon | BoxMon, species: Pokemon): string {
  return ''
}
