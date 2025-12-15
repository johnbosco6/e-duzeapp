
import { getUserProfile } from './storage.js';

const USERS_KEY = 'nearby_active_users';
const CHAT_KEY = 'nearby_chat_messages';
const HEARTBEAT_INTERVAL = 3000; // 3 seconds
const OFFLINE_THRESHOLD = 8000;  // 8 seconds

let presenceInterval;
let listeners = [];
let presenceListeners = [];

// Initialize Chat Service
export function initChatService() {
    // Start Heartbeat
    startHeartbeat();

    // Listen to storage changes (from other tabs)
    window.addEventListener('storage', (e) => {
        if (e.key === CHAT_KEY) {
            notifyListeners();
        }
        if (e.key === USERS_KEY) {
            notifyPresenceListeners();
        }
    });

    // Periodically clean up offline users
    setInterval(cleanupUsers, 5000);
}

// --- MESSAGING ---

export function getMessages() {
    const msgs = localStorage.getItem(CHAT_KEY);
    return msgs ? JSON.parse(msgs) : [];
}

export function sendMessage(text) {
    const profile = getUserProfile();
    const messages = getMessages();

    const newMessage = {
        id: Date.now() + Math.random().toString(36).substr(2, 9),
        text,
        sender: profile.name || 'Anonymous',
        avatar: profile.avatar || '👤',
        timestamp: new Date().toISOString(),
        userId: getUserId(profile)
    };

    messages.push(newMessage);
    // Keep last 50 messages
    if (messages.length > 50) messages.shift();

    localStorage.setItem(CHAT_KEY, JSON.stringify(messages));
    notifyListeners();
}

export function deleteMessage(messageId) {
    let messages = getMessages();
    messages = messages.filter(m => m.id !== messageId);
    localStorage.setItem(CHAT_KEY, JSON.stringify(messages));
    notifyListeners();
}

export function subscribeToMessages(callback) {
    listeners.push(callback);
    callback(getMessages()); // Initial call
    return () => {
        listeners = listeners.filter(l => l !== callback);
    };
}

function notifyListeners() {
    const msgs = getMessages();
    listeners.forEach(cb => cb(msgs));
}

// --- PRESENCE / USER DISCOVERY ---

function getUserId(profile) {
    // Generate a consistent ID based on email or name + friendCode
    // Ideally this would be a real ID, but for simulation:
    if (profile.email) return profile.email;
    if (profile.friendCode) return profile.friendCode;
    return 'user_' + (profile.name || 'anon').replace(/\s+/g, '');
}

function startHeartbeat() {
    updatePresence();
    presenceInterval = setInterval(updatePresence, HEARTBEAT_INTERVAL);
}

function updatePresence() {
    const profile = getUserProfile();
    const userId = getUserId(profile);
    const users = getActiveUsers();

    const me = {
        id: userId,
        name: profile.name || 'Anonymous',
        avatar: profile.avatar || '👤',
        lastSeen: Date.now()
    };

    // Update or add me
    const existingIndex = users.findIndex(u => u.id === userId);
    if (existingIndex >= 0) {
        users[existingIndex] = me;
    } else {
        users.push(me);
    }

    localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

export function getActiveUsers() {
    const users = localStorage.getItem(USERS_KEY);
    return users ? JSON.parse(users) : [];
}

function cleanupUsers() {
    const users = getActiveUsers();
    const now = Date.now();
    const activeUsers = users.filter(u => (now - u.lastSeen) < OFFLINE_THRESHOLD);

    if (activeUsers.length !== users.length) {
        localStorage.setItem(USERS_KEY, JSON.stringify(activeUsers));
        notifyPresenceListeners();
    }
}

export function subscribeToPresence(callback) {
    presenceListeners.push(callback);
    callback(getActiveUsers()); // Initial call
    return () => {
        presenceListeners = presenceListeners.filter(l => l !== callback);
    };
}

function notifyPresenceListeners() {
    const users = getActiveUsers();
    presenceListeners.forEach(cb => cb(users));
}
