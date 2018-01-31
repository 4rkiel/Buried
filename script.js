window.onload = function() {

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

    ctx.beginPath();

    ctx.moveTo(200, 400);
    ctx.lineTo(200, 500);
    ctx.lineTo(500, 500);
    ctx.lineTo(500, 200);
    ctx.lineTo(200, 200);
    ctx.lineTo(200, 300);

    ctx.lineWidth=10;
    ctx.strokeStyle = '#FF0000';
    ctx.stroke();

    ctx.closePath();




    


    wrap.appendChild(canvas);

}
