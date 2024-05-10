'use strict'

function getEntryIdx() {

    if (!+localStorage.getItem('entryIdx')) localStorage.setItem('entryIdx', 1)

    return +localStorage.getItem('entryIdx')
}

function getPlayerNameAndTime() {
    
    if(gGame.customMines) return

    var playerName = prompt('Enter your name:')
    var time = document.querySelector('.timer').innerHTML

    var leaderboardEntry = {
        name: playerName ? playerName : 'Unknown Player',
        time,
        level: gLevel.LEVEL,
        customMode: gGame.customMines
    }

    var serializedEntry = JSON.stringify(leaderboardEntry)
    var entryIdx = getEntryIdx() + 1

    localStorage.setItem(entryIdx, serializedEntry)
    localStorage.setItem('entryIdx', entryIdx)
}

function showLeaderboard() {
    const elLeaderboard = document.querySelector('.leaderboard')
    
    elLeaderboard.innerHTML = ''
    var leaderboard = []
    
    for (var i = 1; i <= localStorage.length; i++) {
        var entry = JSON.parse(localStorage.getItem(i))
        
        if(!entry) continue
        
        if(entry.level == gLevel.LEVEL && !entry.customMode) leaderboard.push(entry)
    }
    if(!leaderboard) return

    // console.log(leaderboard);
    bubbleSort(leaderboard, leaderboard.length)

    for (var i = 0; i < localStorage.length && i < 10; i++) {
        if(!leaderboard[i]) continue
        elLeaderboard.innerHTML += `<li>${leaderboard[i].name}: ${leaderboard[i].time}</li>`    
    }
    // if (leaderboard.length === 0) elLeaderboard.classList.add('hidden')
}