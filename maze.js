//DDA Raycaster
const speed = 0.1
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
    ctx.clearRect(0, 0, canvas.width, canvas.height);
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
    if (event.key=="ArrowUp"){
        const newX = player.px+Math.cos(player.angle)*speed
        const newY = player.py+Math.sin(player.angle)*speed
        if (notInWall(newX,player.py)){
            player.px = newX;
            draw2d();
        }
        if (notInWall(player.px,newY)){
            player.py = newY;
            draw2d();
        }
    }
    if (event.key=="ArrowDown"){
        const newX = player.px-Math.cos(player.angle)*speed
        const newY = player.py-Math.sin(player.angle)*speed
        if (notInWall(newX,player.py)){
            player.px = newX;
            draw2d();
        }
        if (notInWall(player.px,newY)){
            player.py = newY;
            draw2d();
        }
    }
    if (event.key=="ArrowRight"){
        player.angle+=0.1;
        draw2d();
    }
    if (event.key=="ArrowLeft"){
        player.angle-=0.1;
        draw2d();
    }
})
draw2d();