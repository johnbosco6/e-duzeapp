const HISTORY_KEY = 'nearby_scan_history';
const PROFILE_KEY = 'nearby_user_profile';

export function getHistory() {
    const history = localStorage.getItem(HISTORY_KEY);
    return history ? JSON.parse(history) : [];
}

export function addToHistory(product) {
    const history = getHistory();
    const newEntry = {
        barcode: product.code || product._id,
        name: product.product_name,
        image: product.image_url,
        date: new Date().toISOString()
    };
    // Avoid duplicates at the top (remove existing if present)
    const filtered = history.filter(h => h.barcode !== newEntry.barcode);
    filtered.unshift(newEntry);
    localStorage.setItem(HISTORY_KEY, JSON.stringify(filtered.slice(0, 100))); // Increased limit
}

export function clearHistory() {
    localStorage.removeItem(HISTORY_KEY);
}

export function getUserProfile() {
    const profile = localStorage.getItem(PROFILE_KEY);
    return profile ? JSON.parse(profile) : { name: '', email: '' };
}

export function saveUserProfile(profile) {
    localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
}
