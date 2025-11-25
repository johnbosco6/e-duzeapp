// Mock deals data for Polish supermarkets
const MOCK_DEALS = [
    // Biedronka
    { id: 1, store: 'Biedronka', city: 'Warszawa', product: 'Chleb pszenny', discount: '30%', price: '2.49 zł', validUntil: '2025-11-30', category: 'food' },
    { id: 2, store: 'Biedronka', city: 'Kraków', product: 'Mleko 2%', discount: '20%', price: '3.99 zł', validUntil: '2025-11-28', category: 'food' },
    { id: 3, store: 'Biedronka', city: 'Warszawa', product: 'Jabłka', discount: '40%', price: '2.99 zł/kg', validUntil: '2025-11-27', category: 'food' },

    // Lidl
    { id: 4, store: 'Lidl', city: 'Warszawa', product: 'Ser żółty', discount: '25%', price: '12.99 zł', validUntil: '2025-11-29', category: 'food' },
    { id: 5, store: 'Lidl', city: 'Gdańsk', product: 'Kawa ziarnista', discount: '35%', price: '19.99 zł', validUntil: '2025-12-01', category: 'food' },
    { id: 6, store: 'Lidl', city: 'Poznań', product: 'Czekolada', discount: '50%', price: '4.99 zł', validUntil: '2025-11-26', category: 'food' },

    // Żabka
    { id: 7, store: 'Żabka', city: 'Warszawa', product: 'Napoje energetyczne', discount: '2+1 gratis', price: '5.99 zł', validUntil: '2025-11-30', category: 'drinks' },
    { id: 8, store: 'Żabka', city: 'Kraków', product: 'Hot-dog', discount: '30%', price: '4.99 zł', validUntil: '2025-11-28', category: 'food' },

    // Carrefour
    { id: 9, store: 'Carrefour', city: 'Warszawa', product: 'Wino czerwone', discount: '40%', price: '24.99 zł', validUntil: '2025-12-05', category: 'drinks' },
    { id: 10, store: 'Carrefour', city: 'Wrocław', product: 'Kurczak świeży', discount: '25%', price: '14.99 zł/kg', validUntil: '2025-11-27', category: 'food' },

    // Auchan
    { id: 11, store: 'Auchan', city: 'Warszawa', product: 'Proszek do prania', discount: '35%', price: '29.99 zł', validUntil: '2025-12-01', category: 'household' },
    { id: 12, store: 'Auchan', city: 'Katowice', product: 'Papier toaletowy', discount: '3+1 gratis', price: '19.99 zł', validUntil: '2025-11-29', category: 'household' },

    // MediaMarkt
    { id: 13, store: 'MediaMarkt', city: 'Warszawa', product: 'Słuchawki bezprzewodowe', discount: '50%', price: '149.99 zł', validUntil: '2025-12-10', category: 'electronics' },
    { id: 14, store: 'MediaMarkt', city: 'Gdańsk', product: 'Smartwatch', discount: '40%', price: '299.99 zł', validUntil: '2025-12-05', category: 'electronics' },

    // Zara
    { id: 15, store: 'Zara', city: 'Warszawa', product: 'Kurtka zimowa', discount: '60%', price: '199.99 zł', validUntil: '2025-12-15', category: 'fashion' },
    { id: 16, store: 'Zara', city: 'Kraków', product: 'Sweter wełniany', discount: '50%', price: '89.99 zł', validUntil: '2025-12-10', category: 'fashion' },

    // H&M
    { id: 17, store: 'H&M', city: 'Warszawa', product: 'Jeansy', discount: '40%', price: '79.99 zł', validUntil: '2025-12-08', category: 'fashion' },
    { id: 18, store: 'H&M', city: 'Poznań', product: 'Koszula', discount: '30%', price: '49.99 zł', validUntil: '2025-12-05', category: 'fashion' },
];

export function getAllDeals() {
    return MOCK_DEALS;
}

export function getDealsByCity(city) {
    if (!city) return MOCK_DEALS;
    return MOCK_DEALS.filter(deal =>
        deal.city.toLowerCase().includes(city.toLowerCase())
    );
}

export function getDealsByStore(store) {
    return MOCK_DEALS.filter(deal =>
        deal.store.toLowerCase().includes(store.toLowerCase())
    );
}

export function getDealsByCategory(category) {
    return MOCK_DEALS.filter(deal => deal.category === category);
}
