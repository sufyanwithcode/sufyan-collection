import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import ProductCard from '../components/ProductCard';

/* ─── Hero ────────────────────────────────────────────────── */
function Hero() {
  return (
    <section style={{
      minHeight:'100vh', position:'relative', display:'flex', alignItems:'center',
      background:'linear-gradient(160deg, #0f0f1a 0%, #1a1228 55%, #0c1e2e 100%)',
      overflow:'hidden',
    }}>
      {/* background texture overlay */}
      <div style={{ position:'absolute', inset:0,
        backgroundImage:'url(https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1400&q=60)',
        backgroundSize:'cover', backgroundPosition:'center', opacity:.12 }}/>
      <div style={{ position:'absolute', inset:0,
        background:'linear-gradient(to right, rgba(15,15,26,.96) 45%, rgba(15,15,26,.35))' }}/>

      {/* Decorative gold line */}
      <div style={{ position:'absolute', top:0, left:'50%', width:1, height:100,
        background:'linear-gradient(to bottom, transparent, #c9a84c)', opacity:.4 }}/>

      <div className="container" style={{ position:'relative', zIndex:2,
        paddingTop:120, paddingBottom:80 }}>
        <div style={{ maxWidth:580 }}>
          <div className="section-label">New Collection 2024</div>
          <h1 style={{
            fontFamily:'Cormorant Garamond,serif',
            fontSize:'clamp(3rem,7.5vw,5.5rem)',
            color:'white', lineHeight:1.05, fontWeight:600,
            marginBottom:24,
          }}>
            Wear Your<br />
            <em style={{ color:'#c9a84c', fontStyle:'italic' }}>Heritage</em><br />
            With Pride
          </h1>
          <p style={{ fontSize:'1.05rem', color:'rgba(255,255,255,.65)',
            lineHeight:1.8, maxWidth:430, marginBottom:40 }}>
            Discover the finest Pakistani fashion — hand-embroidered kurtas, luxurious lawn suits,
            and timeless formal wear, all in one place.
          </p>
          <div style={{ display:'flex', gap:14, flexWrap:'wrap' }}>
            <Link to="/products" className="btn btn-gold btn-lg">Explore Collection</Link>
            <Link to="/products?newArrival=true" className="btn btn-outline-white btn-lg">New Arrivals</Link>
          </div>

          {/* Stats */}
          <div style={{ display:'flex', gap:40, marginTop:56,
            paddingTop:40, borderTop:'1px solid rgba(255,255,255,.1)' }}>
            {[['500+','Products'],['50K+','Customers'],['100%','Authentic'],['Free','Returns']].map(([n,l])=>(
              <div key={l}>
                <div style={{ fontFamily:'Cormorant Garamond,serif', fontSize:'1.9rem',
                  color:'#c9a84c', fontWeight:700 }}>{n}</div>
                <div style={{ fontSize:10.5, color:'rgba(255,255,255,.45)',
                  letterSpacing:'1.5px', textTransform:'uppercase' }}>{l}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Scroll cue */}
      <div style={{ position:'absolute', bottom:32, left:'50%', transform:'translateX(-50%)',
        display:'flex', flexDirection:'column', alignItems:'center', gap:8 }}>
        <div style={{ width:24, height:40, border:'1.5px solid rgba(255,255,255,.25)',
          borderRadius:12, display:'flex', justifyContent:'center', paddingTop:7 }}>
          <div style={{ width:3, height:7, background:'#c9a84c', borderRadius:2,
            animation:'scrollDot 1.6s ease infinite' }}/>
        </div>
      </div>
      <style>{`@keyframes scrollDot{0%{opacity:1;transform:translateY(0)}100%{opacity:0;transform:translateY(12px)}}`}</style>
    </section>
  );
}

/* ─── Category card ───────────────────────────────────────── */
const CAT_COLORS = ['#1c2e40','#2d1f3d','#1a3028','#3d1818','#1a2d1a','#2a2014','#0d2233','#2d2020'];
function CatCard({ name, icon, slug, idx }) {
  const [hov, setHov] = useState(false);
  return (
    <Link to={`/products?category=${slug}`}
      onMouseEnter={()=>setHov(true)} onMouseLeave={()=>setHov(false)}
      style={{
        display:'block', background: CAT_COLORS[idx % CAT_COLORS.length],
        borderRadius:10, padding:'28px 20px', textAlign:'center',
        transition:'all .3s', textDecoration:'none',
        transform: hov ? 'translateY(-6px)' : 'none',
        boxShadow: hov ? '0 14px 36px rgba(0,0,0,.22)' : '0 2px 10px rgba(0,0,0,.1)',
      }}>
      <div style={{ fontSize:'2.4rem', marginBottom:10 }}>{icon}</div>
      <div style={{ fontFamily:'Cormorant Garamond,serif', fontSize:'1.05rem',
        color:'white', fontWeight:600 }}>{name}</div>
    </Link>
  );
}

/* ─── Why Us card ─────────────────────────────────────────── */
function WhyCard({ icon, title, desc }) {
  const [hov, setHov] = useState(false);
  return (
    <div onMouseEnter={()=>setHov(true)} onMouseLeave={()=>setHov(false)}
      style={{ background:'white', borderRadius:10, padding:'34px 26px', textAlign:'center',
        boxShadow: hov ? 'var(--s2)' : 'var(--s1)', transition:'all .3s',
        transform: hov ? 'translateY(-4px)' : 'none' }}>
      <div style={{ fontSize:'2.6rem', marginBottom:14 }}>{icon}</div>
      <h3 style={{ fontFamily:'Cormorant Garamond,serif', fontSize:'1.15rem',
        marginBottom:10, color:'var(--ink)' }}>{title}</h3>
      <p style={{ fontSize:13, color:'var(--mist)', lineHeight:1.75 }}>{desc}</p>
    </div>
  );
}

/* ─── Main ────────────────────────────────────────────────── */
export default function Home() {
  const [featured, setFeatured] = useState([]);
  const [newArr,   setNewArr]   = useState([]);
  const [cats,     setCats]     = useState([]);
  const [loading,  setLoading]  = useState(true);

  useEffect(() => {
    Promise.all([
      axios.get('/products?featured=true&limit=8'),
      axios.get('/products?newArrival=true&limit=4'),
      axios.get('/categories'),
    ]).then(([f,n,c]) => {
      setFeatured(f.data.products || []);
      setNewArr(n.data.products   || []);
      setCats(c.data.categories   || []);
    }).finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <Hero />

      {/* Categories */}
      <section className="section" style={{ background:'var(--parchment)' }}>
        <div className="container">
          <div className="section-header">
            <div className="section-label">Browse by Category</div>
            <h2 className="section-title">Our Collections</h2>
            <p className="section-sub">From everyday essentials to grand celebration wear.</p>
          </div>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(160px,1fr))', gap:18 }}>
            {cats.map((c,i)=><CatCard key={c._id} name={c.name} icon={c.icon} slug={c.slug} idx={i}/>)}
          </div>
        </div>
      </section>

      {/* Featured */}
      <section className="section" style={{ background:'white' }}>
        <div className="container">
          <div className="section-header">
            <div className="section-label">Handpicked for You</div>
            <h2 className="section-title">Featured Products</h2>
          </div>
          {loading
            ? <div className="page-loader"><div className="spinner"/></div>
            : <>
                <div className="grid-products">
                  {featured.map(p=><ProductCard key={p._id} product={p}/>)}
                </div>
                <div style={{ textAlign:'center', marginTop:48 }}>
                  <Link to="/products" className="btn btn-outline btn-lg">View All Products</Link>
                </div>
              </>
          }
        </div>
      </section>

      {/* New Arrivals dark band */}
      <section style={{ background:'linear-gradient(135deg,#0f0f1a 0%,#1a1228 100%)', padding:'80px 0' }}>
        <div className="container">
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:64, alignItems:'center' }}>
            <div>
              <div className="section-label">Just Dropped</div>
              <h2 style={{ fontFamily:'Cormorant Garamond,serif', fontSize:'clamp(2rem,4vw,2.8rem)',
                color:'white', marginBottom:16, lineHeight:1.15 }}>New Arrivals</h2>
              <p style={{ color:'rgba(255,255,255,.6)', fontSize:'1rem', lineHeight:1.8, marginBottom:34 }}>
                Fresh styles just landed. Be the first to discover this season's most anticipated pieces
                from Sufyan Collection.
              </p>
              <Link to="/products?newArrival=true" className="btn btn-gold btn-lg">Shop New Arrivals</Link>
            </div>
            <div className="grid-products" style={{ gridTemplateColumns:'repeat(2,1fr)', gap:14 }}>
              {newArr.map(p=><ProductCard key={p._id} product={p}/>)}
            </div>
          </div>
        </div>
      </section>

      {/* Why Capra */}
      <section className="section" style={{ background:'var(--parchment)' }}>
        <div className="container">
          <div className="section-header">
            <div className="section-label">The Capra Promise</div>
            <h2 className="section-title">Why Choose Sufyan Collection</h2>
          </div>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(210px,1fr))', gap:24 }}>
            {[
              {icon:'🧵',title:'Premium Fabrics',      desc:'Every piece is crafted from hand-selected, premium-grade fabrics sourced from across Pakistan.'},
              {icon:'✂️',title:'Master Craftsmanship', desc:'Each garment is stitched by skilled artisans with decades of experience in traditional techniques.'},
              {icon:'🚚',title:'Fast Delivery',        desc:'Order today, receive within 3–5 business days anywhere in Pakistan with real-time tracking.'},
              {icon:'↩️',title:'Easy Returns',         desc:'15-day hassle-free return policy. If you\'re not satisfied, we\'ll make it right — guaranteed.'},
            ].map(c=><WhyCard key={c.title} {...c}/>)}
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section style={{ background:'#c9a84c', padding:'68px 0' }}>
        <div className="container" style={{ textAlign:'center', maxWidth:540 }}>
          <h2 style={{ fontFamily:'Cormorant Garamond,serif', fontSize:'2.1rem',
            color:'var(--ink)', marginBottom:10 }}>Stay in the Loop</h2>
          <p style={{ color:'rgba(15,15,26,.7)', marginBottom:30, fontSize:'1rem' }}>
            Subscribe for early access to new collections, exclusive discounts, and style inspiration.
          </p>
          <div style={{ display:'flex', gap:10, maxWidth:420, margin:'0 auto' }}>
            <input type="email" placeholder="Your email address" className="form-input" style={{ flex:1 }}/>
            <button className="btn btn-ink">Subscribe</button>
          </div>
        </div>
      </section>
    </div>
  );
}
