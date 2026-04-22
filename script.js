const board=document.querySelector('.board');
const startButton=document.querySelector('.start-btn');
const modal=document.querySelector('.modal');
const startGameModal=document.querySelector('.start-game');
const gameOverModal=document.querySelector('.game-over');
const restartButton=document.querySelector('.restart-btn');


const highScoreElement=document.querySelector('#high-score');
const scoreElement=document.querySelector('#score');
const timeElement=document.querySelector('#time');


let highScore=Number( localStorage.getItem("highScore") ) || 0
let score=0;
let time="00-00";

highScoreElement.innerText=highScore


const blockHeight=30;
const blockWidth=30;


let intervalId=null;
let timerId = null;

const blocks={}; // to store the blocks in an object with keys as their coordinates and values as the block elements themselves.
const cols= Math.floor(board.clientWidth/blockWidth); 
// clientWidth gives width of the element in pixels, including padding but excluding borders, margins, and vertical scrollbars (if present).

const rows= Math.floor(board.clientHeight/blockHeight);

let snake=[
    {x:1, y:3},
    {x:1, y:4},
    {x:1, y:5},
]


let direction='right';

let food={x:Math.floor(Math.random()*cols), y:Math.floor(Math.random()*rows)};

// for(let i=0; i< rows*cols; i++){
//     const blocks=document.createElement('div');
//     blocks.classList.add('block');
//     board.appendChild(blocks);
// }


// AWS, AZURE and DIGITAL_OCEAN best backend hosting providers.



startButton.addEventListener('click', ()=>{

    modal.style.display='none';

    intervalId = setInterval(()=>{render();}, 350);

    timerIntervalId = setInterval( ()=>{
        let [ min, sec ] = time.split("-").map(Number)
        if(sec==59){
            min+=1
            sec=0
        }else{
            sec+=1;
        }

        time = `${min}-${sec}`
        timeElement.innerText=time;
    }, 1000)

})

// create grid
for( let i=0; i<rows; i++){
    for(let j=0; j<cols; j++){
        const block=document.createElement('div');
        block.classList.add('block');
        board.appendChild(block);

        // block.innerText=`${i},${j}`;
        block.style.fontSize='60%';
        block.style.color='pink';
        blocks[ `${i}-${j}`]=block;
    }
}

restartButton.addEventListener('click', restartGame); 

function restartGame(){

    clearInterval(intervalId);
    score=0;
    time=`00-00`
    scoreElement.innerText=score;

    snake.forEach(segment=>{
        blocks[`${segment.x}-${segment.y}`].classList.remove('snake');
    })

    snake=[
        {x:1, y:3},
        {x:1, y:4},
        {x:1, y:5},
    ];

    modal.style.display='none';
    gameOverModal.style.display='none';
    startGameModal.style.display='flex';

    direction='down';

// restart the loop
    intervalId = setInterval(()=>{
        render();
    }, 350);
}


document.addEventListener('keydown', (e)=>{ // keydown event is fired when a key is pressed down.
    if(e.key==='ArrowUp' && direction!=='down'){ // e.key gives the value of the key that was pressed.
        direction='up';
    }
    else if(e.key==='ArrowDown' && direction!=='up'){
        direction='down';
    }
    else if(e.key==='ArrowLeft' && direction!=='right'){
        direction='left';
    }
    else if(e.key==='ArrowRight' && direction!=='left'){
        direction='right';
    }
});


let touchStartX = 0;
let touchStartY = 0;

document.addEventListener("touchstart", (e) => {
    touchStartX = e.touches[0].clientX;
    touchStartY = e.touches[0].clientY;
});

document.addEventListener("touchend", (e) => {
    let touchEndX = e.changedTouches[0].clientX;
    let touchEndY = e.changedTouches[0].clientY;

    let dx = touchEndX - touchStartX;
    let dy = touchEndY - touchStartY;

    if (Math.abs(dx) > Math.abs(dy)) {
        if (dx > 0 && direction !== "left") direction = "right";
        else if (dx < 0 && direction !== "right") direction = "left";
    } else {
        if (dy > 0 && direction !== "up") direction = "down";
        else if (dy < 0 && direction !== "down") direction = "up";
    }
});


function render(){

    blocks[`${food.x}-${food.y}`].classList.add('food');

    let head=null;

    if(direction==="left"){
        head={ x:snake[0].x, y: snake[0].y-1 };
    }
    if(direction==='right'){
        head={ x:snake[0].x, y:snake[0].y+1 }
    }
    if(direction==='up'){
        head={ x:snake[0].x-1, y:snake[0].y }
    }
    if(direction==='down'){
        head={ x:snake[0].x+1, y:snake[0].y }
    }

    

    snake.forEach(segment=>{ // segment is each part of the snake's body, including the head and tail.
        blocks[`${segment.x}-${segment.y}`].classList.remove('snake');
    })

    if( head.x<0 || head.x>=rows || head.y<0 || head.y>=cols){
        clearInterval(intervalId);

        modal.style.display='flex';
        startGameModal.style.display='none';
        gameOverModal.style.display='flex';

        return;
    }

// food consume logic
    if(head.x===food.x && head.y===food.y){

        score+=10;
        scoreElement.innerText=score;

        if(score>highScore){
            highScore=score;
            highScoreElement.innerText=highScore;
            localStorage.setItem("highscore", highScore.toString())
        }

        snake.unshift(head);

        blocks[`${food.x}-${food.y}`].classList.remove('food');
        food={
            x:Math.floor(Math.random()*rows), 
            y:Math.floor(Math.random()*cols)
        };


    }else{
        snake.unshift(head);
        snake.pop();
    }

    snake.forEach(segment=>{
        blocks[`${segment.x}-${segment.y}`].classList.add('snake'); 
    })
}
render();







