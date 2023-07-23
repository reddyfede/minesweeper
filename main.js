/*----- app's state (variables) -----*/

const begBoard = [9, 9, 10]       //row,col,bombs
const intBoard = [16, 16, 40]
const expBoard = [30, 16, 99]
let bombsIdx
let board
let grid

/*----- cached element references -----*/

boardEl = document.querySelector(".board")

selectLevelBtnEls = document.querySelectorAll(".levelBtn")

resetBtn = document.getElementById("reset")

bombCounter = document.getElementById("bombCounter")

/*----- event listeners -----*/

for (btn of selectLevelBtnEls) {
    btn.addEventListener("click", defineBoard)
}

boardEl.addEventListener("click", clickTile)


resetBtn.addEventListener("click", init)

/*----- functions -----*/

function init() {
    boardEl.addEventListener("click", clickTile)

    bombCounter.innerText = ""
    bombsIdx = []


    createBoard()
    grid = createGrid()

    bombCounter.innerText = board[2]

    generateBombs()
    placeBombs()
    populateGrid()

    renderBoard()
}

function defineBoard(e) {
    if (e.target.classList.contains("beg")) {
        boardEl.classList.add("beginner")
        boardEl.classList.remove("intermediate")
        boardEl.classList.remove("expert")
    } else if (e.target.classList.contains("int")) {
        boardEl.classList.remove("beginner")
        boardEl.classList.add("intermediate")
        boardEl.classList.remove("expert")
    } else if (e.target.classList.contains("exp")) {
        boardEl.classList.remove("beginner")
        boardEl.classList.remove("intermediate")
        boardEl.classList.add("expert")
    }
    init()
}

function createBoard() {

    deleteBoard()

    if (boardEl.classList.contains("beginner")) {
        board = begBoard
    } else if (boardEl.classList.contains("intermediate")) {
        board = intBoard
    } else if (boardEl.classList.contains("expert")) {
        board = expBoard
    }

    for (let i = 0; i < board[0] * board[1]; i++) {
        newBtn = document.createElement("button")
        newBtn.classList.add("gameTile")
        newBtn.setAttribute("id", `idx${i}`)
        boardEl.appendChild(newBtn)
    }
}

function deleteBoard() {
    while (boardEl.firstChild) {
        boardEl.removeChild(boardEl.lastChild);
    }
}

function clickTile(e) {   //placeholder
    if (!e.target.classList.contains("gameTile")) {
        return
    }
    e.target.disabled = true
    e.target.classList.add("clicked")

    let idx = parseInt(e.target.getAttribute("id").slice(3))
    console.log(idx)
    if (grid[idx] === "B") {

        e.target.classList.add("bomb")
        for (el of bombsIdx) {
            document.getElementById(`idx${el}`).innerText = grid[el]
            document.getElementById(`idx${el}`).classList.add("clicked")
            boardEl.removeEventListener("click", clickTile)
        }

    } else if (grid[idx] !== 0) {

        e.target.innerText = grid[idx]

    } else {

        let checkIfReveal = checkGrid([idx])

        console.log(checkIfReveal)

        for (i = 0; i < checkIfReveal.length; i++) {

            if (grid[checkIfReveal[i]] !== 0) {
                console.log(grid[checkIfReveal[i]])
                document.getElementById(`idx${checkIfReveal[i]}`).innerText = grid[checkIfReveal[i]]
                document.getElementById(`idx${checkIfReveal[i]}`).classList.add("clicked")
                document.getElementById(`idx${checkIfReveal[i]}`).disabled = true
            } else {

                document.getElementById(`idx${checkIfReveal[i]}`).classList.add("clicked")

                for (el of checkGrid([checkIfReveal[i]],false)) {
                    if (!checkIfReveal.includes(el)) {
                        checkIfReveal.push(el)
                    }
                }

            }
        }
    }
}

function generateBombs() {
    while (bombsIdx.length < board[2]) {
        let bomb = Math.floor(Math.random() * board[0] * board[1])
        if (!bombsIdx.includes(bomb)) {
            bombsIdx.push(bomb)
        }
    }
}

function placeBombs() {
    for (el of bombsIdx) {
        grid[el] = "B"
    }
}

function createGrid() {

    let arr = []

    for (let i = 0; i < (board[0] * board[1]); i++) {
        arr.push(0)
    }

    return arr
}

function populateGrid() {

    let arr = checkGrid(bombsIdx,true)

    for (el of arr) {
        if (grid[el] !== "B") {
            grid[el] = grid[el] + 1
        }
    }
}

function renderBoard() { //placeholder

    for (i = 0; i < grid.length; i++) {
        if (grid[i]) {
            document.getElementById(`idx${i}`).innerText = grid[i]
        }
        if (grid[i] === "B") {
            document.getElementById(`idx${i}`).style.backgroundColor = "black";
            document.getElementById(`idx${i}`).style.color = "white";
        }
    }
}

function checkGrid(arrOfIdx,boolean) {

    let arr = []

    for (el of arrOfIdx) {

        //row+1 col+0
        if (el + board[0] < board[0] * board[1]) { arr.push(el + board[0]) }
        //row-1 col+0
        if (el - board[0] >= 0) { arr.push(el - board[0]) }

        //row+0 col+1
        if (el + 1 <= board[0] * board[1] && ((el + 1) % (board[0])) !== 0) { arr.push(el + 1) }
        //row+0 col-1
        if (el - 1 >= 0 && ((el % board[0]) !== 0)) { arr.push(el - 1) }


        if (boolean){
        //row+1 col+1
        if (el + 1 + board[0] < board[0] * board[1] && ((el + 1) % board[0]) !== 0) { arr.push(el + board[0] + 1) }
        //row-1 col+1
        if (el + 1 - board[0] > 0 && ((el + 1) % board[0]) !== 0) { arr.push(el - board[0] + 1) }

        
        //row+1 col-1
        if (el - 1 + board[0] < board[0] * board[1] && (el % board[0]) !== 0) { arr.push(el + board[0] - 1) }
        //row-1 col-1
        if (el - 1 - board[0] >= 0 && (el % board[0]) !== 0) { arr.push(el - board[0] - 1) }
        }
    }

    return arr
}


// start!!

init()
