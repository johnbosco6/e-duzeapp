import './styles/style.css';
import { registerSW } from 'virtual:pwa-register';
import NavBar from './components/NavBar.js';
import Scanner from './components/Scanner.js';
import ProductCard from './components/ProductCard.js';
import StoreMap from './components/StoreMap.js';
import { getProduct } from './services/api.js';
import Messaging from './components/Messaging.js';
import AvatarSelector from './components/AvatarSelector.js';
import { STORES_DATA } from './services/stores.js';
import { getUserLocation, getNearbyStores, geocodeCity } from './services/location.js';
import {
  addToHistory, getHistory, clearHistory, getUserProfile, saveUserProfile,
  getFavoriteStores, addFavoriteStore, removeFavoriteStore,
  getNotificationPreferences, toggleNotification,
  getSavedCoupons, addCoupon, removeCoupon, markCouponAsUsed,
  getFriendCode, getFriends, addFriend, removeFriend, generateShareLink,
  getNewsletterPreferences, saveNewsletterPreferences
} from './services/storage.js';
import { getAllDeals, getDealsByCity, getDealsByStore, getDealsByLocation } from './services/deals.js';
import { SOUTH_AFRICAN_CITIES, getAllProvinces, getCitiesByProvince } from './services/cities.js';

// Register Service Worker
const updateSW = registerSW({
  onNeedRefresh() {
    if (confirm('New version available. Refresh?')) {
      updateSW(true);
    }
  },
});

const app = document.querySelector('#app');

// State
let currentState = 'splash';
let currentProduct = null;
let mapInstance = null;

// Show splash screen on load
function showSplashScreen() {
  app.innerHTML = `
    <div class="splash-screen">
      <div class="splash-content">
        <img src="/logo.png" alt="E-Duze" class="splash-logo">
        <div class="splash-loader"></div>
      </div>
    </div>
  `;

  // Transition to home after 2.5 seconds
  setTimeout(() => {
    currentState = 'home';
    render();
  }, 2500);
}

