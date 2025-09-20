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
      function: (selectedText) => {
        // Send selected text to sidebar (simplified)
        const sidebar = document.getElementById("output");
        if (sidebar) sidebar.innerText = selectedText;
      },
      args: [info.selectionText]
    });
  }
});
