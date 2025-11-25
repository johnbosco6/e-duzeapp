const APIS = [
    'https://world.openfoodfacts.org/api/v0/product/',
    'https://world.openbeautyfacts.org/api/v0/product/',
    'https://world.openproductsfacts.org/api/v0/product/'
];

export async function getProduct(barcode) {
    for (const api of APIS) {
        try {
            const response = await fetch(`${api}${barcode}.json`);
            if (!response.ok) continue;

            const data = await response.json();
            if (data.status === 1) {
                // Normalize data if needed, but they share similar structure
                return data.product;
            }
        } catch (error) {
            console.warn(`Error fetching from ${api}:`, error);
            // Continue to next API
        }
    }
    return null;
}
