interface CellularAutomataSettings {
    size: number;
    seed: number;
    iterations: number;
    deathThreshold: number;
    initialDensity: number;
}

export function cellularAutomata(settings: CellularAutomataSettings) {
    const { size, seed, iterations, deathThreshold, initialDensity } = settings;
    const limit = 1000;
    let n = seed;
    let grid: boolean[][] = [];
    for (let i = 0; i < size; i++) {
        const row: boolean[] = [];
        for (let j = 0; j < size; j++) {
            n = (n * 9301 + 49297) % 233280;
            const randomNumber = Math.floor((n / 233280) * limit);
            row.push(randomNumber < initialDensity * limit ? true : false);
        }
        grid.push(row);
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
                        if(newX < 0) newX += size;
                        else if(newX >= size) newX -= size;
                        let newY = j + y;
                        if(newY < 0) newY += size;
                        else if(newY >= size) newY -= size;
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