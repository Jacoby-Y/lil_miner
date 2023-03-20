
export function doubleMap(obj={}) {
    Object.entries(obj).forEach(([key, value])=> obj[value] = key);
    return obj;
}
