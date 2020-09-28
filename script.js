const canvas = getel("canvas");
const input=getel("inputStr");
const special=getel("specialFunc");
const column=getel("column");
const ctx = canvas.getContext('2d');
var placeh='independent variable must be x (no spaces allowed)';
var col="white";
var num=20;
var ySize=5;
var xSize=5;
var ro=0;
var specialMode=false;
var colArr=["red", "blue", "green", "yellow", "orange", "violet", "indigo"];
var drawnArray=[];
var curCol=0;
function createCanvas() {
  canvas.width = canvas.offsetWidth;
  canvas.height = canvas.offsetHeight;
  ctx.fillStyle = "black";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  strokeAxis(0, canvas.height/2, canvas.width, canvas.height/2, col);
  strokeAxis(canvas.width/2,0,canvas.width/2, canvas.height, col);
  strokeTicks();
}
function remove(ro) {
    re=getel(ro);
    re.parentNode.removeChild(re);
    removeAr(ro);
    recreate();
}
function removeAr(ro) {
    for(var m=0;m<drawnArray.length;++m) {
        console.log(drawnArray[m].id, ro);
        if(drawnArray[m].id==ro)
        drawnArray.splice(m, 1);
    }
}

function recreate() {
    createCanvas();
    for(var m=0;m<drawnArray.length;++m) {
        console.log(drawnArray[m].iFunc, drawnArray[m].val);
        draw(drawnArray[m].iFunc, drawnArray[m].val, drawnArray[m].col);
    }
}
function getel(id) {
    return document.getElementById(id);
}
special.addEventListener('change', function (event) {
    var opt = this.options[this.selectedIndex].text;
    if(this.value==0) {
        input.placeholder=placeh;
        specialMode=false;
    }
    else {
        input.placeholder='Evaluate '+ opt +' of';
        specialMode=true;
    }
});
function strokeAxis(sx,sy,fx,fy, col) {
    ctx.beginPath();
    ctx.strokeStyle=col;
    ctx.moveTo(sx,sy);
    ctx.lineTo(fx, fy);
    ctx.stroke();
    ctx.closePath();
}
function coord(x, y) {
    return {
        X: canvas.width/2+x,
        Y: canvas.height/2-y
    };
}
function strokeTicks() {
    for(var x=num, i=1; x<canvas.width/2; x+=num, i++) {
        strokeTick(x, ySize, col, 1, -1, i);
        strokeTick(-x, ySize, col, 1, -1, -i);
        x++;
    }
    for(var y=num, j=1; y<canvas.height/2; y+=num, j++) {
        strokeTick(xSize, y, col, -1, 1, j);
        strokeTick(xSize, -y, col, -1, 1, -j);
        y++;
    }
}
function strokeTick(sX, sY, col, dir1, dir2, text) {
    var co1=coord(sX*dir1, sY*dir2);
    var co2=coord(sX, sY);
    strokeAxis(co1.X, co1.Y, co2.X, co2.Y, col);
    ctx.font = "10px Arial";
    ctx.fillStyle = "white";
    if(dir2==1) {
        ctx.textAlign="right";
        ctx.textBaseline = 'middle';
    }
    else if(dir2==-1) {
        ctx.textAlign="center";
        ctx.textBaseline = 'top';
    }
    ctx.fillText(text,co1.X,co1.Y);
}

function plot() {
    if(input.value=="") {
        alert("Please enter a function");
        recreate();
    }
    else {
        ro++;
        var color=colArr[curCol++];
        const graph= {
            id: ro,
            val: special.value,
            iFunc: input.value,
            col:color
        };
        
        drawnArray.push(graph);
        draw(input.value, special.value,color);
        
        console.log("finished");
        var spec1=(specialMode)?special.options[special.selectedIndex].text+"(" :"";
        var spec2= (specialMode)?")":"";
        let item="<div class='item' id=\'"+ro+"\'><span>f(x) = "+spec1+input.value+spec2+"</span><img src='x.png' onclick='remove("+ro+")'></div>";
        column.innerHTML+=item;
        getel(ro).style.color=color;
        input.value="";
    }
}
function draw(inputVal, specialVal, color) {
    ctx.lineWidth=2.5;
        var colourPlot=color;
        for(var xplot=0;xplot< canvas.width/2; xplot+=0.1) {
            var yplot=evaluate(inputVal, xplot, specialVal);
            var yplot2=evaluate(inputVal, xplot+0.1, specialVal);
            var coord1=coord(xplot, yplot);
            var coord2=coord(xplot+0.1, yplot2);
            strokeAxis(coord1.X, coord1.Y, coord2.X, coord2.Y, colourPlot);
        }
        if(specialVal!=4) {
            for(var xplot=0;xplot< canvas.width/2; xplot+=0.1) {
                var yplot=evaluate(inputVal, -xplot, specialVal);
                var yplot2=evaluate(inputVal, -(xplot+0.1), specialVal);
                var coord1=coord(-xplot, yplot);
                var coord2=coord(-(xplot+0.1), yplot2);
                strokeAxis(coord1.X, coord1.Y, coord2.X, coord2.Y, colourPlot);
            }
        }
}
function evaluate(func, xVal, specVal) {
    xVal/=num;
    x=xVal;
    while(func.includes('^')) {
        var n = func.indexOf("x^");
        var power=func.charAt(n+2);
        var ans=Number(Math.pow(x, power));
        var func=func.slice(0,n)+ans+func.slice(n+3);
    }
    let reg=/(?<=[a-zA-Z0-9])(?=[a-zA-Z])/g;
    let matchAll = func.matchAll(reg);
    matchAll = Array.from(matchAll);
    var counter=0;
    for(var k=0;k<matchAll.length; k++) {
        var ind = matchAll[k].index;
        var func = func.slice(0, ind+counter) + "*" + func.slice(ind+counter);
        counter++;
    }
    var func = func.replace(/\*e-/g, "e-");
    var res=eval(func);
    if(specialMode==true) {
        switch(specVal) {
            case '1':
                res=Math.sin(res);
                break;
            case '2':
                res=Math.cos(res);
                break;
            case '3':
                res=Math.tan(res);
                break;
            case '4':
                res=Math.log(res);
                break;
            case '5':
                res=Math.abs(res);
                break;
        }
    }
    return num*res;
}
document.addEventListener('keydown', function(event) {
    if(event.key=='w') {
        canvas.width*=2;
        canvas.height*=2;
        xSize*=2;
        ySize*=2;
        num*=2;
        recreate();
    }
    else if(event.key=='o') {
        canvas.width/=2;
        canvas.height/=2;
        xSize/=2;
        ySize/=2;
        num/=2;
        recreate();
    }
});
createCanvas();