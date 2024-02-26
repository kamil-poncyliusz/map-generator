import { Settings } from "../App";

function random2dArray(settings: Settings): number[][] {
  const limit = 1000;
  const { seed, size } = settings;
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

function filled2dArray(size: number): number[][] {
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

function generateNoise(settings: Settings): number[][] {
  const { size, firstOctave, lastOctave } = settings;
  const octaves = lastOctave - firstOctave + 1;
  const layers = [];
  layers.push(random2dArray(settings));
  for (let octave = 1; octave < lastOctave; octave++) {
    const layer = filled2dArray(size);
    const ratio = Math.pow(2, octave);
    for (let x = 0; x < size / ratio; x++) {
      for (let y = 0; y < size / ratio; y++) {
        layer[ratio * x][ratio * y] = layers[0][x][y];
      }
    }
    for (
      let distance = ratio / 2;
      distance > 0;
      distance = Math.floor(distance / 2)
    ) {
      for (let x = 0; x < size; x += distance * 2) {
        for (let y = 0; y < size; y += distance * 2) {
          const y1 = y + 2 * distance == size ? 0 : y + 2 * distance;
          const x1 = x + 2 * distance == size ? 0 : x + 2 * distance;
          layer[x][y + distance] = Math.round((layer[x][y] + layer[x][y1]) / 2);
          layer[x + distance][y] = Math.round((layer[x][y] + layer[x1][y]) / 2);
          layer[x + distance][y + distance] = Math.round(
            (layer[x][y] + layer[x][y1] + layer[x1][y] + layer[x1][y1]) / 4
          );
        }
      }
    }
    layers.push(layer);
  }
  const result = [];
  const sumOfWeights = Math.pow(2, octaves) - 1;
  for (let x = 0; x < size; x++) {
    const row = [];
    for (let y = 0; y < size; y++) {
      let sum = 0;
      for (let layer = firstOctave - 1; layer < lastOctave; layer++) {
        sum += layers[layer][x][y] * Math.pow(2, layer - firstOctave + 1);
      }
      sum = Math.round(sum / sumOfWeights);
      row.push(sum);
    }
    result.push(row);
  }
  return result;
}

export default generateNoise;
