import * as draw from "./canvas.js";
import * as world from "./world.js";
import * as tilemaps from "./tilemaps.js";
import * as window from "./window.js";

console.log(tilemaps.main_tiles);

world.generate();
world.render();

