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
      // Load React from CDN
      await this.loadScript('https://unpkg.com/react@18/umd/react.production.min.js');
      await this.loadScript('https://unpkg.com/react-dom@18/umd/react-dom.production.min.js');
      await this.loadScript('https://unpkg.com/@babel/standalone/babel.min.js');
      
      // Load CSS
      this.loadCSS('https://unpkg.com/primereact/resources/themes/lara-light-cyan/theme.css');
      this.loadCSS('https://unpkg.com/primereact/resources/primereact.min.css');
      this.loadCSS('https://unpkg.com/primeicons/primeicons.css');
      
      this.loadCustomCSS();
      this.renderChat();
    } catch (error) {
      console.error('Chat widget failed to load:', error);
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

  loadCSS(href) {
    if (document.querySelector(`link[href="${href}"]`)) return;
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = href;
    document.head.appendChild(link);
  }

  loadCustomCSS() {
    const styles = `
      .chat-widget-container {
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        position: fixed;
        bottom: 20px;
        right: 20px;
        z-index: 10000;
      }
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
        transition: all 0.3s ease;
        border: none;
        font-size: 24px;
      }
      .chat-toggle-btn:hover {
        transform: scale(1.05);
        box-shadow: 0 6px 16px rgba(0,0,0,0.2);
      }
      .chat-sidebar {
        position: fixed;
        top: 0;
        right: 0;
        width: 400px;
        height: 100vh;
        background: white;
        box-shadow: -2px 0 10px rgba(0,0,0,0.1);
        z-index: 9999;
        display: flex;
        flex-direction: column;
      }
      .chat-header {
        padding: 16px;
        background: #3B82F6;
        color: white;
        display: flex;
        justify-content: space-between;
        align-items: center;
      }
      .chat-close-btn {
        background: none;
        border: none;
        color: white;
        font-size: 20px;
        cursor: pointer;
      }
      .chat-content {
        flex: 1;
        padding: 16px;
        overflow-y: auto;
      }
      .resize-handle {
        position: absolute;
        left: -4px;
        top: 0;
        width: 8px;
        height: 100%;
        cursor: col-resize;
        background: transparent;
      }
      .message-bubble {
        padding: 8px 12px;
        margin: 8px 0;
        border-radius: 12px;
        max-width: 80%;
      }
      .user-message {
        background: #3B82F6;
        color: white;
        margin-left: auto;
      }
      .bot-message {
        background: #f1f5f9;
        color: #334155;
      }
      .input-area {
        padding: 16px;
        border-top: 1px solid #e2e8f0;
        display: flex;
        gap: 8px;
      }
      .chat-input {
        flex: 1;
        padding: 8px 12px;
        border: 1px solid #d1d5db;
        border-radius: 6px;
        outline: none;
      }
      .send-btn {
        padding: 8px 16px;
        background: #3B82F6;
        color: white;
        border: none;
        border-radius: 6px;
        cursor: pointer;
      }
      @media (max-width: 768px) {
        .chat-sidebar {
          width: 100vw;
        }
      }
    `;
    
    const styleSheet = document.createElement('style');
    styleSheet.textContent = styles;
    this.shadow.appendChild(styleSheet);
  }

  renderChat() {
    const container = document.createElement('div');
    this.shadow.appendChild(container);
    
    const script = document.createElement('script');
    script.type = 'text/babel';
    script.text = this.getReactComponent();
    this.shadow.appendChild(script);
  }

  getReactComponent() {
    return `
      const { useState, useRef, useEffect } = React;
      
      function ChatApp() {
        const [showChat, setShowChat] = useState(false);
        const [sidebarWidth, setSidebarWidth] = useState(400);
        const [messages, setMessages] = useState([
          { id: 1, text: 'Hello! How can I help you today?', type: 'bot' }
        ]);
        const [inputValue, setInputValue] = useState('');
        
        const isResizing = useRef(false);
        const sidebarRef = useRef(null);

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
          const newWidth = window.innerWidth - e.clientX;
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
              text: "Thanks for your message! This is a demo chat widget.",
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

        return React.createElement(
          'div',
          { className: 'chat-widget-container' },
          
          !showChat && React.createElement(
            'button',
            {
              className: 'chat-toggle-btn',
              onClick: () => setShowChat(true),
              title: 'Open Chat'
            },
            '💬'
          ),
          
          showChat && React.createElement(
            'div',
            {
              ref: sidebarRef,
              className: 'chat-sidebar',
              style: { width: sidebarWidth + 'px' }
            },
            
            React.createElement('div', {
              className: 'resize-handle',
              onMouseDown: startResizing
            }),
            
            React.createElement(
              'div',
              { className: 'chat-header' },
              React.createElement('h3', { style: { margin: 0 } }, 'Chat Support'),
              React.createElement(
                'button',
                {
                  className: 'chat-close-btn',
                  onClick: () => setShowChat(false),
                  title: 'Close Chat'
                },
                '✕'
              )
            ),
            
            React.createElement(
              'div',
              { className: 'chat-content' },
              messages.map(message => 
                React.createElement(
                  'div',
                  {
                    key: message.id,
                    className: \`message-bubble \${message.type === 'user' ? 'user-message' : 'bot-message'}\`
                  },
                  message.text
                )
              )
            ),
            
            React.createElement(
              'div',
              { className: 'input-area' },
              React.createElement('input', {
                type: 'text',
                className: 'chat-input',
                placeholder: 'Type your message...',
                value: inputValue,
                onChange: (e) => setInputValue(e.target.value),
                onKeyPress: handleKeyPress
              }),
              React.createElement(
                'button',
                {
                  className: 'send-btn',
                  onClick: handleSendMessage
                },
                'Send'
              )
            )
          )
        );
      }

      const root = ReactDOM.createRoot(document.querySelector('chat-widget').shadowRoot.querySelector('div'));
      root.render(React.createElement(ChatApp));
    `;
  }
}

if (!customElements.get('chat-widget')) {
  customElements.define('chat-widget', ChatWidget);
}
