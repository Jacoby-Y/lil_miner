import { main_atlas } from "./tilemaps.js";

export const width = 13;
export const height = 6;
export const cell_size = 60;

export const world_data = new Uint8Array([
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0,
    1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
]);

export function generate() {
    // for (let i = 0; i < world_data.length; i++) {
    //     world_data[i] = Math.floor(Math.random() * 13);
    // }
}

console.log(world_data);

export function render() {
    // console.time("render");
    for (let i = 0; i < world_data.length; i++) {
        const id = world_data[i];
        main_atlas.drawAtIndex(
            cell_size * (i%width), cell_size * Math.floor(i/width),
            cell_size, cell_size,
            id
        );
    }
    // console.timeEnd("render");
}