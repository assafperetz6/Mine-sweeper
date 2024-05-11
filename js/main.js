'use strict'

const elModal = document.querySelector('.modal')
const elBoard = document.querySelector('.board')
const elInfoView = document.querySelector('.info-view-content')

var gBoard

var gLevel = {
	SIZE: 9,
	MINES: 10,
	LEVEL: 'easy',
}

var gGame
var gTimer

function onInit() {
	gBoard = buildBoard()
	const elBoard = renderBoard(gBoard)

	gGame = {
		isOn: false,
		isFirstTurn: true,
		lives: 3,

		isCustomModeOn: false,
		customMines: false,

		hintMode: false,
		remainingHints: 3,
		remainingSafeClicks: 3,

		megaHintMode: null,
		megaHintCoords: [],

		flaggedCount: 0,
		blownUpMines: 0,

		mines: [],
		flaggedCells: [],
		previousMoves: [],
	}

	initializeClickListeners(elBoard)
	showRemainingMines()
	showRemainingLives()
	showLeaderboard()

	gGame.isOn = true
}

function buildBoard() {
	const size = gLevel.SIZE
	const board = []

	for (var i = 0; i < size; i++) {
		board[i] = []

		for (var j = 0; j < size; j++) {
			board[i][j] = {
				location: { i, j },
				isMine: false,
				isShown: false,
				isFlagged: false,
				mineNegCount: 0,
			}
		}
	}
	return board
}

// FIXED MINE LOCATIONS
// function buildBoard() {
// 	const size = gLevel.SIZE
// 	const board = []

// 	for (var i = 0; i < size; i++) {
//         board[i] = []

// 		for (var j = 0; j < size; j++) {
// 			if(i === 0 & j === 0 || i === 0 && j === 2) {
// 				board[i][j] = {
// 					location: { i, j },
// 					isMine: true
// 				}
// 				gGame.mines.push(board[i][j].location)
// 			}
// 			else {
// 				board[i][j] = {
// 					location: { i, j },
// 					isMine: false,
// 					isShown: false,
// 					isFlagged: false,
// 					mineNegCount: 0
// 				}
// 			}
// 		}
// 	}
// 	return board
// }

function renderBoard(board) {
	var strHTML = ''
	for (var i = 0; i < board.length; i++) {
		strHTML += '<tr>'
		for (var j = 0; j < board[0].length; j++) {
			const className = `cell cell-${i}-${j}`

			// onclick="onCellClicked(gBoard, ${i}, ${j})"
			strHTML += `<td class="${className}" data-i="${i}" data-j="${j}"></td>`
		}
		strHTML += '</tr>'
	}

	elBoard.innerHTML = strHTML
	return elBoard
}

function renderCell(rowIdx, colIdx, value) {
	const elCell = document.querySelector(`.cell-${rowIdx}-${colIdx}`)

	if (value === 0) {
		value = ''
		elCell.classList.add('empty-cell')
	} else if (value === 'undo') {
		value = ''
		elCell.classList.remove('empty-cell')
		elCell.classList.remove('blown-up')
	}

	elCell.innerText = value
}

function initializeClickListeners(elBoard) {
	function clickEventHandler(el) {
		if (!el.target.classList.contains('cell')) return

		var rowIdx = +el.target.dataset.i
		var colIdx = +el.target.dataset.j

		if (gGame.megaHintMode) {
			onGetMegaHint(rowIdx, colIdx)
			return
		}

		if (gGame.isFirstTurn && !gGame.isCustomMode) startTimer()
		saveBoardState(el)
		cellClicked(gBoard, rowIdx, colIdx)
	}

	elBoard.addEventListener('click', clickEventHandler)

	elBoard.addEventListener('contextmenu', saveBoardState, false)
	elBoard.addEventListener('contextmenu', flagCell, false)

	document.addEventListener('mousemove', (ev) => {
		showMessage(ev)
	})
}

function setMines(negCells, rowIdx, colIdx) {
	for (var i = 0; i < gLevel.MINES; i++) {
		var randCell =
			gBoard[getRandomInt(0, gLevel.SIZE)][getRandomInt(0, gLevel.SIZE)]

		if (
			gGame.mines.includes(randCell.location) ||
			negCells.includes(randCell) ||
			randCell === gBoard[rowIdx][colIdx]
		) {
			i--
			continue
		}

		randCell.isMine = true
		gGame.mines.push(randCell.location)
	}
	showRemainingMines()
}

