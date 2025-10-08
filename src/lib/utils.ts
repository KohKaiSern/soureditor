export const buf2hex = (buffer: ArrayBuffer): Array<string> => {
  return Array.from(
    [...new Uint8Array(buffer)].map((x) => x.toString(16).padStart(2, '0').toUpperCase())
  );
}
