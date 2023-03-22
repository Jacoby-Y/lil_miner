import { canvases } from "./canvas.js";
import { MainTileIds, main_atlas, main_tiles } from "./tilemaps.js";
import * as window from "./window.js";
import { controller } from "./controller.js";
import createPlayer from "./player.js";

export const cols = 20;
export const rows = 12;
// export const cols = 120;
// export const rows = cols * (3/5);
export const cell_size = 1200/cols;
export const width = cols * cell_size;
export const height = rows * cell_size;

// 12 / 20 -> 6/10 -> 3/5

// export const world_data = new Uint8Array(rows*cols).fill(1);
export const world_data = new Uint8Array([
    1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
    1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1,
    1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1,
    1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1,
    1, 0, 0, 0, 0, 1, 1, 0, 1, 5, 0, 0, 1, 1, 1, 1, 4, 1, 1, 1,
    1, 1, 0, 0, 0, 0, 0, 4, 0, 0, 0, 0, 1, 1, 1, 1, 4, 1, 1, 1,
    1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 4, 1, 4, 1, 1,
    1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 4, 4, 1, 1, 1,
    1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 4, 1, 1, 1,
    1, 1, 1, 1, 4, 4, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 5,
    1, 1, 1, 1, 4, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 5, 5, 1,
    1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 5, 1, 1,
]);

// console.log(world_data.length);

