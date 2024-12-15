chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "openExtensionsPage") {
    chrome.tabs.update({ url: `chrome://extensions/?id=${chrome.runtime.id}` });
  }
});
