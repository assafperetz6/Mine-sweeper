'use strict'

const FLAG = '🚩'
const BOMB = '💣'

function clickEventHandler(el) {
	if (!el.target.classList.contains('cell')) return

	var rowIdx = +el.target.dataset.i
	var colIdx = +el.target.dataset.j
	if (gGame.megaHintMode) {
		megaHintClick(rowIdx, colIdx)
		return
	}

	if (gGame.isFirstTurn && !gGame.isCustomMode) startTimer()
	saveBoardState(el)
	cellClicked(gBoard, rowIdx, colIdx)
}

function cellClicked(board, rowIdx, colIdx) {
	// debugger
	if (!gGame.isOn) return

	const clickedCell = board[rowIdx][colIdx]

	if (gGame.isCustomMode) {
		handleCustomModeClick(board, rowIdx, colIdx)
		showRemainingMines()
		return
	}

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
	const elHintBtn = document.querySelector('.hint-btn')
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
	elHintBtn.classList.remove('flicker')

	setTimeout(() => {
		revealedCells.forEach((cell) => {
			renderCell(cell.location.i, cell.location.j, 'undo')
		})
	}, 1000)
}

function flagCell(ev) {
	ev.preventDefault()

	if (!gGame.isOn) return
	if (!ev.target.classList.contains('cell')) return

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
		gGame.flaggedCount++
	} else {
		clickedCell.isFlagged = false
		gGame.flaggedCells.pop()
		gGame.flaggedCount--
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

	if (clickedCell.isMine) return
	
	clickedCell.isMine = true
	gGame.mines.push({ i: rowIdx, j: colIdx })

	elCell.classList.add('flicker')
	setTimeout(() => elCell.classList.remove('flicker'), 2000)

	gGame.previousMoves.push(gBoard.slice())
}

function megaHintClick(rowIdx, colIdx) {
	if (gGame.megaHintCoords.length < 2) {
		gGame.megaHintCoords.push({ rowIdx, colIdx })
		makeCellFlicker(rowIdx, colIdx)

		if (gGame.megaHintCoords.length === 2) {
			showMegaHint(gGame.megaHintCoords[0], gGame.megaHintCoords[1])
			gGame.megaHintMode = false
		}
	}
	return
}

function showMegaHint(coord1, coord2) {
	const elMegaHintBtn = document.querySelector('.mega-hint-btn')

	var revealedCells = []

	var bigRowIdx = Math.max(coord1.rowIdx, coord2.rowIdx)
	var bigColIdx = Math.max(coord1.colIdx, coord2.colIdx)

	var smallRowIdx = Math.min(coord1.rowIdx, coord2.rowIdx)
	var smallColIdx = Math.min(coord1.colIdx, coord2.colIdx)

	for (var i = smallRowIdx; i <= bigRowIdx; i++) {
		for (var j = smallColIdx; j <= bigColIdx; j++) {
			var currCell = gBoard[i][j]
			var currCellNegCount = setMinesNegCount(gBoard, i, j)

			revealedCells.push(currCell)

			if (currCell.isMine) renderCell(i, j, BOMB)
			else renderCell(i, j, currCellNegCount)

			if (
				i === smallRowIdx ||
				i === bigRowIdx ||
				j === smallColIdx ||
				j === bigColIdx
			)
				makeCellFlicker(i, j)
		}
	}
	gGame.megaHintCoords = []

	setTimeout(() => {
		revealedCells.forEach((cell) => {
			if (!cell.isShown && !cell.isFlagged)
				elMegaHintBtn.classList.remove('flicker')
				renderCell(cell.location.i, cell.location.j, 'undo')
		})
	}, 3000)
}
