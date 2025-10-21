class ChatWidget extends HTMLElement {
  constructor() {
    super();
    this.initialized = false;
  }

  connectedCallback() {
    if (this.initialized) return;
    this.initialized = true;
    this.initChat();
  }

  initChat() {
    console.log('Chat widget initializing...');
    
    // Simple HTML approach - no React dependencies
    this.innerHTML = `
      <style>
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
          padding: 5px;
        }
        
        .chat-content {
          flex: 1;
          padding: 16px;
          overflow-y: auto;
          background: #f8f9fa;
        }
        
        .message-bubble {
          padding: 12px 16px;
          margin: 8px 0;
          border-radius: 12px;
          max-width: 80%;
          word-wrap: break-word;
        }
        
        .user-message {
          background: #3B82F6;
          color: white;
          margin-left: auto;
        }
        
        .bot-message {
          background: white;
          color: #334155;
          border: 1px solid #e2e8f0;
        }
        
        .input-area {
          padding: 16px;
          border-top: 1px solid #e2e8f0;
          display: flex;
          gap: 8px;
          background: white;
        }
        
        .chat-input {
          flex: 1;
          padding: 12px 16px;
          border: 1px solid #d1d5db;
          border-radius: 8px;
          outline: none;
          font-size: 14px;
        }
        
        .chat-input:focus {
          border-color: #3B82F6;
        }
        
        .send-btn {
          padding: 12px 20px;
          background: #3B82F6;
          color: white;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          font-weight: 500;
        }
        
        .send-btn:hover {
          background: #2563eb;
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
        
        .resize-handle:hover {
          background: rgba(59, 130, 246, 0.1);
        }
        
        @media (max-width: 768px) {
          .chat-sidebar {
            width: 100vw;
          }
        }
        
        .hidden {
          display: none !important;
        }
      </style>

      <div class="chat-widget-container">
        <button class="chat-toggle-btn" id="chatToggle">💬</button>
        
        <div class="chat-sidebar hidden" id="chatSidebar">
          <div class="resize-handle" id="resizeHandle"></div>
          
          <div class="chat-header">
            <h3 style="margin: 0; font-size: 18px;">Chat Support</h3>
            <button class="chat-close-btn" id="closeChat">✕</button>
          </div>
          
          <div class="chat-content" id="chatMessages">
            <div class="message-bubble bot-message">
              Hello! How can I help you today?
            </div>
            <div class="message-bubble bot-message">
              I'm a simple chat widget integrated in your Next.js app.
            </div>
          </div>
          
          <div class="input-area">
            <input 
              type="text" 
              class="chat-input" 
              id="chatInput" 
              placeholder="Type your message..."
            />
            <button class="send-btn" id="sendBtn">Send</button>
          </div>
        </div>
      </div>
    `;

    this.initializeChatLogic();
  }

  initializeChatLogic() {
    const toggleBtn = this.querySelector('#chatToggle');
    const closeBtn = this.querySelector('#closeChat');
    const chatSidebar = this.querySelector('#chatSidebar');
    const chatInput = this.querySelector('#chatInput');
    const sendBtn = this.querySelector('#sendBtn');
    const chatMessages = this.querySelector('#chatMessages');
    const resizeHandle = this.querySelector('#resizeHandle');

    let isResizing = false;
    let sidebarWidth = 400;

    // Toggle chat
    toggleBtn.addEventListener('click', () => {
      chatSidebar.classList.remove('hidden');
      toggleBtn.classList.add('hidden');
    });

    // Close chat
    closeBtn.addEventListener('click', () => {
      chatSidebar.classList.add('hidden');
      toggleBtn.classList.remove('hidden');
    });

    // Send message
    const sendMessage = () => {
      const message = chatInput.value.trim();
      if (!message) return;

      // Add user message
      const userMessage = document.createElement('div');
      userMessage.className = 'message-bubble user-message';
      userMessage.textContent = message;
      chatMessages.appendChild(userMessage);

      // Clear input
      chatInput.value = '';

      // Scroll to bottom
      chatMessages.scrollTop = chatMessages.scrollHeight;

      // Simulate bot response
      setTimeout(() => {
        const botMessage = document.createElement('div');
        botMessage.className = 'message-bubble bot-message';
        botMessage.textContent = "Thanks for your message! This is a demo response.";
        chatMessages.appendChild(botMessage);
        
        // Scroll to bottom again
        chatMessages.scrollTop = chatMessages.scrollHeight;
      }, 1000);
    };

    sendBtn.addEventListener('click', sendMessage);

    chatInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        sendMessage();
      }
    });

    // Resize functionality
    const startResizing = (e) => {
      e.preventDefault();
      isResizing = true;
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', stopResizing);
    };

    const stopResizing = () => {
      isResizing = false;
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', stopResizing);
    };

    const handleMouseMove = (e) => {
      if (!isResizing) return;
      const newWidth = window.innerWidth - e.clientX;
      if (newWidth > 300 && newWidth < 800) {
        sidebarWidth = newWidth;
        chatSidebar.style.width = `${sidebarWidth}px`;
      }
    };

    resizeHandle.addEventListener('mousedown', startResizing);

    console.log('Chat widget initialized successfully!');
  }
}

// Register custom element
if (!customElements.get('chat-widget')) {
  customElements.define('chat-widget', ChatWidget);
  console.log('Chat widget custom element registered');
}
