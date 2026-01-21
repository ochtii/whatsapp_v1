const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode');
const express = require('express');
const http = require('http');
const socketIO = require('socket.io');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = socketIO(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

const PORT = process.env.PORT || 3000;

// Serve static files from public directory (for local testing)
app.use(express.static('public'));

// WhatsApp client initialization
const client = new Client({
  authStrategy: new LocalAuth(),
  puppeteer: {
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  }
});

let qrCodeData = null;
let isClientReady = false;

// Socket.IO connection handling
io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);

  // Send current QR code if available
  if (qrCodeData && !isClientReady) {
    socket.emit('qr', qrCodeData);
  }

  // Send ready status if client is ready
  if (isClientReady) {
    socket.emit('ready', { message: 'WhatsApp client is ready!' });
  }

  // Handle send message request
  socket.on('sendMessage', async (data) => {
    try {
      const { number, message } = data;
      // Handle both regular chats (@c.us) and group chats (@g.us)
      const chatId = number.includes('@') ? number : `${number}@c.us`;
      await client.sendMessage(chatId, message);
      socket.emit('messageSent', { success: true, number, message });
    } catch (error) {
      console.error('Error sending message:', error);
      socket.emit('error', { message: 'Failed to send message', error: error.message });
    }
  });

  // Handle get chats request
  socket.on('getChats', async () => {
    try {
      const chats = await client.getChats();
      const chatList = chats.map(chat => ({
        id: chat.id._serialized,
        name: chat.name,
        isGroup: chat.isGroup,
        unreadCount: chat.unreadCount
      }));
      socket.emit('chats', chatList);
    } catch (error) {
      console.error('Error getting chats:', error);
      socket.emit('error', { message: 'Failed to get chats', error: error.message });
    }
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});

// WhatsApp client event handlers
client.on('qr', async (qr) => {
  console.log('QR Code received');
  try {
    qrCodeData = await qrcode.toDataURL(qr);
    io.emit('qr', qrCodeData);
  } catch (err) {
    console.error('Error generating QR code:', err);
  }
});

client.on('ready', () => {
  console.log('WhatsApp client is ready!');
  isClientReady = true;
  qrCodeData = null;
  io.emit('ready', { message: 'WhatsApp client is ready!' });
});

client.on('authenticated', () => {
  console.log('Client is authenticated!');
  io.emit('authenticated', { message: 'Authentication successful!' });
});

client.on('auth_failure', (msg) => {
  console.error('Authentication failure:', msg);
  io.emit('auth_failure', { message: 'Authentication failed!', error: msg });
});

client.on('disconnected', (reason) => {
  console.log('Client was disconnected:', reason);
  isClientReady = false;
  io.emit('disconnected', { message: 'Client disconnected', reason });
});

client.on('message', async (message) => {
  console.log('New message received:', message.body);
  io.emit('message', {
    from: message.from,
    body: message.body,
    timestamp: message.timestamp
  });
});

// Initialize WhatsApp client
console.log('Initializing WhatsApp client...');
client.initialize();

// Start server
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`Backend server: http://localhost:${PORT}`);
});
