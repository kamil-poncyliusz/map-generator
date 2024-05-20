interface ParsedColor {
  r: number;
  g: number;
  b: number;
}

export class LCG {
  private seed: number;
  private modulus: number;
  private multiplier: number;
  private increment: number;
  constructor(seed: number) {
    this.seed = seed;
    this.modulus = 233280;
    this.multiplier = 9301;
    this.increment = 49297;
  }
  public next(): number {
    this.seed = (this.multiplier * this.seed + this.increment) % this.modulus;
    return this.seed / this.modulus;
  }
}

export function random2dArray(seed: number, size: number, limit: number): number[][] {
  const random = new LCG(seed);
  const result: number[][] = [];
  for (let i = 0; i < size; i++) {
    const row: number[] = [];
    for (let j = 0; j < size; j++) {
      const randomNumber = Math.floor(random.next() * limit);
      row.push(randomNumber);
    }
    result.push(row);
  }
  return result;
}

export function filled2dArray<T>(size: number, value: T): T[][] {
  const result: T[][] = [];
  for (let i = 0; i < size; i++) {
    const row: T[] = [];
    for (let j = 0; j < size; j++) {
      row.push(value);
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
