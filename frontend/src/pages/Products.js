import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import axios from 'axios';
import ProductCard from '../components/ProductCard';

export default function Products() {
  const [sp] = useSearchParams();
  const [products,   setProducts]   = useState([]);
  const [cats,       setCats]       = useState([]);
  const [pagination, setPagination] = useState({});
  const [loading,    setLoading]    = useState(true);
  const [page,       setPage]       = useState(1);
  const [filters,    setFilters]    = useState({
    category: sp.get('category') || '',
    sort:     sp.get('sort')     || '',
    onSale:   sp.get('onSale')   || '',
    newArrival: sp.get('newArrival') || '',
    search:   '',
    minPrice: '',
    maxPrice: '',
  });

  useEffect(() => { axios.get('/categories').then(r => setCats(r.data.categories || [])); }, []);

  useEffect(() => {
    setLoading(true);
    const p = new URLSearchParams();
    Object.entries(filters).forEach(([k,v]) => { if(v) p.set(k,v); });
    p.set('page', page); p.set('limit', 12);
    axios.get(`/products?${p}`)
      .then(r => { setProducts(r.data.products||[]); setPagination(r.data.pagination||{}); })
      .finally(() => setLoading(false));
  }, [filters, page]);

  const setF = (k, v) => { setFilters(p => ({ ...p, [k]:v })); setPage(1); };
  const clear = () => { setFilters({ category:'', sort:'', onSale:'', newArrival:'', search:'', minPrice:'', maxPrice:'' }); setPage(1); };

  return (
    <div style={{ paddingTop:80, minHeight:'100vh', background:'var(--parchment)' }}>
      {/* Page header */}
      <div style={{ background:'var(--ink)', padding:'48px 0', marginBottom:40 }}>
        <div className="container">
          <h1 style={{ fontFamily:'Cormorant Garamond,serif', fontSize:'clamp(2rem,5vw,3rem)',
            color:'white', marginBottom:6 }}>Our Collection</h1>
          <p style={{ color:'rgba(255,255,255,.5)', fontSize:14 }}>
            {pagination.total || 0} products
          </p>
        </div>
      </div>

      <div className="container">
        <div style={{ display:'grid', gridTemplateColumns:'256px 1fr', gap:28, alignItems:'start' }}>

          {/* Sidebar */}
          <aside style={{ background:'white', borderRadius:10, padding:'26px',
            boxShadow:'var(--s1)', position:'sticky', top:100 }}>
            <h3 style={{ fontFamily:'Cormorant Garamond,serif', fontSize:'1.2rem',
              color:'var(--ink)', marginBottom:22 }}>Filter & Sort</h3>

            <div className="form-group">
              <label className="form-label">Search</label>
              <input className="form-input" placeholder="Search products…"
                value={filters.search} onChange={e=>setF('search',e.target.value)} />
            </div>

            <div className="form-group">
              <label className="form-label">Category</label>
              <select className="form-input" value={filters.category} onChange={e=>setF('category',e.target.value)}>
                <option value="">All Categories</option>
                {cats.map(c=><option key={c._id} value={c._id}>{c.name}</option>)}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Sort By</label>
              <select className="form-input" value={filters.sort} onChange={e=>setF('sort',e.target.value)}>
                <option value="">Latest</option>
                <option value="price_asc">Price: Low → High</option>
                <option value="price_desc">Price: High → Low</option>
                <option value="rating">Top Rated</option>
                <option value="popular">Most Popular</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Price Range (PKR)</label>
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:8 }}>
                <input className="form-input" type="number" placeholder="Min"
                  value={filters.minPrice} onChange={e=>setF('minPrice',e.target.value)}/>
                <input className="form-input" type="number" placeholder="Max"
                  value={filters.maxPrice} onChange={e=>setF('maxPrice',e.target.value)}/>
              </div>
            </div>

            {[['onSale','On Sale Only'],['newArrival','New Arrivals']].map(([k,l])=>(
              <label key={k} style={{ display:'flex', alignItems:'center', gap:9,
                cursor:'pointer', fontSize:13.5, marginBottom:12 }}>
                <input type="checkbox" checked={filters[k]==='true'}
                  onChange={e=>setF(k, e.target.checked?'true':'')}
                  style={{ accentColor:'var(--gold)', width:14, height:14 }}/>
                {l}
              </label>
            ))}

            <button className="btn btn-outline" style={{ width:'100%', marginTop:10 }} onClick={clear}>
              Clear Filters
            </button>
          </aside>

          {/* Grid */}
          <div>
            {loading
              ? <div className="page-loader"><div className="spinner"/></div>
              : products.length === 0
                ? <div style={{ textAlign:'center', padding:'80px 0', color:'var(--mist)' }}>
                    <div style={{ fontSize:'3rem', marginBottom:16 }}>🔍</div>
                    <h3 style={{ fontFamily:'Cormorant Garamond,serif', color:'var(--ink)', marginBottom:8 }}>
                      No Products Found
                    </h3>
                    <p>Try adjusting your filters or search term.</p>
                  </div>
                : <>
                    <div className="grid-products">
                      {products.map(p=><ProductCard key={p._id} product={p}/>)}
                    </div>
                    {pagination.pages > 1 && (
                      <div style={{ display:'flex', justifyContent:'center', gap:8, marginTop:48, flexWrap:'wrap' }}>
                        {Array.from({ length:pagination.pages },(_,i)=>i+1).map(pg=>(
                          <button key={pg} onClick={()=>setPage(pg)} className="btn"
                            style={{ minWidth:40, padding:'8px 12px',
                              background: pg===page ? 'var(--gold)':'white',
                              color: pg===page ? 'white':'var(--ink)',
                              border:'1.5px solid var(--stone)', borderRadius:'var(--r)' }}>
                            {pg}
                          </button>
                        ))}
                      </div>
                    )}
                  </>
            }
          </div>
        </div>
      </div>
      <div style={{ height:60 }}/>
    </div>
  );
}
