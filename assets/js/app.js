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




    $('#info').on('click','button',function(){
        playerName = $('#player-name').val();
        thisPlayer = playerName;
    
        $('#info').text("Go get em, " + thisPlayer + "!");

        playersSnap.once('value', function(snap) {
            console.log(snap.val());
            console.log(snap.val().player1.active);

            if (snap.val().player1.active && snap.val().player2.active) {
                alert("There are already two players fighting it out!");
                $('#info').text("Hello, " + thisPlayer + "! Unable to join game, there are already 2 players.")
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
                // h1 = $('<h1>').text("Player 1: " + playerName);
                // choices = ['Rock','Paper','Scissors'];

                // for (i =0; i < choices.length; i++) {
                //     button = $('<button>');
                //     button.text(choices[i]);
                //     $('#player-1').append(button);
                // }

                // $('#player-1').prepend(h1);

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
                // h1 = $('<h1>').text("Player 2: " + playerName);
                // choices = ['Rock','Paper','Scissors'];

                // for (i =0; i < choices.length; i++) {
                //     button = $('<button>');
                //     button.text(choices[i]);
                //     $('#player-2').append(button);
                // }
                
                // $('#player-2').prepend(h1);
            }
            // Disconnect player from firebase when closing so others may join
            if (currentPlayer === 1) {
                firebase1.onDisconnect().set(false);
                resetName1.onDisconnect().set(''); 

            }
            else {
                firebase2.onDisconnect().set(false);
                resetName2.onDisconnect().set(''); 
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
})

$('#info').on('click','button',function(){

    database.ref().once('value', function(snap) {
        if (!snap.val().players.player1.active && !snap.val().players.player2.active){
            return;
        }
        // else if ($('#player-1').contains('Player')) {
        //     return;
        // }
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
        name1 = snap.val().players.player1.playerName;
        choice1 = snap.val().players.player1.choice;
        wins1 = snap.val().players.player1.wins;
        losses1 = snap.val().players.player1.losses;
        console.log(name1 + choice1 + wins1+losses1);

        if (snap.val().players.player1.active && snap.val().players.player2.active) {
            h1 = $('<h1>').text("Player 2: " + playerName);
            choices = ['Rock','Paper','Scissors'];
    
            for (i =0; i < choices.length; i++) {
                button = $('<button>');
                button.text(choices[i]);
                $('#player-2').append(button);
            }
            $('#player-2').prepend(h1);
        }
        else {
            h1 = $('<h1>').text("Player 1: " + playerName);
            choices = ['Rock','Paper','Scissors'];

            for (i =0; i < choices.length; i++) {
                button = $('<button>');
                button.text(choices[i]);
                $('#player-1').append(button);
            }
                
                $('#player-1').prepend(h1);
        }
    })

})
