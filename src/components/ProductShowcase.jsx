import './ProductShowcase.css';

const products = [
  {
    id: 1,
    name: "Jeeva Gold Rich Elaichi Tea",
    // price: "$24.00",
    description: "Bold Assam tea meets the warmth of real elaichi. A rich, aromatic cup that starts your day right.",
    image:
      "image/product1.png",
    featured: false,
  },
  {
    id: 2,
    name: "Imperial Gold",
    // price: "$38.00",
    description: "Rare second flush leaves with honeyed notes and bright gold liquor.",
    image:
      "image/product2.jpeg",
    featured: true,
  },
  // {
  //   id: 3,
  //   name: "Golden Flowery",
  //   price: "$32.00",
  //   description: "A delicate blend of tender tea buds with floral undertones.",
  //   image:
  //     "https://lh3.googleusercontent.com/aida-public/AB6AXuD8w569ue2YlX5R_8ZAewwflIRMnfh2L-5ocMhL0TgLSbdRij7bHBVw2dWRmSZF0QzzsfdEHtILyz1qyp0kpdboR4hUe6F4jIELsfa43_mm1LEXo8kqjHaSZv6b6gOficiaDrR2XIYOExJU76YctBEzigVS4yaLqPRqfwnSueZmGocv4wH9e2IGtRttYTmVBr9jl8oOy45BpgqsSEd4Yyc6_ix4-iowFfbdfWh1OsT3SqvkcMoxlwJRmEQb8af2vuBSOQvyB5wKUMs",
  //   featured: false,
  // },
];

function ProductCard({ product, delay }) {
  return (
    <div className={`product-card reveal reveal--delay-${delay}${product.featured ? " product-card--featured" : ""}`}>
      <div className="product-card__image-wrap">
        {product.featured && (
          <span className="product-card__badge">Best Seller</span>
        )}
        <img src={product.image} alt={product.name} className="product-card__img" />
      </div>
      <div className="product-card__meta">
        <h3 className="product-card__name">{product.name}</h3>
        <span className="product-card__price">{product.price}</span>
      </div>
      <p className="product-card__desc">{product.description}</p>
      <button
        className={`product-card__btn ${product.featured ? "product-card__btn--primary" : "product-card__btn--outline"
          }`}
      >
        Add to Cart
      </button>
    </div>
  );
}

export default function ProductShowcase() {
  return (
    <section className="products section-py" id="collection">
      <div className="container">
        <div className="products__header reveal">
          <h2 className="products__title">Our Premium Selection</h2>
          <p className="products__subtitle">
            Handpicked variety of the finest teas from the world's largest tea-growing region.
          </p>
        </div>
        <div className="products__grid">
          {products.map((product, i) => (
            <ProductCard key={product.id} product={product} delay={i + 1} />
          ))}
        </div>
      </div>
    </section>
  );
}
