declare module "@mapbox/polyline" {
  export function encode(coordinates: number[][]): string;
  export function decode(encoded: string): number[][];
}
