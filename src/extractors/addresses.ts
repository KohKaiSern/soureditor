import { parseRead } from './utils';

const SYMBOLS = [
  'sNewBoxMons1',
  'sNewBoxMons2',
  'sBackupNewBox1',
  'sBackupPokemonData',
  'sBackupPlayerData',
  'sChecksum',
  'sBackupChecksum',
  'sBackupGameData',
  'sBackupGameDataEnd',
  'wNumItems',
  'wNumBalls',
  'wNumBerries',
  'wNumKeyItems',
  'wTMsHMs',
  'wCoins',
  'wBlueCardBalance',
  'wPlayerID',
  'wPlayerGender',
  'wPlayerName',
  'wRivalName',
  'wMoney',
  'wPartyMonOTs',
  'wPartyMonNicknames',
  'wGameData'
];

function makeAddress(address: string): number {
  //M = (0x2000 * PP) + (QQQQ - 0xA000), where the original memory address was PP:QQQQ
  return 8192 * parseInt(address.slice(0, 2), 16) + (parseInt(address.slice(2), 16) - 40960);
}

//Converts wRAM address to sRAM
function wToSRAM(addresses: Record<string, number>): Record<string, number> {
  for (const [symbol, address] of Object.entries(addresses)) {
    if (symbol.startsWith('s')) continue;
    addresses[symbol] = address + addresses.sBackupGameData - addresses.wGameData;
  }
  return addresses;
}

function extractAddresses(ADDRESSES: string[]): Record<string, number> {
  const addresses: Record<string, number> = {};
  for (const entry of SYMBOLS) {
    const symbol = ADDRESSES.find((line) => line.endsWith(" " + entry))!;
    addresses[entry] = makeAddress(symbol.split(' ').at(0)!.replace(':', ''));
  }
  return addresses;
}

const ADDRESSES = await parseRead('../sourcrystal.sym');
const addresses: Record<string, number> = wToSRAM(extractAddresses(ADDRESSES));
export default addresses;
