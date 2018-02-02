window.onload = function() {

    var walls = [
        {x1: 200, y1: 200, x2: 400, y2: 400},
        {x1: 100, y1: 100, x2: 200, y2: 100},
        {x1: 300, y1: 100, x2: 500, y2: 100},
        {x1: 500, y1: 100, x2: 500, y2: 500},
        {x1: 500, y1: 500, x2: 100, y2: 500},
        {x1: 100, y1: 500, x2: 100, y2: 100}
    ];

    var position = {
        x:40, y:10
    };

    var map = null;
    
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


    function drawRect (x, y, w, h, c){
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

                map[k][h] = {};

                if (checkWall(h * 20, k * 20)){

                    map[k][h].w = true;
                    drawRect(h*20, k*20, 20, 20, '#888888');
                    
                } else {
    
                    map[k][h].w = false;
                }
            }
        }
    }



                    

    function reMap (){

        var curX = position.x;
        var curY = position.y;

        var p = 1;
        var c = 50;

        drawRect (curX*20, curY*20, 20, 20, '#ff5555');
        while(c != 0){

            for(var i=(-1 * p); i<=p; i++){
                for(var j=(-1 * p); j<=p; j++){
                    
                    if (i == (-1 * p) || j == (-1 * p) || j == p || i == p){
                        
                        if ((curX + i) >= 0 && (curY + j) >= 0 &&
                            (curX + i) < 50 && (curY + j) < 50){

                            if (! map[curY+j][curX+i].w ){
                            
                                map[curY+j][curX+i].p = p;
                            
                                var color = 'rgba(0,255,122,'+(c/50)+')';
                                drawRect((curX+i)*20, (curY+j)*20, 20, 20, color);
                            }
                        }
                    }
                }
            }
            
            p ++ ;
            c -- ;
        }
    }

    
    function reDraw (){

        for(var k=0; k<map.length; k++){

            for(var h=0; h<map[k].length; h++){

                

            }

        }
    }



    var wrap = document.getElementById('wrapper');

    var canvas = document.createElement('canvas');
    var ctx = canvas.getContext("2d");
    canvas.className = "canvas";
    var h = canvas.height = 1000;
    var w = canvas.width = 1000;

    var s = 20;

    ctx.beginPath();
    ctx.rect(0, 0, w, h);
    ctx.fillStyle = "#CCCCCC";
    ctx.fill();
    ctx.closePath();

    ctx.strokeStyle = '#000000';

    
    for(var k=s; k<w; k+=s){

        ctx.beginPath();
        ctx.moveTo(k, 0);
        ctx.lineTo(k, h);
        ctx.stroke();
        ctx.closePath();
    }

    for(var k=s; k<h; k+=s){

        ctx.beginPath();
        ctx.moveTo(0, k);
        ctx.lineTo(w, k);
        ctx.stroke();
        ctx.closePath();
    }


    initMap();

    for (var k=0; k<walls.length; k++){    
        var w = walls[k];        
        drawWall(w.x1, w.y1, w.x2, w.y2);
    }


    reMap();
//    reDraw();

    wrap.appendChild(canvas);

}
