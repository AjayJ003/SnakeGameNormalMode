const playBoard = document.querySelector(".playBoard");
const gameScoreEle=document.querySelector(".gameScore");
const scoreEle = document.querySelector(".score");
const highScoreEle = document.querySelector(".highScore");
const exitEle = document.querySelector('.word');
const timerEle = document.querySelector('.timer');
const buttonControlsEle = document.querySelectorAll(".buttonControls i");
const leaderBoard=document.querySelector(".lbc");

let foodX,foodY,foodX1,foodY1,foodX2,foodY2,foodX3,foodY3;
let foodlist=[[foodX,foodY],[foodY1,foodX2],[foodX2,foodY2],[foodX3,foodY3]];
let element=[1,2,3,4];
let cont=0;
let gameOver=false;
let snakebody=[
    {x:3,y:1},
    {x:2,y:1},
    {x:1,y:1}
]
let speedX=0,speedY=0;
let gameScore=0;
let setIntervalEle;
let second=60,starttime,endtime;
let time=60;

let leaderBoardList=JSON.parse(localStorage.getItem(".lbc"));
if(leaderBoardList===null||leaderBoardList == []){
    leaderBoardList=[];
    for(i=0;i<5;i++){
        leaderBoardList.push([0,"Guest"]);
    }
    localStorage.setItem("leaderboard", JSON.stringify(leaderBoardList));
}

//username and prompt message display
let username = prompt("Please enter your username","Guest");
window.alert("If you eat the food according to sequence you will gain time of +5 !!!")
window.alert("Close the leaderboard before the game")

//Getting highscore from localStroage
let highScore = localStorage.getItem(".highScore") || 0;
highScoreEle.innerHTML = 'HighScore : '+highScore;

//function that is called when the game is need to endded
const displayGameOver = () =>{
    leaderBoardList.push([highScore, username]);
    leaderBoardList.sort((a,b) => {return a[0]-b[0]});
    leaderBoardList.reverse();
    leaderBoardList.pop();
    localStorage.setItem(".lbc", JSON.stringify(leaderBoardList));
    clearInterval(setIntervalEle);
    alert('Game Over...');
    location.reload();
}

//randam list generation
const createfood = () => {
    const randfood = () => {
        let randfood=Math.floor((Math.random()*30)+1);
        return randfood;
    }

    foodX=randfood();
    foodY=randfood();
    foodX1=randfood();
    foodY1=randfood();
    foodX2=randfood();
    foodY2=randfood();
    foodX3=randfood();
    foodY3=randfood();

    foodlist=[[foodX,foodY],[foodX1,foodY1],[foodX2,foodY2],[foodX3,foodY3]];
    
    element=[1,2,3,4];


}

//Governs the movement of snake
const snakeControls = (a) => {
    if(second==60){
        starttime=new Date();
        second = 59.99;
    }
    let keyData = a.key;
    if (keyData == "ArrowUp" && speedY!=1){
        cont=1;
        speedX = 0;
        speedY = -1;
    }
    else if (keyData == "ArrowDown" && speedY!=-1){
        cont=1;
        speedX = 0;
        speedY = 1;
    }
    else if (keyData == "ArrowRight" && speedX!=-1){
        cont=1;
        speedX = 1;
        speedY = 0;
    }
    else if (keyData == "ArrowLeft" && speedX!=1){
        cont=1;
        speedX = -1;
        speedY = 0;
    }
    

}

//foreach function creation of virtual button and eventlistener
buttonControlsEle.forEach(button => button.addEventListener("click", () => snakeControls({ key: button.dataset.key })));

//Main Game funciton
const startGame = () => {
    //Time running
    if(second!=60){
        endtime = new Date();
        duration = (endtime-starttime)/1000;
        starttime= new Date();
        second -=duration;
        let time=Math.round(second);
        timerEle.innerHTML = 'Time : '+time;
        if (time<0){
            gameOver=true;
        }
    }
    //gameover condition checking
    if (gameOver) return displayGameOver();
    let html="";
    
    //creation of div food
    for(i=0;i<foodlist.length;i++){
         html+=`<div class="food${element[i]}" style="grid-area: ${foodlist[i][1]}/${foodlist[i][0]}"></div>`; 
    }

    //creation of snakebody
    for (let i = 0; i < snakebody.length; i++) {
        html += `<div class="snake" style="grid-area: ${snakebody[i].y} / ${snakebody[i].x}"></div>`;
    }

    if(cont){
        for (let i = snakebody.length-2 ; i >=0; i--) {
            snakebody[i+1]={...snakebody[i]};        
        }
        snakebody[0].x+=speedX;
        snakebody[0].y+=speedY;
    } 
    
    //checking the seq
    for (let i = 0; i < foodlist.length; i++){
        if (snakebody[0].x == foodlist[i][0] && snakebody[0].y == foodlist[i][1]){
            //console.log((i+ 1), foodNumber);
            if (i != 0){
                //gameOver=true //for ending game if it eats wrong sequence
                gameScore+=1;
                foodlist.splice(i,1);
                element.splice(i,1);
                break;
            }
            else{
                gameScore++; //increment score by 1 for eating a block
                foodlist.splice(i,1);
                element.splice(i,1);
                if (foodlist.length == 0){
                    second+= 5;
                    createfood();            
                }
                break;
            }
        }
    }

    
    if (gameScore >= highScore){
            highScore = gameScore;
    }

    localStorage.setItem('.highScore',highScore);
    scoreEle.innerHTML ='Score : '+gameScore;
    highScoreEle.innerHTML ='HighScore : '+highScore;
        
    if (snakebody[0].x<=0 || snakebody[0].x>=31 || snakebody[0].y<=0 || snakebody[0].y>=31 ){
        gameOver=true;
    }

    //leaderboard div creation
    let html2="";
    leaderBoardList.forEach((element, index)=>{
        html2+=`<div class="leader grid-row-start =${index+1} grid-column-start =1">${element[1]} - ${element[0]}</div>`;
    })
    
    leaderBoard.innerHTML = html2
    playBoard.innerHTML = html;

}

createfood();

setIntervalEle=setInterval(startGame,130);
document.addEventListener('keydown',snakeControls);

//hide the leaderboard div
const togglefunction = () => {
    let x = document.querySelector('.outerwindowlb');
    if (x.style.display === "none") {
      x.style.display = "block";
    } else {
      x.style.display = "none";
    }
}