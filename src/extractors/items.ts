import { readFileSync } from "fs";

const items = []

for (let line of readFileSync(import.meta.dirname + '/../../sourcrystal/data/items/names.asm', 'utf-8').split('\n')) {
  if (line.includes('li ')) {
    items.push({
      name: line.split('"')[1]
    })
  }
}
