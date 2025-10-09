import { readFileSync, readdirSync, mkdirSync, existsSync, createWriteStream } from 'fs';
import { join } from 'path';
import { PNG } from 'pngjs';
// @ts-ignore
import GIFEncoder from 'gif-encoder-2';

interface RGB {
	r: number;
	g: number;
	b: number;
}
interface AnimFrame {
	frameNumber: number;
	duration: number;
}
interface AnimCommand {
	type: 'frame' | 'setrepeat' | 'dorepeat' | 'endanim';
	frameNumber?: number;
	duration?: number;
	count?: number;
}

const INPUT_DIR = join(import.meta.dirname, '../../sourcrystal/gfx/pokemon');
const OUTPUT_DIR = join(import.meta.dirname, '../lib/sprites');

/** Parse palette: returns exactly 2 colors from .pal file */
function parsePalette(palPath: string): RGB[] {
	const content = readFileSync(palPath, 'utf-8');
	const colors: RGB[] = [];
	for (const line of content.split('\n')) {
		const match = line.match(/RGB\s+(\d+),\s*(\d+),\s*(\d+)/);
		if (match) {
			const r = Math.round((parseInt(match[1]) / 31) * 255);
			const g = Math.round((parseInt(match[2]) / 31) * 255);
			const b = Math.round((parseInt(match[3]) / 31) * 255);
			colors.push({ r, g, b });
		}
	}
	while (colors.length < 2) colors.push({ r: 0, g: 0, b: 0 });
	return colors;
}

/** Parse animation commands */
function parseAnimation(animPath: string): AnimFrame[] {
	const content = readFileSync(animPath, 'utf-8');
	const commands: AnimCommand[] = [];
	for (const line of content.split('\n')) {
		const trimmed = line.trim();
		if (!trimmed) continue;
		if (trimmed.startsWith('frame')) {
			const match = trimmed.match(/frame\s+(\d+),\s*(\d+)/);
			if (match) commands.push({ type: 'frame', frameNumber: +match[1], duration: +match[2] });
		} else if (trimmed.startsWith('setrepeat')) {
			const match = trimmed.match(/setrepeat\s+(\d+)/);
			if (match) commands.push({ type: 'setrepeat', count: +match[1] });
		} else if (trimmed.startsWith('dorepeat')) {
			const match = trimmed.match(/dorepeat\s+(\d+)/);
			if (match) commands.push({ type: 'dorepeat', count: +match[1] });
		} else if (trimmed.startsWith('endanim')) {
			commands.push({ type: 'endanim' });
		}
	}

	const frames: AnimFrame[] = [];
	const repeatStack: { startIndex: number; count: number; iterations: number }[] = [];
	let i = 0;
	while (i < commands.length) {
		const cmd = commands[i];
		if (cmd.type === 'frame') {
			frames.push({ frameNumber: cmd.frameNumber!, duration: cmd.duration! });
			i++;
		} else if (cmd.type === 'setrepeat') {
			repeatStack.push({ startIndex: frames.length, count: cmd.count!, iterations: 0 });
			i++;
		} else if (cmd.type === 'dorepeat') {
			const repeat = repeatStack.at(-1)!;
			repeat.iterations++;
			if (repeat.iterations < cmd.count!) {
				const framesToRepeat = frames.slice(repeat.startIndex);
				frames.push(...framesToRepeat);
			} else {
				repeatStack.pop();
				i++;
			}
		} else if (cmd.type === 'endanim') {
			break;
		} else {
			i++;
		}
	}
	return frames;
}

/** Load sprite sheet into frames as 2-bit indices (0-3) */
function loadSpriteSheet(pngPath: string): PNG[] {
	const png = PNG.sync.read(readFileSync(pngPath));
	const frameHeight = png.width;
	const frameCount = Math.max(1, Math.floor(png.height / frameHeight));
	const frames: PNG[] = [];

	for (let i = 0; i < frameCount; i++) {
		const frame = new PNG({ width: png.width, height: frameHeight });
		for (let y = 0; y < frameHeight; y++) {
			for (let x = 0; x < png.width; x++) {
				const srcIdx = ((i * frameHeight + y) * png.width + x) * 4;
				const gray = png.data[srcIdx];
				let index: number;
				if (gray < 64) index = 0;
				else if (gray < 128) index = 1;
				else if (gray < 192) index = 2;
				else index = 3;
				frame.data[(y * png.width + x) * 4] = index;
			}
		}
		frames.push(frame);
	}
	return frames;
}

