// Function to display all saved quotes
function displayQuotes() {
  chrome.storage.sync.get({ quotes: [] }, (data) => {
    const quoteList = document.getElementById('quoteList');
    quoteList.innerHTML = '';
    
    if (data.quotes.length === 0) {
      quoteList.innerHTML = '<div class="no-quotes">No quotes added yet</div>';
      return;
    }

    data.quotes.forEach((quote, index) => {
      const quoteItem = document.createElement('div');
      quoteItem.className = 'quote-item';
      quoteItem.innerHTML = `
        <div class="quote-text">${quote}</div>
        <div class="quote-actions">
          <button class="edit-btn" data-index="${index}">Edit</button>
          <button class="delete-btn" data-index="${index}">Delete</button>
        </div>
      `;
      quoteList.appendChild(quoteItem);
    });

    // Add event listeners to edit and delete buttons
    document.querySelectorAll('.edit-btn').forEach(btn => {
      btn.addEventListener('click', handleEdit);
    });
    
    document.querySelectorAll('.delete-btn').forEach(btn => {
      btn.addEventListener('click', handleDelete);
    });
  });
}

// Function to handle quote editing
function handleEdit(event) {
  const index = parseInt(event.target.dataset.index);
  const quoteItem = event.target.closest('.quote-item');
  const quoteText = quoteItem.querySelector('.quote-text').textContent;
  
  // Transform the quote item into edit mode
  quoteItem.className = 'quote-item edit-mode';
  quoteItem.innerHTML = `
    <textarea class="edit-textarea" placeholder="Edit your quote...">${quoteText}</textarea>
    <div class="quote-actions">
      <button class="save-btn" data-index="${index}">Save</button>
      <button class="cancel-btn">Cancel</button>
    </div>
  `;

  // Focus the textarea
  const textarea = quoteItem.querySelector('.edit-textarea');
  textarea.focus();
  textarea.setSelectionRange(textarea.value.length, textarea.value.length);

  // Add event listeners for save and cancel
  quoteItem.querySelector('.save-btn').addEventListener('click', handleSave);
  quoteItem.querySelector('.cancel-btn').addEventListener('click', () => displayQuotes());
}

// Function to handle quote saving
function handleSave(event) {
  const index = parseInt(event.target.dataset.index);
  const newText = event.target.closest('.quote-item').querySelector('.edit-textarea').value.trim();
  
  if (newText) {
    chrome.storage.sync.get({ quotes: [] }, (data) => {
      const quotes = data.quotes;
      quotes[index] = newText;
      chrome.storage.sync.set({ quotes }, () => {
        displayQuotes();
      });
    });
  }
}

// Function to handle quote deletion
function handleDelete(event) {
  const index = parseInt(event.target.dataset.index);
  const quoteItem = event.target.closest('.quote-item');
  
  // Add fade-out animation
  quoteItem.style.transition = 'opacity 0.3s ease-out';
  quoteItem.style.opacity = '0';
  
  setTimeout(() => {
    chrome.storage.sync.get({ quotes: [] }, (data) => {
      const quotes = data.quotes;
      quotes.splice(index, 1);
      chrome.storage.sync.set({ quotes }, () => {
        displayQuotes();
      });
    });
  }, 300);
}

// Add quote event listener
document.getElementById('addQuote').addEventListener('click', () => {
  const quoteInput = document.getElementById('quoteInput');
  const quote = quoteInput.value.trim();
  
  if (quote) {
    chrome.storage.sync.get({ quotes: [] }, (data) => {
      const quotes = data.quotes;
      quotes.push(quote);
      chrome.storage.sync.set({ quotes }, () => {
        // Clear input with a fade effect
        quoteInput.style.transition = 'opacity 0.3s ease-out';
        quoteInput.style.opacity = '0.5';
        setTimeout(() => {
          quoteInput.value = '';
          quoteInput.style.opacity = '1';
          displayQuotes();
        }, 300);
      });
    });
  }
});

// Add enter key support for the textarea
document.getElementById('quoteInput').addEventListener('keydown', (e) => {
  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault();
    document.getElementById('addQuote').click();
  }
});

// Display quotes when popup opens
document.addEventListener('DOMContentLoaded', displayQuotes);