function render() {
  let content = '';
  const profile = getUserProfile();

  if (currentState === 'home') {
    const history = getHistory().slice(0, 3);
    const historyHtml = history.length > 0
      ? history.map(h => `
          <div class="history-item" onclick="window.location.hash = '#product:${h.barcode}'">
            <div class="history-info">
                <span class="history-name">${h.name || 'Unknown product'}</span>
                <span class="history-date">${new Date(h.date).toLocaleDateString()}</span>
            </div>
            <span>➡️</span>
          </div>
        `).join('')
      : '<p style="color: var(--text-light); text-align: center;">No scan history.</p>';

    content = `
      <div id="home-view" class="fade-in">
        <div class="hero">
            <img src="/logo.png" alt="E-Duze" class="hero-logo">
            <h2>Hello, ${profile.name || 'Guest'}! 👋</h2>
            <p>Find the best products and stores in your area.</p>
            <button class="scan-btn-large" data-target="scan">📷 Scan Now</button>
        </div>

        <!-- Category Filter Tabs -->
        <div class="category-filter-tabs">
            <button class="category-tab active" data-category="all">All Stores</button>
            <button class="category-tab" data-category="retail">🛒 Retail</button>
            <button class="category-tab" data-category="fashion">👕 Fashion</button>
            <button class="category-tab" data-category="health">💊 Health</button>
            <button class="category-tab" data-category="electronics">📱 Tech</button>
            <button class="category-tab" data-category="food">🍽️ Food</button>
            <button class="category-tab" data-category="home">🏠 Home</button>
            <button class="category-tab" data-category="sports">⚽ Sports</button>
        </div>

        <div class="category-section" data-category="retail">
            <div class="category-title">🛒 Retail & Supermarkets</div>
            <div class="store-grid">
                <a href="https://www.pnp.co.za" target="_blank" class="store-logo" style="background: #00923f;">Pick n Pay</a>
                <a href="https://www.checkers.co.za" target="_blank" class="store-logo" style="background: #0066cc;">Checkers</a>
                <a href="https://www.woolworths.co.za" target="_blank" class="store-logo" style="background: #006633;">Woolworths</a>
                <a href="https://www.spar.co.za" target="_blank" class="store-logo" style="background: #00923f;">Spar</a>
                <a href="https://www.shoprite.co.za" target="_blank" class="store-logo" style="background: #e30613;">Shoprite</a>
                <a href="https://www.makro.co.za" target="_blank" class="store-logo" style="background: #003da5;">Makro</a>
                <a href="https://www.boxer.co.za" target="_blank" class="store-logo" style="background: #e30613;">Boxer</a>
                <a href="https://foodloversmarket.co.za" target="_blank" class="store-logo" style="background: #8dc63f;">Food Lover's</a>
                <a href="https://www.cambridgefood.co.za" target="_blank" class="store-logo" style="background: #2c5f2d;">Cambridge</a>
                <a href="https://www.fruitandveg.co.za" target="_blank" class="store-logo" style="background: #97bf0d;">Fruit & Veg</a>
                <a href="https://www.okfoods.co.za" target="_blank" class="store-logo" style="background: #ff6600;">OK Foods</a>
                <a href="https://www.saverite.co.za" target="_blank" class="store-logo" style="background: #c41e3a;">Saverite</a>
            </div>
        </div>

        <div class="category-section" data-category="fashion">
            <div class="category-title">👕 Fashion & Clothing</div>
            <div class="store-grid">
                <a href="https://www.woolworths.co.za" target="_blank" class="store-logo" style="background: #006633;">Woolworths</a>
                <a href="https://www.edgars.co.za" target="_blank" class="store-logo" style="background: #000;">Edgars</a>
                <a href="https://www.truworths.co.za" target="_blank" class="store-logo" style="background: #1e1e1e;">Truworths</a>
                <a href="https://www.mrprice.co.za" target="_blank" class="store-logo" style="background: #e4002b;">Mr Price</a>
                <a href="https://www.ackermans.co.za" target="_blank" class="store-logo" style="background: #ff6600;">Ackermans</a>
                <a href="https://www.jet.co.za" target="_blank" class="store-logo" style="background: #ff0000;">Jet</a>
                <a href="https://www.pepstores.com" target="_blank" class="store-logo" style="background: #e30613;">Pep</a>
                <a href="https://www.markham.co.za" target="_blank" class="store-logo" style="background: #1a1a1a;">Markham</a>
                <a href="https://www.exact.co.za" target="_blank" class="store-logo" style="background: #2d2d2d;">Exact</a>
                <a href="https://www.legit.co.za" target="_blank" class="store-logo" style="background: #ff1493;">Legit</a>
            </div>
        </div>

        <div class="category-section" data-category="health">
            <div class="category-title">💊 Health & Beauty</div>
            <div class="store-grid">
                <a href="https://clicks.co.za" target="_blank" class="store-logo" style="background: #005eb8;">Clicks</a>
                <a href="https://www.dischem.co.za" target="_blank" class="store-logo" style="background: #009640;">Dis-Chem</a>
                <a href="https://www.redsquare.co.za" target="_blank" class="store-logo" style="background: #c41e3a;">Red Square</a>
                <a href="https://www.sorbet.co.za" target="_blank" class="store-logo" style="background: #ff69b4;">Sorbet</a>
                <a href="https://www.skinrenewal.co.za" target="_blank" class="store-logo" style="background: #8b4789;">Skin Renewal</a>
                <a href="https://www.thebodyshop.co.za" target="_blank" class="store-logo" style="background: #00a651;">The Body Shop</a>
                <a href="https://www.wellnesswarehouse.com" target="_blank" class="store-logo" style="background: #6ab023;">Wellness</a>
                <a href="https://www.dermalogica.co.za" target="_blank" class="store-logo" style="background: #4a4a4a;">Dermalogica</a>
            </div>
        </div>

        <div class="category-section" data-category="electronics">
            <div class="category-title">📱 Electronics & Tech</div>
            <div class="store-grid">
                <a href="https://www.game.co.za" target="_blank" class="store-logo" style="background: #e30613;">Game</a>
                <a href="https://www.incredible.co.za" target="_blank" class="store-logo" style="background: #0066cc;">Incredible</a>
                <a href="https://www.takealot.com" target="_blank" class="store-logo" style="background: #0b79bf;">Takealot</a>
                <a href="https://www.hificorp.co.za" target="_blank" class="store-logo" style="background: #000;">HiFi Corp</a>
                <a href="https://www.dionwired.co.za" target="_blank" class="store-logo" style="background: #ff6600;">Dion Wired</a>
                <a href="https://www.vodacom.co.za" target="_blank" class="store-logo" style="background: #e60000;">Vodacom</a>
                <a href="https://www.mtn.co.za" target="_blank" class="store-logo" style="background: #ffcb05;">MTN</a>
                <a href="https://www.cellc.co.za" target="_blank" class="store-logo" style="background: #0057a8;">Cell C</a>
            </div>
        </div>

        <div class="category-section" data-category="food">
            <div class="category-title">🍽️ Restaurants & Food</div>
            <div class="store-grid">
                <a href="https://www.nandos.co.za" target="_blank" class="store-logo" style="background: #8B0000;">Nandos</a>
                <a href="https://www.kfc.co.za" target="_blank" class="store-logo" style="background: #e4002b;">KFC</a>
                <a href="https://www.oceanbasket.com" target="_blank" class="store-logo" style="background: #0066cc;">Ocean Basket</a>
                <a href="https://www.steers.co.za" target="_blank" class="store-logo" style="background: #c41e3a;">Steers</a>
                <a href="https://www.spur.co.za" target="_blank" class="store-logo" style="background: #8B4513;">Spur</a>
                <a href="https://www.debonairspizza.co.za" target="_blank" class="store-logo" style="background: #ff6600;">Debonairs</a>
                <a href="https://wimpy.co.za" target="_blank" class="store-logo" style="background: #e30613;">Wimpy</a>
                <a href="https://www.romanspizza.co.za" target="_blank" class="store-logo" style="background: #ff6600;">Roman's Pizza</a>
                <a href="https://muggandbean.co.za" target="_blank" class="store-logo" style="background: #4a3c31;">Mugg & Bean</a>
                <a href="https://fishaways.co.za" target="_blank" class="store-logo" style="background: #0066cc;">Fishaways</a>
                <a href="https://www.mcdonalds.co.za" target="_blank" class="store-logo" style="background: #ffc72c;">McDonalds</a>
                <a href="https://www.burgerking.co.za" target="_blank" class="store-logo" style="background: #003366;">Burger King</a>
            </div>
        </div>

        <div class="category-section" data-category="home">
            <div class="category-title">🏠 Home & Garden</div>
            <div class="store-grid">
                <a href="https://www.builders.co.za" target="_blank" class="store-logo" style="background: #ff6600;">Builders</a>
                <a href="https://www.leroymerlin.co.za" target="_blank" class="store-logo" style="background: #78be20;">Leroy Merlin</a>
                <a href="https://www.outdoorwarehouse.co.za" target="_blank" class="store-logo" style="background: #006837;">Outdoor WH</a>
                <a href="https://www.athome.co.za" target="_blank" class="store-logo" style="background: #e4002b;">@Home</a>
                <a href="https://www.sheetstreet.co.za" target="_blank" class="store-logo" style="background: #0066cc;">Sheet Street</a>
                <a href="https://www.mrphome.com" target="_blank" class="store-logo" style="background: #e4002b;">Mr Price Home</a>
                <a href="https://www.coricraft.co.za" target="_blank" class="store-logo" style="background: #8b4513;">Coricraft</a>
                <a href="https://www.russells.co.za" target="_blank" class="store-logo" style="background: #1a1a1a;">Russells</a>
            </div>
        </div>

        <div class="category-section" data-category="sports">
            <div class="category-title">⚽ Sports & Outdoor</div>
            <div class="store-grid">
                <a href="https://www.sportscene.co.za" target="_blank" class="store-logo" style="background: #000;">Sportscene</a>
                <a href="https://www.totalsports.co.za" target="_blank" class="store-logo" style="background: #e30613;">Totalsports</a>
                <a href="https://www.capeunionmart.co.za" target="_blank" class="store-logo" style="background: #ff6600;">Cape Union</a>
                <a href="https://www.outdoorwarehouse.co.za" target="_blank" class="store-logo" style="background: #006837;">Outdoor WH</a>
                <a href="https://www.theproshop.co.za" target="_blank" class="store-logo" style="background: #0066cc;">The Pro Shop</a>
                <a href="https://www.tekkietown.com" target="_blank" class="store-logo" style="background: #ffd700;">Tekkie Town</a>
            </div>
        </div>

        <div class="category-section" data-category="retail">
            <div class="category-title">🏬 Malls & Shopping Centers</div>
            <div class="store-grid">
                <a href="https://www.sandtoncity.com" target="_blank" class="store-logo" style="background: #d4af37;">Sandton City</a>
                <a href="https://www.waterfront.co.za" target="_blank" class="store-logo" style="background: #0066cc;">V&A Waterfront</a>
                <a href="https://www.gatewayworld.co.za" target="_blank" class="store-logo" style="background: #003366;">Gateway Theatre</a>
            </div>
        </div>

        <h3 class="section-title">What would you like to do?</h3>
        <div class="features-grid">
            <div class="feature-card" data-target="scan">
                <span class="feature-icon">🔍</span>
                Scan
            </div>
            <div class="feature-card" data-target="map">
                <span class="feature-icon">🗺️</span>
                Map
            </div>
            <div class="feature-card" data-target="profile">
                <span class="feature-icon">👤</span>
                Profile
            </div>
        </div>

        <div class="recent-scans">
            <h3 class="section-title">Recent Scans</h3>
            ${historyHtml}
        </div>
      </div>
    `;
  } else if (currentState === 'deals') {
    const allDeals = getAllDeals();
    const provinces = getAllProvinces();
    const cities = [...new Set(allDeals.map(d => d.city))].sort();
    const stores = [...new Set(allDeals.map(d => d.store))].sort();

    content = `
      <div id="deals-view" class="fade-in">
        <h2 class="section-title">🎟️ Offers & Coupons</h2>
        
        <div class="product-card" style="text-align: left; margin-bottom: 1.5rem;">
          <div class="form-group">
            <label>📍 Province</label>
            <select id="province-filter" class="form-input">
              <option value="">All provinces</option>
              ${provinces.map(p => `<option value="${p}">${p}</option>`).join('')}
            </select>
          </div>
          <div class="form-group">
            <label>🏛️ City</label>
            <select id="city-filter" class="form-input">
              <option value="">All cities</option>
              ${cities.map(city => `<option value="${city}">${city}</option>`).join('')}
            </select>
          </div>
          <div class="form-group">
            <label>🛣️ Street (optional)</label>
            <input type="text" id="street-filter" class="form-input" placeholder="e.g. Sandton Drive">
          </div>
          <div class="form-group">
            <label>🏪 Store</label>
            <select id="store-filter" class="form-input">
              <option value="">All stores</option>
              ${stores.map(store => `<option value="${store}">${store}</option>`).join('')}
            </select>
          </div>
        </div>

        <div id="deals-container">
          ${allDeals.map(deal => `
            <div class="deal-card">
              <div class="deal-header">
                <span class="deal-store">${deal.store}</span>
                <span class="deal-discount">${deal.discount}</span>
              </div>
              <h3 class="deal-product">${deal.product}</h3>
              <div class="deal-details">
                <span class="deal-price">💰 ${deal.price}</span>
              </div>
              <div class="deal-location">
                <div>🏛️ ${deal.city}</div>
                <div class="deal-street">🛣️ ${deal.street}</div>
              </div>
              <div class="deal-validity">Valid until: ${deal.validUntil}</div>
              <button class="clip-coupon-btn" onclick='window.clipCoupon(${JSON.stringify(deal).replace(/'/g, "&apos;")})'>
                🎟️ Clip Coupon
              </button>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  } else if (currentState === 'scan') {
    content = `
      <div id="scan-view" class="fade-in">
        <h3 class="section-title">Scanning...</h3>
        <div id="interactive" class="viewport"></div>
        <button class="btn-secondary" style="margin-top: 1rem;" data-target="home">Cancel</button>
      </div>
    `;
  } else if (currentState === 'map') {
    content = `
      <div id="map-view" class="fade-in" style="height: 100%;">
        <button class="map-close-btn" data-target="home">✕</button>
        <div class="map-container">
            <div class="map-search-bar">
                <input type="text" id="map-search-input" class="map-search-input" placeholder="Search for product (e.g. shoes) or store...">
                <button id="map-search-btn" class="map-search-btn">🔍</button>
            </div>
            <div id="full-map" style="height: 100%; width: 100%;"></div>
        </div>
      </div>
    `;
  } else if (currentState === 'product') {
    content = `
      <div id="product-view" class="fade-in">
        <button class="back-btn" data-target="home">← Back</button>
        ${currentProduct ? ProductCard(currentProduct) : '<p>Loading product...</p>'}
        <h3 class="section-title" style="margin-top: 1.5rem;">Availability Nearby</h3>
        <div id="map" style="height: 300px; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 10px rgba(0,0,0,0.1);"></div>
      </div>
    `;
  } else if (currentState === 'messaging') {
    content = Messaging();
  } else if (currentState === 'profile') {
    const history = getHistory();
    const favorites = getFavoriteStores();
    const notifPrefs = getNotificationPreferences();
    const coupons = getSavedCoupons();
    const friendCode = getFriendCode();
    const friends = getFriends();
    const newsletterPrefs = getNewsletterPreferences();

    // Track avatar changes locally before save
    let selectedAvatar = profile.avatar;
    let selectedGender = profile.gender;
    const onAvatarUpdate = (updates) => {
      if (updates.avatar) selectedAvatar = updates.avatar;
      if (updates.gender) selectedGender = updates.gender;
    };

    // Helper function to calculate days until expiry
    const getDaysUntilExpiry = (validUntil) => {
      const expiry = new Date(validUntil);
      const today = new Date();
      const diffTime = expiry - today;
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return diffDays;
    };

    // Favorites HTML
    const favoritesHtml = favorites.length > 0
      ? `<div class="favorites-grid">
          ${favorites.map(fav => `
            <div class="favorite-store-card" style="background: ${fav.color};">
              ${fav.name}
              <div class="remove-favorite" onclick="window.removeFavorite('${fav.name}')">×</div>
            </div>
          `).join('')}
        </div>`
      : `<div class="empty-state">
          <div class="empty-state-icon">⭐</div>
          <div class="empty-state-text">No favorite stores yet</div>
        </div>`;

    // Coupons HTML
    const couponsHtml = coupons.length > 0
      ? `<div class="coupons-list">
          ${coupons.map((coupon, index) => {
        const daysLeft = getDaysUntilExpiry(coupon.validUntil);
        const isExpiringSoon = daysLeft <= 3;
        return `
              <div class="coupon-card ${coupon.used ? 'used' : ''}">
                <div class="coupon-header">
                  <div>
                    <div class="coupon-product">${coupon.product}</div>
                    <div class="coupon-store">${coupon.store}</div>
                  </div>
                  <div class="coupon-discount-badge">${coupon.discount}</div>
                </div>
                <div class="coupon-expiry ${isExpiringSoon ? 'expiring-soon' : ''}">
                  ${coupon.used ? '✓ Used' : `Expires in ${daysLeft} days`}
                </div>
                ${!coupon.used ? `
                  <div class="coupon-actions">
                    <button class="coupon-btn coupon-btn-use" onclick="window.useCoupon(${index})">Mark as Used</button>
                    <button class="coupon-btn coupon-btn-remove" onclick="window.removeCouponAt(${index})">Remove</button>
                  </div>
                ` : ''}
              </div>
            `;
      }).join('')}
        </div>`
      : `<div class="empty-state">
          <div class="empty-state-icon">🎟️</div>
          <div class="empty-state-text">No saved coupons</div>
          <button class="btn-primary" data-target="deals">Browse Deals</button>
        </div>`;

    // Friends HTML
    const friendsHtml = friends.length > 0
      ? `<div class="friends-list">
          ${friends.map(friend => `
            <div class="friend-item">
              <div class="friend-info">
                <div class="friend-name">${friend.name}</div>
                <div class="friend-code-small">${friend.code}</div>
              </div>
              <div class="friend-actions">
                <button class="friend-action-btn alert" onclick="window.alertFriend('${friend.code}')" title="Alert about deals">🔔</button>
                <button class="friend-action-btn remove" onclick="window.removeFriendByCode('${friend.code}')" title="Remove friend">×</button>
              </div>
            </div>
          `).join('')}
        </div>`
      : `<div class="empty-state">
          <div class="empty-state-icon">👥</div>
          <div class="empty-state-text">No friends added yet</div>
        </div>`;

    // History HTML
    const historyHtml = history.length > 0
      ? history.slice(0, 5).map(h => `
          <div class="history-item" onclick="window.location.hash = '#product:${h.barcode}'">
            <div class="history-info">
                <span class="history-name">${h.name || 'Unknown product'}</span>
                <span class="history-date">${new Date(h.date).toLocaleDateString()}</span>
            </div>
          </div>
        `).join('')
      : '<p style="color: var(--text-light); text-align: center;">No history.</p>';

    content = `
      <div id="profile-view" class="fade-in">
        <h2 class="section-title">👤 Your Profile</h2>
        
        <!-- Basic Info -->
        <div class="profile-section">
            <div class="form-group">
                <label>Name</label>
                <input type="text" id="profile-name" class="form-input" value="${profile.name || ''}" placeholder="Enter your name">
            </div>
            ${AvatarSelector(profile.avatar, profile.gender, onAvatarUpdate)}
            <div class="form-group">
                <label>Email</label>
                <input type="email" id="profile-email" class="form-input" value="${profile.email || ''}" placeholder="your@email.com">
            </div>
            <div class="form-group">
                <label>Location (City)</label>
                <div style="display: flex; gap: 10px;">
                    <input type="text" id="profile-city" class="form-input" value="${profile.location?.name || ''}" placeholder="e.g. Johannesburg">
                    <button id="detect-location" class="btn-secondary" style="width: auto; margin: 0;">📍</button>
                </div>
                <small style="color: var(--text-light);">Leave empty to use GPS.</small>
            </div>
            <button id="save-profile" class="btn-primary">Save Changes</button>
        </div>

        <!-- Favorite Stores -->
        <div class="profile-section">
            <div class="profile-section-title">⭐ Favorite Stores</div>
            ${favoritesHtml}
            <div class="add-favorite-container" style="display: flex; gap: 10px; margin-top: 10px;">
                <select id="new-favorite-select" class="form-input">
                    <option value="">Select a store to add...</option>
                    ${STORES_DATA.map(s => `<option value="${s.name}">${s.name} (${s.category})</option>`).join('')}
                </select>
                <button id="add-favorite-confirm" class="btn-secondary" style="width: auto;">Add</button>
            </div>
        </div>

        <!-- Notification Preferences -->
        <div class="profile-section">
            <div class="profile-section-title">🔔 Notifications</div>
            <div class="toggle-container">
                <div class="toggle-label">💰 Deals & Discounts</div>
                <div class="toggle-switch ${notifPrefs.deals ? 'active' : ''}" data-notif="deals">
                    <div class="toggle-slider"></div>
                </div>
            </div>
            <div class="toggle-container">
                <div class="toggle-label">📧 Newsletter</div>
                <div class="toggle-switch ${notifPrefs.newsletter ? 'active' : ''}" data-notif="newsletter">
                    <div class="toggle-slider"></div>
                </div>
            </div>
            <div class="toggle-container">
                <div class="toggle-label">👥 Friend Alerts</div>
                <div class="toggle-switch ${notifPrefs.friendAlerts ? 'active' : ''}" data-notif="friendAlerts">
                    <div class="toggle-slider"></div>
                </div>
            </div>
            <div class="toggle-container">
                <div class="toggle-label">📍 Location-based Offers</div>
                <div class="toggle-switch ${notifPrefs.locationBased ? 'active' : ''}" data-notif="locationBased">
                    <div class="toggle-slider"></div>
                </div>
            </div>
        </div>

        <!-- My Coupons -->
        <div class="profile-section">
            <div class="profile-section-title">🎟️ My Coupons</div>
            ${couponsHtml}
        </div>

        <!-- Friend Alerts -->
        <div class="profile-section">
            <div class="profile-section-title">👥 Friend Alerts</div>
            <div class="friend-code-container">
                <div class="friend-code-label">Your Friend Code</div>
                <div class="friend-code-display">${friendCode}</div>
                <button class="copy-code-btn" id="copy-friend-code">📋 Copy Code</button>
            </div>
            
            ${friendsHtml}
            
            <div class="add-friend-form">
                <input type="text" id="friend-code-input" class="friend-code-input" placeholder="Enter friend code" maxlength="10">
                <button class="add-friend-btn" id="add-friend-btn">Add</button>
            </div>
        </div>

        <!-- Newsletter Preferences -->
        <div class="profile-section">
            <div class="profile-section-title">📧 Newsletter Preferences</div>
            <div class="newsletter-categories">
                <div class="checkbox-container" data-category="deals">
                    <div class="custom-checkbox ${newsletterPrefs.categories.deals ? 'checked' : ''}"></div>
                    <div class="checkbox-label">💰 Deals & Promotions</div>
                </div>
                <div class="checkbox-container" data-category="newStores">
                    <div class="custom-checkbox ${newsletterPrefs.categories.newStores ? 'checked' : ''}"></div>
                    <div class="checkbox-label">🏪 New Stores</div>
                </div>
                <div class="checkbox-container" data-category="weeklyDigest">
                    <div class="custom-checkbox ${newsletterPrefs.categories.weeklyDigest ? 'checked' : ''}"></div>
                    <div class="checkbox-label">📰 Weekly Digest</div>
                </div>
            </div>
            
            <div class="form-group" style="margin-top: 1rem;">
                <label>Frequency</label>
                <div class="frequency-selector">
                    <button class="frequency-btn ${newsletterPrefs.frequency === 'daily' ? 'active' : ''}" data-freq="daily">Daily</button>
                    <button class="frequency-btn ${newsletterPrefs.frequency === 'weekly' ? 'active' : ''}" data-freq="weekly">Weekly</button>
                    <button class="frequency-btn ${newsletterPrefs.frequency === 'monthly' ? 'active' : ''}" data-freq="monthly">Monthly</button>
                </div>
            </div>
        </div>

        <!-- Scan History -->
        <div class="profile-section">
            <h3 class="profile-section-title">📜 Recent Scans</h3>
            <div class="history-list">
                ${historyHtml}
            </div>
            ${history.length > 0 ? '<button id="clear-history" class="btn-secondary" style="margin-top: 1rem; color: #ff4757;">Clear History</button>' : ''}
        </div>
      </div>
    `;
  }

  app.innerHTML = `
    <div class="app-container">
      ${currentState !== 'home' ? `
      <header class="app-header">
        <div class="header-content">
          <img src="/logo.png" alt="E-Duze" style="height: 80px; filter: drop-shadow(0 4px 6px rgba(0, 0, 0, 0.3));">
        </div>
      </header>
      ` : ''}
      <main id="main-content" style="${currentState === 'home' ? 'padding-top: 1.5rem;' : ''}">
        ${content}
      </main>
      <nav id="bottom-nav">
        ${NavBar(currentState)}
      </nav>
    </div>
  `;

  // Post-render logic
  if (currentState === 'scan') {
    Scanner('interactive', onBarcodeDetected);
  } else if (currentState === 'product' && currentProduct) {
    initMap('map');
  } else if (currentState === 'map') {
    initFullMap();
    document.getElementById('map-search-btn').addEventListener('click', handleMapSearch);
    document.getElementById('map-search-input').addEventListener('keypress', (e) => {
      if (e.key === 'Enter') handleMapSearch();
    });
  } else if (currentState === 'home') {
    // Category filtering for home view
    const categoryTabs = document.querySelectorAll('.category-tab');
    const categorySections = document.querySelectorAll('.category-section');

    categoryTabs.forEach(tab => {
      tab.addEventListener('click', () => {
        const selectedCategory = tab.dataset.category;

        // Update active tab
        categoryTabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');

        // Filter sections
        if (selectedCategory === 'all') {
          categorySections.forEach(section => section.classList.remove('hidden'));
        } else {
          categorySections.forEach(section => {
            if (section.dataset.category === selectedCategory) {
              section.classList.remove('hidden');
            } else {
              section.classList.add('hidden');
            }
          });
        }
      });
    });
  } else if (currentState === 'deals') {
    // Add filter event listeners
    document.getElementById('province-filter').addEventListener('change', filterDeals);
    document.getElementById('city-filter').addEventListener('change', filterDeals);
    document.getElementById('street-filter').addEventListener('input', filterDeals);
    document.getElementById('store-filter').addEventListener('change', filterDeals);
  } else if (currentState === 'profile') {
    // Add Favorite Store (New Logic)
    document.getElementById('add-favorite-confirm').addEventListener('click', () => {
      const select = document.getElementById('new-favorite-select');
      const storeName = select.value;
      if (!storeName) return alert('Please select a store first.');

      const storeData = STORES_DATA.find(s => s.name === storeName);
      if (storeData) {
        if (addFavoriteStore(storeData)) {
          alert(`${storeName} added to favorites!`);
          render();
        } else {
          alert(`${storeName} is already in your favorites.`);
        }
      }
    });

    // Save Profile
    document.getElementById('save-profile').addEventListener('click', async () => {
      const name = document.getElementById('profile-name').value;
      const email = document.getElementById('profile-email').value;
      const city = document.getElementById('profile-city').value;

      let location = null;
      if (city) {
        const geocoded = await geocodeCity(city);
        if (geocoded) {
          location = geocoded;
        } else {
          alert('City not found. Please try again.');
          return;
        }
      }

      saveUserProfile({ name, email, location, avatar: selectedAvatar, gender: selectedGender });
      alert('Profile saved!');
      render();
    });

    // Detect Location
    document.getElementById('detect-location').addEventListener('click', async () => {
      try {
        const pos = await new Promise((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(resolve, reject);
        });
        document.getElementById('profile-city').value = '';
        alert('Using GPS (save profile to confirm).');
      } catch (e) {
        alert('GPS error: ' + e.message);
      }
    });

    // Notification Toggles
    document.querySelectorAll('.toggle-switch').forEach(toggle => {
      toggle.addEventListener('click', () => {
        const notifType = toggle.dataset.notif;
        const newState = toggleNotification(notifType);
        toggle.classList.toggle('active', newState);
      });
    });

    // Copy Friend Code
    document.getElementById('copy-friend-code').addEventListener('click', () => {
      navigator.clipboard.writeText(friendCode).then(() => {
        alert('Friend code copied to clipboard!');
      }).catch(() => {
        alert('Failed to copy code. Your code is: ' + friendCode);
      });
    });

    // Add Friend
    document.getElementById('add-friend-btn').addEventListener('click', () => {
      const code = document.getElementById('friend-code-input').value.trim().toUpperCase();
      if (!code) {
        alert('Please enter a friend code');
        return;
      }
      if (code === friendCode) {
        alert('You cannot add your own friend code!');
        return;
      }
      const friendName = prompt('Enter a name for this friend (optional):');
      if (addFriend(code, friendName)) {
        alert('Friend added successfully!');
        render();
      } else {
        alert('Friend already added or invalid code');
      }
    });

    // Newsletter Category Checkboxes
    document.querySelectorAll('.checkbox-container').forEach(container => {
      container.addEventListener('click', () => {
        const category = container.dataset.category;
        const checkbox = container.querySelector('.custom-checkbox');
        const prefs = getNewsletterPreferences();
        prefs.categories[category] = !prefs.categories[category];
        saveNewsletterPreferences(prefs);
        checkbox.classList.toggle('checked');
      });
    });

    // Newsletter Frequency Buttons
    document.querySelectorAll('.frequency-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const freq = btn.dataset.freq;
        const prefs = getNewsletterPreferences();
        prefs.frequency = freq;
        saveNewsletterPreferences(prefs);
        document.querySelectorAll('.frequency-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
      });
    });

    // Clear History
    const clearHistoryBtn = document.getElementById('clear-history');
    if (clearHistoryBtn) {
      clearHistoryBtn.addEventListener('click', () => {
        if (confirm('Are you sure you want to clear your history?')) {
          clearHistory();
          render();
        }
      });
    }
  }

  attachEvents();
}