/** Apply Game Boy Color palette mapping: 0->transparent, 1->black, 2->palette[1], 3->palette[0] */
function applyPalette(frame: PNG, palette: RGB[]): PNG {
	const result = new PNG({ width: frame.width, height: frame.height });

	for (let y = 0; y < frame.height; y++) {
		for (let x = 0; x < frame.width; x++) {
			const idx = (y * frame.width + x) * 4;
			const pixelIndex = frame.data[idx];

			switch (pixelIndex) {
				case 0: // Transparent
					result.data[idx + 0] = 0;
					result.data[idx + 1] = 0;
					result.data[idx + 2] = 0;
					result.data[idx + 3] = 0;
					break;
				case 1: // Black
					result.data[idx + 0] = 0;
					result.data[idx + 1] = 0;
					result.data[idx + 2] = 0;
					result.data[idx + 3] = 255;
					break;
				case 2: // Palette[1]
					result.data[idx + 0] = palette[1].r;
					result.data[idx + 1] = palette[1].g;
					result.data[idx + 2] = palette[1].b;
					result.data[idx + 3] = 255;
					break;
				case 3: // Palette[0]
					result.data[idx + 0] = palette[0].r;
					result.data[idx + 1] = palette[0].g;
					result.data[idx + 2] = palette[0].b;
					result.data[idx + 3] = 255;
					break;
			}
		}
	}

	return result;
}

/** Create GIF */
function createGIF(frames: PNG[], animSequence: AnimFrame[], outputPath: string): void {
	const width = frames[0].width;
	const height = frames[0].height;
	const encoder = new GIFEncoder(width, height);
	const outStream = createWriteStream(outputPath);
	encoder.createReadStream().pipe(outStream);

	encoder.start();
	encoder.setRepeat(0);
	encoder.setQuality(10);

	for (const animFrame of animSequence) {
		const idx = animFrame.frameNumber - 1;
		if (idx >= 0 && idx < frames.length) {
			encoder.setDelay(animFrame.duration * 10);
			encoder.addFrame(frames[idx].data, true);
		}
	}

	encoder.finish();
}

/** Process Pokémon folder, optional palette override for Unown letters */
function processPokemon(
	pokemonFolder: string,
	outputFolder: string,
	normalPaletteOverride?: RGB[],
	shinyPaletteOverride?: RGB[]
): void {
	const pngPath = join(pokemonFolder, 'front.png');
	const animPath = join(pokemonFolder, 'anim.asm');

	const normalPalette = normalPaletteOverride || parsePalette(join(pokemonFolder, 'normal.pal'));
	const shinyPalette = shinyPaletteOverride || parsePalette(join(pokemonFolder, 'shiny.pal'));
	const animSequence = parseAnimation(animPath);
	const spriteFrames = loadSpriteSheet(pngPath);
	const normalFrames = spriteFrames.map((f) => applyPalette(f, normalPalette));
	const shinyFrames = spriteFrames.map((f) => applyPalette(f, shinyPalette));

	if (!existsSync(outputFolder)) mkdirSync(outputFolder, { recursive: true });

	createGIF(normalFrames, animSequence, join(outputFolder, 'normal.gif'));
	createGIF(shinyFrames, animSequence, join(outputFolder, 'shiny.gif'));
}

/** Main GIF generation */
export function gifs(): void {
	const pokemonFolders = readdirSync(INPUT_DIR, { withFileTypes: true })
		.filter((d) => d.isDirectory())
		.map((d) => d.name);

	// Load Unown palettes if present
	let unownNormalPalette: RGB[] | undefined;
	let unownShinyPalette: RGB[] | undefined;
	if (pokemonFolders.includes('unown')) {
		const unownPalPath = join(INPUT_DIR, 'unown');
		unownNormalPalette = parsePalette(join(unownPalPath, 'normal.pal'));
		unownShinyPalette = parsePalette(join(unownPalPath, 'shiny.pal'));
	}

	for (const name of pokemonFolders) {
		const inputPath = join(INPUT_DIR, name);
		const outputPath = join(OUTPUT_DIR, name);

		if (name.toLowerCase().startsWith('unown') && name !== 'unown') {
			processPokemon(inputPath, outputPath, unownNormalPalette!, unownShinyPalette!);
		} else if (name !== 'unown') {
			processPokemon(inputPath, outputPath);
		}
	}
}

export default gifs;
