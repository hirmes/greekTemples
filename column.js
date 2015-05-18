'use strict';
/*global require*/
var Drone = require('drone'),
    blocks = require('blocks');

function column( b,radius, height, makeDoor, noBase ) {
  // defaults and error checking
		if ( !radius ) {
			size = 2;
		}
		if ( radius < 1 || radius > 4 ) {
			radius = 1;
		}
	  if ( !height ) {
	    height = 16;
	  }
	  if ( height > 60 ) {
	  	height = 60;
	  }
	  this.chkpt('column');

  // base
  if ( noBase ) {
    this.fwd(2)
        .right(2)
  } else {
    this.box(b,(radius*2)+5,1,(radius*2)+5)
        .up(1)
        .fwd(1)
        .right(1)
        .box(b,(radius*2)+3,1,(radius*2)+3)
        .up(1)
        .fwd(1)
        .right(1)
  }

  	this.chkpt("base");

    // column
  	this.cylinder0(b,radius,height)

    // capital
  	.up(height)
  	.back(1)
  	.left(1)
  	.box(b,(radius*2)+3,1,(radius*2)+3)
  	.up(1)
  	.back(1)
  	.left(1)
  	.box(b,(radius*2)+5,1,(radius*2)+5)
  	.move("base")
  	.right(radius);

    if ( radius > 1 && makeDoor ) {
  	  this.door();
    }

  this.move('column');
}
Drone.extend( column );
