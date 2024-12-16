chrome.runtime.onMessage.addListener((message) => {
  if (message.action === "openExtensionsPage") {
    chrome.tabs.update({ url: `chrome://extensions/?id=${chrome.runtime.id}` });
  }
});
