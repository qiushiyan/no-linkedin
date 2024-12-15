(async () => {
  // Stop any further page loading

  try {
    const chrome_url = chrome.runtime.getURL("template.html");
    const response = await fetch(chrome_url);
    const html = await response.text();

    // Create a new HTML document
    const doc = new DOMParser().parseFromString(html, "text/html");
    // Replace the entire document
    document.replaceChild(
      document.importNode(doc.documentElement, true),
      document.documentElement
    );

    document.querySelector(".disable-button")?.addEventListener("click", () => {
      chrome.runtime.sendMessage({ action: "openExtensionsPage" });
    });
  } catch (error) {
    console.error("Failed to load template:", error);
  }
})();
