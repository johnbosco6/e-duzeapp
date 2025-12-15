
export const STORES_DATA = [
    // Retail
    { name: 'Pick n Pay', category: 'retail', color: '#00923f', url: 'https://www.pnp.co.za' },
    { name: 'Checkers', category: 'retail', color: '#0066cc', url: 'https://www.checkers.co.za' },
    { name: 'Woolworths', category: 'retail', color: '#006633', url: 'https://www.woolworths.co.za' },
    { name: 'Spar', category: 'retail', color: '#00923f', url: 'https://www.spar.co.za' },
    { name: 'Shoprite', category: 'retail', color: '#e30613', url: 'https://www.shoprite.co.za' },
    { name: 'Makro', category: 'retail', color: '#003da5', url: 'https://www.makro.co.za' },
    { name: 'Boxer', category: 'retail', color: '#e30613', url: 'https://www.boxer.co.za' },
    { name: 'Food Lover\'s Market', category: 'retail', color: '#8dc63f', url: 'https://foodloversmarket.co.za' },
    { name: 'Cambridge Food', category: 'retail', color: '#2c5f2d', url: 'https://www.cambridgefood.co.za' },

    // Fashion
    { name: 'Edgars', category: 'fashion', color: '#000000', url: 'https://www.edgars.co.za' },
    { name: 'Truworths', category: 'fashion', color: '#1e1e1e', url: 'https://www.truworths.co.za' },
    { name: 'Mr Price', category: 'fashion', color: '#e4002b', url: 'https://www.mrprice.co.za' },
    { name: 'Ackermans', category: 'fashion', color: '#ff6600', url: 'https://www.ackermans.co.za' },
    { name: 'Jet', category: 'fashion', color: '#ff0000', url: 'https://www.jet.co.za' },
    { name: 'Pep', category: 'fashion', color: '#e30613', url: 'https://www.pepstores.com' },
    { name: 'Markham', category: 'fashion', color: '#1a1a1a', url: 'https://www.markham.co.za' },
    { name: 'Exact', category: 'fashion', color: '#2d2d2d', url: 'https://www.exact.co.za' },
    { name: 'Legit', category: 'fashion', color: '#ff1493', url: 'https://www.legit.co.za' },

    // Health
    { name: 'Clicks', category: 'health', color: '#005eb8', url: 'https://clicks.co.za' },
    { name: 'Dis-Chem', category: 'health', color: '#009640', url: 'https://www.dischem.co.za' },
    { name: 'Sorbet', category: 'health', color: '#ff69b4', url: 'https://www.sorbet.co.za' },

    // Tech
    { name: 'Game', category: 'electronics', color: '#e30613', url: 'https://www.game.co.za' },
    { name: 'Incredible Connection', category: 'electronics', color: '#0066cc', url: 'https://www.incredible.co.za' },
    { name: 'Takealot', category: 'electronics', color: '#0b79bf', url: 'https://www.takealot.com' },
    { name: 'HiFi Corp', category: 'electronics', color: '#000000', url: 'https://www.hificorp.co.za' },

    // Food
    { name: 'Nandos', category: 'food', color: '#8B0000', url: 'https://www.nandos.co.za' },
    { name: 'KFC', category: 'food', color: '#e4002b', url: 'https://www.kfc.co.za' },
    { name: 'Ocean Basket', category: 'food', color: '#0066cc', url: 'https://www.oceanbasket.com' },
    { name: 'Steers', category: 'food', color: '#c41e3a', url: 'https://www.steers.co.za' },
    { name: 'Spur', category: 'food', color: '#8B4513', url: 'https://www.spur.co.za' },
    { name: 'McDonalds', category: 'food', color: '#ffc72c', url: 'https://www.mcdonalds.co.za' },
    { name: 'Burger King', category: 'food', color: '#003366', url: 'https://www.burgerking.co.za' },

    // Home
    { name: 'Builders', category: 'home', color: '#ff6600', url: 'https://www.builders.co.za' },
    { name: 'Leroy Merlin', category: 'home', color: '#78be20', url: 'https://www.leroymerlin.co.za' },
    { name: 'Mr Price Home', category: 'home', color: '#e4002b', url: 'https://www.mrphome.com' },

    // Sports
    { name: 'Sportscene', category: 'sports', color: '#000000', url: 'https://www.sportscene.co.za' },
    { name: 'Totalsports', category: 'sports', color: '#e30613', url: 'https://www.totalsports.co.za' },
    { name: 'Cape Union Mart', category: 'sports', color: '#ff6600', url: 'https://www.capeunionmart.co.za' }
];

export function getStoresByCategory(category) {
    if (category === 'all') return STORES_DATA;
    return STORES_DATA.filter(store => store.category === category);
}

export function getAllCategories() {
    return [...new Set(STORES_DATA.map(store => store.category))];
}
