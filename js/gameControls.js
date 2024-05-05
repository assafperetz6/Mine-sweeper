'use strict'

var gLevel = {
	SIZE: 9,
	MINES: 10
	}

function resetGame() {
	const elModal = document.querySelector('.modal')
	const elBoard = document.querySelector('.board')

	gGame = {
		isOn: false,
        isFirstTurn: true,
		shownCount: 0,
		numsCount: 0,
		markedCount: 0,
		secsPassed: 0,
		mines: [],
		flaggedCells: []
		}

	elModal.innerHTML = ''

    elBoard.removeEventListener('contextmenu', flagCell)
	onInit()
}

function onSetGameLevel(level) {

    if (level === 'easy') {
        gLevel.SIZE = 9
        gLevel.MINES = 10
    }
    else if (level === 'medium') {
        gLevel.SIZE = 16
        gLevel.MINES = 40
    }
    else if (level === 'hard') {
        gLevel.SIZE = 22
        gLevel.MINES = 99
    }
    resetGame()
}