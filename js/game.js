'use strict'

var gBoard

var gLevel = {
	SIZE: 4,
	MINES: 2
	}

var	gGame = {
		isOn: false,
		shownCount: 0,
		numsCount: 0,
		markedCount: 0,
		secsPassed: 0,
		mines: [],
		flaggedCells: []
		}


		
function onInit() {

	gBoard = buildBoard()
	renderBoard(gBoard)
	
	rightClick()
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
					mineNegCount: 0
				}
		}
	}

	for (var i = 0; i < 2; i++) {
		const randCell = board[getRandomIntInclusive(0, 3)][getRandomIntInclusive(0, 3)]
		randCell.isMine = true
		gGame.mines.push(randCell.location)

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

function setMinesNegCount(board, rowIdx, colIdx) {
	
	var mineNegCount = 0

	for (var i = rowIdx - 1 ; i <= rowIdx + 1; i++) {

		if (i < 0 || i >= board.length) continue

		for (var j = colIdx - 1; j <= colIdx + 1; j++) {

			if (j < 0 || j >= board[0].length) continue
        	if (i === rowIdx && j === colIdx) continue	

			if (board[i][j].isMine) {
				mineNegCount++
			}
		}
		
	}

	board[rowIdx][colIdx].mineNegCount = mineNegCount
	return mineNegCount > 0 ? mineNegCount : ''
}

function checkWin() {
	const elModal = document.querySelector('.modal')

	if(gLevel.MINES !== gGame.markedCount) return

	for (var i = 0; i < gGame.flaggedCells.length; i++) {
		if(!gGame.flaggedCells[i].isMine) return
	}

	for (var i = 0; i < gBoard.length; i++) {
		for (var j = 0; j < gBoard[i].length; j++) {
			const currCell = gBoard[i][j]
			if (currCell.isMine) continue
			if (!currCell.isShown) return
		}
	}

	elModal.innerHTML = 'YOU WIN!'
}

function gameOver() {
	const elModal = document.querySelector('.modal')
	
	for (var i = 0; i < gGame.mines.length; i++) {
		const cellRowIdx = gGame.mines[i].i
		const cellColIdx = gGame.mines[i].j
		
		renderCell(cellRowIdx, cellColIdx, BOMB)
	}
	elModal.innerHTML = 'You Lost...'
	gGame.isOn = false
}