import { createAtlas } from "./canvas.js";
import { doubleMap } from "./util.js";

export const main_tiles = doubleMap({
    0: "sky",
    1: "dirt",
});

export const main_atlas = createAtlas("main", "../assets/main_tilemap.png", 10);
