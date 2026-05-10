import Groq from "groq-sdk";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

const MODEL = "llama-3.3-70b-versatile";

const SYSTEM_PROMPT = `You are a professional B2B content writer specialising in marketing, demand generation, and technology.

STRICT OUTPUT RULES:
- Respond with ONLY the blog body content using proper HTML tags.
- Use <h2> for section headings, <p> for paragraphs, <ul>/<li> for bullet lists, <strong> for emphasis.
- Do NOT include <html>, <head>, <body>, <!DOCTYPE>, or any wrapper tags.
- Do NOT use markdown, code fences, or backticks.
- Start directly with the first <p> or <h2> — no preamble, no "Here is your blog:" intro.
- Keep paragraphs concise (2–4 sentences).`;

/**
 * Generate a blog post with rich context options.
 *
 * @param {object} options
 * @param {string} options.topic        - Blog topic / title
 * @param {string} [options.tone]       - e.g. "professional", "conversational", "authoritative"
 * @param {string} [options.length]     - "short" (~400w), "medium" (~800w), "long" (~1500w)
 * @param {string} [options.audience]   - Target audience description
 * @param {string} [options.style]      - Writing style inspiration, e.g. "Neil Patel", "HBR"
 * @param {string} [options.keywords]   - Comma-separated keywords to include
 * @param {string} [options.extraContext] - Any additional instructions
 * @returns {Promise<string>} HTML content
 */
export async function generateBlog({
  topic,
  tone = "professional",
  length = "medium",
  audience = "B2B marketing professionals",
  style = "",
  keywords = "",
  extraContext = "",
}) {
  const wordTargets = { short: "350–500", medium: "700–900", long: "1300–1600" };
  const wordTarget = wordTargets[length] || wordTargets.medium;

  const userPrompt = [
    `Write a blog post about: "${topic}"`,
    `Target audience: ${audience}`,
    `Tone: ${tone}`,
    `Length: approximately ${wordTarget} words`,
    style ? `Writing style inspired by: ${style}` : "",
    keywords ? `Naturally include these keywords: ${keywords}` : "",
    extraContext ? `Additional instructions: ${extraContext}` : "",
    `Structure: engaging intro paragraph, 3–4 <h2> sections with supporting paragraphs, and a strong conclusion.`,
  ].filter(Boolean).join("\n");

  try {
    const completion = await groq.chat.completions.create({
      model: MODEL,
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: userPrompt },
      ],
      temperature: 0.72,
      max_tokens: length === "long" ? 3000 : length === "short" ? 1200 : 2048,
    });
    return completion.choices[0]?.message?.content ?? "";
  } catch (error) {
    console.error("[Groq generateBlog Error]:", error.message);
    throw error;
  }
}

/**
 * Refine an existing blog based on user feedback.
 *
 * @param {string} currentContent  - Existing HTML blog content
 * @param {string} instruction     - What the user wants changed
 * @returns {Promise<string>} Updated HTML content
 */
export async function refineBlog(currentContent, instruction) {
  const userPrompt = `Here is the current blog content (HTML):

${currentContent}

The user wants the following changes:
"${instruction}"

Apply the requested changes and return the COMPLETE updated blog in HTML format.
Keep all sections that were not mentioned in the changes.
Do not add any commentary — return only the updated HTML blog body.`;

  try {
    const completion = await groq.chat.completions.create({
      model: MODEL,
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: userPrompt },
      ],
      temperature: 0.65,
      max_tokens: 3000,
    });
    return completion.choices[0]?.message?.content ?? "";
  } catch (error) {
    console.error("[Groq refineBlog Error]:", error.message);
    throw error;
  }
}

// Keep default export for backward compatibility
export default generateBlog;
