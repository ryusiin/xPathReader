chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.local.set({ isActive: false });
});

chrome.action.onClicked.addListener((tab) => {
  chrome.storage.local.get('isActive', ({ isActive }) => {
    const newStatus = !isActive;
    chrome.storage.local.set({ isActive: newStatus });

    if (newStatus) {
      chrome.scripting.executeScript({
        target: { tabId: tab.id },
        files: ['content.js']
      });
    } else {
      chrome.scripting.executeScript({
        target: { tabId: tab.id },
        func: () => {
          window.location.reload();
        }
      });
    }
  });
});
