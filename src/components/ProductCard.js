export default function ProductCard(product) {
    return `
    <div class="product-card">
      <img src="${product.image_url || ''}" alt="${product.product_name}" />
      <h3>${product.product_name}</h3>
      <p>${product.brands}</p>
    </div>
  `;
}
