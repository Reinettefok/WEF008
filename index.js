const unitLength  = 20;
const boxColor    = "#ffffff"; 
const stableColor = 150;
const emptyColor = "#090909";
let leftColor ;
let midColor ;
let rightColor ;

const strokeColor = "#81d4f9";
let columns; /* To be determined by window width */
let rows;    /* To be determined by window height */
let currentBoard;
let nextBoard;
let slider;//speed slider
let isGameStart;



window.onload = () =>{
    console.log("Hello, World")
}

function  init() {
    for (let i = 0; i < columns; i++) {
        for (let j = 0; j < rows; j++) {
            currentBoard[i][j] = 0;
            nextBoard[i][j] = 0;
        }
    }
}

function generate() {
    //Loop over every single box on the board
    for (let x = 0; x < columns; x++) {
        for (let y = 0; y < rows; y++) {
            // Count all living members in the Moore neighborhood(8 boxes surrounding)
            let neighbors = 0;
            //the [-1,0,1] below is the relative direction of the single box
            for (let i of [-1, 0, 1]) {
                for (let j of [-1, 0, 1]) {
                    if( i == 0 && j == 0 ){
                        // the cell itself is not its own neighbor
                        continue;
                    }
                    // The modulo operator is crucial for wrapping on the edge
                    neighbors += currentBoard[(x + i + columns) % columns][(y + j + rows) % rows];
                } 
            }

            // Rules of Life
            if (currentBoard[x][y] == 1 && neighbors < 2) {
                // Die of Loneliness
                nextBoard[x][y] = 0;
            } else if (currentBoard[x][y] == 1 && neighbors > 3) {
                // Die of Overpopulation
                nextBoard[x][y] = 0;
            } else if (currentBoard[x][y] == 0 && neighbors == 3) {
                // New life due to Reproduction
                nextBoard[x][y] = 1;
            } else {
                // Stasis
                nextBoard[x][y] = currentBoard[x][y];
                
            }
        }
    }

    // Swap the nextBoard to be the current Board
    [currentBoard, nextBoard] = [nextBoard, currentBoard];
}

function setup(){
    //set default frameRate
    
    /* Set the canvas to be under the element #canvas*/
    const canvas = createCanvas(300, 300);
    canvas.parent(document.querySelector('#canvas'));
    //make a slider
    slider = createSlider(1, 30, 15, 9);
    //   slider.position(10, 10);
    //   slider.style('width', '80px');
    //make the click only active within canvas
    
    /*Calculate the number of columns and rows */
    columns = floor(width  / unitLength);
    rows    = floor(height / unitLength);

    /*Making both currentBoard and nextBoard 2-dimensional matrix that has (columns * rows) boxes. */
    currentBoard = [];
    nextBoard = [];

    leftColor = color('hsl(33, 41%, 86%)');
    midColor = color('hsl(78, 41%, 86%)');
    rightColor = color('hsl(242, 41%, 86%)');

    for (let i = 0; i < columns; i++) {
        currentBoard[i] = [];
        nextBoard[i] = []
    }
    // Now both currentBoard and nextBoard are array of array of undefined values.
    init();  // Set the initial values of the currentBoard and nextBoard
    updateUI();
}

function draw() {
    
    let val = slider.value();
    frameRate(val);
    console.log(isGameStart);
    if (isGameStart == true) {
    generate();
    updateUI();
    }
    
}

function updateUI (){

    for (let i = 0; i < columns; i++) {
        for (let j = 0; j < rows; j++) {
        
            if (currentBoard[i][j] == nextBoard[i][j] && currentBoard[i][j] !== 0 && nextBoard[i][j] !==0) {
                fill(stableColor);
            
                
            }  else if (currentBoard[i][j] == 1){

                
                fillBoxColor(i,j);
              
                
            } else {
                fill(emptyColor);
            } 
            drawRectangle (i,j);
        }
    }
}

function mousePressed()
{
    const x = Math.floor(mouseX / unitLength);
    const y = Math.floor(mouseY / unitLength);

    if (mouseX > unitLength * columns || mouseY > unitLength * rows || mouseX < 0 || mouseY < 0)
    {
        return;
    }
    if (currentBoard[x][y] == 1)
    {
        currentBoard[x][y] = 0;
    } else
    {
        console.log("mouse pressed triggered")
        currentBoard[x][y] = 1;
    }
    updateUI();
    setGameStart(false);
    console.log(mouseX, mouseY);
}

function mouseDragged() {
    
    /**
     * If the mouse coordinate is outside the board
     */
    if (mouseX > unitLength * columns || mouseY > unitLength * rows || mouseX < 0 || mouseY < 0) {
        console.log(mouseX, mouseY, "testing");
        return;
    }
    const x = Math.floor(mouseX / unitLength);
    const y = Math.floor(mouseY / unitLength);


    console.log("mouse dragged triggered")
    currentBoard[x][y] = 1;

    updateUI();
   
    }

function mouseReleased() {
    if (mouseX > unitLength * columns || mouseY > unitLength * rows || mouseX < 0 || mouseY < 0) {
        return;
    }
    console.log(`mouse released is triggered`)
    setGameStart(false);
    
}

document.querySelector('#start')
    .addEventListener('click', function() {
        setGameStart(true);
    });

document.querySelector('#reset-game')
    .addEventListener('click', function() {
        setGameStart(false)
        init();
        updateUI();
    });


 
function insertPattern (){
    console.log(acornPattern);
    const acornPatternArr = acornPattern.split("\n")
    for (let i =0; i<acornPatternArr.length; i++) {
        for (let j = 0; j < acornPatternArr[i].length; j++) {
            console.log(acornPatternArr[i] [j]);
            currentBoard[j][i] = 1;
        }
    }
}

document.querySelector('#pause')
    .addEventListener('click', function() {
        setGameStart(false);

    });



// set gamestart switch

function setGameStart(isStart)
{
    isGameStart = isStart;
    if (isStart)
    {
        loop();
    } else
    {
        noLoop();
    }
}

function fillBoxColor(x){

        if (x <  columns * 1/3) {
        fill(leftColor);
        }else if( (x <  columns * 2/3)){
        fill(midColor); 
        } else{
        fill(rightColor);  
        }
}

function drawRectangle (x,y){
    stroke(strokeColor);
    rect(x * unitLength, y * unitLength, unitLength, unitLength);
}