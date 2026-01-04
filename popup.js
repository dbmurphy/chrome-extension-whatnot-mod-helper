// Popup script for WhatNot Mod Helper Tools Extension

document.addEventListener('DOMContentLoaded', () => {
  // Tab management
  const tabs = document.querySelectorAll('.tab');
  const tabContents = document.querySelectorAll('.tab-content');
  
  // Buyers tab elements
  const extractBtn = document.getElementById('extractBtn');
  const copyBtn = document.getElementById('copyBtn');
  const buyersList = document.getElementById('buyersList');
  const infoDiv = document.getElementById('info');
  const messageTemplate = document.getElementById('messageTemplate');
  const buyersPerMessage = document.getElementById('buyersPerMessage');
  const generateBtn = document.getElementById('generateBtn');
  const copyMessagesBtn = document.getElementById('copyMessagesBtn');
  const messagesOutput = document.getElementById('messagesOutput');
  
  let currentBuyers = [];
  let generatedMessages = [];
  
  // Tab switching functionality
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const targetTab = tab.getAttribute('data-tab');
      
      // Remove active class from all tabs and contents
      tabs.forEach(t => t.classList.remove('active'));
      tabContents.forEach(tc => tc.classList.remove('active'));
      
      // Add active class to clicked tab and corresponding content
      tab.classList.add('active');
      document.getElementById(`${targetTab}-tab`).classList.add('active');
    });
  });
  
  // Show info message
  function showInfo(message, isError = false) {
    infoDiv.textContent = message;
    infoDiv.className = `info ${isError ? 'error' : ''}`;
    infoDiv.style.display = 'block';
    setTimeout(() => {
      infoDiv.style.display = 'none';
    }, 3000);
  }
  
  // Display buyers list
  function displayBuyers(buyers) {
    currentBuyers = buyers;
    
    if (buyers.length === 0) {
      buyersList.innerHTML = '<div class="empty">No buyers found. Make sure you\'re on a Whatnot stream page with activity feed.</div>';
      return;
    }
    
    buyersList.innerHTML = `
      <div class="buyer-item" style="font-weight: 600; color: #6366f1; border-bottom: 2px solid #6366f1; margin-bottom: 4px;">
        Total Buyers: <span class="count">${buyers.length}</span>
      </div>
      ${buyers.map(buyer => `<div class="buyer-item">@${buyer}</div>`).join('')}
    `;
  }
  
  // Extract buyers from current page
  async function extractBuyers() {
    try {
      buyersList.innerHTML = '<div class="loading">Extracting buyers...</div>';
      
      // Get the active tab
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
      
      if (!tab.url || !tab.url.includes('whatnot.com')) {
        showInfo('Please navigate to a Whatnot stream page first.', true);
        buyersList.innerHTML = '<div class="empty">Please navigate to a Whatnot stream page.</div>';
        return;
      }
      
      // Inject and execute the extraction function directly (same logic as console test)
      const results = await chrome.scripting.executeScript({
        target: { tabId: tab.id },
        func: function() {
          const buyers = new Set();
          
          // Method 1: Look for activity items in the Activity tab that contain "won the auction"
          const activityItems = document.querySelectorAll('[data-testid="virtuoso-item-list"] [data-index]');
          
          activityItems.forEach((item) => {
            const strongElements = item.querySelectorAll('strong');
            
            strongElements.forEach(strong => {
              const text = strong.textContent || strong.innerText;
              
              if (text.includes('won the auction')) {
                // Find the username div - it's a div with bg-neutrals-opaque-200 class containing @username
                const usernameDiv = strong.querySelector('div[class*="bg-neutrals-opaque-200"]');
                
                if (usernameDiv) {
                  const usernameText = usernameDiv.textContent || usernameDiv.innerText;
                  const username = usernameText.replace('@', '').trim();
                  
                  if (username && username.length > 0) {
                    buyers.add(username);
                  }
                }
              }
            });
          });
          
          // Method 2: Look for all divs with the buyer badge pattern in activity items
          const buyerDivs = document.querySelectorAll('[data-testid="virtuoso-item-list"] div[class*="bg-neutrals-opaque-200"][class*="text-neutrals-opaque-1000"]');
          
          buyerDivs.forEach(div => {
            const text = div.textContent || div.innerText;
            const match = text.match(/@([a-zA-Z0-9_]+)/);
            if (match && match[1]) {
              const parentItem = div.closest('[data-index]');
              if (parentItem) {
                buyers.add(match[1]);
              }
            }
          });
          
          return Array.from(buyers).sort();
        }
      });
      
      if (results && results[0] && results[0].result) {
        const buyers = results[0].result;
        displayBuyers(buyers);
        showInfo(`Found ${buyers.length} buyers!`);
        
        // Save to storage
        chrome.storage.local.set({ buyers: buyers, lastUpdated: Date.now() });
      } else {
        showInfo('No buyers found. Try scrolling through the activity feed.', true);
        buyersList.innerHTML = '<div class="empty">No buyers found. Try scrolling through the activity feed to load more items.</div>';
      }
      
    } catch (error) {
      console.error('Error:', error);
      showInfo('An error occurred. Please try again.', true);
      buyersList.innerHTML = '<div class="empty">An error occurred. Please try again.</div>';
    }
  }
  
  // Copy buyers list to clipboard
  async function copyBuyers() {
    if (currentBuyers.length === 0) {
      showInfo('No buyers to copy. Extract buyers first.', true);
      return;
    }
    
    try {
      const buyersText = currentBuyers.map(buyer => `@${buyer}`).join('\n');
      await navigator.clipboard.writeText(buyersText);
      showInfo(`Copied ${currentBuyers.length} buyers to clipboard!`);
    } catch (error) {
      console.error('Error copying:', error);
      showInfo('Failed to copy to clipboard.', true);
    }
  }
  
  // Generate messages from template
  function generateMessages() {
    if (currentBuyers.length === 0) {
      showInfo('No buyers to generate messages. Extract buyers first.', true);
      return;
    }
    
    const template = messageTemplate.value.trim();
    if (!template) {
      showInfo('Please enter a message template.', true);
      return;
    }
    
    if (!template.includes('{{Buyers}}')) {
      showInfo('Template must include {{Buyers}} placeholder.', true);
      return;
    }
    
    const perMessage = parseInt(buyersPerMessage.value, 10);
    generatedMessages = [];
    
    // Split buyers into chunks
    for (let i = 0; i < currentBuyers.length; i += perMessage) {
      const chunk = currentBuyers.slice(i, i + perMessage);
      const buyersText = chunk.map(buyer => `@${buyer}`).join(' ');
      const message = template.replace('{{Buyers}}', buyersText);
      generatedMessages.push(message);
    }
    
    // Display generated messages
    messagesOutput.innerHTML = generatedMessages.map((msg, index) => {
      return `
        <div class="message-item">
          <div class="message-header">Message ${index + 1} of ${generatedMessages.length}</div>${msg}</div>
      `;
    }).join('');
    
    messagesOutput.classList.add('visible');
    showInfo(`Generated ${generatedMessages.length} message(s)!`);
  }
  
  // Copy all generated messages to clipboard
  async function copyGeneratedMessages() {
    if (generatedMessages.length === 0) {
      showInfo('No messages generated. Generate messages first.', true);
      return;
    }
    
    try {
      const allMessages = generatedMessages.join('\n\n---\n\n');
      await navigator.clipboard.writeText(allMessages);
      showInfo(`Copied ${generatedMessages.length} message(s) to clipboard!`);
    } catch (error) {
      console.error('Error copying messages:', error);
      showInfo('Failed to copy messages to clipboard.', true);
    }
  }
  
  // Load saved buyers from storage
  chrome.storage.local.get(['buyers'], (result) => {
    if (result.buyers && result.buyers.length > 0) {
      displayBuyers(result.buyers);
    }
  });
  
  // Set default template
  messageTemplate.value = 'Buyers Givvy in 15 minutes... \n\n{{Buyers}}';
  
  // Event listeners
  extractBtn.addEventListener('click', extractBuyers);
  copyBtn.addEventListener('click', copyBuyers);
  generateBtn.addEventListener('click', generateMessages);
  copyMessagesBtn.addEventListener('click', copyGeneratedMessages);
  
  // Auto-extract on popup open
  extractBuyers();
});
