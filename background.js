chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: "summarize-text",
    title: "Summarize Text",
    contexts: ["selection"]
  });

  chrome.contextMenus.create({
    id: "simplify-text",
    title: "Simplify Text",
    contexts: ["selection"]
  });

  chrome.contextMenus.create({
    id: "transle-text",
    title: "Translate Text",
    contexts: ["selection"]
  });
});


chrome.contextMenus.onClicked.addListener((info, tab) => {
  const selectedText = info.selectionText;
  if (!selectedText) return;

  chrome.storage.local.set({ selectedText });

  if (info.menuItemId === "summarize-text") {
    chrome.windows.create({
      url: chrome.runtime.getURL("sidebar.html?action=summarize"),
      type: "popup",
      width: 400,
      height: 600
    });
  }

  if (info.menuItemId === "simplify-text") {
    chrome.windows.create({
      url: chrome.runtime.getURL("sidebar.html?action=simplify"),
      type: "popup",
      width: 400,
      height: 600
    });
  }
  if (info.menuItemId === "transle-text") {
    chrome.windows.create({
      url: chrome.runtime.getURL("sidebar.html?action=translate"),
      type: "popup",
      width: 400,
      height: 600
    });
  }
});
