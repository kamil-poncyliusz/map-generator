import { filled2dArray } from "./helpers";

export function matrixValuesRange(matrix: number[][]): [number, number] {
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

export function normalizeMatrix(matrix: number[][], min: number, max: number) {
  const [matrixMin, matrixMax] = matrixValuesRange(matrix);
  const matrixRange = matrixMax - matrixMin;
  const newRange = max - min;
  for (let x = 0; x < matrix.length; x++) {
    for (let y = 0; y < matrix[x].length; y++) {
      matrix[x][y] = Math.round(((matrix[x][y] - matrixMin) / matrixRange) * newRange + min);
    }
  }
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

export function landMatrix(matrix: number[][], landPercentage: number): boolean[][] {
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

export function riverFlowMatrix(noise: number[][], waterLevel: number): number[][] {
  const matrixSize = noise.length;
  const riverFlowMatrix = filled2dArray(matrixSize, 1);
  const vectors = [
    [-1, -1],
    [1, -1],
    [1, 1],
    [-1, 1],
    [-1, 0],
    [0, -1],
    [1, 0],
    [0, 1],
    [0, 0],
  ];
  for (let level = 255; level >= waterLevel; level--) {
    for (let x = 0; x < matrixSize; x++) {
      for (let y = 0; y < matrixSize; y++) {
        if (noise[x][y] === level) {
          let biggestDifference = 0;
          let lowestNeighbourX = x;
          let lowestNeighbourY = y;
          for (let i = 0; i < 8; i++) {
            const [dx, dy] = vectors[i];
            let neighbourX = x + dx;
            let neighbourY = y + dy;
            if (neighbourX < 0) neighbourX = matrixSize - 1;
            else if (neighbourX >= matrixSize) neighbourX = 0;
            if (neighbourY < 0) neighbourY = matrixSize - 1;
            else if (neighbourY >= matrixSize) neighbourY = 0;
            const difference = noise[x][y] - noise[neighbourX][neighbourY];
            if (difference >= biggestDifference) {
              biggestDifference = difference;
              lowestNeighbourX = neighbourX;
              lowestNeighbourY = neighbourY;
            }
          }
          riverFlowMatrix[lowestNeighbourX][lowestNeighbourY] += riverFlowMatrix[x][y];
        }
      }
    }
  }
  return riverFlowMatrix;
}

export function landMatrixWithRivers(noise: number[][], landPercentage: number): boolean[][] {
  const waterThreshold = waterLevel(noise, landPercentage);
  const riverThreshold = 15;
  const riverFlow = riverFlowMatrix(noise, waterThreshold);
  const result: boolean[][] = [];
  for (let x = 0; x < noise.length; x++) {
    const row: boolean[] = [];
    for (let y = 0; y < noise[x].length; y++) {
      row.push(noise[x][y] >= waterThreshold && riverFlow[x][y] < riverThreshold);
    }
    result.push(row);
  }
  return result;
}
