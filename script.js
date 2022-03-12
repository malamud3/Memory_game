let userData = {
    username: '',
    username2: '',
    pointsUserA: 0,
    pointsUserB: 0,
    gameSize: '4x4',
    winner: ''
}

let currentPlayer = "playerA";

let gameHistory = {
    history: [],
    playersHistory: []
}


const POINT_PER_WIN = 1;

play = () =>{
const  music =new Audio('music.mp3').play;
music.loop=true;
}

shuffleCards = () => {

new Audio('shuffling.mp3').play;

    const boardSize = userData.gameSize.split("x")[0];
    const gameSize = boardSize*boardSize;
    const cardsElement = document.getElementsByClassName("cards")[0];
    //change grid style for another game size.
    cardsElement.style.gridTemplateColumns = `repeat(${boardSize}, 100px)`;
    cardsElement.style.gridTemplateRows = `repeat(${boardSize}, 100px)`;
    cardsElement.innerHTML = '';
    for(let i=1; i<=gameSize / 2; i++) {
        const card = 
        `
        <div class="card" id="smile (${i})">
        <div class="card__front">
            <img src="images/back.png">
        </div>
            <div class="card__back">
                <img src="images/smile (${i}).png">
            </div>
        </div> 
        `
        cardsElement.innerHTML = cardsElement.innerHTML + card + card;
        const music = new Audio('adf.wav');

    }
   
   
    const cards = document.querySelectorAll('.card');
    const randList = [];
    Array.from(cards).forEach((card) => {
         let rand = Math.floor(Math.random() * cards.length) + 1;
        while(randList.includes(rand)){
             rand = Math.floor(Math.random() * cards.length) + 1;   
         }
         randList.push(rand);
         setTimeout(()=> {
             card.style.order = rand;
         }, 500);
        card.addEventListener('click', flip.bind(null, card));
    });

}

checkWinner = ([card1, card2]) => {
    const promise = new Promise((resolve, reject) => {

    
    setTimeout(()=> {
        if(card1['id'] != card2['id']) {
            card1.classList.remove('flipped');
            card2.classList.remove('flipped');
            
        }
        else {
            card1.classList.add('matched');
            card2.classList.add('matched');    
            card1.classList.remove('flipped');
            card2.classList.remove('flipped');
            changePoints(POINT_PER_WIN);
           
        const matchedCards = Array.from(document.querySelectorAll('.card')).filter(card => card.classList.contains('matched'));
        const cards = document.querySelectorAll('.card');
        //check if end game. (all the cards flipped)
        if(matchedCards.length == cards.length) {
            if(userData.pointsUserA > userData.pointsUserB) {
                userData.winner = userData.username;
                setTimeout(()=> { alert(`winner ${userData.username}`); }, 1000);
            } else if(userData.pointsUserA < userData.pointsUserB) {
                setTimeout(()=> { alert(`winner ${userData.username2}`); }, 1000);
                userData.winner = userData.username2;
            } else {
                setTimeout(()=> { alert('winner TIE'); }, 1000);
                userData.winner = "TIE";
            }
            createNewGame();
    
        }
       
       
    }
    resolve();
    
    }, 1000);
    });
    promise.then(() => { console.log("ggg"); changeCurrentPlayer();});
    promise.catch(() => console.log("dick"));
}

saveHistory = () => {
    gameHistory.history.push({date:Date.now(),...userData});
    let players = gameHistory.playersHistory.filter((x)=> x.username == userData.winner);
    if(players && players.length > 0) {
        players[0].wins = players[0].wins + 1;
        gameHistory.playersHistory.filter((x)=> x.username != userData.winner).push(players[0]);
    } else {
        gameHistory.playersHistory.push({username: userData.winner , wins: 1});
    }
    localStorage.setItem('history', JSON.stringify(gameHistory));

}
//inital game right after win.
createNewGame = () => {
    saveHistory();
    userData = {
        username: '',
        username2: '',
        pointsUserA: 0,
        pointsUserB: 0,
        gameSize: '4x4',
    };
    document.getElementsByClassName("userData")[0].style.display = 'block';
}

flip = (card) => {
    card.classList.toggle('flipped');
    const cards = Array.from(document.querySelectorAll('.card')).filter(card => card.classList.contains('flipped'));
    if (cards.length === 2) {
        checkWinner(cards);
    }
}

changeCurrentPlayer = () => {
    currentPlayer = currentPlayer == "PlayerB" ? "PlayerA" : "PlayerB";
    const playerUser = currentPlayer == "PlayerB" ? userData.username2 : userData.username;
    document.getElementsByClassName(`currentPlayer`)[0].innerHTML = playerUser;
}

changePoints = (points) => {
    if(currentPlayer == "PlayerA") {
        userData.pointsUserA += points;
        document.getElementsByClassName(`pointsCounter${currentPlayer}`)[0].innerHTML = `<b>${userData.username} :</b>${userData.pointsUserA}`;

    } else {
        userData.pointsUserB += points;
        document.getElementsByClassName(`pointsCounter${currentPlayer}`)[0].innerHTML = `<b>${userData.username2} :</b>${userData.pointsUserB}`;;

    }
}

setUserData = () => { 
    const username = document.getElementsByName("name")[0].value;
    const username2 = document.getElementsByName("name2")[0].value;
    const gameSize = document.getElementsByName("board")[0].value;
    userData['username'] = username;
    userData['username2'] = username2;
    userData['gameSize'] = gameSize;
    document.getElementsByClassName("userData")[0].style.display = 'none';
    document.getElementsByClassName("stats")[0].style.display = 'block';
    changeCurrentPlayer();
    shuffleCards();
}

document.addEventListener('DOMContentLoaded', () => {
    const data = localStorage.getItem('history');
    if(data) {
        gameHistory = JSON.parse(data);
    }
});