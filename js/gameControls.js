'use strict'

function resetGame() {

	const elTimer = document.querySelector('.timer')
	const elResetBtn = document.querySelector('.reset-btn')
	const elHintBtn = document.querySelector('.hint-btn')
	const elSafeClickBtn = document.querySelector('.safe-click-btn')

	clearInterval(gTimer)

	elResetBtn.src = 'imgs/Smiley.jpg'
	elTimer.innerHTML = '00:00'
	elHintBtn.innerHTML = '💡X3'
	
	elModal.innerHTML = ''
	elSafeClickBtn.innerHTML = `Safe Click <br> X3`
	
	elBoard.removeEventListener('contextmenu', flagCell)
	elBoard.removeEventListener('click', elBoard.clickEventHandler)
	elBoard.removeEventListener('click', saveBoardState)

	onInit()
}

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
	const elHintBtn = document.querySelector('.hint-btn')

	if (!gGame.remainingHints) return
	if (gGame.hintMode) return

	gGame.hintMode = true
	gGame.remainingHints--

	elHintBtn.innerHTML = `💡X${gGame.remainingHints}`
}

function onSafeClick() {
	if(!gGame.remainingSafeClicks) return

	const elSafeClickBtn = document.querySelector('.safe-click-btn')

	gGame.remainingSafeClicks--

	elSafeClickBtn.innerHTML = `Safe Click <br> X${gGame.remainingSafeClicks}`
	
	var safeCell = getRandomSafeCell()
	const elSafeCell = document.querySelector(`.cell-${safeCell.location.i}-${safeCell.location.j}`)
	
	elSafeCell.classList.add('highlight')
	setTimeout(() => elSafeCell.classList.remove('highlight'), 2000)
}

function getRandomSafeCell() {

	var randCell

	while (!randCell || randCell.isMine || randCell.isShown) {
		randCell = gBoard[getRandomInt(0, gLevel.SIZE)][getRandomInt(0, gLevel.SIZE)]
	}

	return randCell
}

function startTimer() {
	const elTimer = document.querySelector('.timer')
	const start = Date.now()

	gTimer = setInterval(() => {
		var now = Date.now() - start

		var seconds = parseInt(now / 1000)
		var formattedSeconds = String(seconds).padStart(2, '0')
		var millis = String(now).substring(2, 4).padStart(2, 0)

		elTimer.innerHTML = formattedSeconds + ':' + millis
	}, 29)
}

function showRemainingMines() {

	if (gGame.isFirstTurn && !gGame.customMines) elModal.innerHTML = 'Remaining mines: ' + gLevel.MINES
	
	else if (gGame.customMines) {
		elModal.innerHTML = 'Remaining mines: ' + String(gGame.mines.length - gGame.flaggedCells.length - gGame.blownUpMines)
		console.log('hi');
	}
	
	else
		elModal.innerHTML = 'Remaining mines: ' + String(gLevel.MINES - gGame.flaggedCells.length - gGame.blownUpMines)
}

function showRemainingLives() {
	const elLivesSpan = document.querySelector('.lives')

	var live = '❤️'

	elLivesSpan.innerHTML = live.repeat(gGame.lives)
}

function onToggleCustomMode() {
	const elCustomBtn = document.querySelector('.custom-mode-btn')

	if(!gGame.isFirstTurn) resetGame()
	
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

function saveBoardState(el) {

	var rowIdx = el.target.dataset.i
	var colIdx = el.target.dataset.j

	var clickedCell = gBoard[rowIdx][colIdx]

	if(clickedCell.isShown || clickedCell.isFlagged) return

	gGame.previousMoves.push(gBoard.map(row => {	
		return row.map(cell => {
			return JSON.parse(JSON.stringify(cell))
		})
	}))
}