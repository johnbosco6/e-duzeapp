import './styles/style.css';
import { registerSW } from 'virtual:pwa-register';
import NavBar from './components/NavBar.js';
import Scanner from './components/Scanner.js';
import ProductCard from './components/ProductCard.js';
import StoreMap from './components/StoreMap.js';
import { getProduct } from './services/api.js';
import { getUserLocation, getNearbyStores, geocodeCity } from './services/location.js';
import { addToHistory, getHistory, clearHistory, getUserProfile, saveUserProfile } from './services/storage.js';
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
            <h2>Hello, ${profile.name || 'Guest'}! 👋</h2>
            <p>Find the best products and stores in your area.</p>
            <button class="scan-btn-large" data-target="scan">📷 Scan Now</button>
        </div>

        <div class="category-section">
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
            </div>
        </div>

        <div class="category-section">
            <div class="category-title">👕 Fashion & Clothing</div>
            <div class="store-grid">
                <a href="https://www.woolworths.co.za" target="_blank" class="store-logo" style="background: #006633;">Woolworths</a>
                <a href="https://www.edgars.co.za" target="_blank" class="store-logo" style="background: #000;">Edgars</a>
                <a href="https://www.truworths.co.za" target="_blank" class="store-logo" style="background: #1e1e1e;">Truworths</a>
                <a href="https://www.mrprice.co.za" target="_blank" class="store-logo" style="background: #e4002b;">Mr Price</a>
                <a href="https://www.ackermans.co.za" target="_blank" class="store-logo" style="background: #ff6600;">Ackermans</a>
            </div>
        </div>

        <div class="category-section">
            <div class="category-title">💊 Health & Beauty</div>
            <div class="store-grid">
                <a href="https://clicks.co.za" target="_blank" class="store-logo" style="background: #005eb8;">Clicks</a>
                <a href="https://www.dischem.co.za" target="_blank" class="store-logo" style="background: #009640;">Dis-Chem</a>
            </div>
        </div>

        <div class="category-section">
            <div class="category-title">📱 Electronics & Tech</div>
            <div class="store-grid">
                <a href="https://www.game.co.za" target="_blank" class="store-logo" style="background: #e30613;">Game</a>
                <a href="https://www.incredible.co.za" target="_blank" class="store-logo" style="background: #0066cc;">Incredible Connection</a>
                <a href="https://www.takealot.com" target="_blank" class="store-logo" style="background: #0b79bf;">Takealot</a>
                <a href="https://www.hificorp.co.za" target="_blank" class="store-logo" style="background: #000;">HiFi Corp</a>
                <a href="https://www.dionwired.co.za" target="_blank" class="store-logo" style="background: #ff6600;">Dion Wired</a>
            </div>
        </div>

        <div class="category-section">
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

        <div class="category-section">
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
  } else if (currentState === 'profile') {
    const history = getHistory();
    const historyHtml = history.length > 0
      ? history.map(h => `
          <div class="history-item" onclick="window.location.hash = '#product:${h.barcode}'">
            <div class="history-info">
                <span class="history-name">${h.name || 'Unknown product'}</span>
                <span class="history-date">${new Date(h.date).toLocaleDateString()}</span>
            </div>
          </div>
        `).join('')
      : '<p>No history.</p>';

    content = `
      <div id="profile-view" class="fade-in">
        <h2 class="section-title">Your Profile</h2>
        
        <div class="product-card" style="text-align: left;">
            <div class="form-group">
                <label>Name</label>
                <input type="text" id="profile-name" class="form-input" value="${profile.name || ''}" placeholder="Enter your name">
            </div>
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

        <h3 class="section-title">Full History</h3>
        <div class="history-list">
            ${historyHtml}
        </div>
        
        <button id="clear-history" class="btn-secondary" style="margin-top: 2rem; color: #ff4757;">Clear History</button>
      </div>
    `;
  }

  app.innerHTML = `
    <div class="app-container">
      <header class="app-header">
        <div class="header-content">
          <img src="/logo.png" alt="E-Duze" style="height: 80px; filter: drop-shadow(0 4px 6px rgba(0, 0, 0, 0.3));">
        </div>
      </header>
      <main id="main-content">
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
  } else if (currentState === 'deals') {
    // Add filter event listeners
    document.getElementById('province-filter').addEventListener('change', filterDeals);
    document.getElementById('city-filter').addEventListener('change', filterDeals);
    document.getElementById('street-filter').addEventListener('input', filterDeals);
    document.getElementById('store-filter').addEventListener('change', filterDeals);
  } else if (currentState === 'profile') {
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

      saveUserProfile({ name, email, location });
      alert('Profile saved!');
      render();
    });

    document.getElementById('detect-location').addEventListener('click', async () => {
      try {
        const pos = await new Promise((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(resolve, reject);
        });
        // Reverse geocoding could go here, but for now we just clear the manual entry to use GPS
        document.getElementById('profile-city').value = '';
        alert('Using GPS (save profile to confirm).');
      } catch (e) {
        alert('GPS error: ' + e.message);
      }
    });

    document.getElementById('clear-history').addEventListener('click', () => {
      if (confirm('Are you sure you want to clear your history?')) {
        clearHistory();
        render();
      }
    });
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
      </div>
    `).join('');
  }
}

window.addEventListener('hashchange', () => {
  const hash = window.location.hash;
  if (hash.startsWith('#product:')) {
    const barcode = hash.split(':')[1];
    onBarcodeDetected(barcode);
    history.replaceState(null, null, ' ');
  }
});

// Initialize app with splash screen
showSplashScreen();
