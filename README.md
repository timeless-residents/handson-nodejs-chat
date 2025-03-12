# Socket.IO 1-to-1 Chat Application

A real-time 1-to-1 chat application built with Node.js, Express, and Socket.IO that demonstrates private messaging between users.

## Features

- Real-time messaging using Socket.IO
- User login with usernames
- List of online users
- Private 1-to-1 chat between users
- Typing indicators
- Message history during session

## Tech Stack

- **Backend**: Node.js, Express
- **Real-time Communication**: Socket.IO
- **Frontend**: HTML, CSS, JavaScript (Vanilla)

## Prerequisites

- Node.js (v14 or newer)
- npm (Node Package Manager)

## Installation

1. Clone the repository:
   ```
   git clone https://github.com/timeless-residents/handson-nodejs-chat.git
   cd handson-nodejs-chat
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Start the server:
   ```
   npm start
   ```

   Or for development with auto-reload:
   ```
   npm run dev
   ```

4. Open your browser and go to `http://localhost:3000`

## How to Use

1. Enter a username to join the chat
2. Select a user from the online users list to start a chat
3. Type your message and press Enter or click Send
4. You'll see typing indicators when the other user is typing

## Project Structure

```
handson-nodejs-chat/
├── public/            # Static files
│   ├── css/           # CSS styles
│   │   └── style.css  # Main stylesheet
│   └── js/            # Client-side JavaScript
│       └── chat.js    # Client-side Socket.IO logic
├── src/               # Server-side code
│   └── index.js       # Main server file with Socket.IO logic
├── views/             # HTML templates
│   └── index.html     # Main page
├── package.json       # Project metadata and dependencies
└── README.md          # Project documentation
```

## Socket.IO Events

| Event Name | Description |
|------------|-------------|
| `user_join` | Emitted when a user joins the chat |
| `user_list` | Emitted to update the list of online users |
| `private_message` | Emitted to send a private message to a specific user |
| `private_message_sent` | Emitted to confirm a message was sent |
| `typing` | Emitted to indicate a user is typing |

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- [Socket.IO](https://socket.io/) for providing the real-time engine
- [Express](https://expressjs.com/) for the web server framework