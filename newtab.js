let currentQuoteIndex = -1;

function displayRandomQuote() {
  chrome.storage.sync.get({ quotes: [] }, (data) => {
    const quotes = data.quotes;
    const quoteDisplay = document.getElementById('quoteDisplay');
    
    if (quotes.length > 0) {
      // Get a new random index different from the current one
      let newIndex;
      do {
        newIndex = Math.floor(Math.random() * quotes.length);
      } while (quotes.length > 1 && newIndex === currentQuoteIndex);
      
      currentQuoteIndex = newIndex;
      
      // Create the quote content
      quoteDisplay.innerHTML = `
        <div class="quote-text">${quotes[newIndex]}</div>
        <div class="quote-actions">
          <button class="action-button" id="newQuote">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            New Quote
          </button>
        </div>
      `;
      
      // Add event listener for new quote
      document.getElementById('newQuote').addEventListener('click', () => {
        quoteDisplay.classList.remove('fade-in');
        // Trigger reflow
        void quoteDisplay.offsetWidth;
        quoteDisplay.classList.add('fade-in');
        displayRandomQuote();
      });
    } else {
      quoteDisplay.innerHTML = `
        <div class="no-quotes">
          No quotes added yet.<br>
          Add some quotes using the extension popup!
        </div>
      `;
    }
  });
}

// Display initial quote
displayRandomQuote();

// Keyboard shortcut for new quote
document.addEventListener('keydown', (e) => {
  if (e.code === 'Space') {
    document.getElementById('newQuote')?.click();
  }
});
