import { LCG, filled2dArray } from "./helpers";
import { normalizeMatrix } from "./landmap-generator";
import { isPowerOfTwo } from "./validators";

interface DiamondSquareNoiseParams {
  seed: number;
  size: number;
  fragmentation: number;
}
export function diamondSquareNoise({ seed, size, fragmentation }: DiamondSquareNoiseParams): number[][] {
  if (!isPowerOfTwo(size)) throw new Error("Size must be a power of 2");
  const map = filled2dArray(size, 0);
  const random = new LCG(seed);
  map[0][0] = random.next();
  let side = size;
  let roughness = 1;
  let extraInitialSteps = fragmentation;
  while (side > 1) {
    const halfSide = side / 2;
    for (let x = 0; x < size; x += side) {
      for (let y = 0; y < size; y += side) {
        if (extraInitialSteps > 0) {
          map[x + halfSide][y + halfSide] = map[0][0];
          extraInitialSteps--;
          continue;
        }
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
        if (extraInitialSteps > 0) {
          map[x][y] = map[0][0];
          extraInitialSteps--;
          continue;
        }
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
  normalizeMatrix(map, 0, 255);
  return map;
}
