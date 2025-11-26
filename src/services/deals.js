// Comprehensive deals data with South African stores, restaurants, and addresses
const MOCK_DEALS = [
    // Johannesburg - Supermarkets
    { id: 1, store: 'Pick n Pay', city: 'Johannesburg', street: 'Sandton City, Sandton Drive', product: 'Whole Wheat Bread', discount: '30%', price: 'R 14.99', validUntil: '2025-12-05', category: 'food' },
    { id: 2, store: 'Pick n Pay', city: 'Johannesburg', street: 'Nelson Mandela Square', product: 'Fresh Milk 2L', discount: '20%', price: 'R 22.99', validUntil: '2025-12-03', category: 'food' },
    { id: 3, store: 'Pick n Pay', city: 'Johannesburg', street: 'Rosebank Mall', product: 'Apples', discount: '40%', price: 'R 18.99/kg', validUntil: '2025-12-02', category: 'food' },
    { id: 4, store: 'Checkers', city: 'Johannesburg', street: 'Eastgate Shopping Centre', product: 'Cheddar Cheese', discount: '25%', price: 'R 65.99', validUntil: '2025-12-04', category: 'food' },
    { id: 5, store: 'Checkers', city: 'Johannesburg', street: 'Cresta Shopping Centre', product: 'Coffee Beans 500g', discount: '35%', price: 'R 89.99', validUntil: '2025-12-06', category: 'food' },
    { id: 6, store: 'Woolworths', city: 'Johannesburg', street: 'Hyde Park Corner', product: 'Organic Vegetables', discount: '2+1 free', price: 'R 35.99', validUntil: '2025-12-05', category: 'food' },
    { id: 7, store: 'Woolworths', city: 'Johannesburg', street: 'Sandton City', product: 'Premium Steak', discount: '30%', price: 'R 149.99/kg', validUntil: '2025-12-03', category: 'food' },
    { id: 8, store: 'Shoprite', city: 'Johannesburg', street: 'Mall of Africa', product: 'Rice 10kg', discount: '40%', price: 'R 129.99', validUntil: '2025-12-08', category: 'food' },
    { id: 9, store: 'Spar', city: 'Johannesburg', street: 'Melrose Arch', product: 'Fresh Chicken', discount: '25%', price: 'R 54.99/kg', validUntil: '2025-12-05', category: 'food' },
    { id: 10, store: 'Boxer', city: 'Johannesburg', street: 'Johannesburg CBD', product: 'Maize Meal 10kg', discount: '20%', price: 'R 89.99', validUntil: '2025-12-10', category: 'food' },
    { id: 11, store: 'Food Lover\'s Market', city: 'Johannesburg', street: 'The wedge, Morningside', product: 'Avocados', discount: '3 for R50', price: 'R 50.00', validUntil: '2025-12-07', category: 'food' },

    // Johannesburg - Restaurants
    { id: 12, store: 'Nandos', city: 'Johannesburg', street: 'Sandton City', product: 'Quarter Chicken Meal', discount: '20%', price: 'R 79.99', validUntil: '2025-12-10', category: 'restaurant' },
    { id: 13, store: 'KFC', city: 'Johannesburg', street: 'Rosebank Mall', product: 'Family Feast', discount: '30%', price: 'R 189.99', validUntil: '2025-12-07', category: 'restaurant' },
    { id: 14, store: 'Steers', city: 'Johannesburg', street: 'Eastgate', product: 'King Steer Burger Combo', discount: '25%', price: 'R 69.99', validUntil: '2025-12-06', category: 'restaurant' },
    { id: 15, store: 'Ocean Basket', city: 'Johannesburg', street: 'Nelson Mandela Square', product: 'Seafood Platter', discount: '15%', price: 'R 299.99', validUntil: '2025-12-12', category: 'restaurant' },
    { id: 16, store: 'Mugg & Bean', city: 'Johannesburg', street: 'Sandton City', product: 'Breakfast Special', discount: '20%', price: 'R 89.99', validUntil: '2025-12-08', category: 'restaurant' },
    { id: 17, store: 'Spur', city: 'Johannesburg', street: 'Gold Reef City', product: 'Cheddamelt Steak', discount: '20%', price: 'R 139.99', validUntil: '2025-12-09', category: 'restaurant' },
    { id: 18, store: 'McDonalds', city: 'Johannesburg', street: 'Braamfontein', product: 'Big Mac Meal', discount: '30%', price: 'R 49.99', validUntil: '2025-12-05', category: 'restaurant' },
    { id: 19, store: 'Burger King', city: 'Johannesburg', street: 'Park Station', product: 'Whopper Meal', discount: '25%', price: 'R 59.99', validUntil: '2025-12-06', category: 'restaurant' },

    // Johannesburg - Electronics & Fashion
    { id: 20, store: 'Game', city: 'Johannesburg', street: 'Mall of Africa, Waterfall', product: 'Wireless Headphones', discount: '50%', price: 'R 799.99', validUntil: '2025-12-15', category: 'electronics' },
    { id: 21, store: 'Edgars', city: 'Johannesburg', street: 'Sandton City', product: 'Winter Jacket', discount: '60%', price: 'R 1,299.99', validUntil: '2025-12-20', category: 'fashion' },
    { id: 22, store: 'Incredible Connection', city: 'Johannesburg', street: 'Rosebank Mall', product: 'Laptop', discount: '25%', price: 'R 8,999.99', validUntil: '2025-12-18', category: 'electronics' },
    { id: 23, store: 'Clicks', city: 'Johannesburg', street: 'Sandton City', product: 'Vitamins 3-pack', discount: '3 for 2', price: 'R 199.99', validUntil: '2025-12-10', category: 'health' },
    { id: 24, store: 'Dis-Chem', city: 'Johannesburg', street: 'Norwood Mall', product: 'Skincare Set', discount: '20%', price: 'R 299.99', validUntil: '2025-12-12', category: 'health' },

    // Cape Town - Supermarkets
    { id: 25, store: 'Pick n Pay', city: 'Cape Town', street: 'V&A Waterfront', product: 'Whole Wheat Bread', discount: '30%', price: 'R 14.99', validUntil: '2025-12-05', category: 'food' },
    { id: 26, store: 'Checkers', city: 'Cape Town', street: 'Canal Walk Shopping Centre', product: 'Cheddar Cheese', discount: '25%', price: 'R 65.99', validUntil: '2025-12-04', category: 'food' },
    { id: 27, store: 'Woolworths', city: 'Cape Town', street: 'V&A Waterfront', product: 'Red Wine', discount: '40%', price: 'R 129.99', validUntil: '2025-12-10', category: 'drinks' },
    { id: 28, store: 'Shoprite', city: 'Cape Town', street: 'Tyger Valley Centre', product: 'Laundry Detergent', discount: '35%', price: 'R 89.99', validUntil: '2025-12-06', category: 'household' },
    { id: 29, store: 'Spar', city: 'Cape Town', street: 'Gardens Centre', product: 'Fresh Vegetables', discount: '30%', price: 'R 24.99/kg', validUntil: '2025-12-05', category: 'food' },
    { id: 30, store: 'Food Lover\'s Market', city: 'Cape Town', street: 'Tokai', product: 'Sushi Platter', discount: '50%', price: 'R 99.99', validUntil: '2025-12-08', category: 'food' },

    // Cape Town - Restaurants
    { id: 31, store: 'Nandos', city: 'Cape Town', street: 'V&A Waterfront', product: 'Full Chicken & Sides', discount: '25%', price: 'R 199.99', validUntil: '2025-12-10', category: 'restaurant' },
    { id: 32, store: 'Ocean Basket', city: 'Cape Town', street: 'Canal Walk', product: 'Hake & Chips', discount: '20%', price: 'R 119.99', validUntil: '2025-12-12', category: 'restaurant' },
    { id: 33, store: 'Spur', city: 'Cape Town', street: 'Cavendish Square', product: 'Ribs Combo', discount: '30%', price: 'R 149.99', validUntil: '2025-12-09', category: 'restaurant' },
    { id: 34, store: 'Wimpy', city: 'Cape Town', street: 'Tyger Valley', product: 'Breakfast Platter', discount: '15%', price: 'R 79.99', validUntil: '2025-12-07', category: 'restaurant' },
    { id: 35, store: 'Kauai', city: 'Cape Town', street: 'Kloof Street', product: 'Smoothie', discount: '20%', price: 'R 45.99', validUntil: '2025-12-06', category: 'restaurant' },

    // Cape Town - Fashion & Electronics
    { id: 36, store: 'Incredible Connection', city: 'Cape Town', street: 'Canal Walk', product: 'Smartwatch', discount: '40%', price: 'R 1,899.99', validUntil: '2025-12-10', category: 'electronics' },
    { id: 37, store: 'Truworths', city: 'Cape Town', street: 'V&A Waterfront', product: 'Wool Sweater', discount: '50%', price: 'R 599.99', validUntil: '2025-12-15', category: 'fashion' },
    { id: 38, store: 'Mr Price', city: 'Cape Town', street: 'Canal Walk', product: 'Jeans', discount: '40%', price: 'R 399.99', validUntil: '2025-12-13', category: 'fashion' },
    { id: 39, store: 'Clicks', city: 'Cape Town', street: 'Gardens Centre', product: 'Sunscreen', discount: '30%', price: 'R 129.99', validUntil: '2025-12-20', category: 'health' },

    // Durban - Supermarkets
    { id: 40, store: 'Pick n Pay', city: 'Durban', street: 'Gateway Theatre of Shopping', product: 'Fresh Milk 2L', discount: '20%', price: 'R 22.99', validUntil: '2025-12-03', category: 'food' },
    { id: 41, store: 'Checkers', city: 'Durban', street: 'Pavilion Shopping Centre', product: 'Chocolate Bar', discount: '50%', price: 'R 19.99', validUntil: '2025-12-01', category: 'food' },
    { id: 42, store: 'Spar', city: 'Durban', street: 'Florida Road', product: 'Hot Meal Deal', discount: '30%', price: 'R 34.99', validUntil: '2025-12-03', category: 'food' },
    { id: 43, store: 'Woolworths', city: 'Durban', street: 'Gateway Theatre', product: 'Sushi Platter', discount: '25%', price: 'R 89.99', validUntil: '2025-12-06', category: 'food' },
    { id: 44, store: 'Boxer', city: 'Durban', street: 'West Street', product: 'Cooking Oil 2L', discount: '15%', price: 'R 69.99', validUntil: '2025-12-08', category: 'food' },

    // Durban - Restaurants
    { id: 45, store: 'Nandos', city: 'Durban', street: 'Gateway Theatre', product: 'Peri-Peri Chicken', discount: '20%', price: 'R 84.99', validUntil: '2025-12-10', category: 'restaurant' },
    { id: 46, store: 'Debonairs Pizza', city: 'Durban', street: 'Pavilion', product: 'Large Pizza Deal', discount: '35%', price: 'R 119.99', validUntil: '2025-12-08', category: 'restaurant' },
    { id: 47, store: 'KFC', city: 'Durban', street: 'Musgrave Centre', product: 'Streetwise Two', discount: '25%', price: 'R 49.99', validUntil: '2025-12-07', category: 'restaurant' },
    { id: 48, store: 'Steers', city: 'Durban', street: 'Gateway Theatre', product: 'Burger Combo', discount: '20%', price: 'R 64.99', validUntil: '2025-12-06', category: 'restaurant' },
    { id: 49, store: 'Mochachos', city: 'Durban', street: 'Overport', product: 'Chicken Burger Meal', discount: '20%', price: 'R 89.99', validUntil: '2025-12-09', category: 'restaurant' },

    // Durban - Fashion
    { id: 50, store: 'Edgars', city: 'Durban', street: 'Gateway Theatre of Shopping', product: 'Winter Jacket', discount: '60%', price: 'R 1,299.99', validUntil: '2025-12-20', category: 'fashion' },

    // Pretoria - Supermarkets
    { id: 51, store: 'Checkers', city: 'Pretoria', street: 'Menlyn Park Shopping Centre', product: 'Coffee Beans 500g', discount: '35%', price: 'R 89.99', validUntil: '2025-12-06', category: 'food' },
    { id: 52, store: 'Pick n Pay', city: 'Pretoria', street: 'Brooklyn Mall', product: 'Fresh Fruit', discount: '30%', price: 'R 29.99/kg', validUntil: '2025-12-05', category: 'food' },
    { id: 53, store: 'Woolworths', city: 'Pretoria', street: 'Menlyn Park', product: 'Gourmet Meals', discount: '25%', price: 'R 79.99', validUntil: '2025-12-08', category: 'food' },
    { id: 54, store: 'Dis-Chem', city: 'Pretoria', street: 'Centurion Mall', product: 'Protein Powder', discount: '20%', price: 'R 399.99', validUntil: '2025-12-15', category: 'health' },

    // Pretoria - Restaurants
    { id: 55, store: 'Nandos', city: 'Pretoria', street: 'Menlyn Park', product: 'Chicken Wrap Meal', discount: '20%', price: 'R 74.99', validUntil: '2025-12-10', category: 'restaurant' },
    { id: 56, store: 'Mugg & Bean', city: 'Pretoria', street: 'Brooklyn Mall', product: 'Coffee & Muffin', discount: '15%', price: 'R 54.99', validUntil: '2025-12-08', category: 'restaurant' },
    { id: 57, store: 'Roman\'s Pizza', city: 'Pretoria', street: 'Wonderpark Shopping Centre', product: 'Family Pizza Deal', discount: '40%', price: 'R 149.99', validUntil: '2025-12-09', category: 'restaurant' },
    { id: 58, store: 'RocoMamas', city: 'Pretoria', street: 'Menlyn Maine', product: 'Smash Burger', discount: '15%', price: 'R 89.99', validUntil: '2025-12-07', category: 'restaurant' },

    // Pretoria - Electronics
    { id: 59, store: 'Game', city: 'Pretoria', street: 'Menlyn Park', product: 'Wireless Headphones', discount: '50%', price: 'R 799.99', validUntil: '2025-12-15', category: 'electronics' },

    // Port Elizabeth - Supermarkets & Restaurants
    { id: 60, store: 'Checkers', city: 'Port Elizabeth', street: 'Greenacres Shopping Centre', product: 'Chocolate Bar', discount: '50%', price: 'R 19.99', validUntil: '2025-12-01', category: 'food' },
    { id: 61, store: 'Pick n Pay', city: 'Port Elizabeth', street: 'The Bridge Shopping Centre', product: 'Fresh Bread', discount: '30%', price: 'R 14.99', validUntil: '2025-12-05', category: 'food' },
    { id: 62, store: 'Nandos', city: 'Port Elizabeth', street: 'Greenacres', product: 'Quarter Chicken', discount: '20%', price: 'R 79.99', validUntil: '2025-12-10', category: 'restaurant' },
    { id: 63, store: 'Ocean Basket', city: 'Port Elizabeth', street: 'Walmer Park', product: 'Fish & Chips', discount: '25%', price: 'R 99.99', validUntil: '2025-12-12', category: 'restaurant' },
    { id: 64, store: 'Fishaways', city: 'Port Elizabeth', street: 'Summerstrand', product: 'Hake & Rice', discount: '20%', price: 'R 69.99', validUntil: '2025-12-08', category: 'restaurant' },

    // Port Elizabeth - Fashion
    { id: 65, store: 'Mr Price', city: 'Port Elizabeth', street: 'The Bridge Shopping Centre', product: 'Shirt', discount: '30%', price: 'R 249.99', validUntil: '2025-12-10', category: 'fashion' },

    // Bloemfontein
    { id: 66, store: 'Shoprite', city: 'Bloemfontein', street: 'Mimosa Mall', product: 'Fresh Chicken', discount: '25%', price: 'R 59.99/kg', validUntil: '2025-12-02', category: 'food' },
    { id: 67, store: 'Checkers', city: 'Bloemfontein', street: 'Loch Logan Waterfront', product: 'Dairy Products', discount: '30%', price: 'R 44.99', validUntil: '2025-12-06', category: 'food' },
    { id: 68, store: 'KFC', city: 'Bloemfontein', street: 'Mimosa Mall', product: 'Bucket Meal', discount: '25%', price: 'R 159.99', validUntil: '2025-12-07', category: 'restaurant' },
    { id: 69, store: 'Spur', city: 'Bloemfontein', street: 'Loch Logan', product: 'Burger Monday', discount: 'Buy 1 Get 1', price: 'R 99.99', validUntil: '2025-12-05', category: 'restaurant' },

    // Polokwane
    { id: 70, store: 'Spar', city: 'Polokwane', street: 'Mall of the North', product: 'Toilet Paper 12-pack', discount: '3+1 free', price: 'R 79.99', validUntil: '2025-12-04', category: 'household' },
    { id: 71, store: 'Pick n Pay', city: 'Polokwane', street: 'Mall of the North', product: 'Fresh Vegetables', discount: '35%', price: 'R 19.99/kg', validUntil: '2025-12-05', category: 'food' },
    { id: 72, store: 'Steers', city: 'Polokwane', street: 'Mall of the North', product: 'Burger Deal', discount: '20%', price: 'R 59.99', validUntil: '2025-12-06', category: 'restaurant' },
    { id: 73, store: 'Galito\'s', city: 'Polokwane', street: 'Savannah Mall', product: 'Chicken Meal', discount: '15%', price: 'R 65.99', validUntil: '2025-12-08', category: 'restaurant' },

    // Nelspruit
    { id: 74, store: 'Woolworths', city: 'Nelspruit', street: 'Riverside Mall', product: 'Premium Coffee', discount: '30%', price: 'R 69.99', validUntil: '2025-12-08', category: 'food' },
    { id: 75, store: 'Checkers', city: 'Nelspruit', street: 'Ilanga Mall', product: 'Breakfast Cereals', discount: '40%', price: 'R 39.99', validUntil: '2025-12-06', category: 'food' },
    { id: 76, store: 'Nandos', city: 'Nelspruit', street: 'Riverside Mall', product: 'Chicken Meal', discount: '20%', price: 'R 79.99', validUntil: '2025-12-10', category: 'restaurant' },

    // Rustenburg
    { id: 77, store: 'Pick n Pay', city: 'Rustenburg', street: 'Waterfall Mall', product: 'Fresh Milk', discount: '20%', price: 'R 22.99', validUntil: '2025-12-03', category: 'food' },
    { id: 78, store: 'Shoprite', city: 'Rustenburg', street: 'Waterfall Mall', product: 'Meat Special', discount: '35%', price: 'R 89.99/kg', validUntil: '2025-12-05', category: 'food' },
    { id: 79, store: 'Debonairs Pizza', city: 'Rustenburg', street: 'Waterfall Mall', product: 'Triple Decker', discount: '30%', price: 'R 129.99', validUntil: '2025-12-08', category: 'restaurant' },

    // Kimberley
    { id: 80, store: 'Checkers', city: 'Kimberley', street: 'Diamond Pavilion', product: 'Snacks Bundle', discount: '45%', price: 'R 54.99', validUntil: '2025-12-07', category: 'food' },
    { id: 81, store: 'Spar', city: 'Kimberley', street: 'Stockdale Street', product: 'Fresh Bread', discount: '25%', price: 'R 12.99', validUntil: '2025-12-05', category: 'food' },
    { id: 82, store: 'KFC', city: 'Kimberley', street: 'Diamond Pavilion', product: 'Family Meal', discount: '30%', price: 'R 189.99', validUntil: '2025-12-07', category: 'restaurant' },

    // Pietermaritzburg
    { id: 83, store: 'Pick n Pay', city: 'Pietermaritzburg', street: 'Liberty Midlands Mall', product: 'Grocery Essentials', discount: '25%', price: 'R 199.99', validUntil: '2025-12-06', category: 'food' },
    { id: 84, store: 'Woolworths', city: 'Pietermaritzburg', street: 'Liberty Midlands Mall', product: 'Fresh Salads', discount: '30%', price: 'R 49.99', validUntil: '2025-12-05', category: 'food' },
    { id: 85, store: 'Mugg & Bean', city: 'Pietermaritzburg', street: 'Liberty Midlands Mall', product: 'Lunch Special', discount: '20%', price: 'R 99.99', validUntil: '2025-12-08', category: 'restaurant' },

    // East London
    { id: 86, store: 'Checkers', city: 'East London', street: 'Hemingways Mall', product: 'Frozen Foods', discount: '40%', price: 'R 69.99', validUntil: '2025-12-06', category: 'food' },
    { id: 87, store: 'Pick n Pay', city: 'East London', street: 'Vincent Park Centre', product: 'Bakery Items', discount: '35%', price: 'R 29.99', validUntil: '2025-12-05', category: 'food' },
    { id: 88, store: 'Ocean Basket', city: 'East London', street: 'Hemingways Mall', product: 'Seafood Special', discount: '20%', price: 'R 249.99', validUntil: '2025-12-12', category: 'restaurant' },
    { id: 89, store: 'Friesland Milk Bar', city: 'East London', street: 'Tennyson Street', product: 'Famous Milkshake', discount: '10%', price: 'R 35.00', validUntil: '2025-12-10', category: 'restaurant' }
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
