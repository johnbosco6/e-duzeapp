import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Custom 3D-style icon for user location
const userIcon = L.divIcon({
    className: 'custom-user-marker',
    html: `
        <div class="marker-3d user-marker">
            <div class="marker-pin">📍</div>
            <div class="marker-shadow"></div>
        </div>
    `,
    iconSize: [40, 50],
    iconAnchor: [20, 50],
    popupAnchor: [0, -50]
});

// Custom 3D-style icon for stores
const storeIcon = L.divIcon({
    className: 'custom-store-marker',
    html: `
        <div class="marker-3d store-marker">
            <div class="marker-pin">🏪</div>
            <div class="marker-shadow"></div>
        </div>
    `,
    iconSize: [35, 45],
    iconAnchor: [17.5, 45],
    popupAnchor: [0, -45]
});

export default function StoreMap(elementId, lat, lng, stores = []) {
    const element = document.getElementById(elementId);
    if (!element) return;

    // Clear existing map if any
    element.innerHTML = '';

    // Create map with better default settings
    const map = L.map(elementId, {
        center: [lat, lng],
        zoom: 15, // Closer zoom for better detail
        zoomControl: true,
        scrollWheelZoom: true,
        doubleClickZoom: true,
        touchZoom: true
    });

    // Use better tile layer with more detail
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors',
        maxZoom: 19,
        minZoom: 10
    }).addTo(map);

    // Add user location marker with custom 3D icon
    const userMarker = L.marker([lat, lng], { icon: userIcon }).addTo(map);
    userMarker.bindPopup(`
        <div class="map-popup">
            <strong>📍 Twoja lokalizacja</strong>
            <p>Jesteś tutaj</p>
        </div>
    `).openPopup();

    // Add circle to show search radius
    L.circle([lat, lng], {
        color: '#FF6B00',
        fillColor: '#FF6B00',
        fillOpacity: 0.1,
        radius: 2000 // 2km radius
    }).addTo(map);

    // Store markers with custom 3D icons
    stores.forEach((store, index) => {
        if (store.lat && store.lon) {
            const storeName = store.tags?.name || 'Sklep';
            const storeBrand = store.tags?.brand || '';
            const storeType = store.tags?.shop || store.tags?.amenity || 'store';

            const marker = L.marker([store.lat, store.lon], { icon: storeIcon }).addTo(map);

            marker.bindPopup(`
                <div class="map-popup">
                    <strong>🏪 ${storeName}</strong>
                    ${storeBrand ? `<p><em>${storeBrand}</em></p>` : ''}
                    <p class="store-type">${storeType}</p>
                    <button onclick="window.open('https://www.google.com/maps/dir/?api=1&destination=${store.lat},${store.lon}', '_blank')" class="map-directions-btn">
                        🧭 Nawiguj
                    </button>
                </div>
            `);
        }
    });

    // Fit bounds to show all markers if there are stores
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