function attachEvents() {
  document.querySelectorAll('[data-target]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const target = e.currentTarget.dataset.target;
      navigateTo(target);
    });
  });
}

function navigateTo(state) {
  currentState = state;
  render();
}

async function onBarcodeDetected(code) {
  console.log('Barcode detected:', code);
  currentState = 'product';
  currentProduct = null;
  render();

  const product = await getProduct(code);
  if (product) {
    currentProduct = product;
    addToHistory(product);
    render();
  } else {
    alert('Product not found in database.');
    navigateTo('home');
  }
}

async function initMap(elementId) {
  try {
    const location = await getUserLocation();
    const stores = await getNearbyStores(location.lat, location.lng);
    StoreMap(elementId, location.lat, location.lng, stores);
  } catch (error) {
    console.error('Location error:', error);
    const el = document.getElementById(elementId);
    if (el) el.innerHTML = '<p>Unable to get location.</p>';
  }
}

async function initFullMap() {
  try {
    const location = await getUserLocation();
    // Default to supermarkets if no search
    const stores = await getNearbyStores(location.lat, location.lng);
    mapInstance = StoreMap('full-map', location.lat, location.lng, stores);
  } catch (error) {
    console.error('Map error:', error);
  }
}

async function handleMapSearch() {
  const query = document.getElementById('map-search-input').value;
  if (!query) return;

  try {
    const location = await getUserLocation();
    const stores = await getNearbyStores(location.lat, location.lng, query);

    // Re-init map with new stores (simple approach)
    if (mapInstance) {
      mapInstance.remove(); // Leaflet remove
    }
    mapInstance = StoreMap('full-map', location.lat, location.lng, stores);
  } catch (error) {
    console.error('Search error:', error);
    alert('Search error.');
  }
}

