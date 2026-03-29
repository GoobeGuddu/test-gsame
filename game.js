let gameSketch = (p) => {
let player;
let velocity = 0;
let gravity = 1;
let ground;
let obstacles = []
let score = 0
p.setup = function(){
    let canvas = p.createCanvas(window.innerWidth,window.innerHeight-30)
    canvas.parent("gamecontainer")
    ground = 420
    player = {
        x:50,
        y:ground,
        w:40,
        h:60
    }
}
function obstaclespawn(){
    let obs = {
        x: p.width,
        y : ground,
        w: 20,
        h:60
    }
    obstacles.push(obs)
}
function jump(){
    if(player.y >= ground){
        velocity = -20
    }
}
function movement(){
    velocity += gravity
    player.y += velocity
    if(player.y >= ground){
        player.y = ground
        velocity = 0
    }
}
p.draw = function(){
    if(!window.poseReady){
        p.background(30)
        p.fill("white")
        p.textSize(50)
        p.text("Loading....",300,300)
    }
    else{
    p.background(30)
    if(p.frameCount % 160 === 0){
    obstaclespawn()
}
     for(let i= 0;i<obstacles.length;i++){
        let obs = obstacles[i]
        obs.x -= 3
        p.fill(255)
        p.rect(obs.x, obs.y, obs.w, obs.h)
     }
     for(let i=0;i<obstacles.length;i++){
    let obs = obstacles[i]
    if( player.x < obs.x + obs.w && player.x + player.w > obs.x &&player.y < obs.y + obs.h &&player.y + player.h > obs.y
    ){
        alert("you died")
        console.log("you die")
        location.reload()
        window.poseReady = false
    }
}
    if(window.jumpTrigger === true){
        jump()
        window.jumpTrigger = false
        console.log("jump done")
    }
    movement()
    p.fill(255,0,0)
    p.rect(player.x,player.y,player.w,player.h)
    score++
    p.fill("white")
    p.textSize(20)
    p.text("Score: "+score,20,30)
    p.textSize(20)
}}
}
new p5(gameSketch)
