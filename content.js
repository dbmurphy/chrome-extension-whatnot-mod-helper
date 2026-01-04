// Whatnot Buyers Extractor - Content Script
// Extracts buyers from the activity feed (users who won auctions)

(function() {
  'use strict';

  // Function to extract buyers from the page
  function extractBuyers() {
    const buyers = new Set();
    
    // Method 1: Look for activity items in the Activity tab that contain "won the auction"
    // The username appears in a div with classes containing bg-neutrals-opaque-200 and text-neutrals-opaque-1000
    const activityItems = document.querySelectorAll('[data-testid="virtuoso-item-list"] [data-index]');
    
    activityItems.forEach(item => {
      // Look for all strong elements in this item
      const strongElements = item.querySelectorAll('strong');
      
      strongElements.forEach(strong => {
        const text = strong.textContent || strong.innerText;
        
        // Check if this is a "won the auction" item
        if (text.includes('won the auction')) {
          // Find the username div - it's a div with bg-neutrals-opaque-200 class containing @username
          const usernameDiv = strong.querySelector('div[class*="bg-neutrals-opaque-200"]');
          
          if (usernameDiv) {
            const usernameText = usernameDiv.textContent || usernameDiv.innerText;
            // Extract username (remove @ symbol and trim)
            const username = usernameText.replace('@', '').trim();
            
            if (username && username.length > 0) {
              buyers.add(username);
            }
          }
        }
      });
    });
    
    // Method 2: Look for all divs with the buyer badge pattern in activity items
    // Pattern: div with bg-neutrals-opaque-200 and text-neutrals-opaque-1000 classes
    const buyerDivs = document.querySelectorAll('[data-testid="virtuoso-item-list"] div[class*="bg-neutrals-opaque-200"][class*="text-neutrals-opaque-1000"]');
    
    buyerDivs.forEach(div => {
      const text = div.textContent || div.innerText;
      // Match @username pattern
      const match = text.match(/@([a-zA-Z0-9_]+)/);
      if (match && match[1]) {
        // Verify this is in an activity item context (not just any div)
        const parentItem = div.closest('[data-index]');
        if (parentItem) {
          buyers.add(match[1]);
        }
      }
    });
    
    return Array.from(buyers).sort();
  }
  
  // Function to get buyers and send to popup
  function getBuyers() {
    const buyers = extractBuyers();
    return buyers;
  }
  
  // Listen for messages from popup
  chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'extractBuyers') {
      const buyers = getBuyers();
      sendResponse({ buyers: buyers, count: buyers.length });
    }
    return true; // Keep message channel open for async response
  });
  
  // Also store buyers in storage for persistence
  function updateBuyers() {
    const buyers = extractBuyers();
    chrome.storage.local.set({ buyers: buyers, lastUpdated: Date.now() });
  }
  
  // Update buyers when page changes (using MutationObserver)
  const observer = new MutationObserver(() => {
    updateBuyers();
  });
  
  // Start observing when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      observer.observe(document.body, {
        childList: true,
        subtree: true
      });
      updateBuyers();
    });
  } else {
    observer.observe(document.body, {
      childList: true,
      subtree: true
    });
    updateBuyers();
  }
  
})();
