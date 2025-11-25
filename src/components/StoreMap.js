import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Function to get first letter of store name
function getStoreInitial(storeName, storeBrand) {
    const name = storeBrand || storeName || 'S';
    return name.charAt(0).toUpperCase();
}

// Function to get color based on store type
function getStoreColor(storeName, storeBrand) {
    const name = (storeBrand || storeName || '').toLowerCase();

    // Match store colors
    if (name.includes('biedronka')) return '#e30613';
    if (name.includes('lidl')) return '#0050aa';
    if (name.includes('żabka') || name.includes('zabka')) return '#006837';
    if (name.includes('auchan')) return '#e01e37';
    if (name.includes('carrefour')) return '#0071ce';
    if (name.includes('allegro')) return '#ff6600';
    if (name.includes('zara')) return '#000';
    if (name.includes('h&m')) return '#e4002b';
    if (name.includes('reserved')) return '#1e1e1e';
    if (name.includes('mediamarkt') || name.includes('media markt')) return '#e30613';

    // Default color
    return '#FF6B00';
}

// Create custom div icon with letter
function createLetterIcon(letter, color) {
    return L.divIcon({
        className: 'custom-letter-marker',
        html: `
            <div class="letter-marker" style="background-color: ${color};">
                ${letter}
            </div>
        `,
        iconSize: [32, 32],
        iconAnchor: [16, 32],
        popupAnchor: [0, -32]
    });
}

export default function StoreMap(elementId, lat, lng, stores = []) {
    const element = document.getElementById(elementId);
    if (!element) return;

    // Clear existing map if any
    element.innerHTML = '';

    // Create clean, simple map
    const map = L.map(elementId, {
        center: [lat, lng],
        zoom: 15,
        zoomControl: true,
        scrollWheelZoom: true
    });

    // Standard OpenStreetMap tiles
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors',
        maxZoom: 19
    }).addTo(map);

    // User location marker (blue circle with white border)
    const userIcon = L.divIcon({
        className: 'custom-user-marker',
        html: '<div class="user-location-marker"></div>',
        iconSize: [20, 20],
        iconAnchor: [10, 10],
        popupAnchor: [0, -10]
    });

    const userMarker = L.marker([lat, lng], { icon: userIcon }).addTo(map);
    userMarker.bindPopup(`
        <div class="map-popup-simple">
            <strong>📍 Twoja lokalizacja</strong>
        </div>
    `).openPopup();

    // Store markers with letter icons
    stores.forEach((store) => {
        if (store.lat && store.lon) {
            const storeName = store.tags?.name || 'Sklep';
            const storeBrand = store.tags?.brand || '';
            const letter = getStoreInitial(storeName, storeBrand);
            const color = getStoreColor(storeName, storeBrand);

            const marker = L.marker([store.lat, store.lon], {
                icon: createLetterIcon(letter, color)
            }).addTo(map);

            marker.bindPopup(`
                <div class="map-popup-simple">
                    <strong>🏪 ${storeName}</strong>
                    ${storeBrand ? `<p>${storeBrand}</p>` : ''}
                    <button onclick="window.open('https://www.google.com/maps/dir/?api=1&destination=${store.lat},${store.lon}', '_blank')" class="map-nav-btn">
                        🧭 Nawiguj
                    </button>
                </div>
            `);
        }
    });

    // Fit bounds to show all markers
    if (stores.length > 0) {
        const bounds = L.latLngBounds([[lat, lng]]);
        stores.forEach(store => {
            if (store.lat && store.lon) {
                bounds.extend([store.lat, store.lon]);
            }
        });
        map.fitBounds(bounds, { padding: [50, 50] });
    }

    return map;
}
