export interface BoxMon {
  species: string;
  heldItem: string;
  moveset: string[];
  OTID: number;
  exp: number;
  statExps: number[];
  dvs: number[];
  PPUPs: number[];
  happiness: number;
  pokerus:
  {
    strain: number | 'NONE';
    daysRemaining?: number | 'CURED';
  };
  caughtTime: string;
  caughtLevel: number;
  OTGender: 'MALE' | 'FEMALE';
  caughtLocation: string;
  level: number;
  isEgg: boolean;
  nickname: string[];
  OTNickname: string[];
}

export interface PartyMon extends BoxMon {
  currentHP: number;
  stats: number[];
  status: {
    name: string;
    turnsRemaining?: number;
  };
  powerPoints: number[];
}

export interface Box {
  name: string[];
  theme: string;
  mons: (BoxMon | null)[];
}

export interface Item {
  name: string;
  qty: number;
}

export type Bag = Record<string, Item[]>

export interface Player {
  id: number;
  name: string[];
  rivalName: string[];
  money: number;
  gender: string;
}

export interface Data {
  party: PartyMon[];
  boxes: Box[];
  bag: Record<string, Item[]>;
  player: Player;
}
