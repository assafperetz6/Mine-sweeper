'use strict'
//  Everything DOM related

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
	if (gGame.isFirstTurn && !gGame.customMines)
		elModal.innerHTML = 'Remaining mines: ' + gLevel.MINES
	else if (gGame.customMines) {
		elModal.innerHTML =
			'Remaining mines: ' +
			String(
				gGame.mines.length - gGame.flaggedCells.length - gGame.blownUpMines
			)
	} else
		elModal.innerHTML =
			'Remaining mines: ' +
			String(
				gGame.mines.length - gGame.flaggedCells.length - gGame.blownUpMines
			)
}

function showRemainingLives() {
	const elLivesSpan = document.querySelector('.lives')

	var live = '❤️'

	elLivesSpan.innerHTML = live.repeat(gGame.lives)
}

function toggleDarkMode() {
	var elBody = document.querySelector('body')

	elBody.classList.toggle('dark-mode')
}

function makeCellFlicker(rowIdx, colIdx) {
	if (!rowIdx || !colIdx) return

	var elCell = document.querySelector(`.cell-${rowIdx}-${colIdx}`)

	elCell.classList.add('flicker')

	setTimeout(() => elCell.classList.remove('flicker'), 3000)
}

function showMessage(ev) {
	const elCustomBtn = document.querySelector('.custom-mode-btn')
	const elMegaHintBtn = document.querySelector('.mega-hint-btn')
	const elHintBtn = document.querySelector('.hint-btn')
	
	if (elCustomBtn.classList.contains('flicker')) elInfoView.innerHTML = 'Click cells to place mines, than click on custom button to play.'
	else if (elMegaHintBtn.classList.contains('flicker')) elInfoView.innerHTML = 'Click on two cells and see everything between them.'
	else if (elHintBtn.classList.contains('flicker')) elInfoView.innerHTML = 'Pick a cell and see its perimeter.'

	else if (ev.target.classList.contains('cell')) {
		elInfoView.innerHTML = `cell: ${ev.target.dataset.i}-${ev.target.dataset.j}`

	} else if (ev.target.dataset.info) {
		elInfoView.innerHTML = ev.target.dataset.info
	} else elInfoView.innerHTML = ''
}