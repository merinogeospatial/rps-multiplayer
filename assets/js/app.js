 // Initialize Firebase
 var config = {
    apiKey: "AIzaSyCAqAmtjTr0x840PeduPautNsis4VmaOgc",
    authDomain: "rps-multiplayer-33042.firebaseapp.com",
    databaseURL: "https://rps-multiplayer-33042.firebaseio.com",
    projectId: "rps-multiplayer-33042",
    storageBucket: "rps-multiplayer-33042.appspot.com",
    messagingSenderId: "755529491967"
  };
  firebase.initializeApp(config);

const database = firebase.database();
const players = database.ref();
let thisPlayer = 'anonymous';
let currentPlayer = 'anonymous';
let playerName = 'anonymous'
const playersSnap = players.child('players');
const chatSnap = players.child('chat');
const firebase1 = database.ref('players/player1/active');
const firebase2 = database.ref('players/player2/active');
const resetName1 = database.ref('players/player1/playerName');
const resetName2 = database.ref('players/player2/playerName');
const resetWins1 = database.ref('players/player1/wins');
const resetWins2 = database.ref('players/player2/wins');
const resetLosses1 = database.ref('players/player1/losses');
const resetLosses2 = database.ref('players/player2/losses');
const choice1 = database.ref('players/player1');
const choice2 = database.ref('players/player2');
let winner;
let resetChoice = false;
let wins1 = 0;
let losses1 = 0;
let wins2 = 0;
let losses2 = 0;


    $('#info').on('click','button',function(){
        playerName = $('#player-name').val();
        thisPlayer = playerName;
    
        $('#info').text("Go get em, " + thisPlayer + "!");

        playersSnap.once('value', function(snap) {
            console.log(snap.val());
            console.log(snap.val().player1.active);

            if (snap.val().player1.active && snap.val().player2.active) {
                alert("There are already two players fighting it out!");
                $('#info').text("Hello, " + thisPlayer + "! Unable to join game, there are already 2 players.");
                $('#stage').html('<div class="col-12"><h1>Cannot join the game, but you can chat below!</h1></div>');
            }
            else if (!snap.val().player1.active) {
                playersSnap.update({
                    player1: {
                        playerName: playerName,
                        active: true,
                        wins: 0,
                        losses: 0,
                        choice:''
                    }
                }) 
                currentPlayer = 1;
                li = $('<li>').text(playerName + " has joined as Player 1!");
                $('#chat-container').append(li);
                $('#chat-container').scrollTop($('#chat-container').prop("scrollHeight"));

            }
            else {
                playersSnap.update({
                    player2: {
                        playerName: playerName,
                        active: true,
                        wins: 0,
                        losses: 0,
                        choice: ''
                    }
                })
                currentPlayer = 2; 
                li = $('<li>').text(playerName + " has joined as Player 2!");
                $('#chat-container').append(li);
                $('#chat-container').scrollTop($('#chat-container').prop("scrollHeight"));
            }
            // Disconnect player from firebase when closing so others may join
            if (currentPlayer === 1) {
                firebase1.onDisconnect().set(false);
                resetName1.onDisconnect().set(''); 
                resetLosses1.onDisconnect().set(0);
                resetWins1.onDisconnect().set(0);
            }
            else if( currentPlayer === 2) {
                firebase2.onDisconnect().set(false);
                resetName2.onDisconnect().set(''); 
                resetLosses2.onDisconnect().set(0);
                resetWins2.onDisconnect().set(0);
            }
            else {
                return;
            }
        })    
    })

// CHAT LOGIC HERE //

$('#chat').on('click','button',function(){
    console.log('chat button clicked');
    
    message = $('#chat-message').val();
    newli = $('<li>');
    newli.text(
        moment().format('LTS') + " | " + thisPlayer + " says: " + message 
    )
    database.ref('chat').once('value', function(snap) {
        console.log(snap.val());
        database.ref().child('chat').push({
            message: message,
            name: playerName
        })
    })

    // $('#chat-container').append(newli);
    $('#chat-message').val('');
    console.log(message);
})

