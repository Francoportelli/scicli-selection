// api/chat.js — backend Vercel Function
// La chiave Anthropic è segreta, non esposta al client

export default async function handler(req, res) {
  // CORS: permetti richieste dal tuo dominio
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Metodo non consentito" });
  }

  const { messages, productId, productName, productInfo, brandInfo } = req.body;

  if (!messages || !productId) {
    return res.status(400).json({ error: "Dati mancanti" });
  }

  // Limite semplice: max 20 messaggi per sessione
  if (messages.length > 20) {
    return res.status(429).json({ error: "Troppi messaggi in questa sessione." });
  }

  const systemPrompt = `${brandInfo}

INFORMAZIONI SPECIFICHE SU DI ME (${productName}):
${productInfo}

Rispondo in prima persona, con tono elegante e premium. Risposta concisa ma ricca di valore sensoriale e gastronomico.`;

  try {
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.ANTHROPIC_API_KEY, // Chiave sicura sul server
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-haiku-4-5-20251001", // Haiku: più economico per produzione
        max_tokens: 600,
        system: systemPrompt,
        messages: messages,
      }),
    });

    if (!response.ok) {
      const err = await response.json();
      console.error("Anthropic error:", err);
      return res.status(500).json({ error: "Errore AI" });
    }

    const data = await response.json();
    const text = data.content?.[0]?.text ?? "Non riesco a rispondere in questo momento.";

    return res.status(200).json({ reply: text });
  } catch (error) {
    console.error("Server error:", error);
    return res.status(500).json({ error: "Errore del server" });
  }
}
