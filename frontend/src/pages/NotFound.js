import React from 'react';
import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div style={{ paddingTop:140, minHeight:'80vh', display:'flex', alignItems:'center',
      justifyContent:'center', textAlign:'center', padding:'140px 20px 60px' }}>
      <div>
        <div style={{ fontFamily:'Cormorant Garamond,serif', fontSize:'8rem',
          color:'var(--stone)', lineHeight:1, marginBottom:22 }}>404</div>
        <h1 style={{ fontFamily:'Cormorant Garamond,serif', fontSize:'2rem',
          color:'var(--ink)', marginBottom:10 }}>Page Not Found</h1>
        <p style={{ color:'var(--mist)', marginBottom:30 }}>
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div style={{ display:'flex', gap:14, justifyContent:'center' }}>
          <Link to="/"        className="btn btn-ink btn-lg">Go Home</Link>
          <Link to="/products" className="btn btn-outline btn-lg">Browse Products</Link>
        </div>
      </div>
    </div>
  );
}
