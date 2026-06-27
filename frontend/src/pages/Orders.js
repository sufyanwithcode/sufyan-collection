import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const STATUS_COLOR = {
  pending:'#c87020', confirmed:'#2a6abd', processing:'#7a30b0',
  shipped:'#1a7a6a', delivered:'#2a7a50', cancelled:'#b83232', returned:'#7a7570',
};

export default function Orders() {
  const [orders,  setOrders]  = useState([]);
  const [loading, setLoading] = useState(true);
  const { user }              = useAuth();
  const navigate              = useNavigate();

  useEffect(() => {
    if (!user) { navigate('/login'); return; }
    axios.get('/orders/my-orders')
      .then(r => setOrders(r.data.orders || []))
      .finally(() => setLoading(false));
  }, [user, navigate]);

  if (loading) return (
    <div className="page-loader" style={{ paddingTop:120 }}><div className="spinner"/></div>
  );

  return (
    <div style={{ paddingTop:100, background:'var(--parchment)', minHeight:'100vh', paddingBottom:80 }}>
      <div className="container">
        <h1 style={{ fontFamily:'Cormorant Garamond,serif', fontSize:'2rem',
          color:'var(--ink)', margin:'32px 0 36px' }}>My Orders</h1>

        {!orders.length ? (
          <div style={{ textAlign:'center', padding:'72px 20px', background:'white',
            borderRadius:10, boxShadow:'var(--s1)' }}>
            <div style={{ fontSize:'3rem', marginBottom:14 }}>📦</div>
            <h3 style={{ fontFamily:'Cormorant Garamond,serif', color:'var(--ink)', marginBottom:8 }}>
              No Orders Yet
            </h3>
            <p style={{ color:'var(--mist)', marginBottom:24 }}>Start shopping to see your orders here.</p>
            <Link to="/products" className="btn btn-ink">Browse Products</Link>
          </div>
        ) : (
          <div style={{ display:'flex', flexDirection:'column', gap:18 }}>
            {orders.map(o => (
              <div key={o._id} style={{ background:'white', borderRadius:10, padding:26,
                boxShadow:'var(--s1)' }}>
                <div style={{ display:'flex', justifyContent:'space-between',
                  alignItems:'flex-start', marginBottom:18, flexWrap:'wrap', gap:12 }}>
                  <div>
                    <div style={{ fontSize:11.5, color:'var(--mist)', marginBottom:3 }}>Order Number</div>
                    <div style={{ fontFamily:'Cormorant Garamond,serif', fontSize:'1.15rem',
                      color:'var(--ink)', fontWeight:600 }}>#{o.orderNumber}</div>
                    <div style={{ fontSize:12.5, color:'var(--mist)', marginTop:3 }}>
                      {new Date(o.createdAt).toLocaleDateString('en-PK',
                        { year:'numeric', month:'long', day:'numeric' })}
                    </div>
                  </div>
                  <div style={{ textAlign:'right' }}>
                    <span style={{ display:'inline-block', padding:'3px 13px', borderRadius:20,
                      background: STATUS_COLOR[o.orderStatus]||'#7a7570',
                      color:'white', fontSize:11, fontWeight:700,
                      textTransform:'capitalize', marginBottom:6 }}>
                      {o.orderStatus}
                    </span>
                    <div style={{ fontFamily:'Cormorant Garamond,serif', fontSize:'1.1rem',
                      fontWeight:700, color:'var(--ink)' }}>
                      PKR {o.total.toLocaleString()}
                    </div>
                  </div>
                </div>

                <div style={{ display:'flex', gap:10, overflowX:'auto', paddingBottom:4 }}>
                  {o.items.map(item=>(
                    <div key={item._id} style={{ flexShrink:0, width:65 }}>
                      <img src={item.image||'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=100&q=60'}
                        alt={item.name}
                        style={{ width:65, height:84, objectFit:'cover', borderRadius:6, marginBottom:4 }}/>
                      <div style={{ fontSize:10.5, color:'var(--mist)', lineHeight:1.3, textAlign:'center' }}>
                        {item.name}
                      </div>
                    </div>
                  ))}
                </div>

                {o.trackingNumber && (
                  <div style={{ marginTop:14, padding:'9px 14px', background:'var(--parchment)',
                    borderRadius:6, fontSize:12.5, color:'var(--mist)' }}>
                    <strong style={{ color:'var(--ink)' }}>Tracking:</strong> {o.trackingNumber}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
