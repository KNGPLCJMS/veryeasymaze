//DDA Raycaster
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

drawMap();
drawPlayer();


const keys = {};

document.addEventListener("keydown", function(e) {
    keys[e.key.toLowerCase()] = true;
});

document.addEventListener("keyup", function(e) {
    keys[e.key.toLowerCase()] = false;
});


