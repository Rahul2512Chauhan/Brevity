chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: "summarize-text",
    title: "Summarize Text",
    contexts: ["selection"]
  });
});

// background.js
chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === "summarize-text") {
    const selectedText = info.selectionText;
    chrome.storage.local.set({ selectedText });

    // Open sidebar.html as a popup window
    chrome.windows.create({
      url: chrome.runtime.getURL("sidebar.html"),
      type: "popup",
      width: 400,
      height: 600
    });
  }
});

