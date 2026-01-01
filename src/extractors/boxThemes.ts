import { extractIDs, extractNames } from './common';
import type { BoxTheme } from './types';
import { parseRead } from './utils';

const files = await Promise.all(
  ['constants/pc_constants.asm', 'data/pc/theme_names.asm'].map((f) => parseRead(f))
);

const NULL_BOXTHEME: BoxTheme = {
  id: null,
  index: -1,
  name: ''
};

let boxThemes: BoxTheme[] = [];
boxThemes = extractIDs(boxThemes, files[0], NULL_BOXTHEME);
boxThemes = extractNames(boxThemes, files[1], 0);

export default boxThemes;
