import { canvases } from "./canvas.js";
import { main_atlas, main_tiles } from "./tilemaps.js";
import * as window from "./window.js";
import { controller } from "./controller.js";

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
}

function blockAtCoord(x=0, y=0) {
    return world_data[x + y*cols];
}

function dataAtPoint(x=0, y=0) {
    return [Math.floor(x/cell_size), Math.floor(y/cell_size), screenToWorld(x, y)];
}

function checkPoints(ox=0, oy=0, nx=0, ny=0, dir="b") {
    const origin = dataAtPoint(ox, oy);
    const next = dataAtPoint(nx, ny);

    if (next[2] == null) return [0, 0];
    if (!main_tiles[next[2]].collider || origin[0] == next[0] && origin[1] == next[1]) return [0, 0];
    
    if (dir == "b") {
        const top = next[1] * cell_size;
        return [0, top-ny-0.1];
    }
    if (dir == "t") {
        const bottom = next[1] * cell_size;
        return [0, bottom-ny + cell_size + 0.1];
    }
    if (dir == "l") {
        const left = next[0] * cell_size;
        return [left-nx+cell_size+0.1, 0];
    }
    if (dir == "r") {
        const right = next[0] * cell_size;
        return [right-nx, 0];
    }
}

function snapPos(x=0, y=0) {
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

let box = {
    width: cell_size-20,
    height: cell_size-20,
    px: 400,
    py: 50,
    vx: 0,
    vy: 0,
    grounded: false,
    draw() {
        canvases.main.ctx.fillStyle = "green";
        canvases.main.ctx.fillRect(this.px, this.py, this.width, this.height);
    },
    addDiff(diff=[0,0]) {
        let [x, y] = diff;
        if (x == 0 && y == 0) return false;
        //  || Math.floor(Math.abs(y)) == 0
        
        if (x != 0) this.vx = 0;
        if (y != 0) this.vy = 0;

        this.px += x;
        this.py += y;
        
        return true;
    },
    collide() {
        const ctx = canvases.main.ctx;

        const col = (x1=0, y1=0, x2=0, y2=0, d="b")=> this.addDiff(checkPoints(x1, y1, x2, y2, d));

        const col_bot = col(this.px+2, this.py, this.px+2, (this.py + this.height), "b") || col((this.px + this.width)-2, this.py, (this.px + this.width)-2, (this.py + this.height), "b")
        const col_top = col(this.px+2, (this.py + this.height), this.px+2, this.py, "t") || col((this.px + this.width)-2, (this.py + this.height), (this.px + this.width)-2, this.py, "t")
        const col_right = col(this.px, this.py, (this.px + this.width), this.py, "r") || col(this.px, (this.py + this.height), (this.px + this.width), (this.py + this.height), "r");
        const col_left = col((this.px + this.width), this.py, this.px, this.py, "l") || col((this.px + this.width), (this.py + this.height), this.px, (this.py + this.height), "l");
        
        if (col_bot) this.grounded = true;
        else this.grounded = false;
    },
    physics() {
        this.collide();

        this.px += this.vx;
        this.py += this.vy;

        this.vy += 0.5;
        this.vx *= 0.95;
        this.vy *= 0.95;

        if (this.grounded) this.vx *= 0.8;

        // this.collide();
    },
    controller() {
        if ((controller.space === true || controller.w || controller.up) && this.grounded) {
            this.vy -= 12;
            this.grounded = false;
        }
        else if (controller.a || controller.left) this.vx -= 1;
        else if (controller.d || controller.right) this.vx += 1;
    },
}

setInterval(()=>{
    const ctx = canvases.main.ctx;
    ctx.putImageData(prev_render, 0, 0);

    box.controller();
    box.physics();
    box.draw();

    {
        const [x, y] = snapPos(mouse.x, mouse.y);

        ctx.strokeStyle = "#aaaaaa33";
        ctx.strokeRect(x, y, cell_size, cell_size);
        ctx.strokeStyle = "black";
    }

    // if (!mouse.down) return;
    
    {
        // ctx.beginPath();
        // ctx.arc(mouse.x, mouse.y, 10, 0, 2*Math.PI);
        // ctx.fill();

        const x = box.px + box.width/2;
        const y = box.py + box.height/2;

        const ang = Math.atan2(mouse.y-y, mouse.x-x);

        const tox = x + Math.cos(ang) * cell_size;
        const toy = y + Math.sin(ang) * cell_size;

        const [bx, by, id] = dataAtPoint(tox, toy);

        if (main_tiles[id].collider) {
            if (mouse.down) ctx.strokeStyle = "#ffaaaabb";
            else ctx.strokeStyle = "#ffaaaabb";
            
            ctx.strokeRect(bx*cell_size, by*cell_size, cell_size, cell_size);
            ctx.strokeRect(bx*cell_size + (cell_size/2-5), by*cell_size + (cell_size/2-5), 10, 10);
            ctx.strokeStyle = "black";
        }
    }
}, 1000/30)