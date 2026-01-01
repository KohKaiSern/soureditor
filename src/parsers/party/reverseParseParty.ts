import addresses from "$data/addresses.json";
import pokemon from '$data/pokemon.json'
import type { PartyMon } from "$parsers/types";
import { reverseParsePartyMon } from "$parsers/mon/reverseParseMon";
import { writeString } from "$parsers/utils";

function reverseParseParty(file: Uint8Array, party: PartyMon[]): Uint8Array {
  file[addresses.sBackupPokemonData] = party.length;
  for (let i = 0; i < party.length; i++) {
    file = reverseParsePartyMon(file, addresses.sBackupPokemonData + 8 + 48 * i, party[i]);
    file[addresses.sBackupPokemonData + 1 + i] = party[i].isEgg ? pokemon.find(p => p.id === 'EGG')!.index : pokemon.find(p => p.name === party[i].species)!.index
    file = writeString(file, addresses.wPartyMonOTs + i * 11, 8, false, party[i].OTNickname)
    file = writeString(file, addresses.wPartyMonNicknames + i * 11, 11, false, party[i].nickname)
  }
  return file
}

export default reverseParseParty
