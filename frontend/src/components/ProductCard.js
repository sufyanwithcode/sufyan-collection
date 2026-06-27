import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import toast from 'react-hot-toast';

const FALLBACK = 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&q=80';

export default function ProductCard({ product }) {
  const { addToCart } = useCart();
  const price  = product.onSale && product.salePrice ? product.salePrice : product.price;
  const image  = product.images?.[0]?.url || FALLBACK;

  const handleAdd = e => {
    e.preventDefault(); e.stopPropagation();
    addToCart(product, 1);
    toast.success(`${product.name} added to cart`);
  };

  return (
    <div className="pcard">
      <Link to={`/products/${product._id}`}>
        <div className="pcard__img-wrap">
          <img src={image} alt={product.name} className="pcard__img" loading="lazy" />
          <div className="pcard__badges">
            {product.onSale     && <span className="badge badge-sale">Sale</span>}
            {product.isNewArrival && <span className="badge badge-new">New</span>}
            {product.isFeatured && !product.isNewArrival && <span className="badge badge-feat">Featured</span>}
          </div>
        </div>
        <div className="pcard__body">
          <div className="pcard__cat">{product.category?.name || 'Collection'}</div>
          <h3 className="pcard__name">{product.name}</h3>
          <div className="pcard__price">
            <span className="pcard__now">PKR {price.toLocaleString()}</span>
            {product.onSale && product.salePrice && (
              <span className="pcard__was">PKR {product.price.toLocaleString()}</span>
            )}
          </div>
          {product.rating > 0 && (
            <div style={{ fontSize:12, color:'var(--mist)', marginBottom:10 }}>
              {'★'.repeat(Math.round(product.rating))}{'☆'.repeat(5-Math.round(product.rating))}
              <span style={{ marginLeft:5 }}>({product.numReviews})</span>
            </div>
          )}
        </div>
      </Link>
      <div style={{ padding:'0 16px 16px' }}>
        <button className="pcard__btn" onClick={handleAdd}>Add to Cart</button>
      </div>
    </div>
  );
}
