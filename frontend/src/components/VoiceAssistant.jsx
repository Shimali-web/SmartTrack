import React, { useState, useEffect, useRef } from "react";
import ReactMarkdown from "react-markdown";
import { auth } from "../firebase";
import "./VoiceAssistant.css";

const API_BASE = `${import.meta.env.VITE_API_URL || "http://localhost:4000"}/api`;

function VoiceAssistant() {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [messages, setMessages] = useState([
    { role: "assistant", content: "Hello! I am your SmartTrack AI Assistant. How can I help you with your studies today? 🎓" }
  ]);
  const [input, setInput] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
    const handleStatus = () => setIsOnline(navigator.onLine);
    window.addEventListener("online", handleStatus);
    window.addEventListener("offline", handleStatus);
    return () => {
      window.removeEventListener("online", handleStatus);
      window.removeEventListener("offline", handleStatus);
    };
  }, []);
  const chatEndRef = useRef(null);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  // --- Voice Output (Speech Synthesis) ---
  const speak = (text) => {
    window.speechSynthesis.cancel(); // Stop any current speech before starting new one
    
    // Remove markdown symbols and extra whitespace for cleaner speech
    const cleanText = text.replace(/[#*`_]/g, "").replace(/\n+/g, " ").trim();
    if (!cleanText) return;

    const speech = new SpeechSynthesisUtterance(cleanText);
    speech.rate = 1;
    speech.pitch = 1;
    speech.volume = 1;
    
    // Safety: ensure it stops eventually
    speech.onend = () => {
      console.log("Speech finished");
    };

    window.speechSynthesis.speak(speech);
  };

  // Cleanup speech on unmount
  useEffect(() => {
    return () => {
      window.speechSynthesis.cancel();
    };
  }, []);

  // --- Voice Input (Speech Recognition) ---
  const startListening = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Your browser does not support Speech Recognition. Please use Chrome.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = "en-US";
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => {
      setIsListening(true);
      window.speechSynthesis.cancel(); // Stop any current speaking
    };

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      sendMessage(transcript);
    };

    recognition.onerror = (event) => {
      console.error("Speech Recognition Error:", event.error);
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.start();
  };

  const sendMessage = async (text) => {
    const messageText = text || input;
    if (!messageText.trim()) return;

    const userMessage = { role: "user", content: messageText };
    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setIsTyping(true);

    try {
      const res = await fetch(`${API_BASE}/ai/chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${auth.currentUser?._token || ""}`
        },
        body: JSON.stringify({ message: messageText })
      });

      if (!res.ok) throw new Error("Failed to fetch response");
      
      const data = await res.json();
      const botMessage = { role: "assistant", content: data.reply };
      
      setMessages(prev => [...prev, botMessage]);
      speak(data.reply);
    } catch (error) {
      console.error(error);
      setMessages(prev => [...prev, { role: "assistant", content: "Sorry, I'm having trouble connecting right now. 🛑" }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="assistant-container" style={{ background: "var(--primary-bg)", color: "var(--text-color)" }}>
      <div className="chat-window shadow-lg" style={{ borderRadius: 24, overflow: "hidden", background: "var(--card-bg)" }}>
        <div className="chat-header" style={{ background: "var(--header-gradient)", padding: "20px" }}>
          <div className="d-flex align-items-center justify-content-between w-100">
            <div className="d-flex align-items-center gap-3">
              <div className="bot-avatar bg-white bg-opacity-25 p-2 rounded-circle" style={{ width: 45, height: 45, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.5rem" }}>🤖</div>
              <div>
                <h5 className="mb-0 text-white fw-bold">SmartTrack AI</h5>
                <span className="status-badge" style={{ 
                  fontSize: "0.75rem", 
                  background: isOnline ? "#10b981" : "#ef4444",
                  padding: "2px 8px",
                  borderRadius: "10px",
                  fontWeight: "600",
                  display: "inline-block",
                  marginTop: "2px",
                  color: "#fff"
                }}>
                  {isOnline ? "Online" : "Offline"}
                </span>
              </div>
            </div>
            <button 
              className="btn btn-sm border-0 text-white rounded-pill px-3"
              style={{ background: "rgba(255, 255, 255, 0.2)", backdropFilter: "blur(4px)" }}
              onClick={() => window.speechSynthesis.cancel()}
              title="Stop Speaking"
            >
              <i className="bi bi-volume-mute-fill me-1"></i> Stop
            </button>
          </div>
        </div>

        <div className="chat-messages">
          {messages.map((msg, idx) => (
            <div key={idx} className={`message-wrapper ${msg.role}`}>
              <div className="message-bubble">
                <ReactMarkdown>{msg.content}</ReactMarkdown>
              </div>
            </div>
          ))}
          {isTyping && (
            <div className="message-wrapper assistant">
              <div className="message-bubble typing">
                <span></span><span></span><span></span>
              </div>
            </div>
          )}
          <div ref={chatEndRef} />
        </div>

        <div className="chat-input-area">
          <div className="input-group gap-2">
            <input 
              type="text" 
              className="form-control rounded-pill border-0 px-4" 
              style={{ background: "var(--primary-bg)", color: "var(--text-color)" }}
              placeholder="Ask me anything..." 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
            />
            <button 
              className={`btn-mic ${isListening ? 'listening' : ''}`} 
              onClick={startListening}
              title="Speak"
            >
              <i className={`bi ${isListening ? 'bi-mic-fill' : 'bi-mic'}`}></i>
              {isListening && <div className="pulse-ring"></div>}
            </button>
            <button className="btn-send" onClick={() => sendMessage()}>
              <i className="bi bi-send-fill"></i>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default VoiceAssistant;
