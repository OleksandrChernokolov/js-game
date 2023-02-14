import {
    helpMessage,
    gameStopMessage,
    uknownCommandMessage,
    startArt,
    roundsNumberArt,
    fightArt,
    resultsArt,
} from "./messages.js";

// Game "rock, paper, scissors" player vs computer
const OPTIONS_ARR = ["rock", "paper", "scissors"];
let computerWins = 0;
let playerWins = 0;
let currentUser;

verifyPlayer();
game()

// Run the game
function game() {
    console.log(startArt);
    let roundsFinished = 1;
    for (let i = 1; i < 6; i++) {
        console.log(roundsNumberArt[i])
        const playerSelection = userPlay(i)
        const computerSelection = computerPlay()

        if (playerSelection === undefined) break;

        roundsFinished = i;

        roundFightArt(playerSelection, computerSelection);
        const roundResult = playRound(playerSelection, computerSelection)
        console.log(roundResult)
    }

    gameResult(roundsFinished)
}

// Finish the game
function gameResult(roundsFinished) {
    let gameResult = "";

    if (roundsFinished < 5) {
        console.log(gameStopMessage)
        return;
    }
    else if (playerWins > computerWins) {
        console.log(resultsArt.victory);
        gameResult = `${currentUser} Wins! Final score: ${playerWins} wins. Computer's score: ${computerWins} wins.`
    }
    else if (playerWins < computerWins) {
        console.log(resultsArt.defeat);
        gameResult = `${currentUser} Loses! Final score: ${playerWins} wins. Computer's score: ${computerWins} wins.`
    }
    else {
        console.log(resultsArt.draw);
        gameResult = `It is a Draw! ${currentUser} final score: ${playerWins} wins. Computer's score: ${computerWins} wins.`
    }

    gameResult += `
┍━━━━━━━━━━━━━━━━━━━━━━━━━☟━━━━━━━━━━━━━━━━━━━━━━━━━┑
        You can reload the page to Play Again  
┕━━━━━━━━━━━━━━━━━━━━━━━━━☝︎━━━━━━━━━━━━━━━━━━━━━━━━━┙`
    console.log("\n" + gameResult);
    overalResults();
}


// Determine the winner
function playRound(playerSelection, computerSelection) {
    let result;
    const playerSelUpper = firstLetterToUppercase(playerSelection)
    const computerSelUpper = firstLetterToUppercase(computerSelection)

    if (playerSelection === computerSelection) {
        result = `It's a draw. Both players choose ${playerSelUpper}.`;
        return result;
    }

    if ((playerSelection === 'rock' && computerSelection === 'scissors')
        || (playerSelection === 'paper' && computerSelection === 'rock')
        || (playerSelection === 'scissors' && computerSelection === 'paper')) {
        result = `${currentUser} Wins! ${playerSelUpper} beats ${computerSelUpper}.`;
        playerWins++;
        return result;
    }
    result = `${currentUser} you Lose! ${computerSelUpper} beats ${playerSelUpper}.`;
    computerWins++;
    return result;
}

// Get right input from player
function userPlay(round) {
    let promptResp = {
        "err": "",
        'str': ""
    };
    const info = '\nOptions: rock, paper, scissors \nType "help" to get instructions'

    while (promptResp.str === "") {

        let message = "Round " + round + "\n";

        switch (promptResp.err) {
            case "1":
                let conf = confirm(`${currentUser} do you really want to leave the game?`)
                if (conf) return;
                else {
                    message += "So let's do that! Please enter your option." + info;
                    promptResp = promptReq(message, promptResp)
                }
                break;
            case "2":

                message += `Come on! ${currentUser} you just need to enter your option in the input box below.` + info;

                promptResp = promptReq(message, promptResp)
                break;
            case "3":
                message += "If you keep going with non-existent options, we will never finish the game!" + info;
                uknownCommandHandler()
                promptResp = promptReq(message, promptResp)
                break;
            default:
                message += 'Game "rock, paper, scissors". Please enter your option.' + info;
                promptResp = promptReq(message, promptResp)
        }
    }

    return promptResp.str;
}

