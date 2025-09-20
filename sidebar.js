import { summarizeText } from './api/summarizer.js';

const btn = document.getElementById("summarizeBtn");
const input = document.getElementById("inputText");
const output = document.getElementById("output");

btn.addEventListener("click", async () => {
  const text = input.value.trim();
  if (!text) return alert("Please enter or select some text!");
  
  output.innerText = "Summarizing...";
  const summary = await summarizeText(text, "short");
  output.innerText = summary;
});
