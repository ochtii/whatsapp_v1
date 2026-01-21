let socket = null;
let isConnected = false;

// DOM Elements
const qrSection = document.getElementById('qrSection');
const chatSection = document.getElementById('chatSection');
const qrCode = document.getElementById('qrCode');
const statusDot = document.getElementById('statusDot');
const statusText = document.getElementById('statusText');
const messageForm = document.getElementById('messageForm');
const phoneNumber = document.getElementById('phoneNumber');
const messageText = document.getElementById('messageText');
const messagesList = document.getElementById('messagesList');
const chatList = document.getElementById('chatList');
const refreshChatsBtn = document.getElementById('refreshChats');
const serverUrlInput = document.getElementById('serverUrl');
const connectBtn = document.getElementById('connectBtn');

// Update status indicator
function updateStatus(status, text) {
    statusDot.className = `status-dot ${status}`;
    statusText.textContent = text;
}

// Connect to server
function connectToServer() {
    const serverUrl = serverUrlInput.value.trim();
    
    if (!serverUrl) {
        alert('Bitte geben Sie eine Server-URL ein');
        return;
    }

    if (socket) {
        socket.disconnect();
    }

    updateStatus('', 'Verbindung wird hergestellt...');
    
    socket = io(serverUrl, {
        transports: ['websocket', 'polling']
    });

    // Socket event handlers
    socket.on('connect', () => {
        console.log('Connected to server');
        isConnected = true;
        updateStatus('connected', 'Mit Server verbunden');
    });

    socket.on('disconnect', () => {
        console.log('Disconnected from server');
        isConnected = false;
        updateStatus('disconnected', 'Verbindung zum Server getrennt');
        showQRSection();
    });

    socket.on('qr', (qrData) => {
        console.log('QR code received');
        updateStatus('connected', 'QR-Code erhalten - Bitte scannen');
        displayQRCode(qrData);
        showQRSection();
    });

    socket.on('ready', (data) => {
        console.log('WhatsApp client ready:', data);
        updateStatus('connected', 'WhatsApp Client bereit!');
        showChatSection();
        loadChats();
    });

    socket.on('authenticated', (data) => {
        console.log('Authenticated:', data);
        updateStatus('connected', 'Authentifizierung erfolgreich!');
    });

    socket.on('auth_failure', (data) => {
        console.error('Authentication failed:', data);
        updateStatus('disconnected', 'Authentifizierung fehlgeschlagen');
        alert('Authentifizierung fehlgeschlagen. Bitte versuchen Sie es erneut.');
    });

    socket.on('message', (message) => {
        console.log('New message:', message);
        displayMessage(message);
    });

    socket.on('chats', (chats) => {
        console.log('Chats received:', chats.length);
        displayChats(chats);
    });

    socket.on('messageSent', (data) => {
        console.log('Message sent:', data);
        showNotification('Nachricht erfolgreich gesendet!', 'success');
        messageForm.reset();
    });

    socket.on('error', (error) => {
        console.error('Socket error:', error);
        showNotification(error.message || 'Ein Fehler ist aufgetreten', 'error');
    });

    socket.on('connect_error', (error) => {
        console.error('Connection error:', error);
        updateStatus('disconnected', 'Verbindungsfehler');
        showNotification('Verbindung zum Server fehlgeschlagen. Stellen Sie sicher, dass der Backend-Server läuft.', 'error');
    });
}

// Display QR code
function displayQRCode(qrData) {
    qrCode.innerHTML = `<img src="${qrData}" alt="WhatsApp QR Code">`;
}

// Show QR section
function showQRSection() {
    qrSection.style.display = 'flex';
    chatSection.style.display = 'none';
}

// Show chat section
function showChatSection() {
    qrSection.style.display = 'none';
    chatSection.style.display = 'grid';
}

// Load chats
function loadChats() {
    if (!socket || !isConnected) {
        showNotification('Nicht mit dem Server verbunden', 'error');
        return;
    }
    socket.emit('getChats');
}

// Display chats
function displayChats(chats) {
    if (chats.length === 0) {
        chatList.innerHTML = '<div class="empty-state">Keine Chats verfügbar</div>';
        return;
    }

    chatList.innerHTML = chats.map(chat => `
        <div class="chat-item" data-chat-id="${chat.id}">
            <div class="chat-item-name">${chat.isGroup ? '👥 ' : ''}${chat.name}</div>
            <div class="chat-item-info">
                <span>${chat.isGroup ? 'Gruppe' : 'Kontakt'}</span>
                ${chat.unreadCount > 0 ? `<span style="background: var(--primary-color); color: white; padding: 2px 8px; border-radius: 10px; font-size: 0.75rem;">${chat.unreadCount}</span>` : ''}
            </div>
        </div>
    `).join('');

    // Add click handlers to chat items
    document.querySelectorAll('.chat-item').forEach(item => {
        item.addEventListener('click', () => {
            const chatId = item.dataset.chatId;
            // Remove both @c.us and @g.us suffixes
            phoneNumber.value = chatId.replace(/@c\.us$/, '').replace(/@g\.us$/, '');
        });
    });
}

// Display message
function displayMessage(message) {
    const messageElement = document.createElement('div');
    messageElement.className = 'message-item';
    
    const date = new Date(message.timestamp * 1000);
    const timeString = date.toLocaleString('de-DE');
    
    messageElement.innerHTML = `
        <div class="message-from">${message.from}</div>
        <div class="message-body">${escapeHtml(message.body)}</div>
        <div class="message-time">${timeString}</div>
    `;
    
    if (messagesList.querySelector('.empty-state')) {
        messagesList.innerHTML = '';
    }
    
    messagesList.insertBefore(messageElement, messagesList.firstChild);
}

// Handle message form submission
messageForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    if (!socket || !isConnected) {
        showNotification('Nicht mit dem Server verbunden', 'error');
        return;
    }
    
    const number = phoneNumber.value.trim();
    const message = messageText.value.trim();
    
    if (!number || !message) {
        showNotification('Bitte füllen Sie alle Felder aus', 'error');
        return;
    }
    
    socket.emit('sendMessage', { number, message });
});

// Refresh chats button
refreshChatsBtn.addEventListener('click', loadChats);

// Connect button
connectBtn.addEventListener('click', connectToServer);

// Show notification
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px 20px;
        background: ${type === 'success' ? '#4caf50' : type === 'error' ? '#f44336' : '#2196f3'};
        color: white;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.2);
        z-index: 1000;
        animation: slideIn 0.3s ease;
    `;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Escape HTML to prevent XSS
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Add CSS for animations
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(400px);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(400px);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// Auto-connect on page load
window.addEventListener('load', () => {
    connectToServer();
});
