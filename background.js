chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.sync.get({ quotes: [] }, (data) => {
    if (data.quotes.length === 0) {
      const defaultQuotes = [
        "The only way to do great work is to love what you do. - Steve Jobs",
        "Life is what happens to you while you're busy making other plans. - John Lennon",
        "The future belongs to those who believe in the beauty of their dreams. - Eleanor Roosevelt"
      ];
      chrome.storage.sync.set({ quotes: defaultQuotes });
    }
  });
});

