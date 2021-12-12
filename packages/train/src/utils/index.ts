export const random = (min: number, max: number) => min + Math.random() * (max - min);
export const randomInteger = (min: number, max: number) => Math.floor(random(min, max));