chatSnap.on('child_added', function(snap) {
    console.log(snap.val());
    newLI = $('<li>');
    // console.log(snap.val);
    snap.forEach(function(child){
        // console.log(child.val().message);
        let message = snap.val().message;
        let name = snap.val().name;
        if (snap.val().name === undefined) {
            return;
        }
        else {
            newLI.text(
                moment().format('LTS') + " | " + name + " >>> "+ message
            )
            $('#chat-container').append(newLI);
            $('#chat-container').scrollTop($('#chat-container').prop("scrollHeight"));

        }
    })
})

playersSnap.on('child_changed', function(snap) {
    if (resetChoice) {
        $('.btn-primary').removeAttr('disabled');
        resetChoice = false;
    }
    console.log(snap.val());
    if (snap.val().playerName === undefined)  {
        return;
    }
    else if (!snap.val().active) {
        console.log(snap.val().active);
        li = $('<li>').text(snap.val().playerName + " (A user has disconnected)");
        $('#chat-container').append(li);
        $('#chat-container').scrollTop($('#chat-container').prop("scrollHeight"));

    }
    else if (!snap.val().active) {
        li = $('<li>').text(snap.val().playerName + " (A user has disconnected)");
        $('#chat-container').append(li);
        $('#chat-container').scrollTop($('#chat-container').prop("scrollHeight"));

    }
    else {
        return;
    }
})

// GAME LOGIC HERE
database.ref().on('value', function(snap) {
    if (currentPlayer === 1) {
        h1 = $("<h1>").text("Player 2 : " + snap.val().players.player2.playerName);
        $('#player-2').html(h1);
    }
    chatSnap.onDisconnect().set({
        chat:{
            message: "Talk trash but keep it clean... or play mind games with your opponent.",
            name: "GameBot"
        }
        }); 
})

$('#info').on('click','button',function(){

    database.ref().once('value', function(snap) {
        if (!snap.val().players.player1.active && !snap.val().players.player2.active){
            return;
        }
        else if (snap.val().players.player1.active && !snap.val().players.player2.active) {
            h1 = $("<h1>").text("Player 2 : " + snap.val().players.player2.playerName);
            $('#player-2').prepend(h1);
        }
        else if (snap.val().players.player1.active) {
            h1 = $("<h1>").text("Player 1 : " + snap.val().players.player1.playerName);
            $('#player-1').prepend(h1);
        }
    })

    database.ref().once('value', function(snap) {

        if (snap.val().players.player1.active && snap.val().players.player2.active) {
            h1 = $('<h1>').text("Player 2: " + playerName);
            choices = ['Rock','Paper','Scissors'];
    
            for (i =0; i < choices.length; i++) {
                button = $('<button>');
                button.text(choices[i])
                    .attr('class','btn btn-primary m-1 choices')
                    .attr('choice', choices[i]);
                $('#player-2').append(button);
            }
            $('#player-2').prepend(h1);
        }
        else {
            h1 = $('<h1>').text("Player 1: " + playerName);
            choices = ['Rock','Paper','Scissors'];

            for (i =0; i < choices.length; i++) {
                button = $('<button>');
                button.text(choices[i])
                .attr('class','btn btn-primary m-1')
                .attr('choice', choices[i]);
                $('#player-1').append(button);
            }
                
                $('#player-1').prepend(h1);
        }
    })

})

$('#player-1').on('click', 'button', function(){
    choice = $(this).attr('choice');
    //send to firebase
    database.ref('players').once('value', function(snap){
        choice1.update({
            choice: choice
        });
    })
    $('.btn-primary').attr('disabled','true');
})

$('#player-2').on('click', 'button', function(){
    choice = $(this).attr('choice');
    //send to firebase
    database.ref('players').once('value', function(snap){
        choice2.update({
            choice: choice
        });
    })
    $('.btn-primary').attr('disabled','true');
})

