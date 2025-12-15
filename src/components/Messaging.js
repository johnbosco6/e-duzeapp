
import { getFriends, generateShareLink, getFriendCode, addFriend, getUserProfile } from '../services/storage.js';
import { getAllDeals } from '../services/deals.js';
import { getFavoriteStores } from '../services/storage.js';
import { subscribeToMessages, sendMessage, deleteMessage, subscribeToPresence } from '../services/chat.js';

export default function Messaging() {
    const friends = getFriends();
    const deals = getAllDeals();
    const myProfile = getUserProfile();
    const myFavorites = getFavoriteStores();

    setTimeout(() => {
        // --- CHAT LOGIC ---
        const chatContainer = document.getElementById('chat-messages');
        const chatInput = document.getElementById('chat-input');
        const chatSendBtn = document.getElementById('chat-send-btn');
        const activeUsersList = document.getElementById('active-users-list');

        let unsubscribeMessages;
        let unsubscribePresence;

        function renderMessages(messages) {
            if (!chatContainer) return;
            // Get my user ID for checking ownership
            const myUserId = myProfile.email || myProfile.friendCode || 'user_' + (myProfile.name || 'anon').replace(/\s+/g, '');

            chatContainer.innerHTML = messages.map(msg => {
                const isMe = msg.userId === myUserId;
                return `
                <div class="chat-bubble-row ${isMe ? 'me' : 'other'}">
                    ${!isMe ? `<div class="chat-bubble-avatar">${msg.avatar}</div>` : ''}
                    <div class="chat-bubble ${isMe ? 'me' : 'other'}">
                        <div class="chat-bubble-header">
                            <span class="chat-bubble-name">${msg.sender}</span>
                            <span class="chat-bubble-time">${new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                        </div>
                        <div class="chat-bubble-text">${msg.text}</div>
                        ${isMe ? `<button class="delete-msg-btn" data-id="${msg.id}">🗑️</button>` : ''}
                    </div>
                </div>
            `;
            }).join('');

            // Scroll to bottom
            chatContainer.scrollTop = chatContainer.scrollHeight;

            // Attach delete handlers
            document.querySelectorAll('.delete-msg-btn').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    const id = e.target.dataset.id;
                    if (confirm("Delete this message?")) {
                        deleteMessage(id);
                    }
                });
            });
        }

        function renderActiveUsers(users) {
            if (!activeUsersList) return;
            // Filter out 'me' from visual list if desired, or keep all
            const myUserId = myProfile.email || myProfile.friendCode || 'user_' + (myProfile.name || 'anon').replace(/\s+/g, '');

            if (users.length <= 1) { // Only me
                activeUsersList.innerHTML = '<div class="empty-state-small">No other users online. Open this app in another tab to test!</div>';
                return;
            }

            activeUsersList.innerHTML = users
                .filter(u => u.id !== myUserId)
                .map(u => `
                <div class="friend-nearby-card">
                    <div class="friend-avatar">${u.avatar}</div>
                    <div class="friend-details">
                        <div class="friend-name">${u.name}</div>
                        <div class="friend-meta">
                            <span class="status-dot online"></span> Online
                        </div>
                    </div>
                </div>
            `).join('');
        }

        if (chatContainer) {
            // Subscribe to updates
            unsubscribeMessages = subscribeToMessages(renderMessages);
            unsubscribePresence = subscribeToPresence(renderActiveUsers);

            // Send Message
            const handleSend = () => {
                const text = chatInput.value.trim();
                if (text) {
                    sendMessage(text);
                    chatInput.value = '';
                }
            };

            chatSendBtn.addEventListener('click', handleSend);
            chatInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') handleSend();
            });
        }

        // --- MATCHMAKING LOGIC ---
        const matchBtn = document.getElementById('find-match-btn');
        if (matchBtn) {
            matchBtn.addEventListener('click', () => {
                const resultsContainer = document.getElementById('match-results');
                resultsContainer.innerHTML = '<div class="loading-spinner"></div> Finding matches...';

                setTimeout(() => {
                    // Match with online users instead of mock friends
                    // Just simulation: Assume random compatibility for now
                    resultsContainer.innerHTML = '<p class="match-found">Looking for shoppers...</p>';
                }, 1000);
            });
        }

        // --- SHARE DEAL LOGIC ---
        const shareBtn = document.getElementById('share-deal-btn');
        const dealSelect = document.getElementById('share-deal-select');
        const filterFavsCheckbox = document.getElementById('filter-favs-share');

        function renderDealOptions(filterByFavorites) {
            if (!dealSelect) return;

            let displayDeals = deals;

            if (filterByFavorites) {
                displayDeals = deals.filter(d => myFavorites.some(fav => fav.name === d.store));
            }

            if (displayDeals.length === 0) {
                dealSelect.innerHTML = '<option value="">-- No deals found --</option>';
                return;
            }

            dealSelect.innerHTML = '<option value="">-- Choose a deal --</option>' +
                displayDeals.map((d) => {
                    const originalIndex = deals.indexOf(d);
                    return `<option value="${originalIndex}">${d.store} - ${d.product} (${d.discount})</option>`;
                }).join('');
        }

        if (shareBtn) {
            shareBtn.addEventListener('click', () => {
                const selectedIndex = dealSelect.value;
                if (selectedIndex === "") return alert("Please select a deal to share.");

                const deal = deals[selectedIndex];
                const link = generateShareLink(deal);

                navigator.clipboard.writeText(link).then(() => {
                    alert('Share link copied to clipboard! Send it to your friend.');
                });
            });

            renderDealOptions(false);

            if (filterFavsCheckbox) {
                filterFavsCheckbox.addEventListener('change', (e) => {
                    renderDealOptions(e.target.checked);
                });
            }
        }
    }, 0);

    return `
        <div id="messaging-view" class="fade-in">
            <h2 class="section-title">💬 Global Chat & Users</h2>

            <!-- Active Users Section (Real-Time) -->
            <div class="msg-section">
                <div class="section-header">
                    <h3>👥 Online Users (Nearby)</h3>
                </div>
                <div id="active-users-list" class="friends-nearby-list">
                    <div class="loading-text">Scanning for users...</div>
                </div>
            </div>

            <!-- Global Public Chat -->
            <div class="msg-section" style="padding: 0; overflow: hidden; display: flex; flex-direction: column; height: 400px;">
                <div class="chat-header" style="background: var(--accent-dark); color: white; padding: 10px; font-weight: bold;">
                    🌍 Public Channel
                </div>
                <div id="chat-messages" class="chat-messages-area">
                    <!-- Messages injected here -->
                </div>
                <div class="chat-input-area">
                    <input type="text" id="chat-input" placeholder="Type a message..." autocomplete="off">
                    <button id="chat-send-btn">➤</button>
                </div>
            </div>

            <!-- Share Discount Section -->
            <div class="msg-section">
                <h3>🎁 Share a Discount</h3>
                <div class="form-group">
                    <label>Select a deal to share</label>
                    <div style="margin-bottom: 8px;">
                        <input type="checkbox" id="filter-favs-share"> 
                        <label for="filter-favs-share" style="display:inline; font-weight:normal; margin-left: 5px;">Only from my favorite stores</label>
                    </div>
                    <select id="share-deal-select" class="form-input">
                        <option value="">Loading deals...</option>
                    </select>
                </div>
                <button id="share-deal-btn" class="btn-secondary full-width">🔗 Copy Share Link</button>
            </div>
        </div>
    `;
}
