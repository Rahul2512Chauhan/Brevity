// api/translator.js
// Detects the source language and then translates to the requested target language

export async function translateText(text, targetLanguage = "en") {
  if (!text) return "No text provided.";

  // --- 1. Detect source language ---
  let sourceLanguage = "auto";
  try {
    const detector = await LanguageDetector.create();
    const results = await detector.detect(text);

    if (results && results.length > 0) {
      sourceLanguage = results[0].detectedLanguage;
      console.log(
        `Detected language: ${sourceLanguage} (confidence: ${results[0].confidence})`
      );
    }
  } catch (err) {
    console.warn("Language detection failed, falling back to auto:", err);
  }

  // --- 2. Ensure user activation ---
  if (!navigator.userActivation.isActive) {
    return "Please click a button to start translation.";
  }

  // --- 3. Create translator ---
  try {
    const translator = await Translator.create({
      sourceLanguage,
      targetLanguage,
      monitor(m) {
        m.addEventListener("downloadprogress", (e) => {
          console.log(
            `Model download progress: ${Math.round(e.loaded * 100)}%`
          );
        });
      }
    });

    // --- 4. Perform translation ---
    const translated = await translator.translate(text);

    translator.destroy(); // cleanup after use
    return translated;
  } catch (err) {
    console.error("Error translating:", err);
    return "Error translating text.";
  }
}
