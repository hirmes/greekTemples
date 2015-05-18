'use strict';
/*global require*/
var Drone = require('drone'),
    blocks = require('blocks');

function greekBase( b, width, len ) {

	  this.chkpt('greekBase');

  this
  	.up(1)
    .box0(b,width,1,len)
    .up(1)
    .fwd(1)
    .right(1)
    .box0(b,width-2,1,len-2)
    .up(1)
    .fwd(1)
    .right(1)
    .box(b,width-4,1,len-4)
    .up(1)
    .chkpt('baseStartPoint');
}
Drone.extend( greekBase );
