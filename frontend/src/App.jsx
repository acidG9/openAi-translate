import { useState } from "react";
import { Send } from "lucide-react";
import API from "./axios";

function App() {
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [language, setLanguage] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSend(e) {
    e.preventDefault();

    setMessages((prev) => [...prev, { sender: "user", text }]);

    try {
      setLoading(true);
      const res = await API.post("/translate", { text, language });
      const translated = res.data.translatedText;

      setMessages((prev) => [...prev, { sender: "bot", text: translated }]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        { sender: "bot", text: " Error: Could not translate." },
      ]);
      console.error(error);
    } finally {
      setLoading(false);
      setText("");
    }
  }

  return (
    <div className="chat-container">
      <div className="chat-header">Translation Bot</div>

      <div className="chat-box">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`chat-bubble ${msg.sender === "user" ? "user" : "bot"}`}
          >
            {msg.text}
          </div>
        ))}
        {loading && <div className="chat-bubble bot">Translating...</div>}
      </div>

      <form className="chat-input" onSubmit={handleSend}>
        <input
          type="text"
          placeholder="Type something..."
          value={text}
          onChange={(e) => setText(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Language like french"
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
        />
        <button type="submit" disabled={loading}>
          <Send />
        </button>
      </form>
    </div>
  );
}

export default App;
