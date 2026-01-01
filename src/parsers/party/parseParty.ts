import type { PartyMon } from '$parsers/types';
import addresses from '$data/addresses.json';
import pokemon from '$data/pokemon.json';
import { parsePartyMon } from '$parsers/mon/parseMon';
import { readString } from '$parsers/utils';

function parseParty(file: Uint8Array): PartyMon[] {
  const party = [];
  for (let i = 0; i < file[addresses.sBackupPokemonData]; i++) {
    party.push(parsePartyMon(file, addresses.sBackupPokemonData + 8 + 48 * i));
    party[i].isEgg = file[addresses.sBackupPokemonData + 1 + i] === pokemon.find(p => p.id === 'EGG')!.index
    party[i].OTNickname = readString(file, addresses.wPartyMonOTs + i * 11, 7, false);
    party[i].nickname = readString(file, addresses.wPartyMonNicknames + i * 11, 10, false);
  }
  return party;
}
export default parseParty;
