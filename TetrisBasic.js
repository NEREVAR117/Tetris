// Written over 2(ish) weeks and completed on September 9th, 2022 following tutorials

let canvas
let ctx
let gBArrayHeight = 20 // How tall in cells the game board is
let gBArrayWidth = 12 // Cell width of game board
let startX = 4 // Where the tetromino spawns on the X axis
let startY = 0 // Where the tetrominospawns on the Y axis
let score = 0 // Player score
let level = 1 // Current level
let winOrLose = "Playing" // Game status
// Used as a look up table where each value in the array
// contains the x & y position we can use to draw the
// box on the canvas
let coordinateArray = [...Array(gBArrayHeight)].map(e => Array(gBArrayWidth).fill(0))

let curTetromino = [[1,0], [0,1], [1,1], [2,1]]

// A list of existing tetrominos
let tetrominos = []
// Colors that match each specific type of tetromino
let tetrominoColors = ['purple','cyan','blue','yellow','orange','green','red']
// Stores the current tetromino's color
let curTetrominoColor

// Creates the game board array
let gameBoardArray = [...Array(20)].map(e => Array(12).fill(0))

// An array that stores the stopped tetrominos (and their colors)
let stoppedShapeArray = [...Array(20)].map(e => Array(12).fill(0))

// Establishes tetromino movement direction
let DIRECTION = {
    IDLE: 0,
    DOWN: 1,
    LEFT: 2,
    RIGHT: 3
}
let direction

class Coordinates
{
    constructor(x, y)
	{
        this.x = x
        this.y = y
    }
}

// Taps into the SetupCanvas function on page load
document.addEventListener('DOMContentLoaded', SetupCanvas)

// Establishes the coordinate array
function CreateCoordArray()
{
    let xR = 0, yR = 19
    let i = 0, j = 0

    for(let y = 9; y <= 446; y += 23)
	{
        for(let x = 11; x <= 264; x += 23)
		{
            coordinateArray[i][j] = new Coordinates(x,y)
            i++
        }

        j++
        i = 0
    }
}

function SetupCanvas()
{
    canvas = document.getElementById('my-canvas')
    ctx = canvas.getContext('2d')
    canvas.width = 936
    canvas.height = 956

    // Doubles everything in size to better fit the screen
    ctx.scale(2, 2)

    // Draws the canvas background
    ctx.fillStyle = 'white'
    ctx.fillRect(0, 0, canvas.width, canvas.height)
    
    // Draws the gameboard rectangle
    ctx.strokeStyle = 'black'
    ctx.strokeRect(8, 8, 280, 462)

	// Draws the Tetris logo
    tetrisLogo = new Image(161, 54)
    tetrisLogo.onload = DrawTetrisLogo
    tetrisLogo.src = "tetrislogo.png"

    // Establishes font for score label text
    ctx.fillStyle = 'black'
    ctx.font = '21px Arial'
    ctx.fillText("SCORE", 300, 98)

    // Draws the score rectangle
    ctx.strokeRect(300, 107, 161, 24)

    // Draws the score
    ctx.fillText(score.toString(), 310, 127)
    
    // Draw the level label text
    ctx.fillText("LEVEL", 300, 157)

    // Draws the level rectangle
    ctx.strokeRect(300, 171, 161, 24)

    // Draws the level (number)
    ctx.fillText(level.toString(), 310, 190)

    // Draws the next label text
    ctx.fillText("WIN / LOSE", 300, 221)

    // Draws the playing condition
    ctx.fillText(winOrLose, 310, 261)

    // Draws the playing condition rectangle
    ctx.strokeRect(300, 232, 161, 95)
    
    // Draws the controls label text
    ctx.fillText("CONTROLS", 300, 354)

    // Draws the controls rectangle
    ctx.strokeRect(300, 366, 161, 104)

    // Draws the controls text
    ctx.font = '19px Arial'
    ctx.fillText("A : Move Left", 310, 388)
    ctx.fillText("D : Move Right", 310, 413)
    ctx.fillText("S : Move Down", 310, 438)
    ctx.fillText("E : Rotate Right", 310, 463)

    // Handles the keyboard buttons being pressed
    document.addEventListener('keydown', HandleKeyPress)

    // Creates an array of the tetromino arrays
    CreateTetrominos()

    // Creates a random tetromino
    CreateTetromino()

    // Creates the rectangle lookup table
    CreateCoordArray()

	// Draws the tetromino (duh)
    DrawTetromino()
}

