import { mkdir, readdir, copyFile } from 'fs/promises';
import { applyShinyPalette, createGIF, parseRead } from './utils';
import type { Pokemon } from './types';
import { extractIDs, extractNames } from './common';
import growthRates from './growthRates';
import moves from './moves';

function extractStats(
  pokemon: Pokemon[],
  BASE_PTRS: string[],
  base_stats: Record<string, string[]>
): Pokemon[] {
  let index = 1;
  for (let lineNo = 0; lineNo < BASE_PTRS.length; lineNo++) {
    if (!BASE_PTRS[lineNo].startsWith('INCLUDE')) continue;
    const STATS = base_stats[BASE_PTRS[lineNo].split('"').at(1)!];
    const mon = pokemon.find((p) => p.index === index);
    if (mon) {
      mon.bsts = STATS[1].match(/\d+/g)!.map(Number);
      mon.types = Array.from(new Set(STATS[2].match(/[A-Z]+/g)!));
      mon.genderRatio = STATS[6].includes('UNKNOWN')
        ? null
        : Number(
          STATS[6]
            .match(/GENDER_F(.+)/)!
            .at(1)!
            .replaceAll('_', '.')
        );
      mon.growthCFs = growthRates.find((g) => g.id === STATS[12].slice(3))!.coefficients;
      if (STATS[14] != 'tmhm') {
        mon.learnsets.tmhm = STATS[14].match(/[A-Z_\d]+/g)!.map((move) => ({
          name: moves.find((m) => m.id === move)!.name
        }));
      }
    }
    index++;
  }
  return pokemon;
}

function extractLvlMoves(pokemon: Pokemon[], LVL_PTRS: string[], LVL_MOVES: string[]): Pokemon[] {
  let index = 1;
  for (let lineNo = 0; lineNo < LVL_PTRS.length; lineNo++) {
    if (!LVL_PTRS[lineNo].startsWith('dw')) continue;
    const ptr = LVL_PTRS[lineNo].slice(3) + ':';
    let moveIndex = LVL_MOVES.findIndex((l) => l === ptr);
    const mon = pokemon.find((p) => p.index === index);
    if (mon) {
      //Skip evo data
      while (LVL_MOVES[moveIndex] != 'db 0') moveIndex++;
      moveIndex++;
      while (LVL_MOVES[moveIndex] != 'db 0') {
        mon.learnsets.level.push({
          name: moves.find((m) => m.id === LVL_MOVES[moveIndex].match(/[A-Z_]+/)!.at(0)!)!.name,
          level: parseInt(LVL_MOVES[moveIndex].match(/\d+/)!.at(0)!)
        });
        moveIndex++;
      }
    }
    index++;
  }
  return pokemon;
}

function extractEggMoves(pokemon: Pokemon[], EGG_PTRS: string[], EGG_MOVES: string[]): Pokemon[] {
  let index = 1;
  for (let lineNo = 0; lineNo < EGG_PTRS.length; lineNo++) {
    if (!EGG_PTRS[lineNo].startsWith('dw')) continue;
    const ptr = EGG_PTRS[lineNo].slice(3) + ':';
    let moveIndex = EGG_MOVES.findIndex((l) => l === ptr);
    const mon = pokemon.find((p) => p.index === index);
    if (mon) {
      moveIndex++;
      while (EGG_MOVES[moveIndex] != 'db -1') {
        mon.learnsets.egg.push({
          name: moves.find((m) => m.id === EGG_MOVES[moveIndex].match(/[A-Z_]+/)!.at(0)!)!.name
        });
        moveIndex++;
      }
    }
    index++;
  }
  return pokemon;
}

