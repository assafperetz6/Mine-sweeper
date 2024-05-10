'use strict'

const FLAG = '🚩'
const BOMB = '💣'

function initializeClickListeners(elBoard) {

	elBoard.clickEventHandler = (el) => {
		if(!el.target.classList.contains('cell')) return

		var rowIdx = +el.target.dataset.i
		var colIdx = +el.target.dataset.j

		if (gGame.megaHintMode) {
			onGetMegaHint(rowIdx, colIdx)
			return
		}
		
		if (gGame.isFirstTurn && !gGame.isCustomMode) startTimer()
		saveBoardState(el)
		onCellClicked(gBoard, rowIdx, colIdx)
	}

	elBoard.addEventListener('click', elBoard.clickEventHandler)
	
	elBoard.addEventListener('contextmenu', saveBoardState, false)
	elBoard.addEventListener('contextmenu', flagCell, false)

	document.addEventListener('mousemove', (ev) => {
		showMessage(ev)
	})
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
			renderCell(cell.location.i, cell.location.j, 'undo')
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

	clickedCell.isMine = true
	gGame.mines.push({ i: rowIdx, j: colIdx })

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

function showMegaHint(coord1, coord2) {
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

			if (i === smallRowIdx || i === bigRowIdx ||
				j === smallColIdx || j === bigColIdx) makeCellFlicker(i, j)
		}
		
	}
	gGame.megaHintCoords = []
	gGame.megaHintMode = false

	setTimeout(() => {
		revealedCells.forEach((cell) => {
			if (!cell.isShown && !cell.isFlagged) renderCell(cell.location.i, cell.location.j, 'undo')
		})
	}, 2000)
}
