'use strict'

var gLevel = {
	SIZE: 9,
	MINES: 10,
	LEVEL: 'easy'
}

var gTimer

function resetGame() {
	const elModal = document.querySelector('.modal')
	const elBoard = document.querySelector('.board')
	const elTimer = document.querySelector('.timer')
	const elResetBtn = document.querySelector('.reset-btn')
	const elHintBtn = document.querySelector('.hint-btn')

	gGame = {
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

	clearInterval(gTimer)

	elResetBtn.src = 'imgs/Smiley.jpg'
	elTimer.innerHTML = '00:00'
	elHintBtn.innerHTML = '3X💡'
	elModal.innerHTML = ''

	elBoard.removeEventListener('contextmenu', flagCell)
	onInit()
}

function onSetGameLevel(level) {
	if (level === 'easy') {
		gLevel.SIZE = 9
		gLevel.MINES = 10
		gLevel.LEVEL = 'easy'
	} else if (level === 'medium') {
		gLevel.SIZE = 16
		gLevel.MINES = 40
		gLevel.LEVEL = 'medium'
	} else if (level === 'hard') {
		gLevel.SIZE = 22
		gLevel.MINES = 99
		gLevel.LEVEL = 'hard'
	}
	resetGame()
}

function getHint() {
	const elHintBtn = document.querySelector('.hint-btn')

	if (!gGame.remainingHints) return

	gGame.hintMode = true
	gGame.remainingHints--

	elHintBtn.innerHTML = `${gGame.remainingHints}X💡`
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
	const elModal = document.querySelector('.modal')

	if (gGame.isFirstTurn) elModal.innerHTML = 'Remaining mines: ' + gLevel.MINES
	else
		elModal.innerHTML =
			'Remaining mines: ' + String(gLevel.MINES - gGame.flaggedCells.length)
}

function showRemainingLives() {
	const elLivesSpan = document.querySelector('.lives')

	var live = '❤️'

	elLivesSpan.innerHTML = live.repeat(gGame.lives)
}
