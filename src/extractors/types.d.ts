export interface Base {
  id: string | null;
  index: number;
}

export interface Item extends Base {
  name: string;
  description: string;
  category: string;
}

export interface Move extends Base {
  name: string;
  description: string;
  basePower: number;
  type: string;
  accuracy: number;
  powerPoints: number;
  effectChance: number;
}

export interface Location extends Base {
  name: string;
}

export interface BoxTheme extends Base {
  name: string;
}

export interface GrowthRate extends Base {
  coefficients: number[];
}

export interface Pokemon extends Base {
  name: string;
  bsts: number[];
  types: string[];
  genderRatio: number | null;
  growthCFs: number[];
  learnsets: {
    level: {
      name: string;
      level: number;
    }[];
    egg: {
      name: string;
    }[];
    tmhm: {
      name: string;
    }[];
  };
  paths: {
    sprite: string;
    palette: string;
    anim: string;
  };
}
