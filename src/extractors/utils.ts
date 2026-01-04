import { readFile, writeFile } from 'fs/promises';
import { createWriteStream } from 'fs';
import sharp from 'sharp';
import { GifEncoder } from '@skyra/gifenc';

//This function reads an .asm file and outputs the file split into lines,
//with some string replacements. It also removes all comments and empty lines,
//as well as macro definitions.
export async function parseRead(path: string): Promise<string[]> {
  const contents = (await readFile(import.meta.dirname + `/../../sourcrystal/${path}`, 'utf-8'))
    .split('\n')
    .map((line) =>
      line
        .replaceAll('PSYCHIC_M', 'PSYCHIC')
        .replaceAll('PSYCHIC_TYPE', 'PSYCHIC')
        .replaceAll('#', 'POKé')
        .replaceAll('@', '')
        .replaceAll('<BSP>', ' ')
        .replaceAll('<DOT>', '.')
        .split(';')
        .at(0)!
        .trim()
    )
    .filter((line) => line != '');

  const lines = [];
  for (let lineNo = 0; lineNo < contents.length; lineNo++) {
    if (contents[lineNo].startsWith('MACRO')) {
      while (!contents[lineNo].startsWith('ENDM')) lineNo++;
      continue;
    }
    lines.push(contents[lineNo]);
  }
  return lines;
}

export async function writeJSON<T>(name: string, obj: T): Promise<void> {
  writeFile(import.meta.dirname + `/../data/${name}.json`, JSON.stringify(obj, null, 2));
}

export async function applyShinyPalette(
  inputPath: string,
  outputPath: string,
  normalPal1: number[],
  normalPal2: number[],
  shinyPal1: number[],
  shinyPal2: number[]
): Promise<void> {
  //Retrieve the normal image
  const image = sharp(import.meta.dirname + '/../../sourcrystal/' + inputPath);
  const metadata = await image.metadata();

  const data = await image.raw().toBuffer();

  //Create new buffer for the shiny image
  const channels = metadata.channels || 3;
  const shinyData = Buffer.alloc(data.length);

  // Helper function to check if colors match within tolerance
  const colorMatches = (r: number, g: number, b: number, pal: number[], tolerance = 10) => {
    return Math.abs(r - pal[0] * 8) <= tolerance &&
      Math.abs(g - pal[1] * 8) <= tolerance &&
      Math.abs(b - pal[2] * 8) <= tolerance;
  };

  //For every pixel,
  for (let i = 0; i < data.length; i += channels) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];

    //Leave it alone if it's black or white
    if (colorMatches(r, g, b, [0, 0, 0])) {
      shinyData[i] = 0;
      shinyData[i + 1] = 0;
      shinyData[i + 2] = 0;
    }
    else if (colorMatches(r, g, b, [32, 32, 32])) {
      shinyData[i] = 0xFF;
      shinyData[i + 1] = 0xFF;
      shinyData[i + 2] = 0xFF;
    }
    //Otherwise, if it's normalPal1, then replace with shinyPal1.
    else if (colorMatches(r, g, b, normalPal1)) {
      shinyData[i] = shinyPal1[0] * 8;
      shinyData[i + 1] = shinyPal1[1] * 8;
      shinyData[i + 2] = shinyPal1[2] * 8;
    }
    //Otherwise, if it's normalPal2, then replace with shinyPal2.
    else if (colorMatches(r, g, b, normalPal2)) {
      shinyData[i] = shinyPal2[0] * 8;
      shinyData[i + 1] = shinyPal2[1] * 8;
      shinyData[i + 2] = shinyPal2[2] * 8;
    }

    //Copy alpha channel if it exists
    if (channels === 4) {
      shinyData[i + 3] = data[i + 3];
    }
  }

  //Construct the new image
  await sharp(shinyData, {
    raw: { width: metadata.width!, height: metadata.height!, channels: channels }
  })
    .png()
    .toFile(import.meta.dirname + '/../' + outputPath);
}

//Converts a PNG and an anim.asm file into a GIF.
export async function createGIF(
  spritePath: string,
  animPath: string,
  outputPath: string
): Promise<void> {
  const metadata = await sharp(import.meta.dirname + '/../' + spritePath).metadata();
  const frameHeight = metadata.width!;
  const animContent = (await parseRead(animPath));

  const encoder = new GifEncoder(frameHeight, frameHeight);
  encoder.setRepeat(0).setQuality(1);

  // Create a read stream and pipe it into a file write stream:
  const writeStream = createWriteStream(import.meta.dirname + '/../' + outputPath);
  encoder.createReadStream().pipe(writeStream);
  encoder.start();

  const firstFrame = await sharp(import.meta.dirname + '/../' + spritePath)
    .extract({
      left: 0,
      top: 0,
      width: frameHeight,
      height: frameHeight
    })
    .ensureAlpha()
    .raw()
    .toBuffer();
  encoder.setDelay(1000);
  encoder.addFrame(new Uint8ClampedArray(firstFrame));

  for (let lineNo = 0; lineNo < animContent.length; lineNo++) {
    const line = animContent[lineNo];
    if (line.startsWith('frame ')) {
      const parts = line.split(/\s+|,/);
      const frameIndex = parseInt(parts[1]);
      const duration = parseInt(parts[2]);
      const frameBuffer = await sharp(import.meta.dirname + '/../' + spritePath)
        .extract({
          left: 0,
          top: frameIndex * frameHeight,
          width: frameHeight,
          height: frameHeight
        })
        .ensureAlpha()
        .raw()
        .toBuffer();
      encoder.setDelay(duration * 17);
      encoder.addFrame(new Uint8ClampedArray(frameBuffer));
    } else if (line.startsWith('setrepeat ')) {
      const repeatCount = parseInt(line.split(/\s+/)[1]);
      const repeatStart = lineNo + 1;
      let repeatEnd = repeatStart;
      while (!animContent[repeatEnd].startsWith('dorepeat')) {
        repeatEnd++;
      }
      for (let rep = 0; rep < repeatCount; rep++) {
        for (let j = repeatStart; j < repeatEnd; j++) {
          const frameLine = animContent[j];
          const parts = frameLine.split(/\s+|,/);
          const frameIndex = parseInt(parts[1]);
          const duration = parseInt(parts[2]);
          const frameBuffer = await sharp(import.meta.dirname + '/../' + spritePath)
            .extract({
              left: 0,
              top: frameIndex * frameHeight,
              width: frameHeight,
              height: frameHeight
            })
            .ensureAlpha()
            .raw()
            .toBuffer();
          encoder.setDelay(duration * 17);
          encoder.addFrame(new Uint8ClampedArray(frameBuffer));
        }
      }
      lineNo = repeatEnd;
    }
  }
  encoder.finish();
}
