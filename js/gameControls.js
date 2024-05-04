'use strict'

function resetGame() {
	const elModal = document.querySelector('.modal')
	const elBoard = document.querySelector('.board')

	gGame = {
		isOn: false,
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

