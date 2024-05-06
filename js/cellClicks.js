'use strict'

const FLAG = '🚩'
const BOMB = '💣'

function onCellClicked(board, rowIdx, colIdx) {
	// debugger
	if (!gGame.isOn) return

	const clickedCell = board[rowIdx][colIdx]

	if (gGame.isFirstTurn) startTimer()
	if (clickedCell.isShown) return
	if (clickedCell.isBlownUp) return
	if (clickedCell.isFlagged) return

	if (gGame.hintMode) {
		showHint(board, rowIdx, colIdx)
		gGame.hintMode = false
		return
	}

	if (clickedCell.isMine) {
		if (gGame.lives > 1) {
			gGame.lives--
			showRemainingLives()
			blowUpMine(clickedCell)
			checkWin()
			return
		} else {
			gameOver()
			return
		}
	}

	clickedCell.isShown = true

	setMinesNegCount(board, rowIdx, colIdx)

	renderCell(rowIdx, colIdx, clickedCell.mineNegCount)

	checkWin()
}

function initializeClickListeners() {
	const elBoard = document.querySelector('.board')
	elBoard.addEventListener('contextmenu', flagCell, false)
}

function showHint(board, rowIdx, colIdx) {
	var revealedCells = []

	for (var i = rowIdx - 1; i <= rowIdx + 1; i++) {
		if (i < 0 || i >= board.length) continue

		for (var j = colIdx - 1; j <= colIdx + 1; j++) {
            var currCell = board[i][j]
            
            if (j < 0 || j >= board[0].length) continue
			if (currCell.isShown) continue
			
            var currCellNegCount = setMinesNegCount(board, i, j)

			revealedCells.push(currCell)

			if (currCell.isMine) renderCell(i, j, BOMB)
			else renderCell(i, j, currCellNegCount)
		}
	}

	setTimeout(() => {
		revealedCells.forEach((cell) => {
			renderCell(cell.location.i, cell.location.j, '')
		})
	}, 1000)
}

function flagCell(ev) {
	ev.preventDefault()

	if (!gGame.isOn) return

	const elClickedCell = ev.target
	const cellRowIdx = elClickedCell.dataset.i
	const cellColIdx = elClickedCell.dataset.j

	var clickedCell = gBoard[cellRowIdx][cellColIdx]
	var value = FLAG

	if (clickedCell.isShown) return
	if (clickedCell.isBlownUp) return

	if (!clickedCell.isFlagged) {
		clickedCell.isFlagged = true
		gGame.flaggedCells.push(clickedCell)
		gGame.markedCount++
	} else {
		clickedCell.isFlagged = false
		gGame.flaggedCells.pop()
		gGame.markedCount--
		value = ''
	}
	renderCell(cellRowIdx, cellColIdx, value)

	showRemainingMines()
	checkWin()

	return false
}

function renderCell(rowIdx, colIdx, value) {
	const elCell = document.querySelector(`.cell-${rowIdx}-${colIdx}`)

	if (value === '') {
		elCell.classList.remove('empty-cell')
	} else if (value === 0) {
		value = ''
		elCell.classList.add('empty-cell')
	}

	elCell.innerText = value
}
