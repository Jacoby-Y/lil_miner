import { canvases } from "./canvas.js";
import { main_atlas } from "./tilemaps.js";
import * as window from "./window.js";

export const cols = 13;
export const rows = 8;
export const cell_size = 60;
export const width = cols * cell_size;
export const height = rows * cell_size;

export const world_data = new Uint8Array([
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0,
    1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
]);

console.log(world_data[0]);

export function generate() {
    // for (let i = 0; i < world_data.length; i++) {
    //     world_data[i] = Math.floor(Math.random() * 13);
    // }
}

let prev_render = null;

export function render() {
    // console.time("render");
    for (let i = 0; i < world_data.length; i++) {
        const id = world_data[i];
        const x = cell_size * (i%cols);
        const y = cell_size * Math.floor(i/cols);
        main_atlas.drawAtIndex(
            x, y,
            cell_size, cell_size,
            id
        );

        if (id == 3) console.log(x, y);
    }
    // console.timeEnd("render");

    prev_render = canvases.main.ctx.getImageData(0, 0, width, height);
}

const lerp = (val=1, min=0, max=2)=> (val - min) / (max - min);

const scaleY = (pos=0)=>{
    const win = document.body.parentElement.clientHeight;
    const body = document.body.clientHeight;
    const scr = pos / win;
    const top_p = Math.round((1 - body*window.scale / win)/2 * 100)/100;
    const bot_p = 1 - top_p;
    const perc = lerp(scr, top_p, bot_p);

    return perc * 720;
}

const scaleX = (pos=0)=>{
    const win = document.body.parentElement.clientWidth;
    const body = document.body.clientWidth;
    const scr = pos / win;
    const left_p = Math.round(((1 - (body*window.scale / win)))/2 * 100)/100;
    const right_p = 1 - left_p;
    const perc = lerp(scr, left_p, right_p);

    return perc * 1200;
}

canvases.main.canvas.onmousemove = (ev)=>{
    ev.preventDefault();
    const [cx,cy] = [ev.clientX, ev.clientY];
    const x = Math.round(scaleX(cx));
    const y = Math.round(scaleY(cy));

    const gx = Math.floor(x / cell_size) * cell_size + cell_size/2;
    const gy = Math.floor(y / cell_size) * cell_size + cell_size/2;

    const ctx = canvases.main.ctx;
    ctx.putImageData(prev_render, 0, 0);

    // const block_rad = cell_size/2-10;

    // const verts = [
    //     checkPoint(x-block_rad, y-block_rad),
    //     checkPoint(x-block_rad, y+block_rad),
    //     checkPoint(x+block_rad, y-block_rad),
    //     checkPoint(x+block_rad, y+block_rad),
    // ];

    // const touching = verts.find((id)=> id != 0);

    // if (!touching) ctx.fillStyle = "green";
    // else ctx.fillStyle = "pink";

    // ctx.fillRect(x-block_rad, y-block_rad, block_rad*2, block_rad*2)

    checkPoint(gx, gy);
    checkPoint(gx-cell_size, gy);
    checkPoint(gx-cell_size, gy-cell_size);
    checkPoint(gx, gy-cell_size);
    checkPoint(gx+cell_size, gy);
    checkPoint(gx+cell_size, gy+cell_size);
    checkPoint(gx, gy+cell_size);
    checkPoint(gx-cell_size, gy+cell_size);
    checkPoint(gx+cell_size, gy-cell_size);
}

function checkPoint(x, y) {
    const block = screenToWorld(x, y);
    const ctx = canvases.main.ctx;

    if (block == null) return null;
    if (block == 0) ctx.fillStyle = "black";
    else ctx.fillStyle = "red";

    // ctx.fillRect(x-2, y-2, 4, 4);
    ctx.fillRect(x-5, y-5, 10, 10);

    return block;
}

function screenToWorld(x=0,y=0) {
    const w = width;
    const h = height;

    if (x > w || x < 0 || y > h || y < 0) {
        // console.log(`(${x}, ${y}) is out of bounds!`);
        return null;
    }

    const [ix, iy] = [Math.floor(x/cell_size), Math.floor(y/cell_size)];

    const index = iy*cols + ix;

    return world_data[index];

    // console.log("Get quartz block?", screenToWorld(550, 250));
    // Testing commit
}