playersSnap.on('value', function(snap) {
    let playerChoice1 = snap.val().player1.choice;
    let playerChoice2 = snap.val().player2.choice;


    if (playerChoice2 === '' || playerChoice1 === ''){
        return;
    }
    else if ( (playerChoice1 === 'Rock' && playerChoice2=== 'Paper') || (playerChoice1 === 'Paper' && playerChoice2=== 'Scissors') || 
              (playerChoice1 === 'Scissors' && playerChoice2=== 'Rock') ) {
        console.log("Player 2 wins");
        // change local variables
        wins2++;
        losses1++;
        // clear choices and reset buttons
        $('.btn-primary').removeAttr('disabled');
        // winner = snap.val().player2.playerName;
        // clear choice for player 2
        database.ref('players').once('value', function(snap){
            choice2.update({
                choice: ""
            });
        })
        // clear choice for player 1
        database.ref('players').once('value', function(snap){
            choice1.update({
                choice: ""
            });
        })
        // update wins for player 2
        database.ref('players').once('value', function(snap){
            choice2.update({
                wins: wins2
            });
        })
        // update losses for player 1
        database.ref('players').once('value', function(snap){
            choice1.update({
                losses: losses1
            });
        })
        $('#arena').html("<h1>Player 2 Wins!</h1><h3>Make your move or wait for the other player.</h3>");
        resetChoice = true;
        database.ref().once('value', function(snap) {
            winDisplay2 = snap.val().players.player2.wins;
            loseDisplay2 = snap.val().players.player2.losses;
            winDisplay1 = snap.val().players.player1.wins;
            loseDisplay1 = snap.val().players.player1.losses;
            
        setTimeout( function(){
            li = $('<li>').text("Player 2 won this match! " + "Player 1 wins/losses: (" + winDisplay1 +"/" + loseDisplay1 + "). Player 2 wins/losses: (" + winDisplay2 + "/" + loseDisplay2 + ").");
            $('#chat-container').append(li);
            $('#chat-container').scrollTop($('#chat-container').prop("scrollHeight"));
        },500)
        })
    }
    else if ( (playerChoice2 === 'Rock' && playerChoice1 === 'Paper') || (playerChoice2 === 'Paper' && playerChoice1 === 'Scissors') || 
    (playerChoice2 === 'Scissors' && playerChoice1 === 'Rock') ) {
        console.log("Player 1 wins");
        // change local variables
        wins1++;
        losses2++;
        // clear choices and reset buttons
        $('.btn-primary').removeAttr('disabled');
        // winner = snap.val().player2.playerName;
        // clear choice for player 2
        database.ref('players').once('value', function(snap){
            choice2.update({
                choice: ""
            });
        })
        // clear choice for player 1
        database.ref('players').once('value', function(snap){
            choice1.update({
                choice: ""
            });
        })
        // update wins for player 1
        database.ref('players').once('value', function(snap){
            choice1.update({
                wins: wins1
            });
        })
        // update losses for player 2
        database.ref('players').once('value', function(snap){
            choice2.update({
                losses: losses2
            });
        })
        $('#arena').html("<h1>Player 1 Wins!</h1><h3>Make your move or wait for other player.</h3>");
        resetChoice = true;
        database.ref().once('value', function(snap) {
            winDisplay2 = snap.val().players.player2.wins;
            loseDisplay2 = snap.val().players.player2.losses;
            winDisplay1 = snap.val().players.player1.wins;
            loseDisplay1 = snap.val().players.player1.losses;
            
        setTimeout( function(){
            li = $('<li>').text("Player 1 won this match! " + "Player 1 wins/losses: (" + winDisplay1 +"/" + loseDisplay1 + "). Player 2 wins/losses: (" + winDisplay2 + "/" + loseDisplay2 + ").");
            $('#chat-container').append(li);
            $('#chat-container').scrollTop($('#chat-container').prop("scrollHeight"));
        },500)
        })
    }
    else {
        console.log("It's a tie!");
       
        // clear choices and reset buttons
        $('.btn-primary').removeAttr('disabled');
        // clear choice for player 2
        database.ref('players').once('value', function(snap){
            choice2.update({
                choice: ""
            });
        })
        // clear choice for player 1
        database.ref('players').once('value', function(snap){
            choice1.update({
                choice: ""
            });
        })

        $('#arena').html("<h1>It's a tie!</h1><h3>Make your move!</h3>");
        resetChoice = true;
        setTimeout( function(){
            li = $('<li>').text("It's a tie!");
            $('#chat-container').append(li);
            $('#chat-container').scrollTop($('#chat-container').prop("scrollHeight"));
        },500)
    

    }
})

