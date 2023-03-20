const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");

ctx.imageSmoothingEnabled = false;

canvas.width = 1200;
canvas.height = 720;

export function drawImg(src, x=0, y=0, w=0, h=0) {

}

export function atlas(src, x=0, y=0, w=0, h=0) {

}

export function createAtlas(src="/", columns=0) {
    const image = new Image();
    image.loading = "eager";
    image.src = src;

    const cell_size = image.width / columns;

    return {
        drawAtCoord(dx=0, dy=0, w=10, h=10, ix=0, iy=0) {
            ctx.imageSmoothingEnabled = false;
            ctx.drawImage(
                image, 
                ix*cell_size, iy*columns*cell_size, 
                cell_size, cell_size, 
                dx, dy, 
                w, h
            );
        },
        drawAtIndex(dx=0, dy=0, w=10, h=10, i=0) {
            ctx.imageSmoothingEnabled = false;
            ctx.drawImage(
                image, 
                (i%columns)*cell_size, Math.floor(i/columns)*cell_size, 
                cell_size, cell_size, 
                dx, dy, 
                w, h
            );
        },
    }
}

