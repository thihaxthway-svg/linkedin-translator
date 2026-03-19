const rateLimitMap = new Map();

function isRateLimited(ip) {
  const now = Date.now();
  const windowMs = 60000;
  const maxRequests = 3;

  const userData = rateLimitMap.get(ip) || [];
  const recent = userData.filter((t) => now - t < windowMs);

  if (recent.length >= maxRequests) {
    return true;
  }

  recent.push(now);
  rateLimitMap.set(ip, recent);

  if (rateLimitMap.size > 10000) {
    const oldest = [...rateLimitMap.entries()].sort(
      (a, b) => a[1][a[1].length - 1] - b[1][b[1].length - 1]
    );
    oldest.slice(0, 5000).forEach(([key]) => rateLimitMap.delete(key));
  }

  return false;
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const ip =
    req.headers["x-forwarded-for"]?.split(",")[0]?.trim() ||
    req.headers["x-real-ip"] ||
    "unknown";

  if (isRateLimited(ip)) {
    return res.status(429).json({
      error: "Whoa there, thought leader! Wait a minute before translating again.",
    });
  }

  const { input } = req.body;

  if (!input || typeof input !== "string" || input.length > 300) {
    return res.status(400).json({ error: "Invalid input" });
  }

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: `You are a LinkedIn Post Translator. Take the following honest, blunt statement and rewrite it as an over-the-top, cringe-worthy LinkedIn post. Include:
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
            },
          ],
        }),
      }
    );

    const data = await response.json();

    if (data.error) {
      return res.status(500).json({ error: data.error.message });
    }

    const translation =
      data.candidates?.[0]?.content?.parts?.[0]?.text ||
      "Even AI couldn't LinkedIn-ify this one.";

    return res.status(200).json({ translation });
  } catch (err) {
    return res.status(500).json({ error: "Failed to reach Gemini API" });
  }
}
