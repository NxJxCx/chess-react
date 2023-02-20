
module.exports = function(a, b) {
    if (a === b) { return true; }
    if (a == null || b == null) { return false; }
    if (a.length !== b.length) { return false; }

    for (let i = 0; i < a.length; i++) {
        if (a[i] instanceof Array && b[i] instanceof Array) {
        if (a[i].length!==b[i].length) { return false; }
        if (a[i].length===2) {
            for (let o = 0; o < a[i].length; o++) {
            if (a[i][o] !== b[i][o]) { return false; }
            }
        } else { return false; }
        } else {
        if (a[i] !== b[i]) { return false; }
        }
    }
    return true;
}