export async function summarizeText(text, type = "short") {
    // Call Chrome Built-in Summarizer API
    const response = await chrome.ai.summarizer.summarize({
        text: text,
        summaryType: type
    });
    return response.summary
}