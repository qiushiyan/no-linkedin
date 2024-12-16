// content.js
(async () => {
  // Cache the template HTML so we don't need to fetch it multiple times
  let templateHtml = "";
  try {
    const chrome_url = chrome.runtime.getURL("template.html");
    const response = await fetch(chrome_url);
    templateHtml = await response.text();
  } catch (error) {
    console.error("Failed to load template:", error);
    return;
  }

  // Function to replace the feed with our template
  const injectTemplate = () => {
    const feed = document.querySelector('[aria-label="Main Feed"]');
    if (!feed) return;

    const doc = new DOMParser().parseFromString(templateHtml, "text/html");
    feed.replaceWith(document.importNode(doc.documentElement, true));

    // Add click handler for disable button
    document.querySelector(".disable-button")?.addEventListener("click", () => {
      chrome.runtime.sendMessage({ action: "openExtensionsPage" });
    });
  };

  // Try replacing immediately
  injectTemplate();

  // Watch for DOM changes to catch delayed feed loading
  const observer = new MutationObserver(() => {
    if (
      window.location.pathname === "/" ||
      window.location.pathname.startsWith("/feed")
    ) {
      injectTemplate();
    }
  });

  observer.observe(document.documentElement, {
    childList: true,
    subtree: true,
  });

  // Watch for URL changes
  let lastUrl = window.location.href;
  new MutationObserver(() => {
    const currentUrl = window.location.href;
    if (currentUrl !== lastUrl) {
      lastUrl = currentUrl;
      if (
        window.location.pathname === "/" ||
        window.location.pathname.startsWith("/feed")
      ) {
        injectTemplate();
      }
    }
  }).observe(document.documentElement, {
    subtree: true,
    childList: true,
  });

  // Also watch for popstate events (back/forward navigation)
  window.addEventListener("popstate", () => {
    if (
      window.location.pathname === "/" ||
      window.location.pathname.startsWith("/feed")
    ) {
      injectTemplate();
    }
  });

  // Clean up observers when the page unloads
  window.addEventListener("unload", () => {
    observer.disconnect();
  });
})();
