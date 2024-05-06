'use strict'

function getRandomIntInclusive(min, max) {
	return Math.floor(Math.random() * (max - min + 1)) + min
}

function getRandomInt(min, max) {
	const randNum = Math.floor(Math.random() * (max - min)) + min
	return randNum
}

function getRandomColor() {
	var letters = '0123456789ABCDEF'
	var color = '#'
	for (var i = 0; i < 6; i++) {
		color += letters[Math.floor(Math.random() * 16)]
	}
	return color
}

function makeId(length = 6) {
	var txt = ''
	var possible =
		'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'

	for (var i = 0; i < length; i++) {
		txt += possible.charAt(Math.floor(Math.random() * possible.length))
	}

	return txt
}

function shuffleArr(arr) {
	for (var i = arr.length - 1; i > 0; i--) {
		var j = Math.floor(Math.random() * (i + 1))
		var temp = arr[i]
		arr[i] = arr[j]
		arr[j] = temp
	}
}

function bubbleSort(arr, length) {
    
	var i, j, temp
	var swapped

	for (i = 0; i < length - 1; i++) {
		swapped = false

		for (j = 0; j < length - i - 1; j++) {
			if (arr[j].time > arr[j + 1].time) {
				temp = arr[j]
				arr[j] = arr[j + 1]
				arr[j + 1] = temp
				swapped = true
			}
		}
		if (swapped == false) break
	}
}

// function buildBoard() {
// 	const size = 4
// 	const board = []

// 	for (var i = 0; i < size; i++) {
//         board[i] = []
// 		for (var j = 0; j < size; j++) {
// 			board[i][j] = Element
// 		}
// 	}
// 	return board
// }

// function renderCell(location, value) {
// 	// Select the elCell and set the value
// 	const elCell = document.querySelector(`.cell-${location.i}-${location.j}`)
// 	elCell.innerHTML = value
// }

// function negCount(board, rowIdx, colIdx) {

//     for (var i = rowIdx - 1; i <= rowIdx + 1; i++) {

//         if (i < 0 || i >= board.length) continue

//         for (var j = colIdx - 1; j <= colIdx + 1; j++) {

//             if (j < 0 || j >= board[0].length) continue
//             if (i === rowIdx && j === colIdx) continue

//         }
//     }
// }
