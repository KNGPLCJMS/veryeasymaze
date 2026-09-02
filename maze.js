const speed = 3.2
const turnSpeed = 2.8
const keys = {};
const map = genMaze(31,31);
let mFlag = false;
let cpFlag = false;
map[29][29]=2;
const maxDistance = Math.max(map.length,map[0].length);
const player = {
    px:1.5,
    py:1.5,
    angle:0
}
//player.px = 29.1; player.py = 29.1;
if (map[1][2]==1){
    player.angle = Math.PI/2;
}
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

const tileSize =5;

const gradient = ctx.createLinearGradient(0,0,0,canvas.height);
gradient.addColorStop(0.5, "#222222");
gradient.addColorStop(0, "#807f7f");
gradient.addColorStop(1, "#111111");

function drawMap(){
    ctx.lineWidth = 1;
    for (let y = 0; y<map.length; y++){
        for (let x =0; x<map[y].length; x++){
            if (map[y][x]===1){
                ctx.fillStyle = "#a13939"
            } else {
                ctx.fillStyle = "#575757"
            }
            ctx.fillRect(
                x*tileSize+5,
                y*tileSize+5,
                tileSize,
                tileSize,
            );

        }
    }
    ctx.strokeStyle = "#222222";
        ctx.strokeRect(
            5,
            5,
            tileSize*30+5,
            tileSize*30+5,
    );
}
function drawPlayer() {
    ctx.beginPath();
    ctx.arc(player.px*tileSize+5, player.py*tileSize+5, (tileSize*0.5)/2, 0, 2 * Math.PI);
    ctx.fillStyle = "#ffffff";
    ctx.fill();
    ctx.lineWidth = 4;

    ctx.beginPath();
    ctx.moveTo(player.px*tileSize+5, player.py*tileSize+5);
    ctx.strokeStyle = "#ffffff";
    ctx.lineTo(
        player.px*tileSize + Math.cos(player.angle) * tileSize+5,
        player.py*tileSize + Math.sin(player.angle) * tileSize+5
    );
    ctx.lineWidth = 3;
    ctx.stroke();

}


function draw2d(){
    drawMap();
    drawPlayer();
}
function notInWall(hx,hy){
        const mapX = Math.floor(hx);
        const mapY = Math.floor(hy);
    
        if (mapY<0||mapY>=map.length||mapX<0||mapX>=map[mapY].length){
            return false
        }
    return map[mapY][mapX]===0||map[mapY][mapX]===2
}
function notInWallPlayer(px,py){
    

    const radius = 0.1
    const points = [
        [px+radius,py+radius],
        [px-radius,py+radius],
        [px-radius,py-radius],
        [px+radius,py-radius],
    ]
    for (let i = 0; i<4; i++){
        if (!notInWall(points[i][0],points[i][1])){
            return false;
        }
    }
    return true;
}


