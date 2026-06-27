import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { useCart } from '../context/CartContext';
import toast from 'react-hot-toast';

const FALLBACK = 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=700&q=80';

export default function ProductDetail() {
  const { id }                = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selSize,  setSelSize]  = useState('');
  const [selColor, setSelColor] = useState('');
  const [qty, setQty]          = useState(1);
  const [activeImg, setActiveImg] = useState(0);
  const { addToCart }         = useCart();

  useEffect(() => {
    axios.get(`/products/${id}`)
      .then(r => setProduct(r.data.product))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return (
    <div className="page-loader" style={{ paddingTop:120 }}><div className="spinner"/></div>
  );
  if (!product) return (
    <div style={{ paddingTop:140, textAlign:'center' }}>
      <h2 style={{ fontFamily:'Cormorant Garamond,serif', color:'var(--ink)', marginBottom:20 }}>
        Product not found
      </h2>
      <Link to="/products" className="btn btn-ink">Back to Products</Link>
    </div>
  );

  const price  = product.onSale && product.salePrice ? product.salePrice : product.price;
  const images = product.images?.length ? product.images : [{ url:FALLBACK, alt:product.name }];

  const handleAdd = () => {
    if (product.sizes?.length && !selSize) return toast.error('Please select a size');
    addToCart(product, qty, selSize, selColor);
    toast.success('Added to cart!');
  };

  return (
    <div style={{ paddingTop:100, background:'var(--cream)', minHeight:'100vh', paddingBottom:80 }}>
      <div className="container">
        {/* Breadcrumb */}
        <div style={{ fontSize:13, color:'var(--mist)', marginBottom:28, display:'flex', gap:6, alignItems:'center' }}>
          <Link to="/" style={{ color:'var(--mist)' }}>Home</Link> /
          <Link to="/products" style={{ color:'var(--mist)' }}>Products</Link> /
          <span style={{ color:'var(--ink)' }}>{product.name}</span>
        </div>

        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:60, alignItems:'start' }}>
          {/* Images */}
          <div>
            <div style={{ borderRadius:10, overflow:'hidden', background:'var(--parchment)',
              aspectRatio:'3/4', marginBottom:14 }}>
              <img src={images[activeImg]?.url || FALLBACK} alt={product.name}
                style={{ width:'100%', height:'100%', objectFit:'cover' }}/>
            </div>
            {images.length > 1 && (
              <div style={{ display:'flex', gap:10 }}>
                {images.map((img,i)=>(
                  <div key={i} onClick={()=>setActiveImg(i)}
                    style={{ width:72, height:90, borderRadius:6, overflow:'hidden', cursor:'pointer',
                      border: i===activeImg ? '2px solid var(--gold)' : '2px solid transparent',
                      transition:'border .2s' }}>
                    <img src={img.url} alt={img.alt} style={{ width:'100%', height:'100%', objectFit:'cover' }}/>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Info */}
          <div>
            <div style={{ fontSize:11, fontWeight:600, letterSpacing:'2px',
              textTransform:'uppercase', color:'var(--gold)', marginBottom:7 }}>
              {product.category?.name}
            </div>
            <h1 style={{ fontFamily:'Cormorant Garamond,serif',
              fontSize:'clamp(1.7rem,3.5vw,2.5rem)', color:'var(--ink)',
              marginBottom:16, lineHeight:1.15 }}>
              {product.name}
            </h1>

            {product.rating > 0 && (
              <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:18 }}>
                <span style={{ color:'#e8a020', fontSize:17 }}>
                  {'★'.repeat(Math.round(product.rating))}{'☆'.repeat(5-Math.round(product.rating))}
                </span>
                <span style={{ fontSize:12.5, color:'var(--mist)' }}>({product.numReviews} reviews)</span>
              </div>
            )}

            {/* Price */}
            <div style={{ display:'flex', alignItems:'baseline', gap:12, marginBottom:22 }}>
              <span style={{ fontFamily:'Cormorant Garamond,serif', fontSize:'2rem',
                fontWeight:700, color:'var(--ink)' }}>
                PKR {price.toLocaleString()}
              </span>
              {product.onSale && product.salePrice && (
                <span style={{ fontSize:'1.05rem', color:'var(--mist)', textDecoration:'line-through' }}>
                  PKR {product.price.toLocaleString()}
                </span>
              )}
              {product.onSale && (
                <span style={{ background:'var(--error)', color:'white', fontSize:11,
                  fontWeight:700, padding:'2px 9px', borderRadius:20 }}>
                  SALE
                </span>
              )}
            </div>

            <p style={{ fontSize:14.5, color:'var(--mist)', lineHeight:1.85, marginBottom:26 }}>
              {product.description}
            </p>

            {product.fabric && (
              <div style={{ fontSize:13.5, marginBottom:18 }}>
                <strong style={{ color:'var(--ink)' }}>Fabric: </strong>
                <span style={{ color:'var(--mist)' }}>{product.fabric}</span>
              </div>
            )}

            {/* Colors */}
            {product.colors?.length > 0 && (
              <div style={{ marginBottom:20 }}>
                <div style={{ fontSize:13.5, fontWeight:600, color:'var(--ink)', marginBottom:9 }}>
                  Color: <span style={{ fontWeight:400, color:'var(--mist)' }}>{selColor || 'Select'}</span>
                </div>
                <div style={{ display:'flex', gap:9, flexWrap:'wrap' }}>
                  {product.colors.map(c=>(
                    <button key={c.name} onClick={()=>setSelColor(c.name)} title={c.name}
                      style={{ width:30, height:30, borderRadius:'50%', background:c.hex,
                        border: selColor===c.name ? '3px solid var(--gold)' : '2px solid var(--stone)',
                        cursor:'pointer', transition:'border .2s' }}/>
                  ))}
                </div>
              </div>
            )}

            {/* Sizes */}
            {product.sizes?.length > 0 && (
              <div style={{ marginBottom:24 }}>
                <div style={{ fontSize:13.5, fontWeight:600, color:'var(--ink)', marginBottom:9 }}>
                  Size:
                </div>
                <div style={{ display:'flex', gap:9, flexWrap:'wrap' }}>
                  {product.sizes.map(s=>(
                    <button key={s.label} onClick={()=>setSelSize(s.label)}
                      style={{ padding:'7px 17px', borderRadius:5, cursor:'pointer',
                        fontSize:13.5, fontWeight: selSize===s.label ? 600 : 400,
                        background: selSize===s.label ? 'var(--gold)' : 'white',
                        color: selSize===s.label ? 'white' : 'var(--ink)',
                        border: selSize===s.label ? '2px solid var(--gold)' : '1.5px solid var(--stone)',
                        transition:'all .2s' }}>
                      {s.label}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Qty + Cart */}
            <div style={{ display:'flex', gap:14, marginBottom:24, alignItems:'center' }}>
              <div style={{ display:'flex', alignItems:'center',
                border:'1.5px solid var(--stone)', borderRadius:6, overflow:'hidden' }}>
                <button onClick={()=>setQty(q=>Math.max(1,q-1))}
                  style={{ width:38, height:46, background:'var(--parchment)', fontSize:18 }}>−</button>
                <span style={{ width:44, textAlign:'center', fontSize:15, fontWeight:600 }}>{qty}</span>
                <button onClick={()=>setQty(q=>q+1)}
                  style={{ width:38, height:46, background:'var(--parchment)', fontSize:18 }}>+</button>
              </div>
              <button className="btn btn-ink btn-lg" style={{ flex:1 }} onClick={handleAdd}>
                Add to Cart 🛒
              </button>
            </div>

            {/* Care */}
            {product.care?.length > 0 && (
              <div style={{ padding:'18px', background:'var(--parchment)', borderRadius:7 }}>
                <div style={{ fontSize:11, fontWeight:600, letterSpacing:'1.5px',
                  textTransform:'uppercase', color:'var(--ink)', marginBottom:10 }}>
                  Care Instructions
                </div>
                <ul style={{ display:'flex', flexDirection:'column', gap:6 }}>
                  {product.care.map((c,i)=>(
                    <li key={i} style={{ fontSize:13, color:'var(--mist)',
                      display:'flex', gap:8 }}>
                      <span style={{ color:'var(--gold)' }}>•</span>{c}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
