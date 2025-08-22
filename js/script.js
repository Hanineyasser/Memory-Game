// --- Memory Game with Timer, Score, and Rating ---
const emojis = ["🍎", "🍌", "🍇", "🍉", "🍓", "🍒", "🍍", "🥝"];
const cards = shuffle([...emojis, ...emojis]);
const board = document.getElementById("game-board");
const timerEl = document.getElementById("timer");
const submitBtn = document.getElementById("submit-btn");
const scoreView = document.getElementById("score-view");
const scoreEl = document.getElementById("score");
const ratingEl = document.getElementById("rating");

let flipped = [];
let matched = [];
let moves = 0;
let timer;
let timeLeft = 300; // 5 minutes in seconds
let gameEnded = false;

function shuffle(arr) {
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
}

function buildBoard() {
    board.innerHTML = "";
    cards.forEach((emoji, idx) => {
        const card = document.createElement("button");
        card.className = "card";
        card.style.width = "60px";
        card.style.height = "60px";
        card.style.fontSize = "2em";
        card.style.background =flipped.includes(idx)? "white":"black";
        card.style.background= matched.includes(idx) ? "green" : card.style.background;
        card.style.borderRadius = "8px";
        card.disabled =matched.includes(idx) || flipped.includes(idx) || gameEnded;
        card.innerText =matched.includes(idx) || flipped.includes(idx) ? emoji : "";
        card.addEventListener("click", () => handleFlip(idx));
        board.appendChild(card);
    });
}

function handleFlip(idx) {
    if (flipped.length === 2 || flipped.includes(idx) || matched.includes(idx))
        return; //to not flip more than 2 or reflip the cards
    flipped.push(idx);
    buildBoard(); //to show the emoji
    if (flipped.length === 2) {
        moves++;
        setTimeout(checkMatch, 1000);//gives the player time to see the second card before knowing if it's a match or not
    }
}

function checkMatch() {
    const [i, j] = flipped;
    if (cards[i] === cards[j]) {
        matched.push(i, j);
        if (matched.length === cards.length) {
            endGame();
        }
    }
    flipped = [];
    buildBoard();
}

function startTimer() {
    updateTimer();
    timer = setInterval(timerTick, 1000);//setInterval-->repeatedly calls timerTick every 1 second
}

function timerTick() {
    timeLeft--;
    updateTimer();
    if (timeLeft <= 0) {
        endGame();
    }
}

function updateTimer() {
    const min = String(Math.floor(timeLeft / 60)).padStart(2, "0");
    const sec = String(timeLeft % 60).padStart(2, "0");
    timerEl.innerText = `Time: ${min}:${sec}`;
    updateTimerAndMoves();
}

function endGame() {
    if (gameEnded) return;
    gameEnded = true;
    clearInterval(timer);
    board.style.pointerEvents = "none";//makes me unable to click on the cards
    submitBtn.disabled = true;
    showScore();
}


function showScore() {
    scoreView.style.display = "block";
    let baseMoves = cards.length / 2; // 8 pairs = 8 moves minimum
    let stars = 5;
    if (moves > baseMoves) {
        stars = Math.max(1, 5 - Math.floor((moves - baseMoves) / 2));
    }
    scoreEl.innerHTML = `Moves: <b>${moves}</b> <br>Matched: <b>${
        matched.length / 2
    }</b> / ${cards.length / 2}`;
    ratingEl.innerHTML = "★".repeat(stars) + "☆".repeat(5 - stars);
}

submitBtn.onclick = endGame;

function updateTimerAndMoves() {
    const min = String(Math.floor(timeLeft / 60)).padStart(2, "0");
    const sec = String(timeLeft % 60).padStart(2, "0");
    timerEl.innerHTML = `Time: ${min}:${sec} <span id='moves' style='margin-left:20px'>Moves: <b>${moves}</b></span>`;
}

// Update moves in handleFlip
const originalHandleFlip = handleFlip;
handleFlip = function (idx) {
    if (flipped.length === 2 || flipped.includes(idx) || matched.includes(idx))
        return;
    flipped.push(idx);
    buildBoard();
    if (flipped.length === 2) {
        moves++;
        updateTimerAndMoves();
        setTimeout(checkMatch, 700);
    }
};

buildBoard();
updateTimerAndMoves();
startTimer();
