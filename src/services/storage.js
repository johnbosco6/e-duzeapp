const HISTORY_KEY = 'nearby_scan_history';
const PROFILE_KEY = 'nearby_user_profile';
const FAVORITES_KEY = 'nearby_favorite_stores';
const NOTIFICATIONS_KEY = 'nearby_notification_prefs';
const COUPONS_KEY = 'nearby_saved_coupons';
const FRIENDS_KEY = 'nearby_friends';
const NEWSLETTER_KEY = 'nearby_newsletter_prefs';

// ========== HISTORY ==========
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

// ========== PROFILE ==========
export function getUserProfile() {
    const profile = localStorage.getItem(PROFILE_KEY);
    return profile ? JSON.parse(profile) : { name: '', email: '' };
}

export function saveUserProfile(profile) {
    localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
}

// ========== FAVORITE STORES ==========
export function getFavoriteStores() {
    const favorites = localStorage.getItem(FAVORITES_KEY);
    return favorites ? JSON.parse(favorites) : [];
}

export function addFavoriteStore(store) {
    const favorites = getFavoriteStores();
    // Check if already favorited
    if (!favorites.find(f => f.name === store.name)) {
        favorites.push({
            name: store.name,
            category: store.category,
            url: store.url,
            color: store.color,
            addedDate: new Date().toISOString()
        });
        localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
        return true;
    }
    return false;
}

export function removeFavoriteStore(storeName) {
    const favorites = getFavoriteStores();
    const filtered = favorites.filter(f => f.name !== storeName);
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(filtered));
}

export function isFavoriteStore(storeName) {
    const favorites = getFavoriteStores();
    return favorites.some(f => f.name === storeName);
}

// ========== NOTIFICATION PREFERENCES ==========
export function getNotificationPreferences() {
    const prefs = localStorage.getItem(NOTIFICATIONS_KEY);
    return prefs ? JSON.parse(prefs) : {
        deals: true,
        newsletter: true,
        friendAlerts: true,
        locationBased: true
    };
}

export function saveNotificationPreferences(prefs) {
    localStorage.setItem(NOTIFICATIONS_KEY, JSON.stringify(prefs));
}

export function toggleNotification(type) {
    const prefs = getNotificationPreferences();
    prefs[type] = !prefs[type];
    saveNotificationPreferences(prefs);
    return prefs[type];
}

// ========== COUPONS ==========
export function getSavedCoupons() {
    const coupons = localStorage.getItem(COUPONS_KEY);
    const allCoupons = coupons ? JSON.parse(coupons) : [];
    // Filter out expired coupons
    const validCoupons = allCoupons.filter(c => new Date(c.validUntil) > new Date());
    if (validCoupons.length !== allCoupons.length) {
        localStorage.setItem(COUPONS_KEY, JSON.stringify(validCoupons));
    }
    return validCoupons;
}

export function addCoupon(coupon) {
    const coupons = getSavedCoupons();
    // Check if already saved
    const exists = coupons.find(c =>
        c.product === coupon.product &&
        c.store === coupon.store &&
        c.city === coupon.city
    );
    if (!exists) {
        coupons.push({
            ...coupon,
            savedDate: new Date().toISOString(),
            used: false
        });
        localStorage.setItem(COUPONS_KEY, JSON.stringify(coupons));
        return true;
    }
    return false;
}

export function removeCoupon(index) {
    const coupons = getSavedCoupons();
    coupons.splice(index, 1);
    localStorage.setItem(COUPONS_KEY, JSON.stringify(coupons));
}

export function markCouponAsUsed(index) {
    const coupons = getSavedCoupons();
    if (coupons[index]) {
        coupons[index].used = true;
        coupons[index].usedDate = new Date().toISOString();
        localStorage.setItem(COUPONS_KEY, JSON.stringify(coupons));
    }
}

export function addManualCoupon(couponData) {
    const coupons = getSavedCoupons();
    coupons.push({
        ...couponData,
        savedDate: new Date().toISOString(),
        used: false,
        manual: true
    });
    localStorage.setItem(COUPONS_KEY, JSON.stringify(coupons));
}

// ========== FRIENDS & ALERTS ==========
export function getFriendCode() {
    let profile = getUserProfile();
    if (!profile.friendCode) {
        // Generate unique friend code
        profile.friendCode = 'ED' + Math.random().toString(36).substring(2, 10).toUpperCase();
        saveUserProfile(profile);
    }
    return profile.friendCode;
}

export function getFriends() {
    const friends = localStorage.getItem(FRIENDS_KEY);
    return friends ? JSON.parse(friends) : [];
}

export function addFriend(friendCode, friendName) {
    const friends = getFriends();
    // Check if already added
    if (!friends.find(f => f.code === friendCode)) {
        friends.push({
            code: friendCode,
            name: friendName || `Friend ${friends.length + 1}`,
            addedDate: new Date().toISOString()
        });
        localStorage.setItem(FRIENDS_KEY, JSON.stringify(friends));
        return true;
    }
    return false;
}

export function removeFriend(friendCode) {
    const friends = getFriends();
    const filtered = friends.filter(f => f.code !== friendCode);
    localStorage.setItem(FRIENDS_KEY, JSON.stringify(filtered));
}

export function generateShareLink(deal) {
    const friendCode = getFriendCode();
    const dealData = encodeURIComponent(JSON.stringify({
        product: deal.product,
        store: deal.store,
        discount: deal.discount,
        price: deal.price,
        city: deal.city,
        from: friendCode
    }));
    return `${window.location.origin}${window.location.pathname}#share:${dealData}`;
}

// ========== NEWSLETTER PREFERENCES ==========
export function getNewsletterPreferences() {
    const prefs = localStorage.getItem(NEWSLETTER_KEY);
    return prefs ? JSON.parse(prefs) : {
        email: '',
        subscribed: false,
        categories: {
            deals: true,
            newStores: true,
            weeklyDigest: true
        },
        frequency: 'weekly' // daily, weekly, monthly
    };
}

export function saveNewsletterPreferences(prefs) {
    localStorage.setItem(NEWSLETTER_KEY, JSON.stringify(prefs));
}
