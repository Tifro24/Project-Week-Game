// grid

let grid
let gridWidth = 1280
let gridHeight = 720
let context

// character

let charWidth = 48
let charHeight = 68
let charX = gridWidth/16
let charY = gridHeight/4
let charRightImg;
let charLeftImg;


let char = {
    x : charX,
    y : charY,
    width : charWidth,
    height : charHeight,
    img : null,
    velocityLX : 0,
    velocityRX : 0,
    velocityY : 0,
    jumping: true,
}

//physics
let velocityX = 0
let velocityY = 0
let initialVelocityX = -5




//platforms

let platArr = []
let platWidth = 150;
let platHeight = 60;
let platformImg;

let score = 0;
let gameOver = false;

window.onload =function(){

grid = document.getElementById("grid")
grid.width = gridWidth
grid.height = gridHeight
context = grid.getContext("2d")

let bgSound = document.getElementById("bgSound")
bgSound.play()





//drawing character



charRightImg = new Image();
charRightImg.src = "/Media/images/mariorightpng.png"
char.img = charRightImg
charRightImg.onload = function(){
    context.drawImage(charRightImg, char.x, char.y, char.width, char.height)
}

charLeftImg = new Image();
charLeftImg.src = "/Media/images/marioleftpng.png";






platformImg = new Image();
platformImg.src = "/Media/images/8bitplatform.png"

placePlatforms();
requestAnimationFrame(update);
document.addEventListener("keydown", moveCharacter)
document.addEventListener("keyup", noMoveCharacter)
}


function moveCharacter(e){
    if (e.code == "ArrowRight" || e.code == "KeyD"){
        char.velocityRX = 7;
        char.img = charRightImg;
        
    }

    else if (e.code == "ArrowLeft" || e.code == "KeyA"){
        char.velocityLX = -7;
        char.img = charLeftImg;
        
    }

    if (e.code == "ArrowUp" && char.jumping == false || e.code == "KeyW" && char.jumping == false){
        char.velocityY -= 30;
        char.jumping = true
        let sound = document.getElementById("Sound")
        sound.volume = 0.1
        sound.load()
        sound.play()
        
    }

    if (e.code == "Space" && gameOver){
         char = {
            x : charX,
            y : charY,
            width : charWidth,
            height : charHeight,
            img : charRightImg,
            velocityLX : 0,
            velocityRX : 0,
            velocityY : 0,
            jumping: true,
        }
        
        deathSound.pause()
        deathSound.currentTime = 0
     

        score = 0;
        gameOver = false
        bgSound.load()
        bgSound.play()
        placePlatforms();
    }
}

function noMoveCharacter(e){
    if (e.code == "ArrowRight" || e.code == "KeyD"){
        char.velocityRX  = 0;
        char.img = charRightImg;
        
    }

    else if (e.code == "ArrowLeft" || e.code == "KeyA"){
        char.velocityLX = 0;
        char.img = charLeftImg;
        
    }

    if (e.code == "ArrowUp" && char.jumping == false || e.code == "KeyW" && char.jumping == false){
        char.velocityY -= 0;
        char.jumping = true
        
    }
}




function update(){
    requestAnimationFrame(update);
    if(gameOver){
        context.fillStyle = "black"
        context.font = "25px sans-serif"
        context.fillText(`You Scored ${score}! Press 'Space' to Reset`, gridWidth/3 +10, gridHeight*7/8);
        bgSound.pause()
        bgSound.currentTime = 0
        return;
    }
    context.clearRect(0, 0, grid.width, grid.height);

    //character
    char.x += char.velocityLX
    char.x += char.velocityRX
    char.velocityY += 1.5;
    char.y += char.velocityY
    if (char.x > gridWidth - char.width){
        velocityX = 0
        char.x = gridWidth - char.width
    }

    if (char.x < 0){
        velocityX = 0
        char.x = 0
    }

    if (char.y > grid.height){
        char.jumping = true;
        char.y = grid.height
        char.velocityY = 0
        let deathSound = document.getElementById("deathSound")
        deathSound.play()
        gameOver = true
    }


    context.drawImage(char.img, char.x, char.y, char.width, char.height);

    //platforms

    for(let i = 0; i<platArr.length; i++){
        let platform = platArr[i]
            platform.x += initialVelocityX
        

        if (detectCollsion(char, platform) && velocityY >= 0){
            char.y = platform.y - char.height
            char.velocityY = 0
            char.jumping = false
        }
        context.drawImage(platformImg, platform.x, platform.y, platform.width, platform.height)
    }

    //clear platforms and add new platforms

    while (platArr.length > 0 && platArr[0].x + platArr[0].width < 0){
        platArr.shift();
        console.log(platArr)
        newPlatform();
    }

    //score
    updateScore();
    context.fillStyle = "black"
    context.font = "25px sans-serif"
    context.fillText(score, 5,25);

    



}



function placePlatforms(){
    platArr = [];

    //starting platform

    let platform = {
         img: platformImg,
        x : char.x - 50,
        y : char.y,
        width : platWidth,
        height : platHeight
    }

    platArr.push(platform);

    // platform = {
    //      img: platformImg,
    //     x : gridWidth - 650,
    //     y : gridHeight - 100,
    //     width : platWidth,
    //     height : platHeight
    // }
    // platArr.push(platform);

    for (let i=0; i<6; i++){
        let randomY = Math.floor(Math.random() * gridHeight) 
        let platform = {
        img: platformImg,
        x : 0 + 190*i + 150,
        y : randomY,
        width : platWidth,
        height : platHeight
       }
   
       platArr.push(platform);
    }
}


function newPlatform(){
    let randomY = Math.floor(Math.random() * gridHeight) 
        let platform = {
        img: platformImg,
        x : gridWidth,
        y : randomY,
        width : platWidth,
        height : platHeight
       }
   
       platArr.push(platform);
      
}


function detectCollsion(a,b) {
   return   a.x < b.x + b.width && 
            a.x + a.width > b.x &&
            a.y < b.y + b.height &&
            a.y + a.height > b.y;
 }

 function updateScore(){
    let points = Math.floor(50*Math.random())
    score += points
 }

 