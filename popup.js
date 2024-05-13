document.addEventListener('DOMContentLoaded', () => {
  const toggleButton = document.getElementById('toggleButton');

  chrome.storage.local.get('isActive', ({ isActive }) => {
    toggleButton.textContent = isActive ? 'Turn OFF' : 'Turn ON';
  });

  toggleButton.addEventListener('click', () => {
    chrome.storage.local.get('isActive', ({ isActive }) => {
      const newStatus = !isActive;
      chrome.storage.local.set({ isActive: newStatus });
      toggleButton.textContent = newStatus ? 'Turn OFF' : 'Turn ON';

      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        const tabId = tabs[0].id;

        if (newStatus) {
          chrome.scripting.executeScript({
            target: { tabId: tabId },
            files: ['content.js']
          });
        } else {
          chrome.scripting.executeScript({
            target: { tabId: tabId },
            func: () => {
              window.location.reload();
            }
          });
        }
      });
    });
  });
});
