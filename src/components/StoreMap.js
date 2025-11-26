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

    // Supermarkets
    if (name.includes('pick n pay') || name.includes('pnp')) return '#003366'; // Blue
    if (name.includes('checkers')) return '#008da5'; // Teal
    if (name.includes('woolworths')) return '#000000'; // Black
    if (name.includes('spar')) return '#00923f'; // Green
    if (name.includes('shoprite')) return '#e30613'; // Red
    if (name.includes('boxer')) return '#e30613'; // Red
    if (name.includes('food lover')) return '#8dc63f'; // Light Green
    if (name.includes('makro')) return '#003da5'; // Blue
    if (name.includes('game')) return '#e30613'; // Pink/Red

    // Pharmacies
    if (name.includes('clicks')) return '#005eb8'; // Blue
    if (name.includes('dis-chem') || name.includes('dischem')) return '#009640'; // Green

    // Restaurants & Fast Food
    if (name.includes('nandos')) return '#8B0000'; // Dark Red
    if (name.includes('kfc')) return '#e4002b'; // Red
    if (name.includes('mcdonald')) return '#ffc72c'; // Yellow
    if (name.includes('burger king')) return '#003366'; // Blue
    if (name.includes('steers')) return '#c41e3a'; // Red
    if (name.includes('spur')) return '#8B4513'; // Brown
    if (name.includes('wimpy')) return '#e30613'; // Red
    if (name.includes('debonairs')) return '#ff6600'; // Orange
    if (name.includes('ocean basket')) return '#0066cc'; // Blue
    if (name.includes('mugg & bean') || name.includes('mugg')) return '#4a3c31'; // Coffee
    if (name.includes('romans') || name.includes('roman\'s')) return '#ff6600'; // Orange

    // Fashion
    if (name.includes('edgars')) return '#e30613'; // Red
    if (name.includes('mr price') || name.includes('mrp')) return '#e30613'; // Red
    if (name.includes('truworths')) return '#1e1e1e'; // Dark Grey
    if (name.includes('ackermans')) return '#00923f'; // Blue/Green
    if (name.includes('pep')) return '#005eb8'; // Blue

    // Default color
    return '#0066CC';
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
