exports.lineDrawData = function(dx,dy){
    var x1 = 0, x2 = dx, y1 = 0, y2 = dy;
    var y = 0;
    var prevX = 0, prevY = 0;
    var a = [];
    for (var x=0;x<=dx;x++) {
        y = Math.round(dy * (x - x1) / dx);
        if ( y > prevY ) {
            a[x] = -1;
        } else if ( y < prevY ) {
            a[x] = 1;
        } else {
          a[x] = 0;
        }
        prevY = y;
    } 
    return a;
}