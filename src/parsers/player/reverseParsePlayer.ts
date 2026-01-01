import type { Player } from "$parsers/types";
import addresses from '$data/addresses.json'
import { writeString, insert } from "$parsers/utils";

function reverseParsePlayer(file: Uint8Array, player: Player): Uint8Array {
  file = insert(file, addresses.wPlayerID, 2, player.id)
  file = writeString(file, addresses.wPlayerName, 7, false, player.name)
  file = writeString(file, addresses.wRivalName, 7, false, player.rivalName)
  file = insert(file, addresses.wMoney, 3, player.money)
  file[addresses.wPlayerGender] = (player.gender === 'Male' ? 1 : 0)
  return file
}

export default reverseParsePlayer
