'use strict'

var gEntryIdx = 1

function getPlayerNameAndTime() {
    var playerName = prompt('Enter your name:')
    var time = document.querySelector('.timer').innerHTML

    var leaderboardEntry = {
        name: playerName,
        time,
        level: gLevel.LEVEL
    }

    var serializedEntry = JSON.stringify(leaderboardEntry)

    localStorage.setItem(gEntryIdx++, serializedEntry)
}

function showLeaderboard() {
    const elLeaderboard = document.querySelector('.leaderboard')
    
    elLeaderboard.innerHTML = ''
    var leaderboard = []
    
    for (var i = 1; i <= localStorage.length; i++) {
        var entry = JSON.parse(localStorage.getItem(i))
        
        if(!entry) continue
        
        if(entry.level == gLevel.LEVEL) leaderboard.push(entry)
    }
    if(!leaderboard) return

    // console.log(leaderboard);
    bubbleSort(leaderboard, leaderboard.length)

    for (var i = 0; i < localStorage.length && i < 10; i++) {
        if(!leaderboard[i]) continue
        elLeaderboard.innerHTML += `<li>${leaderboard[i].name}: ${leaderboard[i].time}</li>`    
    }
}