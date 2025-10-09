export const buf2hex = (buffer: ArrayBuffer): Array<string> => {
	return Array.from(
		[...new Uint8Array(buffer)].map((x) => x.toString(16).padStart(2, '0').toUpperCase())
	);
};

export const hex2buf = (hex: string[]): ArrayBuffer => {
	const bytes = new Uint8Array(hex.map((byte) => parseInt(byte, 16)));
	return bytes.buffer;
};

export const hex2bin = (hex: string): string => {
	return parseInt(hex, 16).toString(2).padStart(8, '0');
};
