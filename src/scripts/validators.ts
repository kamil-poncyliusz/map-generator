export function isInRange(min: number, max: number): (value: number) => boolean {
  return (value: number) => {
    return value >= min && value <= max;
  };
}
  
export function isDivisibleByPowerOfTwo(power: number): (value: number) => boolean {
  return (value: number) => {
    if (value <= 0) return false;
    return value % Math.pow(2, power) === 0;
  };
}
  
export function highestPowerOfTwoFactor(value: number): number {
  let power = 0;
  while (value % 2 === 0) {
    power++;
    value /= 2;
  }
  return power;
}