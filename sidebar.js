import { summarizeText } from './api/summarizer.js';
import { makeKidFriendly, makeExpertLevel } from './api/rewriter.js';
import { translateText } from "./api/translator.js"
const outputDiv = document.getElementById("output");
const selectedTextDiv = document.getElementById("selected-text");

let currentType = "key-points"; // default summary type

document.addEventListener("DOMContentLoaded", () => {
  console.log("Sidebar loaded");

  // --- 1. Detect action from URL ---
  const urlParams = new URLSearchParams(window.location.search);
  const action = urlParams.get("action");
  console.log("Action from URL:", action);

  const summarizeSection = document.getElementById("summarize-section");
  const simplifySection = document.getElementById("simplify-section");
  const translateSection = document.getElementById("translate-section");
  if (action === "simplify") {
    summarizeSection.classList.add("hidden");
    simplifySection.classList.remove("hidden");
    translateSection?.classList.add("hidden");
    outputDiv.innerText = "Choose a reading level to simplify your text";
  } else if (action === "translate") {
    summarizeSection.classList.add("hidden");
    simplifySection.classList.add("hidden");
    translateSection?.classList.remove("hidden");
    outputDiv.innerText = "Ready to translate your selected text";
  } else {
    summarizeSection.classList.remove("hidden");
    simplifySection.classList.add("hidden");
    translateSection?.classList.add("hidden");
    outputDiv.innerText = "Ready to summarize your selected text";
  }

  // --- 2. Load selected text ---
  chrome.storage.local.get("selectedText", ({ selectedText }) => {
    if (selectedText) {
      selectedTextDiv.textContent = selectedText;
    } else {
      selectedTextDiv.textContent = "No text selected.";
    }
  });

  // --- 3. Summarizer logic ---
  if (action === "summarize") {
    document.getElementById("start-btn").addEventListener("click", () => {
      summarizeSelectedText();
    });

    document.getElementById("keypoints-btn").addEventListener("click", () => {
      currentType = "key-points";
      summarizeSelectedText();
    });

    document.getElementById("tldr-btn").addEventListener("click", () => {
      currentType = "tldr";
      summarizeSelectedText();
    });
  }

  // --- 4. Simplifier logic ---
  if (action === "simplify") {
    document.getElementById("kid-level-btn").addEventListener("click", async () => {
      await simplifyText("kid");
    });

    document.getElementById("student-level-btn").addEventListener("click", async () => {
      await simplifyText("student");
    });

    document.getElementById("expert-level-btn").addEventListener("click", async () => {
      await simplifyText("expert");
    });

    // Example extra button you had
    const testBtn = document.getElementById("test-rewriter-btn");
    if (testBtn) {
      testBtn.addEventListener("click", async () => {
        await testRewriter();
      });
    }
  }

  if (action === "translate") {
    document.getElementById("translate-btn").addEventListener("click", async () => {
      outputDiv.textContent = "Translating...";

      chrome.storage.local.get("selectedText", async ({ selectedText }) => {
        if (!selectedText) {
          outputDiv.textContent = "No text selected.";
          return;
        }

        const targetLang = document.getElementById("target-lang").value;

        const result = await translateText(selectedText, targetLang);
        outputDiv.textContent = result;
      });
    });
  }

});




// ---------------- Helper Functions ----------------

async function summarizeSelectedText() {
  outputDiv.innerText = "Initializing summarizer...";

  chrome.storage.local.get("selectedText", async (data) => {
    const text = data.selectedText || "";
    if (!text) {
      outputDiv.innerText = "No text selected.";
      return;
    }

    outputDiv.innerText = "Summarizing...";

    try {
      const summary = await summarizeText(text, currentType, "medium");
      outputDiv.innerText = summary;
    } catch (err) {
      outputDiv.innerText = "Error while summarizing: " + err.message;
    }
  });
}

async function simplifyText(level) {
  outputDiv.innerText = `Simplifying for ${level} level...`;

  chrome.storage.local.get("selectedText", async (data) => {
    const text = data.selectedText || "";
    if (!text) {
      outputDiv.innerText = "No text selected.";
      return;
    }

    try {
      let result;
      if (level === "kid") {
        result = await makeKidFriendly(text);
      } else if (level === "expert") {
        result = await makeExpertLevel(text);
      } else {
        // student-level: for now just reuse kid-friendly or expert
        result = await makeKidFriendly(text);
      }
      outputDiv.innerText = result;
    } catch (err) {
      outputDiv.innerText = "Error simplifying: " + err.message;
    }
  });
}

async function testRewriter() {
  console.log("Testing rewriter API");
  outputDiv.textContent = "Testing Rewriter API...";

  chrome.storage.local.get("selectedText", async (data) => {
    const text = data.selectedText || "This is a sample text to test the rewriter API.";
    try {
      // Check if Rewriter API is available
      const availability = await Rewriter.availability();
      outputDiv.textContent = "Rewriter API Status: " + availability;

      if (availability !== "unavailable") {
        const kidResult = await makeKidFriendly(text);
        const expertResult = await makeExpertLevel(text);

        outputDiv.innerHTML = `
          <strong>Original:</strong><br>${text}<br><br>
          <strong>Kid Level:</strong><br>${kidResult}<br><br>
          <strong>Expert Level:</strong><br>${expertResult}
        `;
      }
    } catch (error) {
      outputDiv.textContent = "Rewriter API Error: " + error.message;
      console.error("Rewriter API error:", error);
    }
  });
}
