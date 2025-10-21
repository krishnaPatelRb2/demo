class ChatWidget extends HTMLElement {
  constructor() {
    super();
    this.initialized = false;
    console.log('ChatWidget constructor called');
  }

  connectedCallback() {
    console.log('ChatWidget connected to DOM');
    if (this.initialized) return;
    this.initialized = true;
    this.initChat();
  }

  initChat() {
    console.log('initChat called');
    
    try {
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
        </style>

        <div class="chat-widget-container">
          <button class="chat-toggle-btn" id="chatToggle">💬 TEST2</button>
        </div>
      `;
      
      console.log('HTML injected successfully');
      this.initializeChatLogic();
    } catch (error) {
      console.error('Error in initChat:', error);
    }
  }

  initializeChatLogic() {
    console.log('initializeChatLogic called');
    const toggleBtn = this.querySelector('#chatToggle');
    console.log('Toggle button found:', toggleBtn);
    
    if (toggleBtn) {
      toggleBtn.addEventListener('click', () => {
        console.log('Chat toggle button clicked!');
        alert('Chat widget working!');
      });
    }
  }
}

// Register custom element
if (!customElements.get('chat-widget')) {
  customElements.define('chat-widget', ChatWidget);
  console.log('Chat widget custom element registered globally');
}
