let words = [];  // To store words from the file
let currentIndex = 0;
let wordInterval;
let startIndex = 0;
let endIndex = 0;

// Function to fetch the file and split its contents into words
async function fetchWords() {
    try {
        const response = await fetch('english.txt');
        const text = await response.text(); // Get the text content from the file
        words = text.split(/\r?\n/); // Split the content by newlines into an array
    } catch (error) {
        console.error("Error fetching file:", error);
    }
}

// Function to say the word aloud using Web Speech API
function sayWord(word) {
    const utterance = new SpeechSynthesisUtterance(word);
    speechSynthesis.speak(utterance);
}

// Function to display the words one by one and speak them
function displayWord() {
    if (currentIndex <= endIndex && currentIndex < words.length) {
        const word = words[currentIndex];
        document.getElementById('wordDisplay').innerText = word;
        sayWord(word);  // Say the word
        currentIndex++;
    } else {
        clearInterval(wordInterval); // Stop when all words are displayed
    }
}

// Function to stop the display and speech
function stopWords() {
    clearInterval(wordInterval);  // Stop the interval
    speechSynthesis.cancel();  // Stop any ongoing speech synthesis
}

// Event listener for the "Try Yourself" button
document.getElementById('tryBtn').addEventListener('click', async function() {
    startIndex = parseInt(document.getElementById('startIndex').value) - 1;
    endIndex = parseInt(document.getElementById('endIndex').value) - 1;
    currentIndex = startIndex;
    clearInterval(wordInterval);
    await fetchWords(); // Fetch the words from the file before starting
    if (words.length > 0 && startIndex >= 0 && endIndex < words.length && startIndex <= endIndex) {
        wordInterval = setInterval(displayWord, 3000); // Display and say words every 5 seconds
    } else {
        alert("Please enter valid start and end indices.");
    }
});

// Event listener for the "Stop" button
document.getElementById('stopBtn').addEventListener('click', function() {
    stopWords();  // Stop the word display and speech
});