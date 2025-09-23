// api/rewriter.js - Simplified Rewriter API
export async function rewriteText(text, level = "student") {
  // Check if Rewriter API is available
  const availability = await Rewriter.availability();
  if (availability === "unavailable") {
    console.warn("Rewriter API is unavailable.");
    return "Rewriter API is unavailable in this browser.";
  }

  // User activation check
  if (!navigator.userActivation.isActive) {
    console.warn("User activation required to create Rewriter.");
    return "Please click somewhere on the page first.";
  }

  // Configure options based on reading level
  const levelOptions = {
    kid: {
      tone: "more-casual",
      length: "shorter",
      sharedContext: "Rewrite this text using simple words that children can understand. Use short sentences and avoid complex terms."
    },
    student: {
      tone: "as-is", 
      length: "as-is",
      sharedContext: "Rewrite this text for students using clear, educational language that is easy to follow."
    },
    expert: {
      tone: "more-formal",
      length: "longer", 
      sharedContext: "Rewrite this text for experts using technical terminology and detailed explanations."
    }
  };

  const options = levelOptions[level] || levelOptions.student;

  // Create rewriter
  const rewriter = await Rewriter.create({
    ...options,
    format: "plain-text",
    monitor(m) {
      m.addEventListener("downloadprogress", (e) => {
        console.log(`Rewriter model download: ${Math.round((e.loaded / e.total) * 100)}%`);
      });
    }
  });

  try {
    // Rewrite the text
    const result = await rewriter.rewrite(text);
    return result;
  } catch (err) {
    console.error("Error rewriting text:", err);
    return "Error rewriting text.";
  }
}

// Convenience functions
export async function makeKidFriendly(text) {
  return await rewriteText(text, "kid");
}

export async function makeStudentLevel(text) {
  return await rewriteText(text, "student");
}

export async function makeExpertLevel(text) {
  return await rewriteText(text, "expert");
}

// Simple tone adjustments
export async function makeFormal(text) {
  const availability = await Rewriter.availability();
  if (availability === "unavailable") return "Rewriter API unavailable";

  const rewriter = await Rewriter.create({
    tone: "more-formal",
    length: "as-is", 
    format: "plain-text",
    sharedContext: "Make this text more formal and professional."
  });

  try {
    return await rewriter.rewrite(text);
  } catch (err) {
    return "Error making text formal.";
  }
}

export async function makeCasual(text) {
  const availability = await Rewriter.availability();
  if (availability === "unavailable") return "Rewriter API unavailable";

  const rewriter = await Rewriter.create({
    tone: "more-casual",
    length: "as-is",
    format: "plain-text", 
    sharedContext: "Make this text more casual and friendly."
  });

  try {
    return await rewriter.rewrite(text);
  } catch (err) {
    return "Error making text casual.";
  }
}
