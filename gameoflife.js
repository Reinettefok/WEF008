const unitLength = 10;
const boxColor = "#ffffff";
const stableColor = "#7E763B";
const emptyColor = "#9FE7F5";
let leftColor;
let midColor;
let rightColor;
let selectedColor = "#429EBD";
const strokeColor = "#ffffff";
let columns; /* To be determined by window width */
let rows;    /* To be determined by window height */
let currentBoard;
let nextBoard;
let slider;//speed slider
let isGameStart;
let selectedPattern = null;
let keyX = 0;
let keyY = 0;


window.onload = () =>
{
    console.log("Hello, World")
}

function init()
{
    for (let i = 0; i < columns; i++)
    {
        for (let j = 0; j < rows; j++)
        {
            currentBoard[i][j] = 0;
            nextBoard[i][j] = 0;
        }
    }
}

function init2()
{
    for (let i = 0; i < columns; i++)
    {
        for (let j = 0; j < rows; j++)
        {

            currentBoard[i][j] = random() > 0.8 ? 1 : 0;
            nextBoard[i][j] = 0;
        }
    }
}

function generate()
{
    //Loop over every single box on the board
    for (let x = 0; x < columns; x++)
    {
        for (let y = 0; y < rows; y++)
        {
            // Count all living members in the Moore neighborhood(8 boxes surrounding)
            let neighbors = 0;
            //the [-1,0,1] below is the relative direction of the single box
            for (let i of [-1, 0, 1])
            {
                for (let j of [-1, 0, 1])
                {
                    if (i == 0 && j == 0)
                    {
                        // the cell itself is not its own neighbor
                        continue;
                    }
                    // The modulo operator is crucial for wrapping on the edge
                    neighbors += currentBoard[(x + i + columns) % columns][(y + j + rows) % rows];
                }
            }

            // Rules of Life
            if (currentBoard[x][y] == 1 && neighbors < 2)
            {
                // Die of Loneliness
                nextBoard[x][y] = 0;
            } else if (currentBoard[x][y] == 1 && neighbors > 3)
            {
                // Die of Overpopulation
                nextBoard[x][y] = 0;
            } else if (currentBoard[x][y] == 0 && neighbors == 3)
            {
                // New life due to Reproduction
                nextBoard[x][y] = 1;
            } else
            {
                // Stasis
                nextBoard[x][y] = currentBoard[x][y];

            }
        }
    }

    // Swap the nextBoard to be the current Board
    [currentBoard, nextBoard] = [nextBoard, currentBoard];
}

function setup()
{
    //set default frameRate

    /* Set the canvas to be under the element #canvas*/
    const canvas = createCanvas(1000, 500);
    canvas.parent(document.querySelector('#canvas'));
    //make a slider
    slider = createSlider(1, 60);
    slider.parent(document.querySelector('#slider'));
   
    slider.style('width', '80px');
    slider.style('background-color', '#F59613');


    /*Calculate the number of columns and rows */
    columns = floor(width / unitLength);
    rows = floor(height / unitLength);

    /*Making both currentBoard and nextBoard 2-dimensional matrix that has (columns * rows) boxes. */
    currentBoard = [];
    nextBoard = [];

    leftColor = "#F7AD19";
    midColor = "#053F5C";
    rightColor = "#F27F0C";

    for (let i = 0; i < columns; i++)
    {
        currentBoard[i] = [];
        nextBoard[i] = []
    }
    // Now both currentBoard and nextBoard are array of array of undefined values.
    init();  // Set the initial values of the currentBoard and nextBoard
    updateUI();
}

function draw()
{

    let val = slider.value();
    frameRate(val);
    
    if (isGameStart == true)
    {
        generate();
        updateUI();
    }
}

function updateUI()
{

    for (let i = 0; i < columns; i++)
    {
        for (let j = 0; j < rows; j++)
        {

            if (currentBoard[i][j] == nextBoard[i][j] && currentBoard[i][j] !== 0 && nextBoard[i][j] !== 0)
            {
                fill(stableColor);


            } else if (currentBoard[i][j] == 1)
            {


                fillBoxColor(i, j);


            } else
            {
                fill(emptyColor);
            }
            drawRectangle(i, j);
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

    if (selectedPattern !== null)
    {

        insertPattern(x, y, selectedPattern);

    } else
    {
        if (currentBoard[x][y] == 1)
        {
            currentBoard[x][y] = 0;
        } else
        {
            
            currentBoard[x][y] = 1;
        }
    }
    updateUI();
    setGameStart(false);
    selectedPattern = null;
}

function mouseDragged()
{

    /**
     * If the mouse coordinate is outside the board
     */
    if (mouseX > unitLength * columns || mouseY > unitLength * rows || mouseX < 0 || mouseY < 0)
    {
      
        return;
    }
    const x = Math.floor(mouseX / unitLength);
    const y = Math.floor(mouseY / unitLength);

    currentBoard[x][y] = 1;

    updateUI();

}

function mouseReleased()
{
    if (mouseX > unitLength * columns || mouseY > unitLength * rows || mouseX < 0 || mouseY < 0)
    {
        return;
    }
   
    setGameStart(false);

}

document.querySelector('#start')
    .addEventListener('click', function ()
    {
        setGameStart(true);
    });

document.querySelector('#reset-game')
    .addEventListener('click', function ()
    {
        setGameStart(false)
        init();
        updateUI();
    });

document.querySelector('#default')
    .addEventListener('click', function ()
    {
        setGameStart(false)
        init2();
        updateUI();
    });

document.querySelector('#pause')
    .addEventListener('click', function ()
    {
        setGameStart(false);

    })


function insertPattern(x, y, pattern)
{
    
    const patternArr = pattern.split("\n");
    
    for (let i = 0; i < patternArr.length; i++)
    {
        // i -> row
        for (let j = 0; j < patternArr[i].length; j++)
        {
            // j -> column

            currentBoard[x + j][y + i] = patternArr[i][j] === "." ? 0 : 1;
        }
    }

}

document.querySelector('.dropdown-content')
    .addEventListener('click', function (e)
    {
        switch (e.target.innerText)
        {
            case "gosper glider gun":
                selectedPattern = gosper; break;

            case "glider":
                selectedPattern = glider; break;

            case "lightweight train":
                selectedPattern = lwss; break;

            case "pulsar":
                selectedPattern = pulsar; break;

            case "pentadecathlon":
                selectedPattern = penta; break;

        }
    })




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
function fillBoxColor(x)
{

    if (x < columns * 1 / 3)
    {
        fill(leftColor);
    } else if ((x < columns * 2 / 3))
    {
        fill(midColor);
    } else
    {
        fill(rightColor);
    }
}

function drawRectangle(x, y)
{
    stroke(strokeColor);
    rect(x * unitLength, y * unitLength, unitLength, unitLength);
}




function keyPressed()
{   updateUI();
    
     if (keyCode === LEFT_ARROW)
    {
        keyX = keyX - 1; 
        
      
    } 
    else if (keyCode === RIGHT_ARROW)
    {
        
       keyX = keyX + 1;  
      

    } else if (keyCode === UP_ARROW)
    {
        keyY = keyY - 1;
      

    } else if (keyCode === DOWN_ARROW)
    {
       keyY = keyY + 1;
     
    }

    if (keyCode === RETURN) {
        currentBoard[keyX][keyY] = 1;
        updateUI();
       
      }

    keyX = (keyX  + columns) % columns;
    keyY = (keyY+ rows) % rows;
    fill(selectedColor);
    drawRectangle(keyX, keyY);
    setGameStart(false);
   
}