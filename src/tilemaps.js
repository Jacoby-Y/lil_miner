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

export const MainTileIds = {
    sky: 0,
    dirt: 1,
    quartz: 3,
    coal: 4,
    iron: 5,
    copper: 6,
    ruby: 7,
    gold: 8,
    diamond: 9,
    grass: 10,
    flower_1: 11,
    flower_2: 12,
    grass_block_1: 20,
    grass_block_2: 21,
    cave_wall: 22,
    cave_entrance: 23,
}

// export const MainTileIds = Object.fromEntries(
//     Object.entries(main_tiles).map(([k, v])=> [v.name, k])
// )

export const main_atlas = createAtlas("main", "../assets/main_tilemap.png", 10);