//  Player's input implementation
function promptReq(message, promptResp) {
    let inputStr = prompt(message, "")

    if (inputStr === null) {
        promptResp.err = "1";
        return promptResp;
    };

    inputStr = inputStr.trim();
    if (inputStr === "") {
        promptResp.err = "2"
        return promptResp;
    }

    inputStr = inputStr.toLowerCase();

    if (inputStr === "help") {
        promptResp.err = ""
        showHelpMessage();
        return promptResp;

    }
    let check = OPTIONS_ARR.includes(inputStr);

    if (!check) {
        promptResp.err = "3";
    } else {
        promptResp.err = "";
        promptResp.str = inputStr;
    }

    return promptResp;
}

function uknownCommandHandler() {
    console.log(uknownCommandMessage);
}

// Generate computer's answer
function computerPlay() {
    return OPTIONS_ARR[Math.floor(Math.random() * 3)];
}


// Make the first letter of a string capital
function firstLetterToUppercase(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

// Help message
function showHelpMessage() {
    console.log(helpMessage);
}

function verifyPlayer() {
    const lastPlayer = localStorage.getItem('lastPlayer');
    const greetings = `Hi! This is a "Rock, Paper, Scissors" game. To monitor the result of the game, open the console please.\n`
    if (lastPlayer) {
        const conf = confirm(greetings + `Keep Playing as ${lastPlayer}?`);
        if (conf) {
            currentUser = lastPlayer
        }
    }
    if (!currentUser) {
        const aliasPrompt = prompt(greetings + "Enter your game alias if you want.");
        currentUser = (aliasPrompt != null && aliasPrompt.trim() != "") ? aliasPrompt.trim() : "Player";
        localStorage.setItem('lastPlayer', currentUser)
        alert(`Welcome ${currentUser}`);
    }
}

function overalResults() {
    checkLocalStorage();
    const lowerCaseUser = currentUser.toLowerCase();
    let overalResult = localStorage.getItem(`${lowerCaseUser}Score`)
    overalResult = JSON.parse(overalResult)
    if (playerWins > computerWins) {
        overalResult[0]++
    }
    else if (playerWins < computerWins) {
        overalResult[1]++
    }
    else {
        overalResult[2]++
    }
    console.log(`
╔═════════════════════════════════════════════╗
        ${currentUser.toUpperCase()} TOTAL SCORE IS:
    ${overalResult[0]} VICTORIES
    ${overalResult[1]} DEFEATS
    ${overalResult[2]} DRAWS
╚═════════════════════════════════════════════╝`)
    localStorage.setItem(`${lowerCaseUser}Score`, JSON.stringify(overalResult))
    return overalResult
}

function checkLocalStorage() {
    const lowerCaseUser = currentUser.toLowerCase();
    let overalResult = localStorage.getItem(`${lowerCaseUser}Score`)
    overalResult = JSON.parse(overalResult)
    const arr = [0, 0, 0]
    if (!overalResult) {
        localStorage.setItem(`${lowerCaseUser}Score`, JSON.stringify(arr));
        return
    }
    const winsToInt = parseInt(overalResult[0]);
    const losesToInt = parseInt(overalResult[1]);
    const drawToInt = parseInt(overalResult[2]);
    if (typeof overalResult !== "object" || overalResult.length !== 3 || winsToInt === 'NaN'
        || losesToInt === 'NaN' || drawToInt === 'NaN') {
        localStorage.setItem(`${lowerCaseUser}Score`, JSON.stringify(arr));
    }
}

function roundFightArt(playerSelection, computerSelection) {
    let newString = ' ';
    for (let index = 1; index <= 18; index += 1) {
        newString += fightArt[playerSelection][index];
        newString += fightArt.xArt[index];
        newString += fightArt[computerSelection][index];
        newString += '\n';
    }

    console.log(newString)
}
