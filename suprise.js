document.getElementById("start-button").addEventListener("click", startCompetition);

const teams = ["Vios", "Quintus", "Havana", "Grol", "HCW", "Pacelli", "Minerva", "Ha Stu"];
let schedule = [];
let standings = {};
let currentRound = 0;
let poem = [
    `Het seizoen start, de spanning is daar,
    Vios staat op scherp, even je best doen voor de eerste overwinning van het jaar.
    De bal rolt, het publiek juicht luid,
    Het kampioenschap is de doelstelling, punt uit.`,

    `Wat een start, dit heeft de sint zich verbeeld,
    Vios laat zien hoe handbal wordt gespeeld.
    Met flair en kracht, het niveau is hoog,
    Een goed begin, en dat met het kampioenschap op het oog.`,

    `De tweede ronde, de tegenstand groeit,
    Maar Vios blijft sterk en ongeboeid.
    Met teamgeest, tactiek en het juiste plan,
    Zet Vios elke tegenstander aan de kant.`,

    `Tegelijkertijd werkt Marieke met veel plezier,
    Bij Europlanet, waar ze straalt, keer op keer.
    Met passie en kracht, elke taak doet ze graag,
    en op het veld geeft ze de tegenstander de volle laag.`,

    `Maar naast de sport, is er ook nog rust,
    Een wijntje, een glimlach, soms even bewust.
    Marieke geniet, met haar gezin zo fijn,
    Drie kinderen die altijd voor haar zijn.`,

    `Een moeder, met een hart van goud,
    Marieke doet alles met liefde, altijd vertrouwd.
    Met kracht en zorg, blijft ze altijd sterk,
    Ze weet hoe je alles combineert, en dat met al dat werk.`,
    
    `Het seizoen eindigt, de spanning is groot,
    Vios heeft alles gegeven, hun kracht is groot.
    Als de bal het net raakt, klinkt het gejuich,
    Een droom vervuld, de kampioensvlag kan uit.

    Maar de strijd is nog niet over, Vios moet winnen,
    Dan is de overwinning voor hen, het kampioenschap binnen.
    De tribune barst los in een oorverdovend geluid,
    De overwinning is daar, de vreugde is luid.

    De overwinning wordt groots gevierd,
    met de meiden, en natuurlijk onmundig veel wijnen!

    En voor Marieke, een speciaal cadeau,
    Een spannend boek voor de momenten van rust enzo.
    En een heerlijke Primitivo, voor een feestelijk moment,
    Met de smaken van geluk, die ze nooit vergeet, altijd kent.`
];

let poemIndex = 0;

// Initialize standings
teams.forEach(team => standings[team] = 0);

// Generate the round-robin schedule
function generateSchedule() {
    const numTeams = teams.length;
    const numRounds = numTeams - 1;
    const half = Math.floor(numTeams / 2);

    let tempTeams = [...teams];
    tempTeams = tempTeams.concat(tempTeams.shift()); // Rotate teams to generate pairings

    for (let round = 0; round < numRounds; round++) {
        let matchday = [];
        for (let i = 0; i < half; i++) {
            const teamA = tempTeams[i];
            const teamB = tempTeams[numTeams - 1 - i];
            matchday.push([teamA, teamB]);
        }
        schedule.push(matchday);
        tempTeams = [tempTeams[0], ...tempTeams.slice(2), tempTeams[1]];
    }
}

function startCompetition() {
    document.getElementById("front-page").style.display = "none";
    document.getElementById("competition").style.display = "flex"; // Zorg ervoor dat de sectie zichtbaar is met 'flex'
    generateSchedule();
    displayPoem();
}

function displayPoem() {
    const poemText = document.getElementById("poem-text");
    
    // Zorg ervoor dat we binnen de lengte van het gedicht blijven
    if (poemIndex < poem.length) {
        poemText.innerText = poem[poemIndex];
        poemIndex++; // Ga naar het volgende gedichtdeel
    }
    
    document.getElementById("poem-section").style.display = "block";
    document.getElementById("poem-button").style.display = "inline-block"; // Maak de knop direct zichtbaar
}

