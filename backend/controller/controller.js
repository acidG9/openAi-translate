import OpenAI from "openai";
import dotenv from "dotenv";

dotenv.config();

const client = new OpenAI({
  apiKey: process.env.APIKEY,
});

export const doTranslate = async (req, res) => {
  try {
    const { text, language } = req.body;

    if (!text) {
      return res.status(400).json({ error: "Text is required" });
    }

    const targetLang = language ? language : "English";

    const prompt = `Translate the following text into ${targetLang} and only give translation in response nothing else: """${text}"""`;

    const response = await client.chat.completions.create({
      model: "gpt-4o",
      messages: [{ role: "user", content: prompt }],
    });

    const translatedText =
      response.choices[0]?.message?.content || "No translation available.";

    return res.status(200).json({
      translatedText
    });
  } catch (error) {
    console.error("Translation error:", error);
    return res.status(500).json({ error: "Something went wrong." });
  }
};
