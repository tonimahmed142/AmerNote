let words = [];  // To store words from the file
let usedIndices = new Set();  // To store used indices to avoid repetition
let wordInterval;
let startIndex = 0;
let endIndex = 0;

// Function to fetch the file and split its contents into words
async function fetchWords() {
    try {
        const response = await fetch('iealtsenglish.txt'); // Assuming you have a file with Chinese words
        const text = await response.text(); // Get the text content from the file
        words = text.split(/\r?\n/); // Split the content by newlines into an array
    } catch (error) {
        console.error("Error fetching file:", error);
    }
}

// Function to say the word aloud using Web Speech API with Chinese language setting
function sayWord(word) {
    const utterance = new SpeechSynthesisUtterance(word);
    utterance.lang = 'en-US';  // Set the language to Chinese (Simplified)
    speechSynthesis.speak(utterance);
}

// Function to get a random index within the specified range that hasn't been used
function getRandomIndexInRange() {
    let randomIndex;
    do {
        randomIndex = Math.floor(Math.random() * (endIndex - startIndex + 1)) + startIndex;  // Random index within the range
    } while (usedIndices.has(randomIndex));  // Keep generating if the index was already used
    usedIndices.add(randomIndex);  // Mark this index as used
    return randomIndex;
}

// Function to display a random word within the specified range and speak it
function displayWord() {
    if (usedIndices.size < (endIndex - startIndex + 1)) {  // Check if all words within the range have not been used yet
        const randomIndex = getRandomIndexInRange();
        const word = words[randomIndex];
        document.getElementById('wordDisplay').innerText = word;
        sayWord(word);  // Say the word in Chinese
    } else {
        clearInterval(wordInterval); // Stop when all words in the range have been used
    }
}

// Function to stop the display and speech
function stopWords() {
    clearInterval(wordInterval);  // Stop the interval
    speechSynthesis.cancel();  // Stop any ongoing speech synthesis
}

// Event listener for the "Try Yourself" button
document.getElementById('tryBtn').addEventListener('click', async function() {
    startIndex = parseInt(document.getElementById('startIndex').value) - 1;  // Get start index from user input
    endIndex = parseInt(document.getElementById('endIndex').value) - 1;  // Get end index from user input
    usedIndices.clear();  // Clear used indices for a new round
    clearInterval(wordInterval);
    await fetchWords(); // Fetch the words from the file before starting
    if (words.length > 0 && startIndex >= 0 && endIndex < words.length && startIndex <= endIndex) {
        wordInterval = setInterval(displayWord, 3000); // Display and say words every 3 seconds
    } else {
        alert("Please enter valid start and end indices.");
    }
});

// Event listener for the "Stop" button
document.getElementById('stopBtn').addEventListener('click', function() {
    stopWords();  // Stop the word display and speech
});