export function generate() {
    // for (let i = 0; i < world_data.length; i++) {
    //     world_data[i] = Math.floor(Math.random() * 13);
    // }

    world_data.fill(1);

    const noise = noiseGrid(0.55, world_data.length);
    const cel_aut = cellularAutomata(4, noise, 4);
    // console.log(noise);
    // console.log(cel_aut);

    const ore_chance = 0.01;
    for (let i = 0; i < world_data.length; i++) {
        if (Math.random() > ore_chance) continue;
        veinMaker(i % cols, Math.floor(i/cols), Math.ceil(Math.random()*2 + 1), Math.floor(Math.random() * 3 + 3));
    }

    for (let i = 0; i < cel_aut.length; i++) {
        const id = cel_aut[i];
        if (id == 1) world_data[i] = MainTileIds.cave_wall;
    }

    
    // for (let i = 0; i < 40; i++) {
    //     const rx = Math.floor(Math.random() * cols);
    //     const ry = Math.floor(Math.random() * rows);
        
    //     // veinMaker(rx, ry, Math.ceil(Math.random()*3 + 1), Math.floor(Math.random() * 20));
    //     veinMaker(rx, ry, Math.ceil(Math.random()*3+1), Math.floor(Math.random() * 3 + 3));
    // }
    
    // for (let i = 0; i < 20; i++) {
    //     const rx = Math.floor(Math.random() * cols);
    //     const ry = Math.floor(Math.random() * rows);

    //     for (let j = 0; j < 10; j++) veinMaker(rx, ry, 20, MainTileIds.cave_wall);
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

function placeBlock(x=0, y=0, id=0) {
    world_data[x + y*cols] = id;
}

function veinMaker(x=0, y=0, size=5, id=MainTileIds.cave_wall, weights=[1,1,1,1]) {
    let [cx, cy] = [x, y];

    placeBlock(cx, cy, id);

    function step() {
        let dir = Math.floor(Math.random()*4);

        // if (dir == 0) {
        //     const to_change = blockAtCoord(cx, cy - 1);
        //     if (to_change == null || to_change == id) {
        //         dir = (dir + 1) % 4;
        //     } else {
        //         cy -= 1;
        //     }
        // }
        if (dir == 0) cy -= 1;
        if (dir == 2) cy += 1;
        if (dir == 1) cx -= 1;
        if (dir == 3) cx += 1;
        
        placeBlock(cx, cy, id);
    }

    for (let i = 0; i < size; i++) {
        step();
    }
}

function noiseGrid(density=0.5, size=10) {
    const grid = new Uint8Array(size);
    for (let i = 0; i < grid.length; i++) {
        if (
            i % cols == 0 || Math.floor(i/cols) == 0 ||
            i % cols == cols - 1 || Math.floor(i/cols) == rows - 1) continue;
        grid[i] = Math.random() > density ? 0 : 1;
    }
    return grid;
}

function cellularAutomata(iters=1, grid=[0], neighbor=4) {
    function blockAtCoord(x=0, y=0) {
        if (x >= cols || y >= rows || x < 0 || y < 0) return null;
        return grid[x + y*cols] ?? null;
    }    
    function neighborCount(x=0, y=0) {
        let count = 0;

        for (let a = -1; a < 2; a++) {
            for (let b = -1; b < 2; b++) {
                const cx = x + a;
                const cy = y + b;
                if (cx == x && cy == y) continue;
                const block = blockAtCoord(cx, cy);
                if (block == null || block == 1) count++; 
            }
        }

        return count;
    }
    function runAutomata() {
        const new_grid = new Uint8Array(grid.length);
        for (let j = 0; j < new_grid.length; j++) {
            const x = j % cols;
            const y = Math.floor(j/cols);
            const neighbors = neighborCount(x, y);
            if (neighbors > neighbor) new_grid[j] = 1;
            else new_grid[j] = 0;
        }
        return new_grid;
    }

    for (let i = 0; i < iters; i++) {
        const new_grid = runAutomata();
        grid = new_grid;
    }

    return grid;
}

//#region | Crap
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

// canvases.main.canvas.onmousemove = (ev)=>{
//     ev.preventDefault();
//     const [cx,cy] = [ev.clientX, ev.clientY];
//     const x = Math.round(scaleX(cx));
//     const y = Math.round(scaleY(cy));

//     const gx = Math.floor(x / cell_size) * cell_size + cell_size/2;
//     const gy = Math.floor(y / cell_size) * cell_size + cell_size/2;

//     const ctx = canvases.main.ctx;
//     ctx.putImageData(prev_render, 0, 0);

//     const block_rad = cell_size/2-10;

//     const verts = [
//         checkPoint(x-block_rad, y-block_rad),
//         checkPoint(x-block_rad, y+block_rad),
//         checkPoint(x+block_rad, y-block_rad),
//         checkPoint(x+block_rad, y+block_rad),
//     ];

//     const touching = verts.find((id)=> id != 0);

//     if (!touching) ctx.fillStyle = "green";
//     else ctx.fillStyle = "pink";

//     ctx.fillRect(x-block_rad, y-block_rad, block_rad*2, block_rad*2);

//     // checkPoint(gx, gy);
//     // checkPoint(gx-cell_size, gy);
//     // checkPoint(gx-cell_size, gy-cell_size);
//     // checkPoint(gx, gy-cell_size);
//     // checkPoint(gx+cell_size, gy);
//     // checkPoint(gx+cell_size, gy+cell_size);
//     // checkPoint(gx, gy+cell_size);
//     // checkPoint(gx-cell_size, gy+cell_size);
//     // checkPoint(gx+cell_size, gy-cell_size);
// }

export function checkPoint(x, y) {
    const block = screenToWorld(x, y);
    const ctx = canvases.main.ctx;

    if (block == null) return null;
    if (block == 0) ctx.fillStyle = "black";
    else ctx.fillStyle = "red";

    // ctx.fillRect(x-2, y-2, 4, 4);
    ctx.fillRect(x-5, y-5, 10, 10);

    return block;
}

export function screenToWorld(x=0,y=0) {
    const w = width;
    const h = height;

    if (x > w || x < 0 || y > h || y < 0) {
        // console.log(`(${x}, ${y}) is out of bounds!`);
        return null;
    }

    const [ix, iy] = [Math.floor(x/cell_size), Math.floor(y/cell_size)];

    const index = iy*cols + ix;

    return world_data[index];
}

export function blockAtCoord(x=0, y=0) {
    if (x >= cols || y >= rows || x < 0 || y < 0) return null;
    return world_data[x + y*cols] ?? null;
}

export function dataAtPoint(x=0, y=0) {
    return [Math.floor(x/cell_size), Math.floor(y/cell_size), screenToWorld(x, y)];
}

function dataAtCoord(x=0, y=0) {
    return [x, y, blockAtCoord(x, y)];
}

function highlightCell(x=0, y=0, screen_pos=true) {
    if (screen_pos) {
        x = Math.floor(x/cell_size) * cell_size;
        y = Math.floor(y/cell_size) * cell_size;
    } else {
        x *= cell_size;
        y *= cell_size;
    }

    canvases.main.ctx.strokeRect(x, y, cell_size, cell_size);
}

function mineBlock(x=0, y=0) {
    const block = dataAtCoord(x, y);
    if (block == null) return;
    if ((main_tiles[block[2]]?.collider ?? false) == false) return;

    world_data[x + y*cols] = MainTileIds.cave_wall;

    render();
}

const checkOverlap = (x1, y1, w1, h1, x2, y2, w2, h2)=>{
	return (
		x1 + w1 >= x2 && x1 <= x2 + w2 && y1 + h1 >= y2 && y1 <= y2 + h2
	);
}

export function checkCollision(x, y, w, h) {
    const origin = dataAtPoint(x+w/2, y+h/2);
    if (origin[2] == null) return [0, 0];

    const bot1 = dataAtCoord(origin[0] - 1, origin[1] + 1);
    const bot2 = dataAtCoord(origin[0], origin[1] + 1);
    const bot3 = dataAtCoord(origin[0] + 1, origin[1] + 1);

    const top1 = dataAtCoord(origin[0] - 1, origin[1] - 1);
    const top2 = dataAtCoord(origin[0], origin[1] - 1);
    const top3 = dataAtCoord(origin[0] + 1, origin[1] - 1);

    const left1 = dataAtCoord(origin[0] - 1, origin[1] + 1);
    const left2 = dataAtCoord(origin[0] - 1, origin[1]);
    const left3 = dataAtCoord(origin[0] - 1, origin[1] - 1);

    const right1 = dataAtCoord(origin[0] + 1, origin[1] + 1);
    const right2 = dataAtCoord(origin[0] + 1, origin[1]);
    const right3 = dataAtCoord(origin[0] + 1, origin[1] - 1);

    function collide(x1, y1, w1, h1, x2, y2, w2, h2) {
        if (!checkOverlap(x1, y1, w1, h1, x2, y2, w2, h2)) {
            // canvases.main.ctx.strokeRect(x, y-10, 10, 10);
            return [0, 0];
        }
        
        const to_right =   x1+w1 - x2;
        const to_left =  x2+w2 - x1;
        const to_top =    y2+h2 - y1;
        const to_bottom = y1+h1 - y2;
        const closest = Math.min(
            to_left,
            to_right,
            to_top,
            to_bottom
        );

        if (closest == to_top) return [0, to_top];
        if (closest == to_bottom) return (y -= to_bottom, [0, -to_bottom]);
        if (closest == to_left) return [to_left, 0];
        if (closest == to_right) return [-to_right, 0];
    }

    function collideBox(box=[1,2,3], off=[0,0]) {
        if (main_tiles[box[2]]?.collider) {
            return collide(
                x+off[0], y+off[1], w, h,
                box[0] * cell_size, box[1] * cell_size, cell_size, cell_size
            );
        }
        return [0, 0];
    }

    function wrapBox(box1, box2, box3, off) {
        return [
            collideBox(box1, off),
            collideBox(box2, off),
            collideBox(box3, off),
        ].find(([x, y])=> x != 0 || y != 0) ?? [0,0];
    }

    const vecAdd = (vec1, vec2)=>{ vec1[0] += vec2[0]; vec1[1] += vec2[1] }

    let off = [0,0];
    const col_bot = wrapBox(bot1, bot2, bot3, off);
    vecAdd(off, col_bot);
    const col_top = wrapBox(top1, top2, top3, off);
    vecAdd(off, col_top);
    const col_left = wrapBox(left1, left2, left3, off);
    vecAdd(off, col_left);
    const col_right = wrapBox(right1, right2, right3, off);
    vecAdd(off, col_right);
    
    return off;
    
    // const result = [
    //     ...col_bot,
    //     ...col_top,
    //     ...col_left,
    //     ...col_right,
    // ].reduce((p, c)=> [
    //     p[0] || p[0] + c[0],
    //     p[1] || p[1] + c[1]
    // ], [0, 0]);

    // console.log(result);
    
    // return result;
}

export function snapPos(x=0, y=0) {
    return [Math.floor(x/cell_size)*cell_size, Math.floor(y/cell_size)*cell_size];
}

const mouse = {
    x: 0, y: 0, down: false,
}

canvases.main.canvas.onmousemove = (ev)=>{
    ev.preventDefault();
    const [cx,cy] = [ev.clientX, ev.clientY];
    const x = Math.round(scaleX(cx));
    const y = Math.round(scaleY(cy));

    mouse.x = x;
    mouse.y = y;
}

document.onmouseup = document.onmouseleave = ()=> mouse.down = false;
document.onmousedown = document.onmouseenter = ()=> mouse.down = true;

const player = createPlayer();

setInterval(()=>{
    const ctx = canvases.main.ctx;
    ctx.putImageData(prev_render, 0, 0);

    player.update();

    {
        const [x, y] = snapPos(mouse.x, mouse.y);

        ctx.strokeStyle = "#aaaaaa33";
        ctx.strokeRect(x, y, cell_size, cell_size);
        ctx.strokeStyle = "black";
    }

    // if (!mouse.down) return;
    
    {
        const x = player.px + player.width/2;
        const y = player.py + player.height/2;

        const ang = Math.atan2(mouse.y-y, mouse.x-x);

        const tox = x + Math.cos(ang) * cell_size;
        const toy = y + Math.sin(ang) * cell_size;

        // ctx.fillRect(tox, toy, 10, 10);

        const [bx, by, id] = dataAtPoint(tox, toy);

        if (mouse.down) mineBlock(bx, by);

        if (main_tiles[id]?.collider) {
            if (mouse.down) ctx.strokeStyle = "#ffaaaabb";
            else ctx.strokeStyle = "#ffaaaabb";
            
            ctx.strokeRect(bx*cell_size, by*cell_size, cell_size, cell_size);
            ctx.strokeRect(bx*cell_size + (cell_size/2-5), by*cell_size + (cell_size/2-5), 10, 10);
            ctx.strokeStyle = "black";
        }
    }
}, 1000/30);

//#endregion