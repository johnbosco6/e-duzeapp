import { getUserProfile } from './storage.js';

export function getUserLocation() {
    return new Promise((resolve, reject) => {
        // Check for manual location in profile first
        const profile = getUserProfile();
        if (profile.location && profile.location.lat && profile.location.lng) {
            resolve(profile.location);
            return;
        }

        if (!navigator.geolocation) {
            reject(new Error('Geolocation not supported'));
            return;
        }

        // Request high accuracy location
        navigator.geolocation.getCurrentPosition(
            (position) => resolve({
                lat: position.coords.latitude,
                lng: position.coords.longitude,
                accuracy: position.coords.accuracy
            }),
            (error) => reject(error),
            {
                enableHighAccuracy: true,
                timeout: 10000,
                maximumAge: 0
            }
        );
    });
}

export async function geocodeCity(cityName) {
    const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(cityName)}&limit=1`;
    try {
        const response = await fetch(url);
        const data = await response.json();
        if (data && data.length > 0) {
            return {
                lat: parseFloat(data[0].lat),
                lng: parseFloat(data[0].lon),
                name: data[0].display_name
            };
        }
        return null;
    } catch (error) {
        console.error('Geocoding error:', error);
        return null;
    }
}

export async function getNearbyStores(lat, lng, keyword = null) {
    let queryFilter = '["shop"~"supermarket|convenience"]';

    if (keyword) {
        const k = keyword.toLowerCase();
        if (k.includes('but') || k.includes('shoe')) queryFilter = '["shop"="shoes"]';
        else if (k.includes('ubra') || k.includes('cloth')) queryFilter = '["shop"="clothes"]';
        else if (k.includes('elek') || k.includes('tech')) queryFilter = '["shop"="electronics"]';
        else if (k.includes('galer') || k.includes('mall')) queryFilter = '["shop"="mall"]';
        else if (k.includes('aptek') || k.includes('pharm')) queryFilter = '["amenity"="pharmacy"]';
    }

    // Overpass API query
    const query = `
    [out:json][timeout:25];
    (
      node${queryFilter}(around:2000, ${lat}, ${lng});
      way${queryFilter}(around:2000, ${lat}, ${lng});
      relation${queryFilter}(around:2000, ${lat}, ${lng});
    );
    out center;
  `;
    const url = `https://overpass-api.de/api/interpreter?data=${encodeURIComponent(query)}`;

    try {
        const response = await fetch(url);
        const data = await response.json();
        return data.elements.map(el => ({
            lat: el.lat || el.center.lat,
            lon: el.lon || el.center.lon,
            tags: el.tags
        }));
    } catch (error) {
        console.error('Error fetching stores:', error);
        return [];
    }
}