// Draws the Tetris logo image
function DrawTetrisLogo()
{
    ctx.drawImage(tetrisLogo, 300, 8, 161, 54)
}

function DrawTetromino()
{
    // Cycles through the tetromino array to draw it's cells
    for(let i = 0; i < curTetromino.length; i++)
	{

        // Moves the 'current' tetromino X and Y values to the new tetromino in the game board
        let x = curTetromino[i][0] + startX
        let y = curTetromino[i][1] + startY

        // Puts the tetromino into the gameboard array
        gameBoardArray[x][y] = 1

        // Looks for the X and Y values in the lookup table
        let coorX = coordinateArray[x][y].x;
        let coorY = coordinateArray[x][y].y;

        // Draws a cell at the X and Y coordinates that the lookup table provides
        ctx.fillStyle = curTetrominoColor;
        ctx.fillRect(coorX, coorY, 21, 21);
    }
}

// Keypresses move the tetromino certain desired directions. We copy the exisitng tetromino, move it, then delete the old one.
function HandleKeyPress(key)
{
	// Checks if the game is still running
    if(winOrLose != "Game Over")
	{
		// A key = Left
		if(key.keyCode === 65)
		{
			// Check if we're against the left wall
			direction = DIRECTION.LEFT
			if(!HittingTheWall() && !CheckForHorizontalCollision())
			{
				DeleteTetromino()
				startX--
				DrawTetromino()
			}
		}
		// D key = Right
		else if(key.keyCode === 68)
		{
			// Check if we're against the right wall
			direction = DIRECTION.RIGHT
			if(!HittingTheWall() && !CheckForHorizontalCollision())
			{
				DeleteTetromino()
				startX++
				DrawTetromino()
			}
		}
		// S key = Down
		else if(key.keyCode === 83)
		{
			MoveTetrominoDown()
		}
		// E key = rotate clockwise
		else if(key.keyCode === 69)
		{
			RotateTetromino()
		}
    } 
}

function MoveTetrominoDown()
{
    // Indicates I want to the tetromino move downward
    direction = DIRECTION.DOWN

    // Checks for a vertical collision
    if(!CheckForVerticalCollison())
	{
        DeleteTetromino()
        startY++
        DrawTetromino()
    }
}

// Every 1 second (1000 milliseconds) the tetrominos move downward one cell
window.setInterval(function()
{
    if(winOrLose != "Game Over")
	{
        MoveTetrominoDown()
    }
}, 1000)


// Deletes the previous tetromino by 'whiting' the cells it was drawn in
function DeleteTetromino()
{
    for(let i = 0; i < curTetromino.length; i++)
	{
        let x = curTetromino[i][0] + startX
        let y = curTetromino[i][1] + startY

        // Effectively deletes the tetromino from the gameboard array
        gameBoardArray[x][y] = 0

        // Draws white in where the colored cells were
        let coorX = coordinateArray[x][y].x
        let coorY = coordinateArray[x][y].y
        ctx.fillStyle = 'white'
        ctx.fillRect(coorX, coorY, 21, 21)
    }
}

// 3. Generates a random tetromino
function CreateTetrominos()
{
    // Creates T tetromino
    tetrominos.push([[1,0], [0,1], [1,1], [2,1]]);
    // Creates I tetromino
    tetrominos.push([[0,0], [1,0], [2,0], [3,0]]);
    // Creates J tetromino
    tetrominos.push([[0,0], [0,1], [1,1], [2,1]]);
    // Creates Square tetromino
    tetrominos.push([[0,0], [1,0], [0,1], [1,1]]);
    // Creates L tetromino
    tetrominos.push([[2,0], [0,1], [1,1], [2,1]]);
    // Creates S tetromino
    tetrominos.push([[1,0], [2,0], [0,1], [1,1]]);
    // Creates Z tetromino
    tetrominos.push([[0,0], [1,0], [1,1], [2,1]]);
}

