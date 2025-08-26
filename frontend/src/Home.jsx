import { useState, useEffect } from "react";
import { Send } from "lucide-react";
import API from "./axios";
import toast from "react-hot-toast";

function Home() {
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [language, setLanguage] = useState("");
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const user = localStorage.getItem("user");

  useEffect(() => {
    async function fetchHistory() {
      if (!user) return;
      try {
        const res = await API.get(`/history`);
        setHistory(res.data);
      } catch (err) {
        console.error(err);
        toast.error("Failed to fetch history");
      }
    }
    fetchHistory();
  }, [user]);

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
        { sender: "bot", text: "Error: Could not translate." },
      ]);
      console.log(error);
      toast.error("Could not translate. Please try again.");
    } finally {
      setLoading(false);
      setText("");
    }
  }

  async function handleSave() {
    try {
      if (!user) {
        toast.error("You must be logged in to save conversations.");
        return;
      }
      if (messages.length === 0) {
        toast.error("No messages to save.");
        return;
      }
      const nickname = window.prompt("Enter a nickname for this chat:");
      if (!nickname || nickname.trim() === "") {
        toast.error("Nickname is required.");
        return;
      }

      const res = await API.post("/save", {
        user,
        messages,
        nickname: nickname.trim(),
      });

      setHistory((prev) => [res.data, ...prev]);
      toast.success(`Conversation saved as "${nickname}"`);
    } catch (error) {
      toast.error("Failed to save conversation.");
      console.log(error);
    }
  }

  function handleSelectChat(chat) {
    setSelectedChat(chat._id);
    setMessages(chat.messages);
    setSidebarOpen(false);
  }

  function handleNewChat() {
    setMessages([]);
    setSelectedChat(null);
    toast.success("Started a new chat!");
    setSidebarOpen(false);
  }

  function handleLogout() {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    setMessages([]);
    setHistory([]);
    setSelectedChat(null);
    toast.success("Logged out successfully!");
    window.location.href = "/login";
  }

  return (
    <div className="home-container">
      {/* Sidebar */}
      <aside className={`sidebar ${sidebarOpen ? "active" : ""}`}>
        <div className="sidebar-header">
          <h3 className={`sidebar-title ${sidebarOpen ? "activeMargin" : ""}`}>
            Saved Chats
          </h3>
          <button onClick={handleNewChat} className="new-chat-btn">
            newChat
          </button>
        </div>
        <div className="history-list">
          {history.length === 0 && (
            <p className="empty-history">No saved conversations yet</p>
          )}
          {history.map((chat) => (
            <div
              key={chat._id}
              className={`history-item ${
                selectedChat === chat._id ? "active" : ""
              }`}
              onClick={() => handleSelectChat(chat)}
            >
              {chat.nickname}
            </div>
          ))}
        </div>
        <button onClick={handleLogout} className="logout-btn">
          Logout
        </button>
      </aside>

      {/* Chat container */}
      <div className="chat-container">
        <div className="chat-header">
          <div
            className={`hamburger ${sidebarOpen ? "active" : ""}`}
            onClick={() => setSidebarOpen((prev) => !prev)}
          >
            <span></span>
            <span></span>
            <span></span>
          </div>
          <span>Translation Bot</span>
          <button onClick={handleSave} className="save-btn">
            Save
          </button>
        </div>

        <div className="chat-box">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`chat-bubble ${
                msg.sender === "user" ? "user" : "bot"
              }`}
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
            className="input-1"
            required
          />
          <input
            type="text"
            placeholder="Language e.g. French"
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="input-2"
          />
          <button type="submit" disabled={loading}>
            <Send />
          </button>
        </form>
      </div>
    </div>
  );
}

export default Home;
