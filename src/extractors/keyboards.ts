import { parseRead } from "./utils";

function extractKeyboard(keyboards: { name: string[], box: string[] }, KEYBOARDS: string[]): { name: string[], box: string[] } {
  for (let lineNo = 0; lineNo < KEYBOARDS.length; lineNo++) {
    if (KEYBOARDS[lineNo].startsWith('NameInput')) {
      lineNo++;
      while (KEYBOARDS[lineNo].startsWith('db')) {
        if (!KEYBOARDS[lineNo + 1].startsWith('db')) break;
        keyboards.name = keyboards.name.concat(KEYBOARDS[lineNo].split('"').at(1)!.split(' ').filter(c => c != ""))
        lineNo++
      }
    }
    else if (KEYBOARDS[lineNo].startsWith('BoxNameInput')) {
      lineNo++;
      while (KEYBOARDS[lineNo].startsWith('db')) {
        if (KEYBOARDS[lineNo].includes('END')) break;
        keyboards.box = keyboards.box.concat(KEYBOARDS[lineNo].split('"').at(1)!.split(' ').filter(c => c != ""))
        lineNo++
      }
    }
  }
  keyboards.name.push(' ')
  keyboards.box.push(' ')
  return keyboards
}

const KEYBOARDS = await parseRead('data/text/name_input_chars.asm');

let keyboards: {
  name: string[],
  box: string[]
} = {
  name: [],
  box: []
}

keyboards = extractKeyboard(keyboards, KEYBOARDS)

export default keyboards
