// chat-widget.js - Complete bundle with all dependencies
(function() {
  class ChatWidget extends HTMLElement {
    constructor() {
      super();
      this.initialized = false;
      this.dependencies = {
        react: 'https://unpkg.com/react@18/umd/react.production.min.js',
        reactDom: 'https://unpkg.com/react-dom@18/umd/react-dom.production.min.js',
        tailwind: 'https://cdn.tailwindcss.com',
        mui: 'https://unpkg.com/@mui/material@5.15.0/umd/material-ui.production.min.js',
        icons: 'https://unpkg.com/@mui/icons-material@5.15.0/index.umd.js',
        emotion: 'https://unpkg.com/@emotion/react@11.11.0/dist/emotion-react.umd.min.js',
        emotionStyled: 'https://unpkg.com/@emotion/styled@11.11.0/dist/emotion-styled.umd.min.js'
      };
    }

    connectedCallback() {
      if (this.initialized) return;
      this.initialized = true;
      this.initChat();
    }

    async initChat() {
      try {
        // Sab dependencies load karo
        await this.loadDependencies();
        console.log('✅ All dependencies loaded');
        this.renderReactApp();
      } catch (error) {
        console.error('❌ Failed to load dependencies:', error);
        this.renderFallback();
      }
    }

    async loadDependencies() {
      const promises = [];
      
      // React & ReactDOM
      promises.push(this.loadScript(this.dependencies.react));
      promises.push(this.loadScript(this.dependencies.reactDom));
      
      // Tailwind CSS
      promises.push(this.loadStyle(this.dependencies.tailwind));
      
      // Material-UI dependencies
      promises.push(this.loadScript(this.dependencies.emotion));
      promises.push(this.loadScript(this.dependencies.emotionStyled));
      promises.push(this.loadScript(this.dependencies.mui));
      promises.push(this.loadScript(this.dependencies.icons));
      
      await Promise.all(promises);
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

    loadStyle(href) {
      return new Promise((resolve, reject) => {
        if (document.querySelector(`link[href="${href}"]`)) return resolve();
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = href;
        link.onload = resolve;
        link.onerror = reject;
        document.head.appendChild(link);
      });
    }

    renderReactApp() {
      const container = document.createElement('div');
      this.appendChild(container);

      const reactCode = `
        const { useState, useRef, useEffect } = React;
        const { 
          Button, 
          TextField, 
          AppBar, 
          Toolbar, 
          Typography, 
          IconButton,
          Paper,
          Box
        } = MaterialUI;
        const { Close, Send } = MaterialUIIcons;
        
        // Tailwind classes ke liye helper
        const cn = (...classes) => classes.filter(Boolean).join(' ');
        
        function ChatApp() {
          const [showChatLayout, setShowChatLayout] = useState(false);
          const [sidebarWidth, setSidebarWidth] = useState(400);
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
            if (newWidth > 300 && newWidth < 600) {
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

          return React.createElement('div', { 
            className: 'fixed inset-0 z-50 pointer-events-none font-sans'
          },
            // Main Layout
            React.createElement('div', { 
              className: 'flex h-screen w-full relative'
            },
              // Sidebar
              React.createElement('div', { 
                style: { 
                  width: showChatLayout ? sidebarWidth + 'px' : '0px',
                  transition: 'width 0.3s ease-in-out'
                },
                className: 'overflow-hidden h-full flex-shrink-0 bg-gray-50 pointer-events-auto relative order-first'
              },
                showChatLayout && React.createElement(Paper, { 
                  elevation: 3,
                  className: 'h-full flex flex-col bg-white min-w-[300px] border-r border-gray-200'
                },
                  // Resizer
                  React.createElement('div', {
                    className: 'absolute -right-1 top-0 w-2 h-full cursor-col-resize bg-transparent pointer-events-auto',
                    onMouseDown: startResizing
                  }),
                  
                  // Header - MUI use karte hue
                  React.createElement(AppBar, {
                    position: 'static',
                    color: 'primary'
                  },
                    React.createElement(Toolbar, { className: 'flex justify-between' },
                      React.createElement(Typography, { 
                        variant: 'h6',
                        className: 'flex-1'
                      }, 'Chat Support'),
                      React.createElement(IconButton, {
                        edge: 'end',
                        color: 'inherit',
                        onClick: () => setShowChatLayout(false)
                      }, React.createElement(Close))
                    )
                  ),
                  
                  // Messages Area
                  React.createElement('div', { 
                    className: 'flex-1 p-4 overflow-y-auto bg-gray-50'
                  },
                    messages.map(message =>
                      React.createElement('div', {
                        key: message.id,
                        className: cn(
                          'p-3 my-2 rounded-xl max-w-[80%] break-words',
                          message.type === 'user' 
                            ? 'bg-blue-500 text-white ml-auto' 
                            : 'bg-white text-gray-800 border border-gray-200 mr-auto'
                        )
                      }, message.text)
                    )
                  ),
                  
                  // Input Area - Tailwind + MUI
                  React.createElement('div', { 
                    className: 'p-4 border-t border-gray-200 bg-white flex gap-2'
                  },
                    React.createElement(TextField, {
                      fullWidth: true,
                      variant: 'outlined',
                      size: 'small',
                      placeholder: 'Type your message...',
                      value: inputValue,
                      onChange: (e) => setInputValue(e.target.value),
                      onKeyPress: handleKeyPress
                    }),
                    React.createElement(IconButton, {
                      color: 'primary',
                      onClick: handleSendMessage,
                      className: 'bg-blue-500 hover:bg-blue-600 text-white'
                    }, React.createElement(Send))
                  )
                )
              ),
              
              // Main Content
              React.createElement('div', { 
                className: 'flex-1 overflow-auto pointer-events-auto bg-transparent',
                id: 'chat-main-content'
              })
            ),
            
            // Toggle Button - Tailwind classes
            !showChatLayout && React.createElement(Button, {
              variant: 'contained',
              color: 'primary',
              onClick: () => setShowChatLayout(true),
              className: 'fixed bottom-5 left-5 z-50 pointer-events-auto rounded-full w-15 h-15 min-w-0 shadow-lg hover:scale-110 transition-transform',
              style: { 
                borderRadius: '50%',
                width: '60px',
                height: '60px',
                minWidth: '0'
              }
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
      // Simple fallback
      this.innerHTML = `
        <div class="fixed bottom-5 left-5 z-50">
          <button class="bg-blue-500 hover:bg-blue-600 text-white rounded-full w-15 h-15 flex items-center justify-center cursor-pointer shadow-lg transition-transform hover:scale-110"
            onclick="this.parentElement.innerHTML = \\'
              <div class="fixed top-0 left-0 w-96 h-screen bg-white z-50 border-r border-gray-200 flex flex-col shadow-xl">
                <div class="bg-blue-500 text-white p-4 flex justify-between items-center">
                  <h3 class="text-lg font-semibold">Chat Support</h3>
                  <button onclick="this.closest(\\'div\\').style.display=\\'none\\'" class="text-white text-xl">✕</button>
                </div>
                <div class="flex-1 p-4 bg-gray-50 overflow-y-auto">
                  <div class="bg-white p-3 rounded-xl max-w-[80%] border border-gray-200">Hello! How can I help?</div>
                </div>
                <div class="p-4 border-t border-gray-200 bg-white flex gap-2">
                  <input type="text" placeholder="Type your message..." class="flex-1 p-3 border border-gray-300 rounded-lg outline-none">
                  <button class="bg-blue-500 text-white p-3 rounded-lg">Send</button>
                </div>
              </div>
            \\'">
            💬
          </button>
        </div>
      `;
    }
  }

  if (!customElements.get('chat-widget')) {
    customElements.define('chat-widget', ChatWidget);
  }

  if (!document.querySelector('chat-widget')) {
    const widget = document.createElement('chat-widget');
    document.body.appendChild(widget);
  }
})();
