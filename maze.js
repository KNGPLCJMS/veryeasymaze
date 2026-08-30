const speed = 3.2
const turnSpeed = 2.8
const keys = {};
const maxDistance = 10;
const map = [
    "1111111111",
    "1000000001",
    "1011111101",
    "1000000101",
    "1010011101",
    "1001000001",
    "1111111111"
]
const player = {
    px:1.5,
    py:1.5,
    angle:0
}
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const tileSize =20;
function drawMap(){
    ctx.lineWidth = 1;
    for (let y = 0; y<map.length; y++){
        for (let x =0; x<map[y].length; x++){
            if (map[y][x]==="1"){
                ctx.fillStyle = "#a13939"
            } else {
                ctx.fillStyle = "#575757"
            }
            ctx.fillRect(
                x*tileSize,
                y*tileSize,
                tileSize,
                tileSize,
            );
            ctx.strokeStyle = "#222222";
            ctx.strokeRect(
                x*tileSize,
                y*tileSize,
                tileSize,
                tileSize,
            );
        }
    }
}
function drawPlayer() {
    ctx.beginPath();
    ctx.arc(player.px*tileSize, player.py*tileSize, (tileSize*0.5)/2, 0, 2 * Math.PI);
    ctx.fillStyle = "#252d82";
    ctx.fill();
    ctx.lineWidth = 4;

    ctx.beginPath();
    ctx.moveTo(player.px*tileSize, player.py*tileSize);
    ctx.strokeStyle = "#826025";
    ctx.lineTo(
        player.px*tileSize + Math.cos(player.angle) * tileSize,
        player.py*tileSize + Math.sin(player.angle) * tileSize
    );
    ctx.lineWidth = 3;
    ctx.stroke();

}


function draw2d(){
    drawMap();
    drawPlayer();
}

function notInWall(px,py){
    const mapX = Math.floor(px);
    const mapY = Math.floor(py);

    if (mapY<0||mapY>=map.length||mapX<0||mapX>=map[mapY].length){
        return false
    }

    return map[mapY][mapX]==="0"
}


document.addEventListener("keydown",function(event){
    if (event.key ==="ArrowUp"||event.key ==="ArrowDown"||event.key ==="ArrowLeft"||event.key ==="ArrowRight"){
        event.preventDefault();
        keys[event.key]=true
    }
}) 
document.addEventListener("keyup", function(event){
    keys[event.key] = false;
})
let lastTime = performance.now()
function update(time){
    const deltaTime = Math.min((time-lastTime)/1000,0.05);
    lastTime = time;
    if (keys["ArrowRight"]){
        player.angle+=turnSpeed*deltaTime;
    }
    if (keys["ArrowLeft"]){
        player.angle-=turnSpeed*deltaTime;
    }
    if (keys["ArrowUp"]){
        const newX = player.px+Math.cos(player.angle)*speed*deltaTime
        const newY = player.py+Math.sin(player.angle)*speed*deltaTime
        if (notInWall(newX,player.py)){
            player.px = newX;
        }
        if (notInWall(player.px,newY)){
            player.py = newY;
        }
    }
    if (keys["ArrowDown"]){
        const newX = player.px-Math.cos(player.angle)*speed*deltaTime
        const newY = player.py-Math.sin(player.angle)*speed*deltaTime
        if (notInWall(newX,player.py)){
            player.px = newX;
        }
        if (notInWall(player.px,newY)){
            player.py = newY;

        }
    }
    player.angle %= Math.PI*2;
    if (player.angle<0){
        player.angle+=Math.PI*2
    }
    draw3d()
    requestAnimationFrame(update);

}
requestAnimationFrame(update);


function raycaster(angle){
    let tx = player.px;
    let ty = player.py;

    const testSize = 0.02;
    let distance = 0;
    while (notInWall(tx,ty)&&distance<maxDistance){
        tx+=Math.cos(angle)*testSize;
        ty+=Math.sin(angle)*testSize;
        distance+=testSize;
    }

    return [distance,[tx,ty]];
}
function draw3d(){
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for(let i=0; i<=90; i++){
        const disArray = raycaster(player.angle+((i-45)*(Math.PI/180)));

        const dis = disArray[0];

        const wallHeight = 500/dis;

        const sx = i*10;
        const sy = (canvas.height-wallHeight)/2;

        ctx.fillStyle="#7d1212";
        ctx.fillRect(sx,sy,10,wallHeight);
    }
}