function CreateTetromino()
{
    // Grabs a random tetromino from the above array (of tetrominos)
    let randomTetromino = Math.floor(Math.random() * tetrominos.length);
    // Grabs and sets the random tetromino as the current tetromino
    curTetromino = tetrominos[randomTetromino];
    // Grabs the right color for it
    curTetrominoColor = tetrominoColors[randomTetromino];
}

// Cycles through the tetromino's active cells to see if it's trying to pass the left or right walls
function HittingTheWall()
{
    for(let i = 0; i < curTetromino.length; i++)
	{
        let newX = curTetromino[i][0] + startX
        if(newX <= 0 && direction === DIRECTION.LEFT)
		{
            return true
        }
		else if(newX >= 11 && direction === DIRECTION.RIGHT)
		{
            return true
        }  
    }
    return false
}

// Checks for vertical collisions
function CheckForVerticalCollison()
{
    // Makes a copy of the tetromino in the new location to check if it's out of bounds
    let tetrominoCopy = curTetromino
    // First set it as within boundary (and to change later if needed)
    let collision = false

    // Cycles through the tetromino cells
    for(let i = 0; i < tetrominoCopy.length; i++)
	{
        // Gets each cell of the Tetromino and adjusts it over to check for collision
        let cell = tetrominoCopy[i]

        let x = cell[0] + startX
        let y = cell[1] + startY

        // Checks for vertical collision if moving down
        if(direction === DIRECTION.DOWN){
            y++
        }

        // Checks if the current tetromino is hitting older ones
        if(typeof stoppedShapeArray[x][y+1] === 'string')
		{
            // If yes, we delete the current tetromino
            DeleteTetromino()
            // Move into place and draw the new spot
            startY++
            DrawTetromino()
            collision = true
            break
        }
        if(y >= 20)
		{
            collision = true
            break
        }
    }
	
    if(collision)
	{
        // Checks if the current tetromino is too high and 'loses' the game, then displays that message
        if(startY <= 2)
		{
            winOrLose = "Game Over"
            ctx.fillStyle = 'white'
            ctx.fillRect(310, 242, 140, 30)
            ctx.fillStyle = 'black'
            ctx.fillText(winOrLose, 310, 261)
        }
		else 
		{
            // Adds the now stopped current tetromino to the 'stopp tetrominos' array
            for(let i = 0; i < tetrominoCopy.length; i++)
			{
                let cell = tetrominoCopy[i]
                let x = cell[0] + startX
                let y = cell[1] + startY
                // Also adds the proper color to the array
                stoppedShapeArray[x][y] = curTetrominoColor
            }

			// We now check for 'filled' rows
            CheckForCompletedRows()

            CreateTetromino()

            // Creates the next tetromino in the default position up top, and draws it in the default rotation
            direction = DIRECTION.IDLE
            startX = 4
            startY = 0
            DrawTetromino()
        }
    }
}

// Checks for horizontal collisions
function CheckForHorizontalCollision()
{
    // Makes a copy of the tetromino in the new location to check if it's out of bounds
    var tetrominoCopy = curTetromino
	// First set it as within boundary (and to change later if needed)
    var collision = false

    // Cycles through all the tetromino cells
    for(var i = 0; i < tetrominoCopy.length; i++)
    {
		// Gets each cell of the tetromino and adjusts it over to check for collision
        var cell = tetrominoCopy[i]

        var x = cell[0] + startX
        var y = cell[1] + startY

        // Moves the tetromino left or right
        if (direction == DIRECTION.LEFT)
		{
            x--
        }
		else if (direction == DIRECTION.RIGHT)
		{
            x++
        }

        // If a cell is already present, we copy it to be checked
        var stoppedShapeVal = stoppedShapeArray[x][y]

        // Check if a cell is already taken by a previous tetromino (if it's a string)
        if (typeof stoppedShapeVal === 'string')
        {
            collision = true
            break
        }
    }
    return collision
}

