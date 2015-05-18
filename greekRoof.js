'use strict';
/*global require*/
var Drone = require('drone'),
    blocks = require('blocks');

function greekRoof( b, width, depth ) {

    width += 2;
    var midPoint = Math.ceil((width-2)/2),
        height = Math.ceil((width-2)/5),
        fullDepth = depth;

    this.chkpt('frieze');

    this.box(b,width,1,depth+2) // ceiling
        .fwd()
        .right()
        .up()
        .box0(b,width-2,2,depth) // frieze
        .left()
        .back()
        .up()
        .chkpt('greekRoof')
    // end cap
        .fwd(fullDepth)
        .right(2);
    var a = lineDrawData(midPoint,height),
        lineLength = midPoint-1;
    for (var i=0;i<a.length;i++) {
        if ( a[i] == -1 ) {
            this.up()
                .box(1,(lineLength*2)-1,1,1); // back pediment
        }
        this.right();
        lineLength--;
    }

    this.move('greekRoof')
        .fwd(1);     
    var a = lineDrawData(midPoint,height),
        lineLength = midPoint-0.5;
    for (var i=0;i<a.length;i++) {
        if ( a[i] == -1 ) {
            this.up()
                .box(1,(lineLength*2)+1,1,1); // pediment
        }
        // roof top
        this.back()
            .box(b,1,1,depth+2)
            .right((lineLength*2)+1)
            .box(b,1,1,depth+2)
            .left((lineLength*2)+1)
            .fwd()
            .right();

        lineLength--;
    }

  this.move('greekRoof');

  this.box0(b,width,1,depth+2); // top of frieze
  
}
Drone.extend( greekRoof );