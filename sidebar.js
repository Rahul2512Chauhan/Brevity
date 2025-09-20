import { summarizeText } from './api/summarizer.js';

const outputDiv = document.getElementById("output");
let currentType = "key-points"; // default summary type

// Only summarize after user clicks "start-btn"
document.getElementById("start-btn").addEventListener("click", () => {
  summarizeSelectedText();
});

// Toggle buttons
document.getElementById("keypoints-btn").addEventListener("click", () => {
  currentType = "key-points";
  summarizeSelectedText();
});

document.getElementById("tldr-btn").addEventListener("click", () => {
  currentType = "tldr";
  summarizeSelectedText();
});

async function summarizeSelectedText() {
  outputDiv.innerText = "Initializing summarizer...";

  // Get selected text from storage
  chrome.storage.local.get("selectedText", async (data) => {
    const text = data.selectedText || "";
    if (!text) {
      outputDiv.innerText = "No text selected.";
      return;
    }

    outputDiv.innerText = "Summarizing...";

    const summary = await summarizeText(text, currentType, "medium");
    outputDiv.innerText = summary;
  });
}
