class ChatWidget extends HTMLElement {
  constructor() {
    super();
    this.initialized = false;
    this.shadow = null;
  }

  connectedCallback() {
    if (this.initialized) return;
    this.initialized = true;
    this.shadow = this.attachShadow({ mode: 'open' });
    this.initChat();
  }

  async initChat() {
    try {
      // Load React and dependencies from CDN
      await this.loadScript('https://unpkg.com/react@18/umd/react.production.min.js');
      await this.loadScript('https://unpkg.com/react-dom@18/umd/react-dom.production.min.js');
      
      console.log('React loaded successfully');
      this.renderReactApp();
    } catch (error) {
      console.error('Failed to load React:', error);
      this.renderFallback();
    }
  }

  loadScript(src) {
    return new Promise((resolve, reject) => {
      if (document.querySelector(`script[src="${src}"]`)) return resolve();
      const script = document.createElement('script');
      script.src = src;
      script.onload = resolve;
      script.onerror = reject;
      document.head.appendChild(script);
    });
  }

  renderReactApp() {
  const container = document.createElement('div');
  this.appendChild(container); // ✅ Light DOM

  const reactCode = `
    const { useState, useRef, useEffect } = React;
    
    function ChatApp() {
      const [showChatLayout, setShowChatLayout] = useState(false);
      const [sidebarWidth, setSidebarWidth] = useState(500);
      const [messages, setMessages] = useState([
        { id: 1, text: 'Hello! How can I help you today?', type: 'bot' },
        { id: 2, text: "I'm your chat assistant. Ask me anything!", type: 'bot' }
      ]);
      const [inputValue, setInputValue] = useState('');
      
      const isResizing = useRef(false);

      const startResizing = (e) => {
        e.preventDefault();
        isResizing.current = true;
        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseup', stopResizing);
      };

      const stopResizing = () => {
        isResizing.current = false;
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', stopResizing);
      };

      const handleMouseMove = (e) => {
        if (!isResizing.current) return;
        const newWidth = e.clientX;
        if (newWidth > 300 && newWidth < 800) {
          setSidebarWidth(newWidth);
        }
      };

      const handleSendMessage = () => {
        if (!inputValue.trim()) return;
        const userMessage = {
          id: Date.now(),
          text: inputValue,
          type: 'user'
        };
        setMessages(prev => [...prev, userMessage]);
        setInputValue('');
        setTimeout(() => {
          const botMessage = {
            id: Date.now() + 1,
            text: "Thanks for your message! I'm here to help you.",
            type: 'bot'
          };
          setMessages(prev => [...prev, botMessage]);
        }, 1000);
      };

      const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
          handleSendMessage();
        }
      };

      useEffect(() => {
        return () => {
          document.removeEventListener('mousemove', handleMouseMove);
          document.removeEventListener('mouseup', stopResizing);
        };
      }, []);

      useEffect(() => {
        const clientContent = document.getElementById('client-main-content');
        const mainContent = document.getElementById('chat-main-content');
        if (clientContent && mainContent) {
          while (clientContent.firstChild) {
            mainContent.appendChild(clientContent.firstChild);
          }
        }
      }, []);

      const styles = {
        chatWidgetContainer: {
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: 10000,
          pointerEvents: 'none',
          fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
        },
        mainLayout: {
          display: 'flex',
          height: '100vh',
          width: '100%',
          position: 'relative'
        },
        sidebar: {
          width: showChatLayout ? sidebarWidth + 'px' : '0px',
          transition: 'width 0.3s ease-in-out',
          overflow: 'hidden',
          height: '100%',
          flexShrink: 0,
          backgroundColor: '#fef2f2',
          pointerEvents: 'auto',
          position: 'relative'
        },
        chatContainer: {
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          background: 'white',
          minWidth: '400px'
        },
        chatHeader: {
          padding: '16px',
          background: '#3b82f6',
          color: 'white',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          borderBottom: '1px solid #e5e7eb'
        },
        chatContent: {
          flex: 1,
          padding: '16px',
          overflowY: 'auto',
          background: '#f8fafc'
        },
        messageBubble: {
          padding: '12px 16px',
          margin: '8px 0',
          borderRadius: '16px',
          maxWidth: '70%',
          wordWrap: 'break-word'
        },
        userMessage: {
          background: '#3b82f6',
          color: 'white',
          marginLeft: 'auto',
          marginRight: 0
        },
        botMessage: {
          background: 'white',
          color: '#374151',
          border: '1px solid #e5e7eb',
          marginRight: 'auto',
          marginLeft: 0
        },
        inputArea: {
          padding: '16px',
          borderTop: '1px solid #e5e7eb',
          background: 'white',
          display: 'flex',
          gap: '8px'
        },
        chatInput: {
          flex: 1,
          padding: '12px 16px',
          border: '1px solid #d1d5db',
          borderRadius: '8px',
          outline: 'none',
          fontSize: '14px'
        },
        sendButton: {
          padding: '12px 20px',
          background: '#3b82f6',
          color: 'white',
          border: 'none',
          borderRadius: '8px',
          cursor: 'pointer',
          fontWeight: '500'
        },
        resizer: {
          position: 'absolute',
          right: '-2px',  // ⬅️ Move resizer to the right of left-sidebar
          top: 0,
          width: '4px',
          height: '100%',
          cursor: 'col-resize',
          backgroundColor: 'transparent',
          pointerEvents: 'auto'
        },
        toggleButton: {
          backgroundColor: '#3b82f6',
          height: '60px',
          width: '60px',
          borderRadius: '30px',
          position: 'fixed',
          bottom: '20px',
          left: '20px', // ⬅️ Move toggle button to bottom-left
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          color: 'white',
          border: 'none',
          fontSize: '24px',
          zIndex: 10001,
          pointerEvents: 'auto',
          boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
        },
        mainContent: {
          flex: 1,
          overflow: 'auto',
          pointerEvents: 'auto',
          background: 'transparent'
        }
      };

      return React.createElement('div', { style: styles.chatWidgetContainer },
        React.createElement('div', { style: styles.mainLayout },
          // Sidebar (now on the left)
          React.createElement('div', { style: styles.sidebar },
            showChatLayout && React.createElement('div', { style: styles.chatContainer },
              React.createElement('div', {
                style: styles.resizer,
                onMouseDown: startResizing
              }),
              React.createElement('div', { style: styles.chatHeader },
                React.createElement('h3', { style: { margin: 0, fontSize: '18px' } }, 'Chat Support'),
                React.createElement('button', {
                  onClick: () => setShowChatLayout(false),
                  style: {
                    background: 'none',
                    border: 'none',
                    color: 'white',
                    cursor: 'pointer',
                    fontSize: '20px',
                    padding: '4px'
                  }
                }, '✕')
              ),
              React.createElement('div', { style: styles.chatContent },
                messages.map(message =>
                  React.createElement('div', {
                    key: message.id,
                    style: {
                      ...styles.messageBubble,
                      ...(message.type === 'user' ? styles.userMessage : styles.botMessage)
                    }
                  }, message.text)
                )
              ),
              React.createElement('div', { style: styles.inputArea },
                React.createElement('input', {
                  type: 'text',
                  style: styles.chatInput,
                  placeholder: 'Type your message...',
                  value: inputValue,
                  onChange: (e) => setInputValue(e.target.value),
                  onKeyPress: handleKeyPress
                }),
                React.createElement('button', {
                  style: styles.sendButton,
                  onClick: handleSendMessage
                }, 'Send')
              )
            )
          ),
          // Main content area
          React.createElement('div', {
            style: styles.mainContent,
            id: 'chat-main-content'
          })
        ),
        // Toggle button
        !showChatLayout && React.createElement('button', {
          onClick: () => setShowChatLayout(true),
          style: styles.toggleButton
        }, '💬')
      );
    }

    const container = document.querySelector('chat-widget').querySelector('div');
    const root = ReactDOM.createRoot(container);
    root.render(React.createElement(ChatApp));
  `;

  const script = document.createElement('script');
  script.textContent = reactCode;
  this.appendChild(script);
}


  renderFallback() {
    // Fallback to vanilla JS if React fails to load
    this.shadow.innerHTML = `
      <style>
        .chat-toggle-btn {
          background: #3B82F6;
          height: 60px;
          width: 60px;
          border-radius: 30px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          color: white;
          box-shadow: 0 4px 12px rgba(0,0,0,0.15);
          position: fixed;
          bottom: 20px;
          right: 20px;
          z-index: 10000;
          border: none;
          font-size: 24px;
        }
      </style>
      <button class="chat-toggle-btn" onclick="alert('Chat widget - React failed to load')">💬</button>
    `;
  }
}

// Register custom element
if (!customElements.get('chat-widget')) {
  customElements.define('chat-widget', ChatWidget);
  console.log('✅ React Chat Widget registered');
}
