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