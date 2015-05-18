/*

    Parametric Greek Temples in Minecraft using Scriptcraft 

    Author: David Hirmes

*/



'use strict';
/*global require*/
var Drone = require('drone'),
    blocks = require('blocks');

function greekTemple(   blocktype,          // minecraft block ID
                        columnRadius,       // 1, 2, or 3
                        numOfColumnsFront,  // must be even, recommended < 8
                        numOfColumnsSide,   // recommended < 10
                        height,             // height of columns
                        doors,              // doors on columns of r > 1
                        walls,              // 'outer', 'inner', or false
                        clearInnerSpace     // only applicable if walls == 'inner'
) {

    if ( arguments.length == 0 ) {
        echo("greekTemple(blocktype,columnRadius,numOfColumnsFront,numOfColumnsSide,height,doors,walls,clearInnerSpace)");
        return;
    }

    var kBlockType = blocktype || 155; // quartz

    if ( columnRadius < 1 || columnRadius > 3 ) {
        echo("WARNING: Column radius must be between 1 and 3.  Using 1.");
        columnRadius = 1;
    }

    var columnSpacing = 3,
        entranceSpacing = 5,
        edgePadding = 6,
        columnBaseSize = (columnRadius * 2) + 5;


    // numOfColumnsFront must be even
    if ( numOfColumnsFront % 2 != 0 ) {
        echo("WARNING: Number of front columns must be even.  Adding one.");
        numOfColumnsFront++;
    }

    var columnFrontCount = numOfColumnsFront,
        columnSideCount = numOfColumnsSide,
        baseWidth = (numOfColumnsFront * (columnBaseSize + columnSpacing)) + entranceSpacing - (2 * columnSpacing),
        baseLength = (numOfColumnsSide * (columnBaseSize + columnSpacing)) - columnSpacing;

    this.chkpt('greekTemple');


    // --------------------------------------
    // COLUMNS
    // --------------------------------------

    var width = baseWidth + edgePadding,
        len= baseLength + edgePadding;

    var columnHeight = height;

    if ( columnRadius == 1 ) doors = false;

    // create base and go to position for first column
    this.greekBase(kBlockType, width,len).right(1).fwd(1);

    // front and back columns

    // front
    for (var i=1;i<=columnFrontCount;i++) {
        this.column(kBlockType, columnRadius,columnHeight, doors);
        if ( i == columnFrontCount/2 ) {
            this.right(columnBaseSize + entranceSpacing);
        } else {
            this.right(columnBaseSize + columnSpacing);
        }
    }
    // back
     this.move('baseStartPoint')
        .fwd(baseLength+1-columnBaseSize)
        .right()
   
    for (var i=1;i<=columnFrontCount;i++) {
        this.column(kBlockType, columnRadius,columnHeight, doors);
        if ( i == columnFrontCount/2 ) {
            this.right(columnBaseSize + entranceSpacing);
        } else {
            this.right(columnBaseSize + columnSpacing);
        }
    }
    
    // side columns

    if ( columnSideCount > 2 ) {
        // left side
        this.move('baseStartPoint')
            .right()
            .fwd(1 + columnBaseSize + columnSpacing);

        for (var i=2;i<columnSideCount;i++) {
            this.column(kBlockType, columnRadius, columnHeight, doors)
                .fwd(columnBaseSize + columnSpacing);
        }
        // right side
        this.move('baseStartPoint')
            .right(baseWidth+1-columnBaseSize)
            .fwd(1 + columnBaseSize + columnSpacing);

        for (var i=2;i<columnSideCount;i++) {
            this.column(kBlockType, columnRadius, columnHeight, doors)
                .fwd(columnBaseSize + columnSpacing);
        }
    }


    // --------------------------------------
    // WALLS
    // --------------------------------------

    if ( walls == "outer" ) {
        // left
        this.move('baseStartPoint')
            .right(columnBaseSize/2)
            .fwd(4)
            .box(kBlockType,1,columnHeight+4,baseLength-8);
       // right
        this.move('baseStartPoint')
            .right(baseWidth-(columnBaseSize/2))
            .fwd(4)
            .box(kBlockType,1,columnHeight+4,baseLength-8);
        // back
        this.move('baseStartPoint')
            .fwd(baseLength-(columnBaseSize/2)-2)
            .right(columnBaseSize/2)
            .box(kBlockType,baseWidth-8,columnHeight+4,1);

    } else if ( walls == "inner" ) {

        var innerIndent = columnBaseSize+columnSpacing+1,
            innerWidth = baseWidth-(innerIndent*2),
            innerLength = baseLength-(innerIndent*2)-2,
            pilasterSpacing = 4;

        this.move('baseStartPoint')
            .fwd((columnBaseSize/2)-1)
            .chkpt('innerStartPoint');

        if ( clearInnerSpace ) {
            this.move('innerStartPoint')
                 .right(innerIndent+1)
                 .fwd(innerIndent+1)
                 .box(0,baseWidth-(innerIndent*2)+1,height+4,innerLength);
        }

        // the two front inner columns
        this.move('innerStartPoint')
            .fwd(columnBaseSize)
            .right(columnRadius);

        for (var i=1;i<=columnFrontCount;i++) {
            if ( i == columnFrontCount/2 || i == (columnFrontCount/2)+1 ) {
                this.column(kBlockType, 1,columnHeight+2, doors, true);
            }
            if ( i == columnFrontCount/2 ) {
                this.right(columnBaseSize + entranceSpacing);
            } else {
                this.right(columnBaseSize + columnSpacing);
            }
        }

        // box
       this.move('innerStartPoint')
            .right(innerIndent)
            .fwd(innerIndent)
            .box0(kBlockType,baseWidth-(innerIndent*2)+2,height+4,innerLength+1);

        // door
        var doorWidth = 5,
            doorHeight = 8,
            tempDoorHeight = doorHeight;

        // if the temple is long enough, we'l make this front wall open
        // and add another inner front wall later
        if ( columnSideCount > 4 ) {
            tempDoorHeight = columnHeight + 3;
        }
        this.move('innerStartPoint')
            .fwd(innerIndent)
            .right((baseWidth/2)+1) // center
            .left(doorWidth/2)
            .box(0,doorWidth,tempDoorHeight,1);

        if ( clearInnerSpace ) {
            this.move('innerStartPoint')
                .fwd(innerIndent)
                .right((baseWidth/2)+1) // center
                .left(doorWidth/2)
                .back((innerIndent*2)-1)
                .box(0,doorWidth,tempDoorHeight,innerIndent*2);
        }

        // pilasters
 
        // left side
        this.move('innerStartPoint')
            .right(innerIndent+1)
            .fwd(innerIndent+1);

        for (var i=0;i<innerLength;i=i+pilasterSpacing) {
            this.box(1,1,columnHeight+3,1)
                .up(columnHeight+3)
                .box(1,2,1,1)
                .down(columnHeight+3)
                .fwd(pilasterSpacing);
        }

        // right side
        this.move('innerStartPoint')
            .right(baseWidth-innerIndent)
            .fwd(innerIndent+1);

        for (var i=0;i<innerLength;i=i+pilasterSpacing) {
            this.box(1,1,columnHeight+3,1)
                .up(columnHeight+3)
                .left()
                .box(1,2,1,1)
                .right()
                .down(columnHeight+3)
                .fwd(pilasterSpacing);
        }

        // mid-point band
        this.move('innerStartPoint')
            .right(innerIndent+1)
            .fwd(innerIndent)
            .up(columnHeight/2)
            .box0(kBlockType,innerWidth,1,innerLength+1);


        // lighting

        // left side
        this.move('innerStartPoint')
            .right(innerIndent+2)
            .fwd(innerIndent+1)
            .up(columnHeight/2);

        for (var i=0;i<innerLength;i=i+pilasterSpacing) {
            this.turn(3)
                .hangtorch()
                .turn()
                .fwd(pilasterSpacing);
        }

        // right side
        this.move('innerStartPoint')
            .right(baseWidth-innerIndent-1)
            .fwd(innerIndent+1)
            .up(columnHeight/2);


        for (var i=0;i<innerLength;i=i+pilasterSpacing) {
            this.turn(1)
                .hangtorch()
                .turn(3)
                .fwd(pilasterSpacing);
        }


        // add additional walls if there's room for them

        // make the first front wall open and add a second front wall
        if ( columnSideCount > 4 ) {
            // extra wall
            this.move('innerStartPoint')
                 .right(innerIndent)
                 .fwd(innerIndent + columnBaseSize)
                 .box0(kBlockType,baseWidth-(innerIndent*2)+2,height+4,1);

            // extra door
             this.move('innerStartPoint')
                 .fwd(innerIndent + columnBaseSize)
                 .right((baseWidth/2)+1) // center
                 .left(doorWidth/2)
                 .box(0,doorWidth,doorHeight,1);

            // make sure original door is still open
            this.move('innerStartPoint')
                .fwd(innerIndent)
                .right((baseWidth/2)+1) // center
                .left(doorWidth/2)
                .box(0,doorWidth,tempDoorHeight,1);
        }

        if ( columnSideCount > 5 ) {
            // extra wall
            this.move('innerStartPoint')
                 .right(innerIndent)
                 .fwd(innerLength - columnBaseSize + innerIndent)
                 .box0(kBlockType,baseWidth-(innerIndent*2)+2,height+4,1);

            // make back door
            this.move('innerStartPoint')
                .fwd(innerLength+innerIndent)
                .right((baseWidth/2)+1) // center
                .left(doorWidth/2)
                .box(0,doorWidth,doorHeight,1);
        }


    }


    // --------------------------------------
    // ROOF
    // --------------------------------------

    this
        .move('baseStartPoint')
        .up(columnHeight+4)
        .greekRoof(kBlockType,baseWidth,baseLength);


    // --------------------------------------
    // TRIGLYPHS
    // --------------------------------------

    var triglyphsFront  = columnFrontCount * 2,
        triglyphsSide   = columnSideCount * 2;

    // front
    this.move('baseStartPoint')
        .up(columnHeight+5)
        .right(Math.ceil(columnBaseSize/2));

    for (var i=1;i<=(columnFrontCount*2)-1;i++) {
        this.left()
        .box(139).right().box(139).right().box(139)
        .left();
        if ( i == ((columnFrontCount*2)/2)-1 ) {
            this.right(Math.ceil((columnBaseSize + entranceSpacing)/2));
        } else {
            this.right(Math.ceil((columnBaseSize + columnSpacing)/2));
        }
        if ( i == ((columnFrontCount*2)/2) ) {
            this.right();
        }
    }

    // back
    this.move('baseStartPoint')
        .up(columnHeight+5)
        .fwd(baseLength+1)
        .right(Math.ceil(columnBaseSize/2));

    for (var i=1;i<=(columnFrontCount*2)-1;i++) {
        this.left()
        .box(139).right().box(139).right().box(139)
        // .box(19).right().box(19).right().box(19)
        .left();
        if ( i == ((columnFrontCount*2)/2)-1 ) {
            this.right(Math.ceil((columnBaseSize + entranceSpacing)/2));
        } else {
            this.right(Math.ceil((columnBaseSize + columnSpacing)/2));
        }
        if ( i == ((columnFrontCount*2)/2) ) {
            this.right();
        }
    }

    // left
    this.move('baseStartPoint')
        .up(columnHeight+5)
        .fwd(Math.ceil(columnBaseSize/2));
    for (var i=1;i<=(columnSideCount*2)-1;i++) {
        this.back()
        .box(139).fwd().box(139).fwd().box(139)
        .back();
        this.fwd(Math.ceil((columnBaseSize + columnSpacing)/2));
     }

    // right
    this.move('baseStartPoint')
        .up(columnHeight+5)
        .right(baseWidth+1)
        .fwd(Math.ceil(columnBaseSize/2));
    for (var i=1;i<=(columnSideCount*2)-1;i++) {
        this.back()
        .box(139).fwd().box(139).fwd().box(139)
        .back();
        this.fwd(Math.ceil((columnBaseSize + columnSpacing)/2));
     }


    // --------------------------------------
    // FUN
    // --------------------------------------

     if ( columnRadius > 1 ) {
        // sign
        this.move('baseStartPoint')
            .up(3)
            .right(Math.ceil(columnBaseSize/2))
            .fwd(columnBaseSize-3)
            .wallsign(['You can','go up'])
        // ladder
            .right()
            .box(65,1,columnHeight+2,1);
    }


    this.move('greekTemple');
}

Drone.extend( greekTemple );
