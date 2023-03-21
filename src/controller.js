export const controller = {
    w: false,
    a: false,
    s: false,
    d: false,
    up: false,
    left: false,
    down: false,
    right: false,
    space: false,
}

window.onkeydown = ({ key })=>{
    /** @type {string} */
    const low = key.toLowerCase();
    
    if (low.includes("arrow")) controller[low.slice(5)] = true;
    else if (controller[low] != undefined) controller[low] = true;
    else if (low == " ") controller.space = true;
}
window.onkeyup = ({ key })=>{
    /** @type {string} */
    const low = key.toLowerCase();
    
    if (low.includes("arrow")) controller[low.slice(5)] = false;
    else if (controller[low] != undefined) controller[low] = false;
    else if (low == " ") controller.space = false;
}