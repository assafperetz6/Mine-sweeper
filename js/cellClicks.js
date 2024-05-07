'use strict'

const FLAG = '🚩'
const BOMB = '💣'

function initializeClickListeners(elBoard) {

	elBoard.clickEventHandler = (el) => {
		var rowIdx = +el.target.dataset.i
		var colIdx = +el.target.dataset.j

		saveBoardState(el)
		onCellClicked(gBoard, rowIdx, colIdx)
	}

	elBoard.addEventListener('click', elBoard.clickEventHandler)

	elBoard.addEventListener('contextmenu', saveBoardState, false)
	elBoard.addEventListener('contextmenu', flagCell, false)




}

function onCellClicked(board, rowIdx, colIdx) {
	// debugger
	if (!gGame.isOn) return

	const clickedCell = board[rowIdx][colIdx]

	if(gGame.isCustomMode) {
		handleCustomModeClick(board, rowIdx, colIdx)
		showRemainingMines()
		return
	}

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

	elBoard.previousBoard = gBoard
	checkWin()
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
			renderCell(cell.location.i, cell.location.j, -1)
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

function handleCustomModeClick(board, rowIdx, colIdx) {

	const clickedCell = board[rowIdx][colIdx]
	const elCell = document.querySelector(`.cell-${rowIdx}-${colIdx}`)

	clickedCell.isMine = true
	gGame.mines.push(clickedCell)

	elCell.classList.add('flicker')
	setTimeout(() => elCell.classList.remove('flicker'), 2000)

	gGame.previousMoves.push(gBoard.slice())
}

function renderCell(rowIdx, colIdx, value) {
	const elCell = document.querySelector(`.cell-${rowIdx}-${colIdx}`)

	if (value === 0) {
		value = ''
		elCell.classList.add('empty-cell')
	}
	else if (value === 'undo') {
		value = ''
		elCell.classList.remove('empty-cell')
		elCell.classList.remove('blown-up')
	}

	elCell.innerText = value
}
