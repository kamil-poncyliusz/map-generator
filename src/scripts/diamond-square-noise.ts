import { Randomizer, filled2dArray } from "./helpers";
import { isPowerOfTwo } from "./validators";

interface DiamondSquareNoiseParams {
  seed: number;
  size: number;
  roughness: number;
}
export function diamondSquareNoise({ seed, size, roughness }: DiamondSquareNoiseParams): number[][] {
  if (!isPowerOfTwo(size)) throw new Error("Size must be a power of 2");
  const map = filled2dArray(size, 0);
  const random = new Randomizer(seed);
  map[0][0] = random.next();
  let side = size;
  while (side > 1) {
    const halfSide = side / 2;
    for (let x = 0; x < size; x += side) {
      for (let y = 0; y < size; y += side) {
        const average =
          (map[x][y] +
            map[(x + side) % size][y] +
            map[x][(y + side) % size] +
            map[(x + side) % size][(y + side) % size]) /
          4;
        map[x + halfSide][y + halfSide] = average + (random.next() - 0.5) * roughness;
      }
    }
    for (let x = 0; x < size; x += halfSide) {
      for (let y = (x + halfSide) % side; y < size; y += side) {
        const average =
          (map[(x - halfSide + size) % size][y] +
            map[(x + halfSide) % size][y] +
            map[x][(y + halfSide) % size] +
            map[x][(y - halfSide + size) % size]) /
          4;
        map[x][y] = average + (random.next() - 0.5) * roughness;
      }
    }
    side /= 2;
    roughness /= 2;
  }
  let min = map[0][0];
  let max = map[0][0];
  for (let i = 0; i < size; i++) {
    for (let j = 0; j < size; j++) {
      if (map[i][j] < min) min = map[i][j];
      if (map[i][j] > max) max = map[i][j];
    }
  }
  const range = max - min;
  for (let i = 0; i < size; i++) {
    for (let j = 0; j < size; j++) {
      map[i][j] = Math.floor(((map[i][j] - min) / range) * 255);
    }
  }
  return map;
}