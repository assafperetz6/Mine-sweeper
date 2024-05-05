'use strict'

const FLAG = '🚩'
const BOMB = '💣'


function onCellClicked(board, rowIdx, colIdx) {

    // debugger
    if(!gGame.isOn) return

    const clickedCell = board[rowIdx][colIdx]

    if(clickedCell.isShown) return
    if(clickedCell.isFlagged) return

	if(clickedCell.isMine) {
		gameOver()
		return
	}

    clickedCell.isShown = true
    
    gGame.shownCount++
    
	setMinesNegCount(board, rowIdx, colIdx)

	renderCell(rowIdx, colIdx, clickedCell.mineNegCount)


    checkWin()
}

function initializeClickListeners() {

    const elBoard = document.querySelector('.board')
    elBoard.addEventListener('contextmenu', flagCell, false)
}

function flagCell(ev) {

    ev.preventDefault()

    if(!gGame.isOn) return

	const elClickedCell = ev.target
	const cellRowIdx = elClickedCell.dataset.i
	const cellColIdx = elClickedCell.dataset.j

    var clickedCell = gBoard[cellRowIdx][cellColIdx]
    var value = FLAG

    if(clickedCell.isShown) return

    if(!clickedCell.isFlagged) {
        clickedCell.isFlagged = true
        gGame.flaggedCells.push(clickedCell)
        gGame.markedCount++
    }
    else {
        clickedCell.isFlagged = false
        gGame.flaggedCells.pop()
        gGame.markedCount--
        value = ''
    }
	renderCell(cellRowIdx, cellColIdx, value)
    
    checkWin()

    return false
}

function renderCell(rowIdx, colIdx, value) {
	const elCell = document.querySelector(`.cell-${rowIdx}-${colIdx}`)
	
    if(value === 0) {
        value = ''
        elCell.classList.add('empty-cell')
    }

	elCell.innerText = value
}