// Checks if a row is 'filled' in
function CheckForCompletedRows()
{
    // Assigns these to 0 to start off
    let rowsToDelete = 0
    let startOfDeletion = 0

    // Checks every row to see if it's filled in
    for (let y = 0; y < gBArrayHeight; y++)
    {
        let completed = true
        // Cycles from left to right to check if the row is filled
        for(let x = 0; x < gBArrayWidth; x++)
        {
            // Grabs the values stored in the stopped tetrominos array
            let cell = stoppedShapeArray[x][y]

            // Checks if the cell is empty or not
            if (cell === 0 || (typeof cell === 'undefined'))
            {
                // If 'nothing' is detected then we break out and move to the next row
                completed=false
                break
            }
        }

        // Triggers if the row is filled
        if (completed)
        {
            // Shifts down the rows
            if(startOfDeletion === 0) startOfDeletion = y
			{
            	rowsToDelete++
			}

            // Deletes the entire line by 'whiting' it out
            for(let i = 0; i < gBArrayWidth; i++)
            {
                // Update the arrays by deleting previous cells
                stoppedShapeArray[i][y] = 0
                gameBoardArray[i][y] = 0
                // Grabs the X and Y values in the lookup table
                let coorX = coordinateArray[i][y].x
                let coorY = coordinateArray[i][y].y
                // Draws the cells as white
                ctx.fillStyle = 'white'
                ctx.fillRect(coorX, coorY, 21, 21)
            }
        }
    }
    if(rowsToDelete > 0)
	{
        score += 10
        ctx.fillStyle = 'white'
        ctx.fillRect(310, 109, 140, 19)
        ctx.fillStyle = 'black'
        ctx.fillText(score.toString(), 310, 127)
        MoveAllRowsDown(rowsToDelete, startOfDeletion)
    }
}

// Moves the upper rows down after a row is deleted
function MoveAllRowsDown(rowsToDelete, startOfDeletion)
{
    for (var i = startOfDeletion-1; i >= 0; i--)
    {
        for(var x = 0; x < gBArrayWidth; x++)
        {
            var y2 = i + rowsToDelete
            var cell = stoppedShapeArray[x][i]
            var nextCell = stoppedShapeArray[x][y2]

            if (typeof cell === 'string')
            {
                nextCell = cell
				// Puts a cell in the gameboard at this X and Y coordinate
                gameBoardArray[x][y2] = 1
				// Draws in the right color
                stoppedShapeArray[x][y2] = cell

                // Gets the X and Y values in the lookup table
                let coorX = coordinateArray[x][y2].x
                let coorY = coordinateArray[x][y2].y
                ctx.fillStyle = nextCell
                ctx.fillRect(coorX, coorY, 21, 21)

                cell = 0
				// Clears the cell
                gameBoardArray[x][i] = 0
				// Clears this spot in the stopped tetromino array
                stoppedShapeArray[x][i] = 0
                coorX = coordinateArray[x][i].x
                coorY = coordinateArray[x][i].y
                ctx.fillStyle = 'white'
                ctx.fillRect(coorX, coorY, 21, 21)
            }
        }
    }
}

// Rotates the tetromino clockwise
function RotateTetromino()
{
    let newRotation = new Array()
    let tetrominoCopy = curTetromino
    let curTetrominoBU

    for(let i = 0; i < tetrominoCopy.length; i++)
    {
        // Clones the array rather than referencing it (as it can cause issues)
        curTetrominoBU = [...curTetromino]

		// Gets the new rotation by deriving the X value of the last cell, then gets the rest of the cells based on that
        let x = tetrominoCopy[i][0]
        let y = tetrominoCopy[i][1]
        let newX = (GetLastCellX() - y)
        let newY = x
        newRotation.push([newX, newY])
    }

    DeleteTetromino()

    // Tries to draw the new tetromino in its new rotation
    try
	{
        curTetromino = newRotation
        DrawTetromino()
    }  
	// If it fails then we back up and redraw the last tetromino
    catch (e)
	{ 
        if(e instanceof TypeError)
		{
            curTetromino = curTetrominoBU
            DeleteTetromino()
            DrawTetromino()
        }
    }
}

// Grabs the X value for the last cell in the tetromino, then orients the other cells with tha
function GetLastCellX()
{
    let lastX = 0
     for(let i = 0; i < curTetromino.length; i++)
    {
        let cell = curTetromino[i]
        if (cell[0] > lastX)
		{
            lastX = cell[0]
		}
    }
    return lastX
}