function extractSpritePaths(
  pokemon: Pokemon[],
  PIC_PTRS: string[],
  PIC_PATHS: string[]
): Pokemon[] {
  let index = 1;
  for (let lineNo = 0; lineNo < PIC_PTRS.length; lineNo++) {
    if (!PIC_PTRS[lineNo].startsWith('dba_pics')) continue;
    const ptr = PIC_PTRS[lineNo].split(',').at(0)!.slice(9) + ':';
    const picIndex = PIC_PATHS.findIndex((l) => l.startsWith(ptr));
    const mon = pokemon.find((p) => p.index === index);
    if (mon && picIndex != -1) {
      mon.paths.sprite = PIC_PATHS[picIndex]
        .split('"')
        .at(1)!
        .replace('front.animated.2bpp.lz', '');
    }
    index++;
  }
  return pokemon;
}

function extractPalPaths(pokemon: Pokemon[], PAL_PATHS: string[]): Pokemon[] {
  let index = 1;
  for (let lineNo = 0; lineNo < PAL_PATHS.length; lineNo++) {
    if (!PAL_PATHS[lineNo].startsWith('INCLUDE')) continue;
    const mon = pokemon.find((p) => p.index === index);
    if (mon) {
      if (!mon.id) {
        index++;
        lineNo--;
        continue;
      }
      mon.paths.palette = PAL_PATHS[lineNo].split('"').at(1)!.replace('shiny.pal', '');
    }
    index++;
  }
  return pokemon;
}

async function extractPNGs(pokemon: Pokemon[]): Promise<void> {
  for (const mon of pokemon) {
    if (!mon.id || mon.id === 'UNOWN') continue;
    try {
      await mkdir(import.meta.dirname + `/../${mon.paths.sprite}`);
    } catch { }
    const PALS = await Promise.all(
      [`${mon.paths.palette}normal.pal`, `${mon.paths.palette}shiny.pal`].map((f) => parseRead(f))
    );
    await copyFile(import.meta.dirname + `/../../sourcrystal/${mon.paths.sprite}front.png`, import.meta.dirname + `/../${mon.paths.sprite}normal.png`)
    const normalPal1 = PALS[0][0].match(/\d+/g)!.map(Number);
    const normalPal2 = PALS[0][1].match(/\d+/g)!.map(Number);
    const shinyPal1 = PALS[1][0].match(/\d+/g)!.map(Number);
    const shinyPal2 = PALS[1][1].match(/\d+/g)!.map(Number);
    applyShinyPalette(`${mon.paths.sprite}front.png`, `${mon.paths.sprite}shiny.png`, normalPal1, normalPal2, shinyPal1, shinyPal2);
  }
}

function extractAnimPaths(
  pokemon: Pokemon[],
  ANIM_PTRS: string[],
  ANIM_PATHS: string[]
): Pokemon[] {
  let index = 1;
  for (let lineNo = 0; lineNo < ANIM_PTRS.length; lineNo++) {
    if (!ANIM_PTRS[lineNo].startsWith('dw')) continue;
    const ptr = ANIM_PTRS[lineNo].split(',').at(0)!.slice(3) + ':';
    const animIndex = ANIM_PATHS.findIndex((l) => l.startsWith(ptr));
    const mon = pokemon.find((p) => p.index === index);
    if (mon && animIndex != -1) {
      mon.paths.anim = ANIM_PATHS[animIndex].split('"').at(1)!.replace('anim.asm', '');
    }
    index++;
  }
  //Special Case: Egg
  const egg = pokemon.find((p) => p.id === 'EGG')!;
  egg.paths.anim = 'gfx/pokemon/egg/';
  return pokemon;
}

async function extractGIFs(pokemon: Pokemon[]): Promise<void> {
  for (const mon of pokemon) {
    if (!mon.id || mon.id === 'UNOWN') continue;
    createGIF(
      mon.paths.sprite + 'normal.png',
      mon.paths.anim + 'anim.asm',
      mon.paths.sprite + 'normal.gif'
    );
    createGIF(
      mon.paths.sprite + 'shiny.png',
      mon.paths.anim + 'anim.asm',
      mon.paths.sprite + 'shiny.gif'
    );
  }
}

