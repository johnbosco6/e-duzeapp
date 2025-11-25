import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

export default function StoreMap(elementId, lat, lng, stores = []) {
    const element = document.getElementById(elementId);
    if (!element) return;

    const map = L.map(elementId).setView([lat, lng], 14);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
    }).addTo(map);

    // User marker
    L.marker([lat, lng]).addTo(map)
        .bindPopup('Twoja lokalizacja')
        .openPopup();

    // Store markers
    stores.forEach(store => {
        if (store.lat && store.lon) {
            L.marker([store.lat, store.lon]).addTo(map)
                .bindPopup(`<b>${store.tags.name || 'Sklep'}</b><br>${store.tags.brand || ''}`);
        }
    });

    return map;
}
