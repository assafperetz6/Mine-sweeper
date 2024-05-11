'use strict'

function onSetGameLevel(level) {
	switch (level) {
		case 'easy':
			gLevel.SIZE = 9
			gLevel.MINES = 10
			gLevel.LEVEL = 'easy'
			break

		case 'medium':
			gLevel.SIZE = 16
			gLevel.MINES = 40
			gLevel.LEVEL = 'medium'
			break

		case 'hard':
			gLevel.SIZE = 22
			gLevel.MINES = 99
			gLevel.LEVEL = 'hard'
			break
	}

	resetGame()
}

function onGetHint() {
	const elHintBtn = document.querySelector('.hint-btn .btn-text')

	if (!gGame.remainingHints) return
	if (gGame.hintMode) return

	gGame.hintMode = true
	gGame.remainingHints--

	elHintBtn.innerHTML = `💡X${gGame.remainingHints}`
}

function onGetMegaHint(rowIdx, colIdx) {
	if (gGame.megaHintMode === false && gGame.isFirstTurn) return

	if (gGame.megaHintMode === null) gGame.megaHintMode = true
	else if (gGame.megaHintCoords.length < 2) {
		gGame.megaHintCoords.push({ rowIdx, colIdx })
		makeCellFlicker(rowIdx, colIdx)

		if (gGame.megaHintCoords.length === 2)
			showMegaHint(gGame.megaHintCoords[0], gGame.megaHintCoords[1])
	}
	return
}

function onSafeClick() {
	if (!gGame.remainingSafeClicks) return

	const elSafeClickBtn = document.querySelector('.safe-click-btn .btn-text')

	gGame.remainingSafeClicks--

	elSafeClickBtn.innerHTML = `Safe Click <br> X${gGame.remainingSafeClicks}`

	var safeCell = getRandomSafeCell()
	const elSafeCell = document.querySelector(
		`.cell-${safeCell.location.i}-${safeCell.location.j}`
	)

	elSafeCell.classList.add('highlight')
	setTimeout(() => elSafeCell.classList.remove('highlight'), 2000)
}

function getRandomSafeCell() {
	var randCell

	while (!randCell || randCell.isMine || randCell.isShown) {
		randCell =
			gBoard[getRandomInt(0, gLevel.SIZE)][getRandomInt(0, gLevel.SIZE)]
	}

	return randCell
}

function onToggleCustomMode() {
	const elCustomBtn = document.querySelector('.custom-mode-btn')

	if (!gGame.isFirstTurn) resetGame()

	gGame.isCustomMode = !gGame.isCustomMode
	gGame.customMines = true
	elCustomBtn.classList.toggle('flicker')

	showRemainingMines()

	return
}

function undoMove() {
	if (!gGame.isOn) return
	if (!gGame.previousMoves.length) return

	var currBoard = gBoard
	gBoard = gGame.previousMoves.at(-1)

	if (gGame.previousMoves.length === 1) {
		resetGame()
		return
	}

	gGame.previousMoves.pop()

	for (var i = 0; i < gBoard.length; i++) {
		for (var j = 0; j < gBoard[i].length; j++) {
			var currCellState = currBoard[i][j]
			var previousCellState = gBoard[i][j]

			if (JSON.stringify(currCellState) !== JSON.stringify(previousCellState)) {
				renderCell(i, j, 'undo')

				if (currCellState.isBlownUp) {
					gGame.lives++
					gGame.blownUpMines--
					showRemainingLives()
					showRemainingMines()
				}
			}
		}
	}
}

function exterminate() {
	if (gGame.isFirstTurn) {
		elInfoView.innerHTML = 'Maybe start playing first?'
		return
	}

	shuffleArr(gGame.mines)

	for (var i = 0; i < 3 && i <= gGame.mines.length; i++) {
		var bombCoords = gGame.mines.at(-1)
		var currBomb = gBoard[bombCoords.i][bombCoords.j]

		var elCell = document.querySelector(`.cell-${bombCoords.i}-${bombCoords.j}`)

		if (currBomb.isBlownUp) {
			i--
			continue
		} else {
			gGame.mines.pop()
			currBomb.isMine = false
			currBomb.isShown = true
			negCountAfterExter(gBoard, bombCoords.i, bombCoords.j)

			elCell.classList.add('diffused')
		}
	}
	showRemainingMines()
}