'use strict'

function getLeaderboardFromStorage() {
    var leaderboard = []
    
	if (!currLeaderboard) localStorage.setItem('leaderboard', leaderboard)
    var currLeaderboard = localStorage.getItem('leaderboard')
    

	return leaderboard
}

function getPlayerNameAndTime() {
	if (gGame.customMines) return

    if (!localStorage.getItem('leaderboard')) localStorage.setItem('leaderboard', '[]')
    var currLeaderboard = JSON.parse(localStorage.getItem('leaderboard'))



	var playerName = prompt('Enter your name:')
	var time = document.querySelector('.timer').innerHTML

	var leaderboardEntry = {
		name: playerName ? playerName : 'Unknown Player',
		time,
		level: gLevel.LEVEL,
		customMode: gGame.customMines,
	}

    currLeaderboard.push(leaderboardEntry)
	
	localStorage.setItem('leaderboard', JSON.stringify(currLeaderboard))
}

function showLeaderboard() {
    const elLeaderboard = document.querySelector('.leaderboard')

    if(!localStorage.getItem('leaderboard')) return

	elLeaderboard.innerHTML = ''
	var leaderboard = JSON.parse(localStorage.getItem('leaderboard'))
    var currLevelLeaderboard = []

	for (var i = 0; i < leaderboard.length; i++) {
		var entry = leaderboard[i]

		if (!entry) continue

		if (entry.level == gLevel.LEVEL && !entry.customMode)
			currLevelLeaderboard.push(entry)
	}

	currLevelLeaderboard.sort((a, b) => {
	    const [min1, sec1] = a.time.split(':').map(Number)
	    const [min2, sec2] = b.time.split(':').map(Number)
	    if (min1 !== min2) return min1 - min2
	    return sec1 - sec2
	})

	for (var i = 0; i < currLevelLeaderboard.length && i < 10; i++) {
		if (!leaderboard[i]) continue
		elLeaderboard.innerHTML += `<li class="leaderboard-item" data-info="Everyone here <br> is better than you">${currLevelLeaderboard[i].name}: ${currLevelLeaderboard[i].time}</li>`
	}
}
