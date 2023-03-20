function addCanvas(qry="canvas") {
    /** @type {HTMLCanvasElement} */
    const canvas = document.querySelector(qry);
    const ctx = canvas.getContext("2d");

    canvas.width = 1200;
    canvas.height = 720;

    return { canvas, ctx }
}

export const canvases = {
    main: addCanvas("canvas.main"),
}

export function drawImg(src, x=0, y=0, w=0, h=0) {

}

export function createAtlas(canvas="main", src="/", columns=0) {
    const image = new Image();
    image.loading = "eager";
    image.src = src;

    const ctx = canvases[canvas]?.ctx;
    if (ctx == undefined) {
        console.error(`Canvas name "${canvas}" not found!`);
        return null;
    }

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

