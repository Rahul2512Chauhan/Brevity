export async function summarizeText(text, type = "key-points", length = "medium") {
  const availability = await Summarizer.availability();
  if (availability === "unavailable") {
    console.warn("Summarizer API is unavailable.");
    return "Summarizer API is unavailable in this browser.";
  }

  if (!navigator.userActivation.isActive) {
    console.warn("User activation required to create Summarizer.");
    return "Please click somewhere on the page first.";
  }

  const summarizer = await Summarizer.create({
    type,        // key-points, tldr, teaser, headline
    length,      // short, medium, long
    format: "markdown",
    language: "en",
    monitor(m) {
      m.addEventListener("downloadprogress", (e) => {
        console.log(`Model download progress: ${Math.round(e.loaded * 100)}%`);
      });
    }
  });

  try {
    const summary = await summarizer.summarize(text, {
      context: "This text is summarized for general reading."
    });
    return summary;
  } catch (err) {
    console.error("Error summarizing text:", err);
    return "Error generating summary.";
  }
}
