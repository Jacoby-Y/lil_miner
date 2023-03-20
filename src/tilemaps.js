import { createAtlas } from "./canvas.js";
import { doubleMap } from "./util.js";

export const main_tiles = doubleMap({
    0: "sky",
    1: "dirt",
});

export const main_atlas = createAtlas("../assets/main_tilemap.png", 10);

main_atlas.drawAtCoord(10, 10, 30, 30, 3, 0);
main_atlas.drawAtIndex(10, 40, 30, 30, 12);