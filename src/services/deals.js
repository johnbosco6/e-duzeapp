// Comprehensive deals data with specific addresses
const MOCK_DEALS = [
    // Lublin - Biedronka
    { id: 1, store: 'Biedronka', city: 'Lublin', street: 'ul. Krakowskie Przedmieście 15', product: 'Chleb pszenny', discount: '30%', price: '2.49 zł', validUntil: '2025-12-05', category: 'food' },
    { id: 2, store: 'Biedronka', city: 'Lublin', street: 'ul. Lipowa 8', product: 'Mleko 2%', discount: '20%', price: '3.99 zł', validUntil: '2025-12-03', category: 'food' },
    { id: 3, store: 'Biedronka', city: 'Lublin', street: 'ul. Narutowicza 22', product: 'Jabłka', discount: '40%', price: '2.99 zł/kg', validUntil: '2025-12-02', category: 'food' },

    // Lublin - Lidl
    { id: 4, store: 'Lidl', city: 'Lublin', street: 'ul. Witosa 12', product: 'Ser żółty', discount: '25%', price: '12.99 zł', validUntil: '2025-12-04', category: 'food' },
    { id: 5, store: 'Lidl', city: 'Lublin', street: 'ul. Aleje Racławickie 18', product: 'Kawa ziarnista', discount: '35%', price: '19.99 zł', validUntil: '2025-12-06', category: 'food' },

    // Lublin - Żabka
    { id: 6, store: 'Żabka', city: 'Lublin', street: 'ul. Chopina 5', product: 'Napoje energetyczne', discount: '2+1 gratis', price: '5.99 zł', validUntil: '2025-12-05', category: 'drinks' },
    { id: 7, store: 'Żabka', city: 'Lublin', street: 'ul. Peowiaków 10', product: 'Hot-dog', discount: '30%', price: '4.99 zł', validUntil: '2025-12-03', category: 'food' },

    // Lublin - MediaMarkt
    { id: 8, store: 'MediaMarkt', city: 'Lublin', street: 'Galeria Olimp, ul. Lipowa 13', product: 'Słuchawki bezprzewodowe', discount: '50%', price: '149.99 zł', validUntil: '2025-12-15', category: 'electronics' },

    // Lublin - Zara
    { id: 9, store: 'Zara', city: 'Lublin', street: 'Galeria Olimp, ul. Lipowa 13', product: 'Kurtka zimowa', discount: '60%', price: '199.99 zł', validUntil: '2025-12-20', category: 'fashion' },

    // Warszawa
    { id: 10, store: 'Biedronka', city: 'Warszawa', street: 'ul. Marszałkowska 45', product: 'Chleb pszenny', discount: '30%', price: '2.49 zł', validUntil: '2025-12-05', category: 'food' },
    { id: 11, store: 'Lidl', city: 'Warszawa', street: 'ul. Puławska 120', product: 'Ser żółty', discount: '25%', price: '12.99 zł', validUntil: '2025-12-04', category: 'food' },
    { id: 12, store: 'Carrefour', city: 'Warszawa', street: 'ul. Targowa 72', product: 'Wino czerwone', discount: '40%', price: '24.99 zł', validUntil: '2025-12-10', category: 'drinks' },
    { id: 13, store: 'Auchan', city: 'Warszawa', street: 'ul. Modlińska 6', product: 'Proszek do prania', discount: '35%', price: '29.99 zł', validUntil: '2025-12-06', category: 'household' },
    { id: 14, store: 'MediaMarkt', city: 'Warszawa', street: 'Galeria Mokotów, ul. Wołoska 12', product: 'Smartwatch', discount: '40%', price: '299.99 zł', validUntil: '2025-12-10', category: 'electronics' },
    { id: 15, store: 'Zara', city: 'Warszawa', street: 'Złote Tarasy, ul. Złota 59', product: 'Sweter wełniany', discount: '50%', price: '89.99 zł', validUntil: '2025-12-15', category: 'fashion' },
    { id: 16, store: 'H&M', city: 'Warszawa', street: 'Arkadia, Al. Jana Pawła II 82', product: 'Jeansy', discount: '40%', price: '79.99 zł', validUntil: '2025-12-13', category: 'fashion' },

    // Kraków
    { id: 17, store: 'Biedronka', city: 'Kraków', street: 'ul. Floriańska 12', product: 'Mleko 2%', discount: '20%', price: '3.99 zł', validUntil: '2025-12-03', category: 'food' },
    { id: 18, store: 'Lidl', city: 'Kraków', street: 'ul. Wielicka 28', product: 'Czekolada', discount: '50%', price: '4.99 zł', validUntil: '2025-12-01', category: 'food' },
    { id: 19, store: 'Żabka', city: 'Kraków', street: 'ul. Grodzka 45', product: 'Hot-dog', discount: '30%', price: '4.99 zł', validUntil: '2025-12-03', category: 'food' },
    { id: 20, store: 'Zara', city: 'Kraków', street: 'Galeria Krakowska, ul. Pawia 5', product: 'Kurtka zimowa', discount: '60%', price: '199.99 zł', validUntil: '2025-12-20', category: 'fashion' },

    // Gdańsk
    { id: 21, store: 'Lidl', city: 'Gdańsk', street: 'ul. Grunwaldzka 82', product: 'Kawa ziarnista', discount: '35%', price: '19.99 zł', validUntil: '2025-12-06', category: 'food' },
    { id: 22, store: 'MediaMarkt', city: 'Gdańsk', street: 'Galeria Bałtycka, ul. Grunwaldzka 141', product: 'Słuchawki bezprzewodowe', discount: '50%', price: '149.99 zł', validUntil: '2025-12-15', category: 'electronics' },

    // Poznań
    { id: 23, store: 'Lidl', city: 'Poznań', street: 'ul. Półwiejska 42', product: 'Czekolada', discount: '50%', price: '4.99 zł', validUntil: '2025-12-01', category: 'food' },
    { id: 24, store: 'H&M', city: 'Poznań', street: 'Stary Browar, ul. Półwiejska 42', product: 'Koszula', discount: '30%', price: '49.99 zł', validUntil: '2025-12-10', category: 'fashion' },

    // Wrocław
    { id: 25, store: 'Carrefour', city: 'Wrocław', street: 'ul. Legnicka 58', product: 'Kurczak świeży', discount: '25%', price: '14.99 zł/kg', validUntil: '2025-12-02', category: 'food' },

    // Katowice
    { id: 26, store: 'Auchan', city: 'Katowice', street: 'ul. Chorzowska 107', product: 'Papier toaletowy', discount: '3+1 gratis', price: '19.99 zł', validUntil: '2025-12-04', category: 'household' },
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

export function getDealsByStreet(street) {
    if (!street) return MOCK_DEALS;
    return MOCK_DEALS.filter(deal =>
        deal.street.toLowerCase().includes(street.toLowerCase())
    );
}

export function getDealsByLocation(city, street = null) {
    let deals = getDealsByCity(city);
    if (street) {
        deals = deals.filter(deal =>
            deal.street.toLowerCase().includes(street.toLowerCase())
        );
    }
    return deals;
}
