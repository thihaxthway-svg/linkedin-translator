export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { input } = req.body;

  if (!input || typeof input !== "string" || input.length > 300) {
    return res.status(400).json({ error: "Invalid input" });
  }

  try {
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.ANTHROPIC_API_KEY,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-20250514",
        max_tokens: 1024,
        messages: [
          {
            role: "user",
            content: `You are a LinkedIn Post Translator. Take the following honest, blunt statement and rewrite it as an over-the-top, cringe-worthy LinkedIn post. Include:
- Rocket emoji and other emojis
- Buzzwords like "thrilled", "excited to announce", "new chapter", "journey", "pivot", "growth mindset", "grateful"
- Humble bragging
- Turning negatives into "learning opportunities"
- Corporate jargon and toxic positivity
- A motivational closing line
- Relevant hashtags at the end
- Keep it to 1-3 short paragraphs, like a real LinkedIn post

The honest truth: "${input}"

Write ONLY the LinkedIn post, nothing else.`,
          },
        ],
      }),
    });

    const data = await response.json();

    if (data.error) {
      return res.status(500).json({ error: data.error.message });
    }

    const translation = data.content
      ?.filter((block) => block.type === "text")
      .map((block) => block.text)
      .join("\n");

    return res.status(200).json({ translation });
  } catch (err) {
    return res.status(500).json({ error: "Failed to reach Anthropic API" });
  }
}