function filterDeals() {
  const provinceFilter = document.getElementById('province-filter').value;
  const cityFilter = document.getElementById('city-filter').value;
  const streetFilter = document.getElementById('street-filter').value.toLowerCase();
  const storeFilter = document.getElementById('store-filter').value;

  let deals = getAllDeals();

  // Filter by province (updates city dropdown)
  if (provinceFilter) {
    const citiesInProvince = getCitiesByProvince(provinceFilter).map(c => c.name);
    deals = deals.filter(d => citiesInProvince.includes(d.city));

    // Update city dropdown to show only cities in selected province
    const citySelect = document.getElementById('city-filter');
    const currentCity = citySelect.value;
    citySelect.innerHTML = '<option value="">All cities</option>' +
      citiesInProvince.sort().map(city =>
        `<option value="${city}" ${city === currentCity ? 'selected' : ''}>${city}</option>`
      ).join('');
  }

  // Filter by city
  if (cityFilter) {
    deals = deals.filter(d => d.city === cityFilter);
  }

  // Filter by street
  if (streetFilter) {
    deals = deals.filter(d => d.street.toLowerCase().includes(streetFilter));
  }

  // Filter by store
  if (storeFilter) {
    deals = deals.filter(d => d.store === storeFilter);
  }

  const container = document.getElementById('deals-container');
  if (deals.length === 0) {
    container.innerHTML = '<div class="product-card"><p>No offers for selected filters</p></div>';
  } else {
    container.innerHTML = deals.map(deal => `
      <div class="deal-card">
        <div class="deal-header">
          <span class="deal-store">${deal.store}</span>
          <span class="deal-discount">${deal.discount}</span>
        </div>
        <h3 class="deal-product">${deal.product}</h3>
        <div class="deal-details">
          <span class="deal-price">💰 ${deal.price}</span>
        </div>
        <div class="deal-location">
          <div>🏛️ ${deal.city}</div>
          <div class="deal-street">🛣️ ${deal.street}</div>
        </div>
        <div class="deal-validity">Valid until: ${deal.validUntil}</div>
        <button class="clip-coupon-btn" onclick='window.clipCoupon(${JSON.stringify(deal).replace(/'/g, "&apos;")})'>
          🎟️ Clip Coupon
        </button>
      </div>
    `).join('');
  }
}

