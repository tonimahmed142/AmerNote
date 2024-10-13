function scrollToTop() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth' // Ensure smooth scrolling when clicking the "Top" button
    });
}

// Show or hide the scroll-to-top button based on the scroll position
window.onscroll = function() {
    const scrollTopBtn = document.getElementById("scrollTopBtn");
    if (document.body.scrollTop > 300 || document.documentElement.scrollTop > 300) {
        scrollTopBtn.style.display = "block"; // Show the button when scrolled down
    } else {
        scrollTopBtn.style.display = "none"; // Hide the button when near the top
    }
};

let englishWords = [];
let chineseWords = [];
let pinyinWords = [];
let banglaWords = [];

async function fetchWords(file) {
    const response = await fetch(file);
    const text = await response.text();
    return text.split('\n').map(word => word.trim()).filter(word => word);
}

async function loadWords() {
    englishWords = await fetchWords('english.txt');
    chineseWords = await fetchWords('chinese.txt');
    pinyinWords = await fetchWords('pinyin.txt');
    banglaWords = await fetchWords('bangla.txt');
    displayWords(englishWords); // Initial display of all words
}

function displayWords(filteredEnglishWords) {
    const container = document.getElementById('word-container');
    container.innerHTML = ''; // Clear previous words

    // Display the filtered words
    for (let i = 0; i < filteredEnglishWords.length; i++) {
        const index = englishWords.indexOf(filteredEnglishWords[i]); // Get the original index
        const div = document.createElement('div');
        div.className = 'word-container';
        div.innerHTML = `
            <div class="box">
                <div class="clickbox">
                    <div class="word pointer bg-color" onclick="speak('${englishWords[index]}')">${index + 1}. ${englishWords[index]}</div>
                    <div class="word pointer bg-color" onclick="pronounce('${chineseWords[index]}')">${chineseWords[index]}</div>
                </div>
                <div class="noclickbox">
                    <div class="word non-style">${pinyinWords[index]}</div>
                    <div class="word non-style">${banglaWords[index]}</div>
                </div>
            </div>
        `;
        container.appendChild(div);
    }
}

function speak(text) {
    const utterance = new SpeechSynthesisUtterance(text);
    speechSynthesis.speak(utterance);
}

function pronounce(text) {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'zh-CN';
    speechSynthesis.speak(utterance);
}

function filterWords() {
    const searchTerm = document.getElementById('search-box').value.toLowerCase();
    const filteredEnglishWords = englishWords.filter(word => word.toLowerCase().includes(searchTerm));
    displayWords(filteredEnglishWords);
}

loadWords();
