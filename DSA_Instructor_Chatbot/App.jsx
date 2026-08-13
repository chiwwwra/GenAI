import React, { useState } from 'react';

function App() {
  const [messages, setMessages] = useState([
    { role: 'model', text: "Hello! I am your DSA Instructor. Ask me about arrays, trees, graphs, or algorithms." }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = { role: 'user', text: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const response = await fetch('http://localhost:5000/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: input }),
      });

      const data = await response.json();
      
      setMessages((prev) => [...prev, { role: 'model', text: data.text }]);
    } catch (error) {
      console.error("Error communicating with backend:", error);
      setMessages((prev) => [...prev, { role: 'model', text: "❌ Connection Error: Make sure your backend is running on port 5000" }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.chatBox}>
        <div style={styles.header}>
          <h2>📚 DSA Instructor Bot</h2>
          <p>Ask me anything about Data Structures & Algorithms</p>
        </div>
        
        <div style={styles.messageArea}>
          {messages.map((msg, index) => (
            <div 
              key={index} 
              style={{
                ...styles.messageBubble,
                alignSelf: msg.role === 'user' ? 'flex-end' : 'flex-start',
                backgroundColor: msg.role === 'user' ? '#007bff' : '#f1f1f1',
                color: msg.role === 'user' ? '#fff' : '#333',
              }}
            >
              {msg.text}
            </div>
          ))}
          {loading && <div style={{ ...styles.messageBubble, alignSelf: 'flex-start', backgroundColor: '#e9ecef', color: '#666' }}>Thinking...</div>}
        </div>

        <form onSubmit={handleSendMessage} style={styles.inputArea}>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask a query..."
            style={styles.inputField}
            disabled={loading}
          />
          <button type="submit" style={styles.sendButton} disabled={loading}>
            Send
          </button>
        </form>
      </div>
    </div>
  );
}

// Inline Styles for a clean modern layout
const styles = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    backgroundColor: '#1a1a2e',
    fontFamily: 'Arial, sans-serif',
  },
  chatBox: {
    width: '450px',
    height: '600px',
    backgroundColor: '#ffffff',
    borderRadius: '12px',
    boxShadow: '0px 8px 24px rgba(0,0,0,0.2)',
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
  },
  header: {
    backgroundColor: '#0f3460',
    color: '#ffffff',
    padding: '15px',
    textAlign: 'center',
  },
  messageArea: {
    flex: 1,
    padding: '20px',
    overflowY: 'auto',
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  messageBubble: {
    maxWidth: '75%',
    padding: '10px 14px',
    borderRadius: '16px',
    fontSize: '14px',
    lineHeight: '1.4',
    wordBreak: 'break-word',
  },
  inputArea: {
    display: 'flex',
    borderTop: '1px solid #e0e0e0',
    padding: '10px',
  },
  inputField: {
    flex: 1,
    padding: '12px',
    border: '1px solid #ccc',
    borderRadius: '6px',
    outline: 'none',
    fontSize: '14px',
  },
  sendButton: {
    marginLeft: '10px',
    padding: '0 20px',
    backgroundColor: '#e94560',
    color: '#fff',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: 'bold',
  },
};

export default App;