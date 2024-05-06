'use strict'

var gBoard

var gGame = {
	isOn: false,
	isFirstTurn: true,
	lives: 3,
	hintMode: false,
	remainingHints: 3,
	numsCount: 0,
	markedCount: 0,
	secsPassed: 0,
	mines: [],
	flaggedCells: [],
}

function onInit() {
	gBoard = buildBoard()
	renderBoard(gBoard)

	initializeClickListeners()
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

			strHTML += `<td class="${className}" data-i="${i}" data-j="${j}" onclick="onCellClicked(gBoard, ${i}, ${j})"></td>`
		}
		strHTML += '</tr>'
	}
	const elBoard = document.querySelector('.board')
	elBoard.innerHTML = strHTML
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
		setMines(negCells, rowIdx, colIdx)
	}

	board[rowIdx][colIdx].mineNegCount = mineNegCount

	if (mineNegCount === 0 && !gGame.hintMode) {
		negCells.forEach((cell) => {
			if (!cell.isMine) onCellClicked(board, cell.location.i, cell.location.j)
		})
		return ''
	}

	return mineNegCount
}

function blowUpMine(clickedMine) {
	const rowIdx = clickedMine.location.i
	const colIdx = clickedMine.location.j
	const elMine = document.querySelector(`.cell-${rowIdx}-${colIdx}`)

	clickedMine.isBlownUp = true

	elMine.classList.add('blown-up')

	gLevel.MINES--

	showRemainingMines()
	renderCell(rowIdx, colIdx, 0)
}

function checkWin() {
	const elModal = document.querySelector('.modal')
	const elResetBtn = document.querySelector('.reset-btn')

	if (gLevel.MINES !== gGame.markedCount) return

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

function gameOver() {
	const elModal = document.querySelector('.modal')
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