// ========== GLOBAL HELPER FUNCTIONS ==========
// These are called from onclick handlers in the HTML

window.removeFavorite = (storeName) => {
  if (confirm(`Remove ${storeName} from favorites?`)) {
    removeFavoriteStore(storeName);
    render();
  }
};

window.useCoupon = (index) => {
  markCouponAsUsed(index);
  alert('Coupon marked as used!');
  render();
};

window.removeCouponAt = (index) => {
  if (confirm('Remove this coupon?')) {
    removeCoupon(index);
    render();
  }
};

window.alertFriend = (friendCode) => {
  alert(`Alert feature coming soon! Will notify friend ${friendCode} about deals.`);
};

window.removeFriendByCode = (friendCode) => {
  if (confirm('Remove this friend?')) {
    removeFriend(friendCode);
    render();
  }
};

window.clipCoupon = (deal) => {
  if (addCoupon(deal)) {
    alert('Coupon saved to your profile!');
    render();
  } else {
    alert('Coupon already saved!');
  }
};

window.addEventListener('hashchange', () => {
  const hash = window.location.hash;
  if (hash.startsWith('#product:')) {
    const barcode = hash.split(':')[1];
    onBarcodeDetected(barcode);
    history.replaceState(null, null, ' ');
  } else if (hash.startsWith('#share:')) {
    // Handle shared deal from friend
    try {
      const dealData = JSON.parse(decodeURIComponent(hash.split(':')[1]));
      alert(`${dealData.from} shared a deal with you!\n\n${dealData.product} at ${dealData.store}\n${dealData.discount} - ${dealData.price}`);
      currentState = 'deals';
      render();
    } catch (e) {
      console.error('Error parsing shared deal:', e);
    }
  }
});

// Initialize app with splash screen
showSplashScreen();
