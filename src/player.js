import { canvases } from "./canvas.js";
import { controller } from "./controller.js";
import { cell_size, checkCollision } from "./world.js";

export default function() {
    const ctx = canvases.main.ctx;

    let width = cell_size-20;
    let height = cell_size-20;
    let px = 400;
    let py = 100;
    let vx = 0;
    let vy = 0;
    let grounded = false;

    const gravity = 1;
    const jump_height = 15;
    const move_speed = 0.8;

    function draw() {
        ctx.fillStyle = "green";
        ctx.fillRect(px, py, width, height);
    }
    function addDiff(diff=[0,0]) {
        let [x, y] = diff;

        if (x == 0 && y == 0) return false;
        //  || Math.floor(Math.abs(y)) == 0
        
        if (x != 0) vx = 0;
        if (y != 0) vy = 0;

        px += x;
        py += y;
        
        return true;
    }
    function collide() {
        const col_diff = checkCollision(px, py, width, height);
        addDiff(col_diff);

        if (col_diff[1] < 0) grounded = true;
        else grounded = false;
    }
    function physics() {
        px += vx;
        py += vy;

        vy += gravity;
        vx *= 0.95;
        vy *= 0.95;

        if (grounded) vx *= 0.8;
    }
    function userController() {
        if ((controller.space === true || controller.w || controller.up) && grounded) {
            vy -= jump_height;
            grounded = false;
        }
        else if (controller.a || controller.left) vx -= move_speed;
        else if (controller.d || controller.right) vx += move_speed;
    }

    function update() {
        userController();
        collide();
        draw();
        physics();
    }

    return { 
        get width() { return width; },
        get height() { return height; },
        get px() { return px; },
        get py() { return py; },
        get vx() { return vx; },
        get vy() { return vy; },
        get grounded() { return grounded; },

        draw,
        addDiff,
        collide,
        physics,
        controller,
        update,
    }
}