document.addEventListener("keydown",function(event){
    if (event.key ==="ArrowUp"||event.key ==="ArrowDown"||event.key ==="ArrowLeft"||event.key ==="ArrowRight"||
        event.key =="w"||event.key =="a"||event.key =="s"||event.key =="d"
    ){
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
    if (keys["ArrowRight"]||keys["d"]){
        player.angle+=turnSpeed*deltaTime;
    }
    if (keys["ArrowLeft"]||keys["a"]){
        player.angle-=turnSpeed*deltaTime;
    }
    if (keys["ArrowUp"]||keys["w"]){
        const newX = player.px+Math.cos(player.angle)*speed*deltaTime
        const newY = player.py+Math.sin(player.angle)*speed*deltaTime
        if (notInWallPlayer(newX,player.py)){
            player.px = newX;
        }
        if (notInWallPlayer(player.px,newY)){
            player.py = newY;
        }
    }
    if (keys["ArrowDown"]||keys["s"]){
        const newX = player.px-Math.cos(player.angle)*speed*deltaTime
        const newY = player.py-Math.sin(player.angle)*speed*deltaTime
        if (notInWallPlayer(newX,player.py)){
            player.px = newX;
        }
        if (notInWallPlayer(player.px,newY)){
            player.py = newY;

        }
    }
    if (Math.floor(player.px)==29&&Math.floor(player.py)==29){
        //window.location.href = "winner.html";
    }
    player.angle %= Math.PI*2;
    if (player.angle<0){
        player.angle+=Math.PI*2
    }
    draw3d()
    if(mFlag){draw2d()}
    if(cpFlag){drawCompass()}
    requestAnimationFrame(update);

}
requestAnimationFrame(update);


function raycaster(angle){
    let tx = player.px;
    let ty = player.py;

    const testSize = 0.02;
    let distance = 0;
    let side = 0
    while (notInWall(tx,ty)&&distance<maxDistance){
        tx+=Math.cos(angle)*testSize;
        ty+=Math.sin(angle)*testSize;
        distance+=testSize;
    }
    if (Math.floor(tx-Math.cos(angle)*testSize) !==Math.floor(tx)){
        side = 0.5;
    }
    return [distance*Math.cos(angle-player.angle),[tx,ty],side];
}

function draw3d(){
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = gradient;
    ctx.fillRect(0,0,canvas.width, canvas.height);
    for(let i=0; i<90; i++){
        const disArray = raycaster(player.angle+((i-45)*(Math.PI/180)));
        const dis = disArray[0];
        const brightness = Math.max(0,1-dis*2.3*disArray[2]/maxDistance)

        const wallHeight = 500/dis;

        const sx = i*10;
        
        const sy = (canvas.height-wallHeight)/2;
        const hitC = disArray[1];
        if(Math.floor(hitC[0])>=29&&Math.floor(hitC[1])>=29){
            ctx.fillStyle=`rgb(${96*brightness}, ${186*brightness}, ${92*brightness})`
        }
        else {
            ctx.fillStyle=`rgb(${190*brightness}, ${52*brightness}, ${52*brightness})`;
        }
        ctx.fillRect(sx,sy,10,wallHeight);
    }
}
function genMaze(w,h){
    let maze = Array.from({ length: h }, () => Array(w).fill(1));
    maze[1][1]=0;
    function shuffleArray(array) {
        for (let i = array.length - 1; i >= 1; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }
    let direction = [
            [0,-2],
            [0,2],
            [2,0],
            [-2,0]
    ];
    let stack = [[1,1]];
    while (stack.length>0){
        const ox = stack[stack.length-1][0];
        const oy = stack[stack.length-1][1];
        let cflag = true;
        direction = shuffleArray(direction);
        for (const [dx,dy] of direction ){
            const nx = ox+dx;
            const ny = oy+dy;
            if (nx<=0||nx>=w-1||ny<=0||ny>=h-1){
                continue;
            }
            if (maze[ny][nx]===1){
                maze[oy + dy / 2][ox + dx / 2] = 0;
                maze[ny][nx]=0;
                stack.push([nx,ny]);
                cflag = false;
                break;
            }
        }
        if (cflag){
            stack.pop();
        }

    }
    return maze;
}
function minimap(){
    if (mFlag) {
        mFlag = false
    } else{
        mFlag = true
    }
}
function drawCompass(){
    ctx.beginPath();
    ctx.arc(tileSize*170, tileSize*7, (tileSize*5), 0, 2 * Math.PI);
    ctx.fillStyle = "#f5f5f5";
    ctx.fill();
    ctx.lineWidth = 4;

    ctx.beginPath();
    ctx.arc(tileSize*170, tileSize*7, (tileSize*3.25), 0, 2 * Math.PI);
    ctx.strokeStyle = "#383636";
    ctx.stroke();
    ctx.lineWidth = 4;

    ctx.beginPath();
    ctx.moveTo(tileSize*170, tileSize*7);
    ctx.strokeStyle = "#ce1a1a";
    ctx.lineTo(
    tileSize*170 + Math.cos(player.angle+Math.PI/2) * tileSize*4.5,
    tileSize*7 + Math.sin(player.angle+Math.PI/2) * tileSize*4.5
);
    ctx.lineWidth = 3;
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(tileSize*170, tileSize*7);
    ctx.strokeStyle = "#838383";
    ctx.lineTo(
    tileSize*170 + Math.cos(player.angle) * tileSize*4.5,
    tileSize*7 + Math.sin(player.angle) * tileSize*4.5
);
    ctx.lineWidth = 3;
    ctx.stroke();

    ctx.lineWidth = 3;
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(tileSize*170, tileSize*7);
    ctx.strokeStyle = "#838383";
    ctx.lineTo(
    tileSize*170 + Math.cos(player.angle-Math.PI/2) * tileSize*4.5,
    tileSize*7 + Math.sin(player.angle-Math.PI/2) * tileSize*4.5
);
    ctx.lineWidth = 3;
    ctx.stroke();

    ctx.lineWidth = 3;
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(tileSize*170, tileSize*7);
    ctx.strokeStyle = "#838383";
    ctx.lineTo(
    tileSize*170 + Math.cos(player.angle+Math.PI) * tileSize*4.5,
    tileSize*7 + Math.sin(player.angle+Math.PI) * tileSize*4.5
);
    ctx.lineWidth = 3;
    ctx.stroke();
}
function compass(){
    if (cpFlag) {
        cpFlag = false
    } else{
        cpFlag = true
    }
}

