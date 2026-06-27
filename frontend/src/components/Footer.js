import React from 'react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer style={{ background:'#0f0f1a', color:'rgba(255,255,255,.65)', paddingTop:60 }}>
      <div className="container">
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(190px,1fr))',
          gap:40, paddingBottom:48, borderBottom:'1px solid rgba(255,255,255,.09)' }}>

          {/* Brand */}
          <div>
            <div style={{ fontFamily:'Cormorant Garamond,serif', fontSize:'1.3rem',
              color:'white', fontWeight:700, marginBottom:2 }}>Sufyan Collection</div>
            <div style={{ fontSize:'9px', letterSpacing:'3px', color:'#c9a84c',
              textTransform:'uppercase', marginBottom:16 }}>by Capra</div>
            <p style={{ fontSize:13, lineHeight:1.75, marginBottom:20 }}>
              Premium Pakistani fashion — crafted with heritage, passion, and artistry since 2018.
            </p>
            <div style={{ display:'flex', gap:10 }}>
              {['📘','📸','🐦','▶️'].map((ico,i) => (
                <a key={i} href="#!" style={{ width:32, height:32, background:'rgba(255,255,255,.07)',
                  borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center',
                  fontSize:13, transition:'all .2s' }}>{ico}</a>
              ))}
            </div>
          </div>

          {/* Shop */}
          <div>
            <h4 style={{ color:'white', fontSize:12, letterSpacing:'2px',
              textTransform:'uppercase', marginBottom:18 }}>Shop</h4>
            <ul style={{ display:'flex', flexDirection:'column', gap:10 }}>
              {[['New Arrivals','/products?newArrival=true'],["Men's Wear",'/products?gender=men'],
                ["Women's Wear",'/products?gender=women'],['Sale','/products?onSale=true'],
                ['All Products','/products']].map(([l,p]) => (
                <li key={p}><Link to={p} style={{ fontSize:13.5 }}
                  onMouseEnter={e=>e.target.style.color='#c9a84c'}
                  onMouseLeave={e=>e.target.style.color=''}>{l}</Link></li>
              ))}
            </ul>
          </div>

          {/* Help */}
          <div>
            <h4 style={{ color:'white', fontSize:12, letterSpacing:'2px',
              textTransform:'uppercase', marginBottom:18 }}>Help</h4>
            <ul style={{ display:'flex', flexDirection:'column', gap:10 }}>
              {[['My Account','/profile'],['Track Order','/orders'],
                ['Size Guide','#!'],['Return Policy','#!'],['Contact Us','#!']].map(([l,p]) => (
                <li key={l}><Link to={p} style={{ fontSize:13.5 }}>{l}</Link></li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 style={{ color:'white', fontSize:12, letterSpacing:'2px',
              textTransform:'uppercase', marginBottom:18 }}>Contact</h4>
            <div style={{ display:'flex', flexDirection:'column', gap:11, fontSize:13 }}>
              <div>📍 Gulshan-e-Iqbal, Karachi, Pakistan</div>
              <div>📞 +92-300-1234567</div>
              <div>✉️ info@sufyan-collection.com</div>
              <div>🕐 Mon–Sat: 10 am – 9 pm</div>
            </div>
          </div>
        </div>

        <div style={{ padding:'22px 0', display:'flex', justifyContent:'space-between',
          alignItems:'center', flexWrap:'wrap', gap:12, fontSize:12.5 }}>
          <p>© {new Date().getFullYear()} Sufyan Collection by Capra. All rights reserved.</p>
          <div style={{ display:'flex', gap:20 }}>
            <Link to="#!">Privacy Policy</Link>
            <Link to="#!">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
