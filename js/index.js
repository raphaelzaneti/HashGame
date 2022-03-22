
let player1Active = true
let computerPlaying = false
let playersName = [null, null]


function newGame() {
    $('.game-board__line').children().text(" ")
    $('.game-board__line').children().css("color", "")
    $('#winner-area').text(" ")

    if(!validatePlayersName($('#input-p1').val(), $('#input-p2').val())){
        alert('Os nomes dos jogadores não podem estar vazios')
        return
    }

    $('.game-board__table').removeClass('d-none')

    player1Active = true
    toggleTurn()
}

function newGameComputer() {
    computerPlaying = true
    newGame()
}

function validatePlayersName(p1, p2){
    
    
    if(p1 === " "|| p2 === " " || p1 === "" || p2 === ""){
        return false
    } else{
        playersName[0] = p1
        playersName[1] = p2
    
        $('input').addClass('d-none')
    
        $('#p1-name').text(playersName[0])
        $('#p2-name').text(playersName[1])
        
        return true
    }
}

$('.game-board__line').children().click(function () {

    if (emptyField($(this).text())) {
        alert('Vocẽ não pode jogar em um campo já ocupado!')
        return
    }

    if (player1Active) {
        $(this).text('O')
        $(this).css('color', '#E63946')
    } else {
        $(this).text('X')
        $(this).css('color', '#457B9D')
    }


    let fields = validateFields()


    if(checkWinner()){
        return
    }

    checkDraw(fields)


    if (computerPlaying) {
        computerPlay(fields)
    } else {
        player1Active = !player1Active
        toggleTurn()
    }

})

function emptyField(field) {
    if (field === "O" || field === "X") return true
}

function toggleTurn() {
    if (player1Active) {
        $('#turn-p2').text('')
        $('#turn-p1').text(`It's your turn!`)
    } else {
        $('#turn-p1').text('')
        $('#turn-p2').text(`It's your turn!`)
    }
}

function validateFields() {
    let players = ["O", "X"]
    const gameArray = []
    gameArray.push($('#board-line-1').children().text().split(''))
    gameArray.push($('#board-line-2').children().text().split(''))
    gameArray.push($('#board-line-3').children().text().split(''))

    //validate if there is a winner
    horizontalLine(gameArray, players)
    verticalLine(gameArray)
    diagonalLine(gameArray)

    return gameArray

}

function horizontalLine(arr, players) {

    for (let i = 0; i < 2; i++) {
        let result = arr.map(e => e.every(e => e === players[i])).some(e => e === true)
        if (result) {
            setWinner(players[i])
            return true
        }
    }

    return false
}

function verticalLine(arr) {
    for (let i = 0; i < 3; i++) {
        let line = []
        arr.map(e => line.push(e[i]))

        if (line.every(e => e === 'O')) {
            setWinner('O')
            return true
        } else if (line.every(e => e === 'X')) {
            setWinner('X')
            return true
        }
    }

    return false
}

function diagonalLine(arr) {
    let slash = arr[0][0] === arr[1][1] && arr[0][0] === arr[2][2] && (arr[0][0] === "X" || arr[0][0] === "O")
    let backSlash = arr[0][2] === arr[1][1] && arr[0][2] === arr[2][0] && (arr[0][2] === "X" || arr[0][2] === "O")

    if (slash || backSlash) {
        setWinner(arr[1][1])
        return true
    }
}

function checkDraw(fields){
    const flatFields = fields.flat()
    if(flatFields.every(e => e!==" ")){
        $('#winner-area').text("Empate!")
        clearNames()
    }
}

function setWinner(win) {
    let winner = win === "O" ? playersName[0] : playersName[1]
    $('#winner-area').text("Vencedor: " + winner)
    clearNames()
}

function checkWinner(){
    if(!$('#winner-area').text()===" "){
        return true
    }

    return false
}

function clearNames() {
    $('.player-turn').text(' ')
    $('input').removeClass('d-none')
    $('.player-name').text('')
}

function computerPlay(arr) {
    const occupiedFields = arr.flat()
    let play = 9 - (Math.floor(Math.random() * 10))

    if (!occupiedFields.some(e => e === " ")) {
        return
    }

    let uniqueBlankField = preventPlayerVictory(arr)
    
    if (uniqueBlankField !== false) {
        $('.game-board__line').children()[uniqueBlankField].textContent = 'X'
        return
    }

    while (occupiedFields[play] !== " ") {
        play = 9 - (Math.floor(Math.random() * 10))
    }

    $('.game-board__line').children()[play].textContent = 'X'
    validateFields()

    return
}

function preventPlayerVictory(arr) {
    const occupiedFields = arr.flat()

    //horizontal
    for (let i = 0; i < 3; i++) {
        let counter = 0

        for (let index = (i * 3); index < (i * 3) + 3; index++) {
            if (occupiedFields[index] === "O") counter++

        }

        if (counter === 2 && arr[i].indexOf(" ") > -1) {
            return arr[i].indexOf(" ") + (i * 3)
        }
    }

    //vertical
    for (let i = 0; i < 3; i++) {
        let counter = 0

        for (let index = i; index < (i + 7); index = index + 3) {
            if (occupiedFields[index] === "O") counter++
            if (occupiedFields[index] === "X") counter--
        }

        if (counter === 2) {
            let field
            
            arr.map((e, ind) => {
                if (e[i] === " ") {
                    field = i+(ind*3)
                }
            })

            return field
        }
    }

    //slash
    if(occupiedFields[4]==="O"){
        if(occupiedFields[0]==="O" && occupiedFields[8]===" "){
            return 8
        }
        if(occupiedFields[2]==="O" && occupiedFields[6]===" "){
            return 6
        }
        if(occupiedFields[6]==="O" && occupiedFields[2]===" "){
            return 2
        }
        if(occupiedFields[8]==="O" && occupiedFields[0]===" "){
            return 0
        }
    }


    return false

}