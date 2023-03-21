import { createAtlas } from "./canvas.js";
import { doubleMap } from "./util.js";

function newTile(name="joe", collider=true) {
    return { name, collider }
}

export const main_tiles = {
    0: newTile("sky", false),
    1: newTile("dirt", true),
    3: newTile("quartz", true),
    4: newTile("coal", true),
    5: newTile("iron", true),
    6: newTile("copper", true),
    7: newTile("ruby", true),
    8: newTile("gold", true),
    9: newTile("diamond", true),
    10: newTile("grass", false),
    11: newTile("flower_1", false),
    12: newTile("flower_2", false),
    20: newTile("grass_block_1", true),
    21: newTile("grass_block_2", true),
    22: newTile("cave_wall", false),
    23: newTile("cave_entrance", false),
};

export const main_atlas = createAtlas("main", "../assets/main_tilemap.png", 10);

main_atlas.drawAtCoord(10, 10, 30, 30, 3, 0);
main_atlas.drawAtIndex(10, 40, 30, 30, 12);