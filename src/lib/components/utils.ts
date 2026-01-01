//A collection of utility functions

import type { BoxMon, PartyMon } from "$parsers/types";

export function isShiny(mon: PartyMon | BoxMon): boolean {
  return mon.dvs[1] === 0 && mon.dvs[2] === 0 && mon.dvs[3] === 0 && [2, 3, 6, 7, 10, 11, 14, 15].includes(mon.dvs[0])
}
