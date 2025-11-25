const APIS = [
    'https://world.openfoodfacts.org/api/v0/product/',
    'https://world.openbeautyfacts.org/api/v0/product/',
    'https://world.openproductsfacts.org/api/v0/product/'
];

// Additional API for broader product coverage
const UPC_DATABASE_API = 'https://api.upcitemdb.com/prod/trial/lookup';
const BARCODELOOKUP_API = 'https://api.barcodelookup.com/v3/products';

export async function getProduct(barcode) {
    // Try Open*Facts APIs first (free, no API key needed)
    for (const api of APIS) {
        try {
            const response = await fetch(`${api}${barcode}.json`);
            if (!response.ok) continue;

            const data = await response.json();
            if (data.status === 1) {
                return {
                    barcode: barcode,
                    name: data.product.product_name || data.product.generic_name || 'Unknown Product',
                    brand: data.product.brands || 'Unknown Brand',
                    image: data.product.image_url || data.product.image_front_url,
                    categories: data.product.categories || '',
                    source: 'OpenFacts'
                };
            }
        } catch (error) {
            console.warn(`Error fetching from ${api}:`, error);
        }
    }

    // Try UPC Item DB (free tier, no key needed for trial)
    try {
        const response = await fetch(`${UPC_DATABASE_API}?upc=${barcode}`);
        if (response.ok) {
            const data = await response.json();
            if (data.items && data.items.length > 0) {
                const item = data.items[0];
                return {
                    barcode: barcode,
                    name: item.title || 'Unknown Product',
                    brand: item.brand || 'Unknown Brand',
                    image: item.images?.[0] || null,
                    categories: item.category || '',
                    source: 'UPC Database'
                };
            }
        }
    } catch (error) {
        console.warn('Error fetching from UPC Database:', error);
    }

    // If all APIs fail, return basic info
    return {
        barcode: barcode,
        name: 'Product Found',
        brand: 'Unknown Brand',
        image: null,
        categories: '',
        source: 'Barcode Only'
    };
}
