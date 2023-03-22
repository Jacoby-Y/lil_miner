import { canvases } from "./canvas.js";
import { main_atlas, main_tiles } from "./tilemaps.js";
import * as window from "./window.js";
import { controller } from "./controller.js";
import createPlayer from "./player.js";

export const cols = 20;
export const rows = 12;
export const cell_size = 60;
export const width = cols * cell_size;
export const height = rows * cell_size;

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
    if (x >= cols || y >= rows) return null;
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

    world_data[x + y*cols] = 22;

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

    function collideBox(box=[1,2,3]) {
        if (main_tiles[box[2]]?.collider) {
            return collide(
                x, y, w, h,
                box[0] * cell_size, box[1] * cell_size, cell_size, cell_size
            );
        }
        return [0, 0];
    }

    function wrapBox(box1, box2, box3) {
        return [
            collideBox(box1),
            collideBox(box2),
            collideBox(box3),
        ]// .find(([x, y])=> x != 0 || y != 0) ?? [0,0];
    }

    const col_bot = wrapBox(bot1, bot2, bot3);
    const col_top = wrapBox(top1, top2, top3);
    const col_left = wrapBox(left1, left2, left3);
    const col_right = wrapBox(right1, right2, right3);

    return [
        ...col_bot,
        ...col_top,
        ...col_left,
        ...col_right,
    ].reduce((p, c)=> [
        p[0] || p[0] + c[0],
        p[1] || p[1] + c[1]
    ], [0, 0]);
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