document.getElementById("poem-button").addEventListener("click", () => {
    // Hide poem and show matchday results
    document.getElementById("poem-section").style.display = "none";
    displayMatchday();
});

function displayMatchday() {
    const resultsList = document.getElementById("results-list");
    resultsList.innerHTML = ""; // Clear previous results
    const matchday = schedule[currentRound];
    
    // Randomize the order of teams for this matchday
    const randomizedMatchday = shuffleArray([...matchday]);

    randomizedMatchday.forEach(([teamA, teamB]) => {
        // Simulate the scores, with Vios always winning
        let teamAScore, teamBScore;
        if (teamA === "Vios") {
            teamAScore = getRandomScore();
            const goalDifference = getRandomInt(1, 10); // Min 1 and max 10 goal difference
            teamBScore = teamAScore - goalDifference;
        } else if (teamB === "Vios") {
            teamBScore = getRandomScore();
            const goalDifference = getRandomInt(1, 10);
            teamAScore = teamBScore - goalDifference;
        } else {
            teamAScore = getRandomScore();
            teamBScore = getRandomScore();
        }

        resultsList.innerHTML += `<li>${teamA} (${teamAScore}) - ${teamB} (${teamBScore})</li>`;

        // Update standings (2 for win, 1 for draw, 0 for loss)
        if (teamAScore > teamBScore) {
            standings[teamA] += 2;
        } else if (teamAScore < teamBScore) {
            standings[teamB] += 2;
        } else {
            standings[teamA] += 1;
            standings[teamB] += 1;
        }
    });

    document.getElementById("matchday-results").style.display = "block";
    document.getElementById("poem-button").style.display = "none"; // Hide poem button
    document.getElementById("next-button").style.display = "inline-block"; // Show the next button
}

document.getElementById("next-button").addEventListener("click", () => {
    // Hide matchday and show standings
    document.getElementById("matchday-results").style.display = "none";
    displayStandings();
    document.getElementById("next-button").style.display = "none"; // Hide the next button
});

function displayStandings() {
    const standingsList = document.getElementById("standings-list");
    standingsList.innerHTML = "";
    Object.entries(standings)
        .sort(([, pointsA], [, pointsB]) => pointsB - pointsA) // Sort by points
        .forEach(([team, points]) => {
            standingsList.innerHTML += `<li>${team}: ${points} punten</li>`;
        });

    document.getElementById("standings").style.display = "block";
    document.getElementById("proceed-button").style.display = "inline-block"; // Show the proceed button
}

document.getElementById("proceed-button").addEventListener("click", () => {
    // Check if Vios has 14 points
    if (standings["Vios"] >= 14) {
        document.getElementById("champion").style.display = "block"; // Show champion message
        document.getElementById("standings").style.display = "none"; // Hide standings
        document.getElementById("proceed-button").style.display = "none"; // Hide proceed button
    } else {
        currentRound++;
        if (currentRound < schedule.length && currentRound < 7) {
            document.getElementById("standings").style.display = "none"; // Hide standings again
            displayPoem(); // Show poem again for the next round
        } else {
            alert("De competitie is afgelopen!");
            location.reload(); // Herlaad de pagina na het einde van de competitie
        }
    }
});

document.getElementById("restart-button").addEventListener("click", () => {
    location.reload(); // Reset the game by reloading the page
});

// Helper functions
function getRandomScore() {
    return getRandomInt(15, 30); // Genereer een willekeurig aantal doelpunten tussen 15 en 30
}

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min; // Genereer een willekeurig geheel getal tussen min en max
}

// Helper function to shuffle array (randomize order of teams)
function shuffleArray(array) {
    let shuffledArray = array.slice();
    for (let i = shuffledArray.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffledArray[i], shuffledArray[j]] = [shuffledArray[j], shuffledArray[i]];
    }
    return shuffledArray;
}
