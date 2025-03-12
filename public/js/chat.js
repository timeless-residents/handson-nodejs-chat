document.addEventListener('DOMContentLoaded', () => {
  // DOM Elements
  const loginContainer = document.getElementById('login-container');
  const chatContainer = document.getElementById('chat-container');
  const usernameInput = document.getElementById('username-input');
  const joinBtn = document.getElementById('join-btn');
  const usersList = document.getElementById('users');
  const chatWith = document.getElementById('chat-with');
  const messagesContainer = document.getElementById('messages');
  const messageInput = document.getElementById('message-input');
  const sendBtn = document.getElementById('send-btn');
  const typingIndicator = document.getElementById('typing-indicator');
  
  // Connect to Socket.IO
  const socket = io();
  
  // User state
  let currentUser = null;
  let selectedUser = null;
  let chatHistory = {};
  let typingTimeout = null;
  
  // Event Listeners
  joinBtn.addEventListener('click', handleJoin);
  usernameInput.addEventListener('keyup', (e) => {
    if (e.key === 'Enter') handleJoin();
  });
  
  sendBtn.addEventListener('click', sendMessage);
  messageInput.addEventListener('keyup', (e) => {
    if (e.key === 'Enter') sendMessage();
  });
  
  messageInput.addEventListener('input', handleTyping);
  
  // Functions
  function handleJoin() {
    const username = usernameInput.value.trim();
    
    if (username) {
      currentUser = username;
      socket.emit('user_join', username);
      
      // Switch to chat view
      loginContainer.classList.add('hidden');
      chatContainer.classList.remove('hidden');
    }
  }
  
  function handleUserSelect(userId, username) {
    // Deselect previous user
    const previousSelected = document.querySelector('.users-list li.active');
    if (previousSelected) {
      previousSelected.classList.remove('active');
    }
    
    // Select the clicked user
    document.querySelector(`[data-id="${userId}"]`).classList.add('active');
    
    // Update the chat header
    chatWith.textContent = `Chat with ${username}`;
    
    // Enable chat input
    messageInput.disabled = false;
    sendBtn.disabled = false;
    
    // Set selected user
    selectedUser = userId;
    
    // Load chat history
    loadChatHistory(userId);
  }
  
  function loadChatHistory(userId) {
    messagesContainer.innerHTML = '';
    
    if (!chatHistory[userId]) {
      chatHistory[userId] = [];
    }
    
    if (chatHistory[userId].length === 0) {
      messagesContainer.innerHTML = '<div class="empty-state">No messages yet. Start a conversation!</div>';
      return;
    }
    
    chatHistory[userId].forEach(msg => {
      const messageEl = document.createElement('div');
      messageEl.className = `message ${msg.type}`;
      messageEl.textContent = msg.text;
      messagesContainer.appendChild(messageEl);
    });
    
    // Scroll to bottom
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
  }
  
  function sendMessage() {
    const message = messageInput.value.trim();
    
    if (message && selectedUser) {
      // Send message via socket
      socket.emit('private_message', {
        to: selectedUser,
        message: message
      });
      
      // Clear input
      messageInput.value = '';
      messageInput.focus();
      
      // Cancel typing indicator
      clearTimeout(typingTimeout);
      socket.emit('typing', {
        to: selectedUser,
        isTyping: false
      });
    }
  }
  
  function handleTyping() {
    if (selectedUser) {
      // Clear previous timeout
      clearTimeout(typingTimeout);
      
      // Send typing indicator
      socket.emit('typing', {
        to: selectedUser,
        isTyping: true
      });
      
      // Set timeout to stop typing indicator
      typingTimeout = setTimeout(() => {
        socket.emit('typing', {
          to: selectedUser,
          isTyping: false
        });
      }, 1000);
    }
  }
  
  // Socket Events
  socket.on('user_list', (users) => {
    // Update users list
    usersList.innerHTML = '';
    
    users.forEach(user => {
      if (user.id !== socket.id) { // Don't show current user
        const userEl = document.createElement('li');
        userEl.textContent = user.username;
        userEl.dataset.id = user.id;
        userEl.addEventListener('click', () => handleUserSelect(user.id, user.username));
        usersList.appendChild(userEl);
      }
    });
    
    if (users.length <= 1) {
      usersList.innerHTML = '<div class="empty-state">No other users online</div>';
    }
  });
  
  socket.on('private_message', (data) => {
    // Add message to chat history
    if (!chatHistory[data.from]) {
      chatHistory[data.from] = [];
    }
    
    chatHistory[data.from].push({
      type: 'received',
      text: `${data.username}: ${data.message}`
    });
    
    // If this user is selected, update the chat view
    if (selectedUser === data.from) {
      loadChatHistory(data.from);
    }
  });
  
  socket.on('private_message_sent', (data) => {
    // Add message to chat history
    if (!chatHistory[data.to]) {
      chatHistory[data.to] = [];
    }
    
    chatHistory[data.to].push({
      type: 'sent',
      text: `You: ${data.message}`
    });
    
    // If this user is selected, update the chat view
    if (selectedUser === data.to) {
      loadChatHistory(data.to);
    }
  });
  
  socket.on('typing', (data) => {
    if (selectedUser === data.from) {
      if (data.isTyping) {
        typingIndicator.classList.remove('hidden');
        typingIndicator.textContent = `${data.username} is typing...`;
      } else {
        typingIndicator.classList.add('hidden');
      }
    }
  });
});