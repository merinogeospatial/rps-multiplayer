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

// let player1 = '';
// let player2 = '';
// let choice1;
// let choice2;
let thisPlayer;



    $('#info').on('click','button',function(){
        playerName = $('#player-name').val();
        thisPlayer = playerName;

        $('#info').text("Hello, " + thisPlayer + "!");

            // put if statement here
            // update player names based on conditional?
        // var ref = players.child('players/player1');
        var playersSnap = players.child('players');
        playersSnap.once('value', function(snap) {
            console.log(snap.val());
        })    

        players.update({
            player1: {
                    playerName: playerName,
                    choice: '',
                    wins: 0,
                    losses: 0

            },
            player2: {
                    playerName: '',
                    choice: '',
                    wins: 0,
                    losses: 0 
                }

            }) 
            
 
    })


// First we want to ask user for name
  // In #info, add input asking for name, upon typing name and submitting - fill player1, if player 1 not empty, fill player 2
  // This will create objects for player 1 and 2

  // Display in 





// CHAT HERE //

$('#chat').on('click','button',function(){
    console.log('this works');
    
    message = $('#chat-message').val();
    newli = $('<li>');
    newli.text(
        moment().format('LTS') + " | " + thisPlayer + " says: " + message 
    )
    $('#chat-container').append(newli);
    $('#chat-message').val('');
    console.log(message);
})


