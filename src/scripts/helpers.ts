interface ParsedColor {
  r: number;
  g: number;
  b: number;
}

export function random2dArray(seed:number, size:number): number[][] {
  const limit = 1000;
  let n = seed;
  const result: number[][] = [];
  for (let i = 0; i < size; i++) {
    const row: number[] = [];
    for (let j = 0; j < size; j++) {
      n = (n * 9301 + 49297) % 233280;
      const randomNumber = Math.floor((n / 233280) * limit);
      row.push(randomNumber);
    }
    result.push(row);
  }
  return result;
}
  
export function filled2dArray(size: number): number[][] {
  const result: number[][] = [];
  for (let i = 0; i < size; i++) {
    const row: number[] = [];
    for (let j = 0; j < size; j++) {
      row.push(0);
    }
    result.push(row);
  }
  return result;
}

export const parseHexColor = function (color: string): ParsedColor {
  const black = { r: 0, g: 0, b: 0 };
  const regex = new RegExp("^#[A-Fa-f0-9]{6}$");
  if (!regex.test(color)) return black;
  return { r: parseInt(color.slice(1, 3), 16), g: parseInt(color.slice(3, 5), 16), b: parseInt(color.slice(5, 7), 16) };
};