function setMinesNegCount(board, rowIdx, colIdx) {
	var mineNegCount = 0
	var negCells = []

	for (var i = rowIdx - 1; i <= rowIdx + 1; i++) {
		if (i < 0 || i >= board.length) continue

		for (var j = colIdx - 1; j <= colIdx + 1; j++) {
			if (j < 0 || j >= board[0].length) continue
			if (i === rowIdx && j === colIdx) continue

			if (board[i][j].isMine) mineNegCount++
			else negCells.push(board[i][j])
		}
	}

	if (gGame.isFirstTurn) {
		gGame.isFirstTurn = false
		if (!gGame.customMines) setMines(negCells, rowIdx, colIdx)
	}

	board[rowIdx][colIdx].mineNegCount = mineNegCount

	if (mineNegCount === 0 && !gGame.hintMode && !gGame.megaHintMode) {
		negCells.forEach((cell) => {
			if (!cell.isMine) cellClicked(board, cell.location.i, cell.location.j)
		})
		return ''
	}

	return mineNegCount
}

function negCountAfterExter(board, rowIdx, colIdx) {
	for (var i = rowIdx - 1; i <= rowIdx + 1; i++) {
		if (i < 0 || i >= board.length) continue

		for (var j = colIdx - 1; j <= colIdx + 1; j++) {
			if (j < 0 || j >= board[0].length) continue
			if (i === rowIdx && j === colIdx) continue
			if (!board[i][j].isShown) continue

			board[i][j].mineNegCount--
			if (board[i][j].mineNegCount < 0) board[i][j].mineNegCount = 0
				
			renderCell(i, j, board[i][j].mineNegCount)
		}
	}
}

function blowUpMine(clickedMine) {
	const rowIdx = clickedMine.location.i
	const colIdx = clickedMine.location.j
	const elMine = document.querySelector(`.cell-${rowIdx}-${colIdx}`)

	clickedMine.isBlownUp = true

	elMine.classList.add('blown-up')

	gGame.blownUpMines++

	showRemainingMines()
	renderCell(rowIdx, colIdx, 0)
}

function checkWin() {
	const elResetBtn = document.querySelector('.reset-btn')

	if (gGame.mines.length !== gGame.flaggedCount + gGame.blownUpMines) return

	for (var i = 0; i < gGame.flaggedCells.length; i++) {
		if (!gGame.flaggedCells[i].isMine) return
	}
	
	for (var i = 0; i < gBoard.length; i++) {
		for (var j = 0; j < gBoard[i].length; j++) {
			const currCell = gBoard[i][j]
			if (currCell.isMine) continue
			if (!currCell.isShown) return
		}
	}
	clearInterval(gTimer)

	getPlayerNameAndTime()
	elResetBtn.src = 'imgs/winning.png'
	elModal.innerHTML = 'YOU WIN!'
}

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

function gameOver() {
	const elLivesSpan = document.querySelector('.lives')
	const elResetBtn = document.querySelector('.reset-btn')

	clearInterval(gTimer)

	for (var i = 0; i < gGame.mines.length; i++) {
		const cellRowIdx = gGame.mines[i].i
		const cellColIdx = gGame.mines[i].j

		renderCell(cellRowIdx, cellColIdx, BOMB)
	}

	elLivesSpan.innerHTML = '💔'

	elResetBtn.src = 'imgs/lose.png'
	elModal.innerHTML = 'You Lost...'
	gGame.isOn = false
}

function saveBoardState(el) {
	if (!el.target.classList.contains('cell')) return

	var rowIdx = el.target.dataset.i
	var colIdx = el.target.dataset.j

	var clickedCell = gBoard[rowIdx][colIdx]

	if (clickedCell.isShown || clickedCell.isFlagged) return

	gGame.previousMoves.push(
		gBoard.map((row) => {
			return row.map((cell) => {
				return JSON.parse(JSON.stringify(cell))
			})
		})
	)
}
