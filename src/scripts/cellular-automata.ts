import { LCG, filled2dArray } from "./helpers";

interface CellularAutomataSettings {
  size: number;
  seed: number;
  iterations: number;
  deathThreshold: number;
  initialDensity: number;
}

export function cellularAutomata(settings: CellularAutomataSettings) {
  const { size, seed, iterations, deathThreshold, initialDensity } = settings;
  const random = new LCG(seed);
  let grid: boolean[][] = filled2dArray(size, false);
  for (let x = 0; x < size; x++) {
    for (let y = 0; y < size; y++) {
      const randomNumber = random.next();
      grid[x][y] = randomNumber < initialDensity ? true : false;
    }
  }
  for (let i = 0; i < iterations; i++) {
    const newGrid: boolean[][] = [];
    for (let i = 0; i < size; i++) {
      const newRow: boolean[] = [];
      for (let j = 0; j < size; j++) {
        let deadNeighbors = 0;
        for (let x = -1; x < 2; x++) {
          for (let y = -1; y < 2; y++) {
            let newX = i + x;
            if (newX < 0) newX += size;
            else if (newX >= size) newX -= size;
            let newY = j + y;
            if (newY < 0) newY += size;
            else if (newY >= size) newY -= size;
            if (!grid[newX][newY]) deadNeighbors++;
          }
        }
        if (deadNeighbors >= deathThreshold) {
          newRow.push(false);
        } else {
          newRow.push(true);
        }
      }
      newGrid.push(newRow);
    }
    grid = newGrid;
  }
  return grid;
}
