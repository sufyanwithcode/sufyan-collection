import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const METHODS = [
  ['cash_on_delivery','💵','Cash on Delivery','Pay when your order arrives'],
  ['bank_transfer',   '🏦','Bank Transfer',   'Transfer to our bank account'],
  ['easypaisa',       '📱','EasyPaisa',        'Pay via EasyPaisa mobile wallet'],
  ['jazzcash',        '📲','JazzCash',         'Pay via JazzCash mobile wallet'],
];

export default function Checkout() {
  const { items, total, clear } = useCart();
  const { user }                = useAuth();
  const navigate                = useNavigate();
  const [loading, setLoading]   = useState(false);
  const [form, setForm]         = useState({
    fullName:      user?.name  || '',
    phone:         user?.phone || '',
    street:        '', city:'', province:'', postalCode:'', country:'Pakistan',
    paymentMethod: 'cash_on_delivery',
  });
  const f = (k,v) => setForm(p=>({...p,[k]:v}));
  const shipping = total >= 5000 ? 0 : 150;

  if (!user) return (
    <div style={{ paddingTop:140, textAlign:'center', padding:'140px 20px' }}>
      <h2 style={{ fontFamily:'Cormorant Garamond,serif', color:'var(--ink)', marginBottom:20 }}>
        Please Login to Checkout
      </h2>
      <Link to="/login" className="btn btn-ink btn-lg">Login</Link>
    </div>
  );

  const submit = async e => {
    e.preventDefault();
    if (!items.length) return toast.error('Your cart is empty');
    setLoading(true);
    try {
      const { fullName, phone, street, city, province, postalCode, country, paymentMethod } = form;
      await axios.post('/orders', {
        items: items.map(i=>({ product:i._id, quantity:i.quantity, size:i.size, color:i.color })),
        shippingAddress: { fullName, phone, street, city, province, postalCode, country },
        paymentMethod,
      });
      clear();
      toast.success('Order placed successfully! 🎉');
      navigate('/orders');
    } catch (err) { toast.error(err.response?.data?.message || 'Failed to place order'); }
    finally { setLoading(false); }
  };

  return (
    <div style={{ paddingTop:100, background:'var(--parchment)', minHeight:'100vh', paddingBottom:80 }}>
      <div className="container">
        <h1 style={{ fontFamily:'Cormorant Garamond,serif', fontSize:'2rem',
          color:'var(--ink)', margin:'32px 0 36px' }}>Checkout</h1>

        <form onSubmit={submit}>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 340px', gap:28, alignItems:'start' }}>
            <div style={{ display:'flex', flexDirection:'column', gap:20 }}>

              {/* Shipping */}
              <div style={{ background:'white', borderRadius:10, padding:30, boxShadow:'var(--s1)' }}>
                <h3 style={{ fontFamily:'Cormorant Garamond,serif', fontSize:'1.25rem',
                  color:'var(--ink)', marginBottom:22 }}>Shipping Information</h3>
                <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:14 }}>
                  {[['fullName','Full Name','Ahmed Khan'],['phone','Phone','+92-300-0000000']].map(([k,l,ph])=>(
                    <div key={k} className="form-group" style={{ marginBottom:0 }}>
                      <label className="form-label">{l} *</label>
                      <input className="form-input" placeholder={ph} value={form[k]}
                        onChange={e=>f(k,e.target.value)} required/>
                    </div>
                  ))}
                  <div className="form-group" style={{ gridColumn:'1/-1', marginBottom:0 }}>
                    <label className="form-label">Street Address *</label>
                    <input className="form-input" placeholder="House #1, Street #2, Block A"
                      value={form.street} onChange={e=>f('street',e.target.value)} required/>
                  </div>
                  {[['city','City','Karachi'],['province','Province','Sindh'],['postalCode','Postal Code','75500']].map(([k,l,ph])=>(
                    <div key={k} className="form-group" style={{ marginBottom:0 }}>
                      <label className="form-label">{l}{k!=='postalCode'&&' *'}</label>
                      <input className="form-input" placeholder={ph} value={form[k]}
                        onChange={e=>f(k,e.target.value)} required={k!=='postalCode'}/>
                    </div>
                  ))}
                </div>
              </div>

              {/* Payment */}
              <div style={{ background:'white', borderRadius:10, padding:30, boxShadow:'var(--s1)' }}>
                <h3 style={{ fontFamily:'Cormorant Garamond,serif', fontSize:'1.25rem',
                  color:'var(--ink)', marginBottom:22 }}>Payment Method</h3>
                {METHODS.map(([val,icon,label,desc])=>(
                  <label key={val} style={{ display:'flex', alignItems:'center', gap:14,
                    padding:'13px 15px', borderRadius:7, marginBottom:10, cursor:'pointer',
                    border: `2px solid ${form.paymentMethod===val ? 'var(--gold)':'var(--stone)'}`,
                    background: form.paymentMethod===val ? 'rgba(201,168,76,.05)':'white',
                    transition:'border .2s' }}>
                    <input type="radio" value={val} checked={form.paymentMethod===val}
                      onChange={e=>f('paymentMethod',e.target.value)}
                      style={{ accentColor:'var(--gold)' }}/>
                    <span style={{ fontSize:'1.2rem' }}>{icon}</span>
                    <div>
                      <div style={{ fontSize:13.5, fontWeight:600, color:'var(--ink)' }}>{label}</div>
                      <div style={{ fontSize:12, color:'var(--mist)' }}>{desc}</div>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* Summary */}
            <div style={{ background:'white', borderRadius:10, padding:26,
              boxShadow:'var(--s1)', position:'sticky', top:100 }}>
              <h3 style={{ fontFamily:'Cormorant Garamond,serif', fontSize:'1.25rem',
                color:'var(--ink)', marginBottom:18 }}>Order Summary</h3>
              <div style={{ maxHeight:180, overflowY:'auto', marginBottom:18 }}>
                {items.map(i=>(
                  <div key={i.cartId} style={{ display:'flex', justifyContent:'space-between',
                    fontSize:12.5, padding:'5px 0', borderBottom:'1px solid var(--parchment)',
                    color:'var(--mist)' }}>
                    <span>{i.name} × {i.quantity}</span>
                    <span>PKR {((i.onSale&&i.salePrice?i.salePrice:i.price)*i.quantity).toLocaleString()}</span>
                  </div>
                ))}
              </div>
              {[['Subtotal',`PKR ${total.toLocaleString()}`],
                ['Shipping', shipping===0?'Free':'PKR '+shipping],
                ['Total',`PKR ${(total+shipping).toLocaleString()}`]
              ].map(([l,v])=>(
                <div key={l} style={{ display:'flex', justifyContent:'space-between',
                  fontSize:l==='Total'?15.5:13.5, fontWeight:l==='Total'?700:400,
                  color:'var(--mist)', marginBottom:12,
                  paddingTop:l==='Total'?12:0, borderTop:l==='Total'?'1px solid var(--stone)':'none' }}>
                  <span>{l}</span><span style={{ color:'var(--ink)' }}>{v}</span>
                </div>
              ))}
              <button type="submit" className="btn btn-ink btn-lg"
                style={{ width:'100%', marginTop:8 }} disabled={loading}>
                {loading ? 'Placing Order…' : 'Place Order'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
