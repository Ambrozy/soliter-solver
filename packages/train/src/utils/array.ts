export const emptyArray = <T>(length: number) => Array.from(Array(length)) as T[];
export const range = (length: number) => Array(length).keys();
export const array1d = <T>(length: number, initial: T): T[] =>
    emptyArray(length).map(() => initial);
export const array2d = <T>(shape: [number, number], initial: T): T[][] =>
    emptyArray(shape[0]).map(() => array1d(shape[1], initial));
