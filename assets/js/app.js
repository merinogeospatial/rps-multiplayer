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
const players = database.ref().child("players");
// let player1 = '';
// let player2 = '';
// let choice1;
// let choice2;



    $('#info').on('click','button',function(){
        playerName = $('#player-name').val();

                players.set({
                    player1: {
                        playerName: playerName,
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