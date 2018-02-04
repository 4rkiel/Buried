window.onload = function() {

    var walls = [
        {x1: 200, y1: 200, x2: 300, y2: 400},
        {x1: 100, y1: 100, x2: 200, y2: 100},
        {x1: 300, y1: 100, x2: 500, y2: 100},
        {x1: 500, y1: 100, x2: 500, y2: 500},
        {x1: 500, y1: 500, x2: 100, y2: 500},
        {x1: 100, y1: 500, x2: 100, y2: 100}
    ];

    var position = {
        x:40, y:10
    };

    var zb = [];

    var map = null;
    
    var s = 20;
    var P = 40;
    var time = 0;


    var mUp = false;
    var mDown = false;
    var mLeft = false;
    var mRight = false;

    var mTimer = null;
    var zTimer = null;



    function drawGrid (){

        ctx.beginPath();
        ctx.rect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = "#CCCCCC";
        ctx.fill();
        ctx.closePath();

        ctx.lineCap = 'butt';
        ctx.lineWidth = 1;
        ctx.strokeStyle = '#000000';

        
        for(var k=s; k<canvas.width; k+=s){

            ctx.beginPath();
            ctx.moveTo(k, 0);
            ctx.lineTo(k, canvas.height);
            ctx.stroke();
            ctx.closePath();
        }

        for(var k=s; k<canvas.height; k+=s){

            ctx.beginPath();
            ctx.moveTo(0, k);
            ctx.lineTo(canvas.width, k);
            ctx.stroke();
            ctx.closePath();
        }

    }



    function drawWall (x1, y1, x2, y2){

        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);

        ctx.lineWidth=20;
        ctx.lineCap = 'round';
        ctx.strokeStyle = '#55555';
        ctx.stroke();

        ctx.closePath();

    }


    function drawRect (ctx, x, y, w, h, c){
        ctx.fillStyle = c;
        ctx.fillRect(x,y,w,h);
    }



    function testWall (x1, y1, x2, y2){

        var res = false;
        for(var w=0; w<walls.length; w++){

            var v = walls[w];

   
            if ((
                (x1 >= v.x1 && x1 <= v.x2) ||
                (x1 >= v.x2 && x1 <= v.x1) ||
                (x2 >= v.x1 && x2 <= v.x2) ||
                (x2 >= v.x2 && x2 <= v.x1)
            ) && (
                (y1 >= v.y1 && y1 <= v.y2) ||
                (y1 >= v.y2 && y1 <= v.y1) ||
                (y2 >= v.y1 && y2 <= v.y2) ||
                (y2 >= v.y2 && y2 <= v.y1)
            )){

                var a1 = ((v.x2 - v.x1) == 0) ? 0 : ((v.y2 - v.y1) / (v.x2 - v.x1));
                var a2 = ((x2 - x1) == 0) ? 0 : ((y2 - y1) / (x2 - x1));

                if (a2 == a1){

                    res = true;
                    break;

                } else {

                    var b1 = v.y1 - (a1 * v.x1);
                    var b2 = y1 - (a2 * x1);

                    var inter = (b2 - b1)/(a1 - a2);

                    if (
                        ((inter >= v.x1 && inter <= v.x2) ||
                        (inter >= v.x2 && inter <= v.x1)) &&
                        ((inter >= x1 && inter <= x2) ||
                        (inter >= x2 && inter <= x1))
                    ){

                        res = true;
                        break;

                    }
                }
            }
    
        }
        
        return res;
    }


    function checkWall (x, y){

        return (        
            testWall(x, y, x+20, y) ||
            testWall(x+20, y, x+20, y+20) ||
            testWall(x+20, y+20, x, y+20) ||
            testWall(x, y+20, x, y)
        );
    }



    function initMap (){

        map = new Array(100);
        for (var k=0; k<map.length; k++){
        
            map[k] = new Array(100);

            for(var h=0; h<map[k].length; h++){

                map[k][h] = {t:0, o:false};

                if (checkWall(h * 20, k * 20)){

                    map[k][h].w = true;

                    ctx.fillStyle = '#888888';
                    ctx.fillRect(h*20,k*20,20,20);
                    
                } else {
    
                    map[k][h].w = false;
                }
            }
        }

        for (var k=0; k<walls.length; k++){    
            var w = walls[k];        
            drawWall(w.x1, w.y1, w.x2, w.y2);
        }
    }



                    
    function reMap (){

        var curX = position.x;
        var curY = position.y;

        map[curY][curX].o = true;
        
        var p = P;
//        var c = 40;

        time = (new Date()).getTime();
        map[curY][curX].t = time;

        var stk = [{x:curX, y:curY}];

        
        while (stk.length > 0 && p > 0){

            var cpy = JSON.parse(JSON.stringify(stk));
            stk = [];
            
            for (var k=0; k<cpy.length; k++){

                curX = cpy[k].x;
                curY = cpy[k].y;

                ctxs.fillStyle = 'rgba(0,255,122,'+(p/P)+')';
                ctxs.fillRect(curX*20, curY*20, 20, 20);
                
               
                for (var i=-1; i<=1; i++){
                    for (var j=-1; j<=1; j++){
                   
                        if (
                            (curY+j) >= 0 && (curX+i) >= 0 &&
                            (curY+j) < 50 && (curX+i) < 50
                        ){

                            if ((map[curY+j][curX+i].t < time) &&
                                !(map[curY+j][curX+i].w) 
                            ){
  
                                map[curY+j][curX+i].x = curX;
                                map[curY+j][curX+i].y = curY;
                                map[curY+j][curX+i].t = time;
                                map[curY+j][curX+i].p = p;

                                stk.push({x:(curX+i), y:(curY+j)});
                            }

                        }
                    }
                }
            }
          
//            c -- ;
            p -- ;
        }

 
        ctxs.fillStyle = '#ff5555';
        ctxs.fillRect(position.x * 20, position.y * 20, 20, 20);
 
    }


    
    function reDraw (){

        ctxz.clearRect(0, 0, canvas.width, canvas.height);

        for(var k=0; k<map.length; k++){

            for(var h=0; h<map[k].length; h++){


                if (! map[h][k].w && ! map[h][k]){
                
                }
               
            }
        }
        
 
    }


    /*********************************************************/
    /*                                                       */
    /*********************************************************/


    function moveZ (){

        for (var z=0; z<zb.length; z++){

            var curX = zb[z].x;
            var curY = zb[z].y;

            var bX = -1;
            var bY = -1;
            var best = 0;

            for (var k=-1; k<=1; k++){
                for (var h=-1; h<=1; h++){
                    
                    if (
                        curX+k >=0 &&
                        curY+h >= 0 &&
                        curX+k < 50 &&
                        curY+h < 50 &&
                        ((k+h)*(k+h) != 4) && 
                        //((k+h)*(k+h) != 0) && 
                        (!map[curY+h][curX+k].w) &&
                        (!map[curY+h][curX+k].o) &&
                        (map[curY+h][curX+k].p > best)
                    ){
                        best = map[curY+h][curX+k].p;
                        bX = curX+k;
                        bY = curY+h;
                    }
                }
            }

            if (best != 0){
                
                map[curY][curX].o = false;
                map[bY][bX].o = true;

                zb[z].x = bX;
                zb[z].y = bY;

            }
        }

        ctxz.clearRect(0, 0, canvaZ.width, canvaZ.height);
        
        for (var z=0; z<zb.length; z++){
        
            ctxz.fillStyle = '#ffff00';
            ctxz.fillRect(zb[z].x * 20, zb[z].y * 20, 20, 20);

        }

        zTimer = setTimeout(moveZ, 100);
    }


    function newZ (){

        var w = window,
                d = document,
                e = d.documentElement,
                g = d.getElementsByTagName('body')[0],
                x = w.innerWidth || e.clientWidth || g.clientWidth,
                y = w.innerHeight|| e.clientHeight|| g.clientHeight;

        var k = Math.floor(event.clientX * 50 / x);
        var h = Math.floor(event.clientY * 50 / y);

        if (!map[h][k].w && !map[h][k].o){

            zb.push({x:k, y:h});

            map[h][k].o = true;

            ctxz.fillStyle = '#ffff00';
            ctxz.fillRect(k * 20, h * 20, 20, 20);
 
        }
    }



    function domove (){

        var x = position.x;
        var y = position.y;

        var i = 0;
        var j = 0;

        if (mUp && !mDown){
            j = -1;
        } else if (mDown && !mUp){
            j = 1;
        }

        if (mLeft && !mRight){
            i = -1;
        } else if (mRight && !mLeft){
            i = 1;
        }

        if (
            (y+j >= 0) && (y+j < 50) && 
            (x+i >= 0) && (x+i < 50) &&
            (! map[y+j][x+i].w) && 
            (! map[y+j][x+i].o)
        ){
            
            map[y][x].o = false;
            position.x = position.x + i;
            position.y = position.y + j;
            
            ctxs.clearRect(0, 0, canvaSmell.width, canvaSmell.height);
            reMap();
        }

        if (!mUp && !mDown && !mLeft && !mRight){
            clearTimeout(domove);
            mTimer = null;
        } else {
            mTimer = setTimeout(domove, 40);
        }
    }


    function move (){

        if (event.repeat){
            return;
        }

        switch (event.keyCode){
        
            case 38 : // up
              
                mUp = true;

                if (mTimer == null){
                    domove();
                }

                break;

            case 40 : // down
                
                mDown = true;
 
                if (mTimer == null){
                    domove();
                }

                break;

            case 37 : // left
                
                mLeft = true;
 
                if (mTimer == null){
                    domove();
                }

                break;

            case 39 : // right
                
                mRight = true;
 
                if (mTimer == null){
                    domove();
                }

                break;

            default:
                break;
        }
    }


    function unmove (){

        switch (event.keyCode){
        
            case 38 : // up
                
                mUp = false;
                
                break;

            case 40 : // down
                
                mDown = false;

                break;

            case 37 : // left
                
                mLeft = false;
                
                break;

            case 39 : // right
                
                mRight = false;

                break;

            default:
                break;
        }
    }



    function initWorld (){

        document.addEventListener('click', newZ, false);

        document.addEventListener('keydown', move, false);
        document.addEventListener('keyup', unmove, false);



    }







    var wrap = document.getElementById('wrapper');

    var canvas = document.createElement('canvas');
    var ctx = canvas.getContext("2d");
    canvas.className = "canvas";
    canvas.height = 1000;
    canvas.width = 1000;

    var canvaSmell = document.createElement('canvas');
    var ctxs = canvaSmell.getContext("2d");
    canvaSmell.className = "canvas";
    canvaSmell.height = 1000;
    canvaSmell.width = 1000;

    var canvaZ = document.createElement('canvas');
    var ctxz = canvaZ.getContext("2d");
    canvaZ.className = "canvas";
    canvaZ.height = 1000;
    canvaZ.width = 1000;


    wrap.appendChild(canvas);
    wrap.appendChild(canvaSmell);
    wrap.appendChild(canvaZ);



    drawGrid();

    initMap();

    reMap();

    initWorld();

//    reDraw();
    
    moveZ();

}
