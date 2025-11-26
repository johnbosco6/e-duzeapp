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
    // Default query parts covering major categories
    let queryParts = [
        '["shop"~"supermarket|convenience|department_store|general|mall"]',
        '["amenity"~"restaurant|fast_food|cafe|pharmacy"]',
        '["shop"~"clothes|electronics|shoes"]'
    ];

    if (keyword) {
        const k = keyword.toLowerCase();
        if (k.includes('shoe')) queryParts = ['["shop"="shoes"]'];
        else if (k.includes('cloth') || k.includes('fashion')) queryParts = ['["shop"~"clothes|fashion"]'];
        else if (k.includes('tech') || k.includes('electr')) queryParts = ['["shop"~"electronics|mobile_phone|computer"]'];
        else if (k.includes('mall') || k.includes('center')) queryParts = ['["shop"="mall"]'];
        else if (k.includes('pharm') || k.includes('chem')) queryParts = ['["amenity"="pharmacy"]', '["shop"="chemist"]'];
        else if (k.includes('food') || k.includes('rest') || k.includes('eat')) queryParts = ['["amenity"~"restaurant|fast_food|cafe"]'];
        else if (k.includes('grocer') || k.includes('super')) queryParts = ['["shop"~"supermarket|convenience"]'];
    }

    // Construct query with multiple filters
    const queryItems = queryParts.map(filter => `
      node${filter}(around:5000, ${lat}, ${lng});
      way${filter}(around:5000, ${lat}, ${lng});
      relation${filter}(around:5000, ${lat}, ${lng});
    `).join('\n');

    // Overpass API query
    const query = `
    [out:json][timeout:25];
    (
      ${queryItems}
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
