chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: "summarize",
    title: "Summarize Text",
    contexts: ["selection"]
  });
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === "summarize") {
    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      function: () => {
        alert("Selected text will be summarized here!");
      }
    });
  }
});
