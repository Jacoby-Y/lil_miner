import * as draw from "./canvas.js";
import * as world from "./world.js";
import * as tilemaps from "./tilemaps.js";

window.onresize = ()=>{
    let scale = 1;
    const w = document.body.parentElement.clientWidth;
    const h = document.body.parentElement.clientHeight;
    if (w*(720/1200) >= h) scale = h/720;
    else scale = w/1200;
    
    document.body.style.transform = `translate(-50%, -50%) scale(${scale}, ${scale})`;
}; window.onresize();

console.log(tilemaps.main_tiles);

world.generate();
world.render();