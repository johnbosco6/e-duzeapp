
import { getFriends, generateShareLink, getFriendCode, addFriend } from '../services/storage.js';
import { getAllDeals } from '../services/deals.js';
import { getFavoriteStores } from '../services/storage.js';
import { getUserProfile } from '../services/storage.js';

export default function Messaging() {
    const friends = getFriends();
    const deals = getAllDeals();
    const myProfile = getUserProfile();
    const myFavorites = getFavoriteStores();

    // Mock friends nearby data
    const nearbyFriends = friends.map(f => ({
        ...f,
        distance: Math.floor(Math.random() * 500) + 'm', // Mock distance
        status: Math.random() > 0.5 ? 'online' : 'offline',
        // Mock favorites for matchmaking (randomly assign some stores)
        favorites: ['Pick n Pay', 'Woolworths', 'Nandos', 'Clicks'].filter(() => Math.random() > 0.5)
    }));

    setTimeout(() => {
        // --- MATCHMAKING LOGIC ---
        const matchBtn = document.getElementById('find-match-btn');
        if (matchBtn) {
            matchBtn.addEventListener('click', () => {
                const resultsContainer = document.getElementById('match-results');
                resultsContainer.innerHTML = '<div class="loading-spinner"></div> Finding matches...';

                setTimeout(() => {
                    // Find friends with at least one common favorite store
                    const matches = nearbyFriends.filter(friend => {
                        const friendFavs = friend.favorites || [];
                        const common = friendFavs.filter(fav => myFavorites.some(mf => mf.name === fav));
                        friend.commonStores = common;
                        return common.length > 0;
                    });

                    if (matches.length > 0) {
                        resultsContainer.innerHTML = matches.map(m => `
                            <div class="match-card">
                                <div class="match-info">
                                    <div class="match-name">${m.name}</div>
                                    <div class="match-common">Common: ${m.commonStores.join(', ')}</div>
                                </div>
                                <button class="btn-sm" onclick="alert('Match found! You can now chat.')">Chat</button>
                            </div>
                        `).join('');
                    } else {
                        resultsContainer.innerHTML = '<p class="no-matches">No matches found based on favorite stores.</p>';
                    }
                }, 1500);
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
                    // Find original index to keep reference correct
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

            // Initial Render
            renderDealOptions(false);

            // Filter Change Event
            if (filterFavsCheckbox) {
                filterFavsCheckbox.addEventListener('change', (e) => {
                    renderDealOptions(e.target.checked);
                });
            }
        }

        // --- ADD FRIEND OVERLAY LOGIC --- (Reusing existing logic or simple prompt)
        const addFriendFab = document.getElementById('fab-add-friend');
        if (addFriendFab) {
            addFriendFab.addEventListener('click', () => {
                const code = prompt("Enter Friend Code:");
                if (code) {
                    if (addFriend(code)) {
                        alert("Friend added! Refreshing...");
                        window.location.reload(); // Simple reload to update state
                    } else {
                        alert("Could not add friend.");
                    }
                }
            });
        }

    }, 0);

    return `
        <div id="messaging-view" class="fade-in">
            <h2 class="section-title">💬 Messages & Friends</h2>

            <!-- Friends Nearby Section -->
            <div class="msg-section">
                <div class="section-header">
                    <h3>👥 Friends Nearby</h3>
                    <button class="btn-icon-sm" id="fab-add-friend" title="Add Friend">+</button>
                </div>
                ${nearbyFriends.length > 0 ? `
                    <div class="friends-nearby-list">
                        ${nearbyFriends.map(f => `
                            <div class="friend-nearby-card">
                                <div class="friend-avatar">${f.avatar || '👤'}</div>
                                <div class="friend-details">
                                    <div class="friend-name">${f.name}</div>
                                    <div class="friend-meta">
                                        <span class="status-dot ${f.status}"></span> ${f.distance} away
                                    </div>
                                </div>
                                <button class="btn-chat-icon">💬</button>
                            </div>
                        `).join('')}
                    </div>
                ` : `
                    <div class="empty-state-small">
                        <p>No friends added yet. Share your code!</p>
                        <div class="code-box">${getFriendCode()}</div>
                    </div>
                `}
            </div>

            <!-- Matchmaking Section -->
            <div class="msg-section highlight-section">
                <h3>💘 Store Matchmaking</h3>
                <p>Find friends who love the same stores as you!</p>
                <div id="match-results" class="match-results-area"></div>
                <button id="find-match-btn" class="btn-primary full-width">Find Shopping Buddies</button>
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

            <!-- Recent Chats (Mocked) -->
            <div class="msg-section">
                <h3>Recent Chats</h3>
                <div class="chats-list">
                    <div class="chat-item">
                        <div class="chat-avatar">🤖</div>
                        <div class="chat-content">
                            <div class="chat-name">System Bot</div>
                            <div class="chat-preview">Welcome to E-Duze messaging!</div>
                        </div>
                        <div class="chat-time">Now</div>
                    </div>
                </div>
            </div>
        </div>
    `;
}
