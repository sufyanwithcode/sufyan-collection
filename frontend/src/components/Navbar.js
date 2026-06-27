import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import toast from 'react-hot-toast';

const NAV = [
  { label: 'Home',        to: '/' },
  { label: 'All Products',to: '/products' },
  { label: "Men's",       to: '/products?gender=men' },
  { label: "Women's",     to: '/products?gender=women' },
  { label: 'Sale',        to: '/products?onSale=true' },
];

export default function Navbar() {
  const [scrolled,   setScrolled]   = useState(false);
  const [menuOpen,   setMenuOpen]   = useState(false);
  const [dropOpen,   setDropOpen]   = useState(false);
  const dropRef    = useRef(null);
  const { user, logout }            = useAuth();
  const { count }                   = useCart();
  const navigate                    = useNavigate();
  const { pathname }                = useLocation();

  useEffect(() => {
    const s = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', s);
    return () => window.removeEventListener('scroll', s);
  }, []);

  useEffect(() => { setMenuOpen(false); setDropOpen(false); }, [pathname]);

  /* Close dropdown on outside click */
  useEffect(() => {
    const handler = e => { if (dropRef.current && !dropRef.current.contains(e.target)) setDropOpen(false); };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleLogout = () => { logout(); toast.success('Logged out'); navigate('/'); };

  return (
    <>
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 1000,
        padding: scrolled ? '10px 0' : '18px 0',
        background: scrolled ? 'rgba(15,15,26,.97)' : 'transparent',
        backdropFilter: scrolled ? 'blur(12px)' : 'none',
        boxShadow: scrolled ? '0 2px 20px rgba(0,0,0,.35)' : 'none',
        transition: 'all .35s ease',
      }}>
        <div className="container" style={{ display:'flex', alignItems:'center', gap:24 }}>

          {/* Burger */}
          <button onClick={() => setMenuOpen(p=>!p)} aria-label="menu"
            style={{ display:'none', flexDirection:'column', gap:5, padding:6, ['@media(max-width:900px)']:{ display:'flex' } }}
            className="burger-btn">
            <span style={{ width:22, height:2, background:'white', display:'block' }}/>
            <span style={{ width:22, height:2, background:'white', display:'block' }}/>
            <span style={{ width:22, height:2, background:'white', display:'block' }}/>
          </button>

          {/* Logo */}
          <Link to="/" style={{ display:'flex', flexDirection:'column', lineHeight:1, flexShrink:0 }}>
            <span style={{ fontFamily:'Cormorant Garamond,serif', fontSize:'1.35rem', fontWeight:700, color:'white', letterSpacing:1 }}>
              Sufyan Collection
            </span>
            <span style={{ fontSize:'9px', letterSpacing:'3px', textTransform:'uppercase', color:'#c9a84c' }}>
             
            </span>
          </Link>

          {/* Desktop links */}
          <ul style={{ display:'flex', gap:4, marginLeft:8, flex:1 }} className="nav-links-desktop">
            {NAV.map(n => (
              <li key={n.to}>
                <Link to={n.to} style={{
                  color: pathname === n.to ? '#c9a84c' : 'rgba(255,255,255,.82)',
                  fontSize:'13.5px', fontWeight:500, padding:'6px 14px',
                  borderRadius:4, transition:'all .2s',
                  background: pathname === n.to ? 'rgba(201,168,76,.1)' : 'transparent',
                }}>{n.label}</Link>
              </li>
            ))}
          </ul>

          {/* Actions */}
          <div style={{ display:'flex', alignItems:'center', gap:10, marginLeft:'auto' }}>
            <Link to="/cart" style={{ position:'relative', color:'white', fontSize:18,
              padding:'6px 8px', borderRadius:4, transition:'all .2s' }}
              title="Cart">
              🛒
              {count > 0 && (
                <span style={{ position:'absolute', top:-4, right:-4, background:'#c9a84c',
                  color:'white', borderRadius:'50%', width:18, height:18, fontSize:10,
                  display:'flex', alignItems:'center', justifyContent:'center', fontWeight:700 }}>
                  {count > 9 ? '9+' : count}
                </span>
              )}
            </Link>

            {user ? (
              <div ref={dropRef} style={{ position:'relative' }}>
                <button onClick={() => setDropOpen(p=>!p)}
                  style={{ display:'flex', alignItems:'center', gap:7, color:'white',
                    fontSize:13.5, padding:'6px 12px', borderRadius:4,
                    background: dropOpen ? 'rgba(255,255,255,.1)' : 'transparent',
                    transition:'all .2s' }}>
                  <span style={{ width:28, height:28, borderRadius:'50%', background:'#c9a84c',
                    display:'flex', alignItems:'center', justifyContent:'center',
                    fontFamily:'Cormorant Garamond,serif', fontWeight:700, fontSize:14 }}>
                    {user.name[0].toUpperCase()}
                  </span>
                  <span className="hide-mobile">{user.name.split(' ')[0]}</span> ▾
                </button>
                {dropOpen && (
                  <div style={{ position:'absolute', top:'calc(100% + 8px)', right:0,
                    background:'white', borderRadius:8, boxShadow:'0 8px 32px rgba(0,0,0,.18)',
                    minWidth:180, overflow:'hidden', zIndex:200 }}>
                    {[['My Profile','/profile'],['My Orders','/orders']].map(([l,p]) => (
                      <Link key={p} to={p} style={{ display:'block', padding:'12px 18px',
                        fontSize:13.5, color:'#1e1e30', transition:'all .15s' }}
                        onMouseEnter={e=>e.target.style.background='#faf7f2'}
                        onMouseLeave={e=>e.target.style.background='transparent'}>
                        {l}
                      </Link>
                    ))}
                    <hr style={{ border:'none', borderTop:'1px solid #e8e2d9', margin:'3px 0' }}/>
                    <button onClick={handleLogout} style={{ display:'block', width:'100%',
                      padding:'12px 18px', fontSize:13.5, color:'#b83232', textAlign:'left',
                      transition:'all .15s' }}
                      onMouseEnter={e=>e.currentTarget.style.background='#faf7f2'}
                      onMouseLeave={e=>e.currentTarget.style.background='transparent'}>
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link to="/login" className="btn btn-gold btn-sm">Login</Link>
            )}
          </div>
        </div>
      </nav>

      {/* Mobile menu */}
      <div style={{
        position:'fixed', top:0, left: menuOpen ? 0 : '-290px', width:280,
        height:'100vh', background:'#0f0f1a', zIndex:999,
        padding:'80px 0 40px', transition:'left .3s ease', overflowY:'auto',
      }}>
        {NAV.map(n => (
          <Link key={n.to} to={n.to} style={{
            display:'block', padding:'14px 28px', color:'rgba(255,255,255,.82)',
            fontSize:15, borderBottom:'1px solid rgba(255,255,255,.06)', transition:'all .2s',
          }}>
            {n.label}
          </Link>
        ))}
        {!user && (<>
          <Link to="/login"    style={{ display:'block', padding:'14px 28px', color:'#c9a84c', fontSize:15 }}>Login</Link>
          <Link to="/register" style={{ display:'block', padding:'14px 28px', color:'#c9a84c', fontSize:15 }}>Register</Link>
        </>)}
      </div>
      {menuOpen && (
        <div onClick={() => setMenuOpen(false)}
          style={{ position:'fixed', inset:0, background:'rgba(0,0,0,.55)', zIndex:998 }}/>
      )}

      <style>{`
        .burger-btn { display: none; }
        .hide-mobile { }
        @media (max-width: 900px) {
          .burger-btn { display: flex !important; }
          .nav-links-desktop { display: none !important; }
          .hide-mobile { display: none; }
        }
      `}</style>
    </>
  );
}
