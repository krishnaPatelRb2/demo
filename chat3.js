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
    this.shadow.appendChild(container);

    // React component as string
    const reactCode = `
      const { useState, useRef, useEffect } = React;
      
      function ChatApp() {
        const [showChatLayout, setShowChatLayout] = useState(false);
        const [sidebarWidth, setSidebarWidth] = useState(500);
        const [messages, setMessages] = useState([
          { id: 1, text: 'Hello! How can I help you today?', type: 'bot' },
          { id: 2, text: 'I\\'m a React-based chat widget!', type: 'bot' }
        ]);
        const [inputValue, setInputValue] = useState('');
        
        const isResizing = useRef(false);

        const startResizing = () => {
          isResizing.current = true;
        };

        const stopResizing = () => {
          isResizing.current = false;
        };

        const handleMouseMove = (e) => {
          if (!isResizing.current) return;
          const newWidth = e.clientX;
          if (newWidth > 200 && newWidth < window.innerWidth - 200) {
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
              text: "Thanks for your message! I'll help you with that.",
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
          window.addEventListener('mousemove', handleMouseMove);
          window.addEventListener('mouseup', stopResizing);
          
          return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseup', stopResizing);
          };
        }, []);

        // Styles
        const styles = {
          container: {
            fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
          },
          mainContainer: {
            display: 'flex',
            flexDirection: 'row',
            height: '100vh',
            position: 'relative',
            overflow: 'hidden'
          },
          sidebar: {
            width: showChatLayout ? sidebarWidth : 0,
            transition: 'width 0.3s ease-in-out',
            overflow: 'hidden',
            height: '100%',
            flexShrink: 0,
            backgroundColor: '#fef2f2'
          },
          resizer: {
            width: '1px',
            backgroundColor: '#d1d5db',
            cursor: 'col-resize',
            zIndex: 10
          },
          toggleButton: {
            backgroundColor: '#3b82f6',
            height: '40px',
            width: '40px',
            borderRadius: '16px',
            left: '20px',
            bottom: '20px',
            position: 'fixed',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 20,
            cursor: 'pointer',
            color: 'white',
            border: 'none',
            fontSize: '18px'
          },
          mainContent: {
            flex: 1,
            overflow: 'auto'
          },
          chatContainer: {
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            background: 'white'
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
            padding: '12px',
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
          }
        };

        return React.createElement('div', { style: styles.container },
          React.createElement('div', { style: styles.mainContainer },
            // Sidebar
            React.createElement('div', { 
              style: styles.sidebar 
            },
              showChatLayout && React.createElement('div', { style: styles.chatContainer },
                // Header
                React.createElement('div', { style: styles.chatHeader },
                  React.createElement('h3', { style: { margin: 0, fontSize: '18px' } }, 'Chat Support'),
                  React.createElement('button', {
                    onClick: () => setShowChatLayout(false),
                    style: {
                      background: 'none',
                      border: 'none',
                      color: 'white',
                      cursor: 'pointer',
                      fontSize: '20px'
                    }
                  }, '✕')
                ),
                
                // Messages
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
                
                // Input Area
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

            // Resizer
            showChatLayout && React.createElement('div', {
              onMouseDown: startResizing,
              style: styles.resizer
            }),

            // Toggle Button
            !showChatLayout && React.createElement('button', {
              onClick: () => setShowChatLayout(true),
              style: styles.toggleButton
            }, '💬'),

            // Main Content
            React.createElement('div', { 
              style: styles.mainContent,
              id: 'chat-main-content'
            })
          )
        );
      }

      // Move existing content to main content area
      const moveContentToMain = () => {
        const mainContent = document.querySelector('chat-widget').shadowRoot.querySelector('#chat-main-content');
        const body = document.body;
        const existingContent = Array.from(body.childNodes).filter(node => {
          return node.nodeType === 1 && node.tagName !== 'SCRIPT' && node.tagName !== 'CHAT-WIDGET';
        });
        
        existingContent.forEach(node => {
          if (mainContent) {
            mainContent.appendChild(node.cloneNode(true));
          }
        });
      };

      // Render React app
      const container = document.querySelector('chat-widget').shadowRoot.querySelector('div');
      const root = ReactDOM.createRoot(container);
      root.render(React.createElement(ChatApp));
      
      // Move content after render
      setTimeout(moveContentToMain, 100);
    `;

    // Execute React code
    const script = document.createElement('script');
    script.textContent = reactCode;
    this.shadow.appendChild(script);
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
