let currentWord = "";
let playerName = "";
let timeLeft = 15;
let timerInterval;
let playerScore = 0;
let usedWords = []; // Store words to prevent repetition

// Start Game after entering the name
function startGame() { 
    playerName = document.getElementById("player-name").value.trim();
    if (!playerName) {
        alert("Please enter your name to start the game.");
        return;
    }
    document.getElementById("name-form").style.display = "none";
    document.getElementById("game-container").style.display = "block";
    document.getElementById("player-display").innerText = "Player: " + playerName;
    
    usedWords = []; // Reset used words list on game start

    fetch("/start")
        .then(response => response.json())
        .then(data => {
            if (data.word) {
                document.getElementById("current-word").innerText = "Current Word: " + data.word;
                currentWord = data.word;
                playerScore = 0;
                document.getElementById("score").innerText = "Score: " + playerScore;
                resetTimer();
            } else {
                document.getElementById("current-word").innerText = "Error: No word received!";
            }
        })
        .catch(error => {
            console.error("Error fetching word:", error);
            document.getElementById("current-word").innerText = "Error loading word!";
        });
}

function submitWord() {
    let newWord = document.getElementById("word-input").value.trim().toLowerCase();

    if (!newWord) {
        document.getElementById("message").innerText = "Please enter a word!";
        return;
    }

    // Check if word is already used
    if (usedWords.includes(newWord)) {
        document.getElementById("message").innerText = "Word already used! Try another one.";
        return;
    }

    fetch("/play", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ playerName: playerName, word: newWord })
    })
    .then(response => response.json())
    .then(data => {
        if (data.valid) {
            currentWord = data.nextWord;
            document.getElementById("current-word").innerText = "Current Word: " + currentWord;
            playerScore += newWord.length; // Update score based on word length
            document.getElementById("score").innerText = "Score: " + playerScore;
            document.getElementById("message").innerText = "Valid word!";
            
            usedWords.push(newWord); // Add word to used list
            resetTimer();
        } else {
            document.getElementById("message").innerText = data.message;
        }
    })
    .catch(error => {
        console.error("Error submitting word:", error);
        document.getElementById("message").innerText = "Error processing request!";
    });

    document.getElementById("word-input").value = ""; // Clear input field after submission
}

function resetTimer() {
    clearInterval(timerInterval);
    timeLeft = 15;
    document.getElementById("timer").innerText = "Time Left: " + timeLeft + "s";
    timerInterval = setInterval(() => {
        if (timeLeft > 0) {
            timeLeft--;
            document.getElementById("timer").innerText = "Time Left: " + timeLeft + "s";
        } else {
            clearInterval(timerInterval);
            document.getElementById("message").innerText = "Time's up! You lost this round.";
            document.getElementById("word-input").disabled = true;
            document.querySelector(".submit-btn").disabled = true;
        }
    }, 1000);
}

document.getElementById("name-form").style.display = "block";
document.getElementById("game-container").style.display = "none";
