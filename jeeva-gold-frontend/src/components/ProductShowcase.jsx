import { useState } from 'react';
import './ProductShowcase.css';
import { useCartStore } from '../store/CartStore1';
import product2Img from '../../../image/product2.webp';
import Product3Img from '../../../image/Elaichi.webp';
import Product4Img from '../../../image/GreenTea.webp';
import Product5Img from '../../../image/MasalaChai.webp';
import RoyalTeaImg from '../../../image/product6.webp';
import premiumTeaImg from '../../../image/pre.webp';

const products = [
  {
    id: 'starter-2',
    productId: 'starter-2',
    name: 'Jeeva Gold Premium Tea',
    price: 210,
    quantity: '250g x 2 Pack',
    description: 'Jeeva Gold brings the richness of Strong Assam Tea into every sip - bold in taste, rich in colour, and full of life.',
    image: product2Img,
    tags: ['250g x 2 Pack', 'Premium Assam'],
    featured: true,
  },
  {
    id: 'starter-1',
    productId: 'starter-1',
    name: 'Jeeva Gold Elaichi',
    price: 270,
    quantity: '250g x 2 Pack',
    description: 'Jeeva Gold Elaichi Tea brings rich strength and soothing aroma of cardamom for a perfect tea experience.',
    image: Product3Img,
    tags: ['Elaichi', '250g Pack of 2'],
    featured: false,
  },
  {
    id: 'starter-3',
    productId: 'starter-3',
    name: 'Jeeva Gold Masala Chai',
    price: 290,
    quantity: '250g x 2 Pack',
    description: 'Jeeva Gold Masala Chai is a rich fusion of premium tea and aromatic spices, crafted for a strong and flavorful cup.',
    image: Product5Img,
    tags: ['250g x 2 Pack', 'Masala'],
    featured: false,
  },
  {
    id: 'starter-4',
    productId: 'starter-4',
    name: 'Jeeva Gold Green',
    price: 280,
    quantity: '100g x 2 Pack',
    description: 'Jeeva Gold Wellness Green Tea delivers a crisp burst of antioxidants and revitalizing freshness.',
    image: Product4Img,
    tags: ['100g x 2 Pack', 'Green Tea'],
    featured: false,
  },
  {
    id: 'starter-5',
    productId: 'starter-5',
    name: 'Jeeva Gold Premium Tea',
    price: 360,
    quantity: '1 KG Pack',
    description: 'Jeeva Gold brings the richness of Strong Assam Tea into every sip - bold in taste, rich in colour, and full of life.',
    image: premiumTeaImg,
    tags: ['1KG', 'Premium Assam'],
    featured: false,
  },
  {
    id: 'starter-6',
    productId: 'starter-6',
    name: 'Jeeva Gold Royal Tea',
    price: 450,
    quantity: '1 KG Pack',
    description: 'Jeeva Gold Royal Tea brings a sophisticated and elegant tea experience with its premium blend and rich aroma.',
    image: RoyalTeaImg,
    tags: ['1KG', 'Premium Assam'],
    featured: false,
  },
];

function ProductCard({ product, delay }) {
  const addItem = useCartStore((state) => state.addItem);
  const [added, setAdded] = useState(false);

  const handleAddToCart = () => {
    addItem({
      id: product.id,
      productId: product.productId,
      size: product.quantity,
      name: product.name,
      price: product.price,
      img: product.image,
      alt: product.name,
      description: product.description,
      tags: product.tags || [],
    });

    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  return (
    <div className={`product-card reveal is-visible reveal--delay-${delay}${product.featured ? ' product-card--featured' : ''}`}>
      <div className="product-card__image-wrap">
        {product.featured && (
          <span className="product-card__badge">Best Seller</span>
        )}
        <img src={product.image} alt={product.name} className="product-card__img" />
      </div>
      <div className="product-card__meta">
        <h3 className="product-card__name">{product.name}</h3>
        <span className="product-card__price">Rs {product.price.toLocaleString('en-IN')}</span>
      </div>
      {product.quantity && (
        <div className="product-card__qty">
          <span className="product-card__qty-icon"></span>
          {product.quantity}
        </div>
      )}
      <p className="product-card__desc">{product.description}</p>
      <button
        className={`product-card__btn ${added
          ? 'product-card__btn--added'
          : product.featured
            ? 'product-card__btn--primary'
            : 'product-card__btn--outline'
          }`}
        onClick={handleAddToCart}
      >
        {added ? 'Added to Cart' : 'Add to Cart'}
      </button>
    </div>
  );
}

export default function ProductShowcase() {
  return (
    <section className="products section-py" id="collection">
      <div className="container">
        <div className="products__header reveal">
          <div className="products__title-row">
            <span className="products__leaf products__leaf--left"></span>
            <h2 className="products__title">Our Premium Selection</h2>
            <span className="products__leaf products__leaf--right"></span>
          </div>
          <p className="products__subtitle">
            Handpicked variety of the finest teas from the world's largest tea-growing region.
          </p>
        </div>

        <div className="products__grid">
          {products.map((product, i) => (
            <ProductCard key={product.id} product={product} delay={i + 1} />
          ))}
        </div>

        <div className="products__features reveal">
          <div className="products__feature">
            <span className="products__feature-icon"></span>
            <div>
              <p className="products__feature-title">Premium Quality</p>
              <p className="products__feature-sub">Carefully selected leaves</p>
            </div>
          </div>
          <div className="products__feature-divider" />
          <div className="products__feature">
            <span className="products__feature-icon"></span>
            <div>
              <p className="products__feature-title">Natural &amp; Pure</p>
              <p className="products__feature-sub">100% natural ingredients</p>
            </div>
          </div>
          <div className="products__feature-divider" />
          <div className="products__feature">
            <span className="products__feature-icon"></span>
            <div>
              <p className="products__feature-title">Fresh &amp; Flavorful</p>
              <p className="products__feature-sub">Rich taste in every sip</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
