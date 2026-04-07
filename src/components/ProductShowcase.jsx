import { useState } from 'react';
import './ProductShowcase.css';
import { useCartStore } from '../store/CartStore1';
import product1Img from '../../image/product1.png';
import product2Img from '../../image/product2.jpeg';
import Product3Img from '../../image/Elaichi.jpg'
import Product4Img from '../../image/GreenTea.jpg'
import Product5Img from '../../image/MasalaChai.jpg'


const products = [
  {
    id: 1,
    name: "Jeeva Gold Elaichi Tea",
    price: 499,
    description: "Jeeva Gold Elaichi Tea brings rich strength & soothing aroma of cardamon — a perfect tea experience.",
    image: Product3Img,
    tags: ["Elaichi", "250g Pack"],
    featured: false,
  },
  {
    id: 2,
    name: "Jeeva Gold Tea",
    price: 599,
    description: "Jeeva Gold brings the richness of Strong Assam Tea into every sip - bold in taste, rich in colour, and full of life.",
    image: product2Img,
    tags: ["Best Seller", "Premium Assam"],
    featured: true,
  },
  {
    id: 3,
    name: "Jeeva Gold Masala Chai",
    price: 549,
    description: "Jeeva Gold Masala Chai is a rich fusion of premium tea and aromatic spices , crafted for a strong and flavorful cup that warms your senses & provides a refreshing Masala Chai experience.",
    image: Product5Img,
    tags: ["Masala", "250g Pack"],
    featured: false,
  },
  {
    id: 4,
    name: "Jeeva Gold Green Tea",
    price: 449,
    description: "Jeeva Gold Wellness Green Tea delivers a crisp burst of antioxidants and revitalizing freshness - The ultimate reset for your body and mind.",
    image: Product4Img,
    tags: ["Green Tea", "Wellness"],
    featured: false,
  },
];

function ProductCard({ product, delay }) {
  const addItem = useCartStore((state) => state.addItem);
  const [added, setAdded] = useState(false);

  const handleAddToCart = () => {
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      img: product.image,       // ShoppingCart expects 'img'
      alt: product.name,
      description: product.description,
      tags: product.tags || [],
    });

    // Show brief "Added!" feedback
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

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
        <span className="product-card__price">₹{product.price}</span>
      </div>
      <p className="product-card__desc">{product.description}</p>
      <button
        className={`product-card__btn ${
          added
            ? "product-card__btn--added"
            : product.featured
              ? "product-card__btn--primary"
              : "product-card__btn--outline"
        }`}
        onClick={handleAddToCart}
      >
        {added ? "✓ Added to Cart" : "Add to Cart"}
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
