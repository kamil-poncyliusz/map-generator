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

function scaleWithBilinearInterpolation(
  base: number[][],
  octave: number
): number[][] {
  const size = base.length;
  const layer = filled2dArray(size);
  const ratio = Math.pow(2, octave);
  for (let x = 0; x < size / ratio; x++) {
    for (let y = 0; y < size / ratio; y++) {
      layer[ratio * x][ratio * y] = base[x][y];
    }
  }
  for (
    let distance = ratio / 2;
    distance > 0;
    distance = Math.floor(distance / 2)
  ) {
    const doubleDistance = distance * 2;
    for (let x = 0; x < size; x += doubleDistance) {
      for (let y = 0; y < size; y += doubleDistance) {
        const y1 = y + doubleDistance == size ? 0 : y + doubleDistance;
        const x1 = x + doubleDistance == size ? 0 : x + doubleDistance;
        layer[x][y + distance] = Math.round((layer[x][y] + layer[x][y1]) / 2);
        layer[x + distance][y] = Math.round((layer[x][y] + layer[x1][y]) / 2);
        layer[x + distance][y + distance] = Math.round(
          (layer[x][y] + layer[x][y1] + layer[x1][y] + layer[x1][y1]) / 4
        );
      }
    }
  }
  return layer;
}

function cubicInterpolation(
  a: number,
  b: number,
  c: number,
  d: number,
  x: number
) {
  const p = d - c - (a - b);
  const q = a - b - p;
  const r = c - a;
  const s = b;
  return p * Math.pow(x, 3) + q * Math.pow(x, 2) + r * x + s;
}

function scaleWithBicubicInterpolation(base: number[][], octave: number) {
  const size = base.length;
  const layer = filled2dArray(size);
  const scale = Math.pow(2, octave);
  if (size % scale !== 0) throw new Error("Size must be divisible by scale");
  const baseSize = size / scale;
  for (let baseX = 0; baseX < baseSize; baseX++) {
    let a = baseX - 1;
    if (a < 0) a += baseSize;
    const b = baseX;
    let c = baseX + 1;
    if (c >= baseSize) c -= baseSize;
    let d = baseX + 2;
    if (d >= baseSize) d -= baseSize;
    for (let baseY = 0; baseY < baseSize; baseY++) {
      layer[baseX * scale][baseY * scale] = base[baseX][baseY];
      for (let x = 1; x < scale; x++) {
        const xRatio = x / scale;
        layer[baseX * scale + x][baseY * scale] = cubicInterpolation(
          base[a][baseY],
          base[b][baseY],
          base[c][baseY],
          base[d][baseY],
          xRatio
        );
      }
    }
  }
  for (let y = 0; y < size; y += scale) {
    for (let x = 0; x < size; x++) {
      let a = y - scale;
      if (a < 0) a += size;
      const b = y;
      let c = y + scale;
      if (c >= size) c -= size;
      let d = y + scale * 2;
      if (d >= size) d -= size;
      for (let j = 1; j < scale; j++) {
        const yRatio = j / scale;
        layer[x][y + j] = cubicInterpolation(
          layer[x][a],
          layer[x][b],
          layer[x][c],
          layer[x][d],
          yRatio
        );
      }
    }
  }
  return layer;
}

function getLayerInterpolation(interpolationMethod: number) {
  if (interpolationMethod === 0) return scaleWithBilinearInterpolation;
  if (interpolationMethod === 1) return scaleWithBicubicInterpolation;
  throw new Error("Invalid interpolation method");
}

export function generateNoise(settings: Settings): number[][] {
  const { size, firstOctave, lastOctave } = settings;
  const octaves = lastOctave - firstOctave + 1;
  const layers = [];
  layers.push(random2dArray(settings));
  const getLayer = getLayerInterpolation(settings.interpolationMethod);
  for (let octave = 1; octave < lastOctave; octave++) {
    const layer = getLayer(layers[0], octave);
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

function matrixValuesRange(matrix: number[][]): [number, number] {
  let min = matrix[0][0];
  let max = matrix[0][0];
  for (let x = 0; x < matrix.length; x++) {
    for (let y = 0; y < matrix[x].length; y++) {
      if (matrix[x][y] < min) min = matrix[x][y];
      if (matrix[x][y] > max) max = matrix[x][y];
    }
  }
  return [min, max];
}

function layerHistogram(matrix: number[][]): number[] {
  const histogram: number[] = [];
  const [, max] = matrixValuesRange(matrix);
  for (let i = 0; i < max; i++) {
    histogram.push(0);
  }
  for (let x = 0; x < matrix.length; x++) {
    for (let y = 0; y < matrix[x].length; y++) {
      histogram[matrix[x][y]]++;
    }
  }
  return histogram;
}

function waterLevel(matrix: number[][], landPercentage: number): number {
  const histogram = layerHistogram(matrix);
  const waterPercentage = 100 - landPercentage;
  const totalPixels = matrix.length * matrix[0].length;
  const waterPixels = Math.floor((waterPercentage / 100) * totalPixels);
  let sum = 0;
  for (let i = 0; i < histogram.length; i++) {
    sum += histogram[i];
    if (sum > waterPixels) {
      return i;
    }
  }
  return histogram.length;
}

export function landMatrix(settings: Settings): boolean[][] {
  const matrix = generateNoise(settings);
  const landPercentage = settings.landPercentage;
  const waterThreshold = waterLevel(matrix, landPercentage);
  const result: boolean[][] = [];
  for (let x = 0; x < matrix.length; x++) {
    const row: boolean[] = [];
    for (let y = 0; y < matrix[x].length; y++) {
      row.push(matrix[x][y] >= waterThreshold);
    }
    result.push(row);
  }
  return result;
}
