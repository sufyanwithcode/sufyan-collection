import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';

const FB = 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=200&q=70';

export default function Cart() {
  const { items, remove, setQty, total, count } = useCart();
  const shipping = total >= 5000 ? 0 : 150;
  const grand    = total + shipping;

  if (!items.length) return (
    <div style={{ paddingTop:140, minHeight:'60vh', textAlign:'center', padding:'140px 20px 60px' }}>
      <div style={{ fontSize:'3.5rem', marginBottom:18 }}>🛒</div>
      <h2 style={{ fontFamily:'Cormorant Garamond,serif', fontSize:'2rem',
        color:'var(--ink)', marginBottom:10 }}>Your Cart is Empty</h2>
      <p style={{ color:'var(--mist)', marginBottom:30 }}>Discover our beautiful collection and add some pieces!</p>
      <Link to="/products" className="btn btn-ink btn-lg">Start Shopping</Link>
    </div>
  );

  return (
    <div style={{ paddingTop:100, background:'var(--parchment)', minHeight:'100vh', paddingBottom:80 }}>
      <div className="container">
        <h1 style={{ fontFamily:'Cormorant Garamond,serif', fontSize:'2.2rem',
          color:'var(--ink)', margin:'32px 0 36px' }}>
          Shopping Cart <span style={{ fontSize:'1.1rem', color:'var(--mist)', fontFamily:'Inter,sans-serif' }}>
            ({count} items)
          </span>
        </h1>

        <div style={{ display:'grid', gridTemplateColumns:'1fr 340px', gap:28, alignItems:'start' }}>
          {/* Items */}
          <div style={{ display:'flex', flexDirection:'column', gap:14 }}>
            {items.map(item => {
              const price = item.onSale && item.salePrice ? item.salePrice : item.price;
              return (
                <div key={item.cartId} style={{ background:'white', borderRadius:10, padding:20,
                  display:'flex', gap:18, boxShadow:'var(--s1)' }}>
                  <Link to={`/products/${item._id}`}>
                    <img src={item.images?.[0]?.url || FB} alt={item.name}
                      style={{ width:90, height:116, objectFit:'cover', borderRadius:6 }}/>
                  </Link>
                  <div style={{ flex:1 }}>
                    <Link to={`/products/${item._id}`}
                      style={{ fontFamily:'Cormorant Garamond,serif', fontSize:'1.1rem',
                        color:'var(--ink)', display:'block', marginBottom:5 }}>
                      {item.name}
                    </Link>
                    {(item.size||item.color) && (
                      <div style={{ fontSize:12.5, color:'var(--mist)', marginBottom:4 }}>
                        {item.size && `Size: ${item.size}`}
                        {item.size && item.color && ' · '}
                        {item.color && `Color: ${item.color}`}
                      </div>
                    )}
                    <div style={{ fontSize:'1.05rem', fontWeight:600, color:'var(--ink)', marginBottom:13 }}>
                      PKR {price.toLocaleString()}
                    </div>
                    <div style={{ display:'flex', alignItems:'center', gap:14 }}>
                      <div style={{ display:'flex', alignItems:'center',
                        border:'1.5px solid var(--stone)', borderRadius:6, overflow:'hidden' }}>
                        <button onClick={()=>setQty(item.cartId,item.quantity-1)}
                          style={{ width:30, height:34, background:'var(--parchment)' }}>−</button>
                        <span style={{ width:38, textAlign:'center', fontSize:13.5, fontWeight:600 }}>
                          {item.quantity}
                        </span>
                        <button onClick={()=>setQty(item.cartId,item.quantity+1)}
                          style={{ width:30, height:34, background:'var(--parchment)' }}>+</button>
                      </div>
                      <span style={{ fontSize:13, color:'var(--mist)' }}>
                        = PKR {(price*item.quantity).toLocaleString()}
                      </span>
                      <button onClick={()=>remove(item.cartId)}
                        style={{ marginLeft:'auto', color:'var(--error)', fontSize:12.5,
                          padding:'3px 8px', borderRadius:4, transition:'all .2s' }}>
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Summary */}
          <div style={{ background:'white', borderRadius:10, padding:26,
            boxShadow:'var(--s1)', position:'sticky', top:100 }}>
            <h3 style={{ fontFamily:'Cormorant Garamond,serif', fontSize:'1.3rem',
              color:'var(--ink)', marginBottom:22 }}>Order Summary</h3>
            {[['Subtotal',`PKR ${total.toLocaleString()}`],
              ['Shipping', shipping===0 ? 'Free 🎉' : `PKR ${shipping}`],
              ['Total',    `PKR ${grand.toLocaleString()}`]
            ].map(([l,v])=>(
              <div key={l} style={{ display:'flex', justifyContent:'space-between',
                fontSize: l==='Total'?16:13.5, fontWeight: l==='Total'?700:400,
                color:'var(--mist)', marginBottom:13,
                paddingTop: l==='Total'?13:0, borderTop: l==='Total'?'1px solid var(--stone)':'none' }}>
                <span>{l}</span>
                <span style={{ color:'var(--ink)' }}>{v}</span>
              </div>
            ))}
            {total < 5000 && (
              <p style={{ fontSize:12, color:'var(--success)', background:'#e8f5ef',
                padding:'9px 13px', borderRadius:6, marginBottom:18 }}>
                Add PKR {(5000-total).toLocaleString()} more for free shipping!
              </p>
            )}
            <Link to="/checkout" className="btn btn-ink btn-lg"
              style={{ width:'100%', display:'block', textAlign:'center' }}>
              Proceed to Checkout
            </Link>
            <Link to="/products" style={{ display:'block', textAlign:'center',
              marginTop:13, fontSize:13, color:'var(--gold)' }}>
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