async function extractUnown(): Promise<void> {
  for (let i = 97; i <= 122; i++) {
    const c = String.fromCharCode(i);
    try {
      await mkdir(import.meta.dirname + `/../gfx/pokemon/unown_${c}`);
    } catch { }
    const PALS = await Promise.all(
      [`gfx/pokemon/unown/normal.pal`, `gfx/pokemon/unown/shiny.pal`].map((f) => parseRead(f))
    );
    await copyFile(import.meta.dirname + `/../../sourcrystal/gfx/pokemon/unown_${c}/front.png`, import.meta.dirname + `/../gfx/pokemon/unown_${c}/normal.png`)
    const normalPal1 = PALS[0][0].match(/\d+/g)!.map(Number);
    const normalPal2 = PALS[0][1].match(/\d+/g)!.map(Number);
    const shinyPal1 = PALS[1][0].match(/\d+/g)!.map(Number);
    const shinyPal2 = PALS[1][1].match(/\d+/g)!.map(Number);
    await applyShinyPalette(
      `gfx/pokemon/unown_${c}/front.png`,
      `gfx/pokemon/unown_${c}/shiny.png`,
      normalPal1,
      normalPal2,
      shinyPal1,
      shinyPal2
    );
    setTimeout(() => {
      createGIF(
        `gfx/pokemon/unown_${c}/normal.png`,
        `gfx/pokemon/unown_${c}/anim.asm`,
        `gfx/pokemon/unown_${c}/normal.gif`
      );
      createGIF(
        `gfx/pokemon/unown_${c}/shiny.png`,
        `gfx/pokemon/unown_${c}/anim.asm`,
        `gfx/pokemon/unown_${c}/shiny.gif`
      );
    }, 200);
  }
}

let files: Promise<string[]>[] | string[][] = [
  'constants/pokemon_constants.asm',
  'data/pokemon/names.asm',
  'data/pokemon/base_stats.asm',
  'data/pokemon/evos_attacks_pointers.asm',
  'data/pokemon/evos_attacks.asm',
  'data/pokemon/egg_move_pointers.asm',
  'data/pokemon/egg_moves.asm',
  'data/pokemon/pic_pointers.asm',
  'gfx/pics.asm',
  'data/pokemon/palettes.asm',
  'gfx/pokemon/anim_pointers.asm',
  'gfx/pokemon/anims.asm'
].map((f) => parseRead(f));

let base_stats: Record<string, string[] | Promise<string[]>> = {};
for (const filename of await readdir(
  import.meta.dirname + '/../../sourcrystal/data/pokemon/base_stats/'
)) {
  base_stats[`data/pokemon/base_stats/${filename}`] = parseRead(
    `data/pokemon/base_stats/${filename}`
  );
}

files = await Promise.all(files);
base_stats = Object.fromEntries(
  await Promise.all(Object.entries(base_stats).map(async ([key, promise]) => [key, await promise]))
);

const NULL_POKEMON: Pokemon = {
  id: null,
  index: -1,
  name: '',
  bsts: [],
  types: [],
  genderRatio: -1,
  growthCFs: [],
  learnsets: {
    level: [],
    egg: [],
    tmhm: []
  },
  paths: {
    sprite: '',
    palette: '',
    anim: ''
  }
};

let pokemon: Pokemon[] = [];
pokemon = extractIDs(pokemon, files[0], NULL_POKEMON, undefined, 'const_def 1');
pokemon = extractNames(pokemon, files[1], 1, undefined, 'NUM_POKEMON');
pokemon = extractStats(pokemon, files[2], base_stats as Record<string, string[]>);
pokemon = extractLvlMoves(pokemon, files[3], files[4]);
pokemon = extractEggMoves(pokemon, files[5], files[6]);
pokemon = extractSpritePaths(pokemon, files[7], files[8]);
pokemon = extractPalPaths(pokemon, files[9]);
extractPNGs(pokemon);
pokemon = extractAnimPaths(pokemon, files[10], files[11]);
extractGIFs(pokemon);
extractUnown();

export default pokemon;
