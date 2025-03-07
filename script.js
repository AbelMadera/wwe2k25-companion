// Load stored data on page load
window.onload = function () {
    loadPPV();
    loadMatchHistory();
    suggestNextWeekMatches();
};

// Local storage keys
const PPV_STORAGE_KEY = "ppvData";
const MATCH_STORAGE_KEY = "matchHistory";

// Store PPV Details
function savePPV() {
    const ppvName = document.getElementById("ppv-name").value;
    const weeksUntilPPV = parseInt(document.getElementById("weeks-until-ppv").value);

    if (!ppvName || isNaN(weeksUntilPPV) || weeksUntilPPV < 1) {
        alert("Please enter a valid PPV name and weeks count.");
        return;
    }

    const ppvData = { name: ppvName, weeksRemaining: weeksUntilPPV };
    localStorage.setItem(PPV_STORAGE_KEY, JSON.stringify(ppvData));
    loadPPV();
}

// Load PPV from local storage
function loadPPV() {
    const ppvData = JSON.parse(localStorage.getItem(PPV_STORAGE_KEY));
    if (ppvData) {
        document.getElementById("current-ppv").innerText = `${ppvData.name} - ${ppvData.weeksRemaining} weeks away`;
    }
}

// Store match history
let matchHistory = JSON.parse(localStorage.getItem(MATCH_STORAGE_KEY)) || [];

function recordMatch() {
    const brand = document.getElementById("brand").value;
    const wrestler1 = document.getElementById("wrestler1").value;
    const wrestler2 = document.getElementById("wrestler2").value;
    const winner = document.getElementById("winner").value;

    if (!wrestler1 || !wrestler2 || !winner) {
        alert("Please fill in all fields!");
        return;
    }

    const matchData = { brand, wrestler1, wrestler2, winner };
    matchHistory.push(matchData);
    localStorage.setItem(MATCH_STORAGE_KEY, JSON.stringify(matchHistory));

    updateMatchHistory();
    suggestNextWeekMatches();
}

// Load match history from local storage
function loadMatchHistory() {
    updateMatchHistory();
}

// Display match history
function updateMatchHistory() {
    const historyList = document.getElementById("history-list");
    historyList.innerHTML = "";

    matchHistory.forEach((match, index) => {
        let listItem = document.createElement("li");
        listItem.innerHTML = `
            ${match.brand}: ${match.wrestler1} vs ${match.wrestler2} - Winner: ${match.winner}
            <button class="edit-btn" onclick="editMatch(${index})">Edit</button>
            <button class="delete-btn" onclick="deleteMatch(${index})">Delete</button>
        `;
        historyList.appendChild(listItem);
    });
}

// Edit a match
function editMatch(index) {
    const match = matchHistory[index];
    document.getElementById("brand").value = match.brand;
    document.getElementById("wrestler1").value = match.wrestler1;
    document.getElementById("wrestler2").value = match.wrestler2;
    document.getElementById("winner").value = match.winner;

    deleteMatch(index);
}

// Delete a match
function deleteMatch(index) {
    matchHistory.splice(index, 1);
    localStorage.setItem(MATCH_STORAGE_KEY, JSON.stringify(matchHistory));
    updateMatchHistory();
    suggestNextWeekMatches();
}

// Suggest matches for next week
function suggestNextWeekMatches() {
    const bookingList = document.getElementById("booking-list");
    bookingList.innerHTML = "";

    matchHistory.forEach((match, index) => {
        let suggestedMatch = `${match.winner} vs ???`;

        let listItem = document.createElement("li");
        listItem.innerHTML = `
            ${match.brand}: ${suggestedMatch}
            <button class="remove-btn" onclick="removeSuggestion(${index})">Remove</button>
        `;
        bookingList.appendChild(listItem);
    });
}

// Remove a booking suggestion
function removeSuggestion(index) {
    document.getElementById("booking-list").children[index].remove();
}