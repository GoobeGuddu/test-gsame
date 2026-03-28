let poseSketch = (p) => {
let video;
let body;
let poses = [];
let lerpx = [];
let lerpy = [];
let isSquatting = false;
window.jumpTrigger = false;
window.poseReady = false
function output(e){
    poses = e
}
p.setup = function(){
    let canvas = p.createCanvas(300,300)
    canvas.parent("posecontainer")
    video = p.createCapture(p.VIDEO,{flipped:true})
    video.size(500,500)
    video.hide()
    body = ml5.bodyPose("BlazePose",{flipped:true}, () => {
    body.detectStart(video, output)
    window.poseReady = true}
)
}

function detectSquat(pose){
    let hipY = (pose.keypoints[23].y + pose.keypoints[24].y) / 2
    let kneeY = (pose.keypoints[25].y + pose.keypoints[26].y) / 2
    let squatting = hipY > kneeY - 20
    if(squatting && !isSquatting){
        isSquatting = true
    }
    else if(!squatting && isSquatting){
        isSquatting = false
        window.jumpTrigger = true
        console.log("jumping")
    }
}
p.draw = function(){
    p.background(0)
    p.image(video,0,0,300,300)
    if(poses.length > 0){
        let pose = poses[0]
        detectSquat(pose)
        let skeley = body.getSkeleton()
        for(let i=0;i<pose.keypoints.length;i++){
            let keypoint = pose.keypoints[i]
            let x = keypoint.x * (300 / video.width)
            let y = keypoint.y * (300 / video.height)
            if(!lerpx[i]){
                lerpx[i] = x
                lerpy[i] = y
            }
            lerpx[i] = p.lerp(lerpx[i],x,0.3)
            lerpy[i] = p.lerp(lerpy[i],y,0.3)
            if(keypoint.confidence>0.2){
                p.circle(lerpx[i],lerpy[i],9)
            }
        }
        for(let i=0;i<skeley.length;i++){
            let pair = skeley[i]
            let a = pose.keypoints[pair[0]]
            let b = pose.keypoints[pair[1]]
            let x1 = a.x * (300 / video.width)
            let y1 = a.y * (300 / video.height)
            let x2 = b.x * (300 / video.width)
            let y2 = b.y * (300 / video.height)
            if(a.confidence > 0.2 && b.confidence > 0.2){
                p.stroke(0,255,0)
                p.strokeWeight(3)
                p.line(x1,y1,x2,y2)
            }
        }
    }
}
}
new p5(poseSketch)