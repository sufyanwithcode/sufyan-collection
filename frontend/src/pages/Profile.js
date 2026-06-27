import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

export default function Profile() {
  const { user, logout } = useAuth();
  const navigate         = useNavigate();
  const [form,    setForm]    = useState({ name: user?.name||'', phone: user?.phone||'' });
  const [loading, setLoading] = useState(false);

  if (!user) { navigate('/login'); return null; }

  const save = async e => {
    e.preventDefault(); setLoading(true);
    try   { await axios.put('/auth/profile', form); toast.success('Profile updated!'); }
    catch { toast.error('Update failed'); }
    finally { setLoading(false); }
  };

  return (
    <div style={{ paddingTop:100, background:'var(--parchment)', minHeight:'100vh', paddingBottom:80 }}>
      <div className="container" style={{ maxWidth:640 }}>
        <h1 style={{ fontFamily:'Cormorant Garamond,serif', fontSize:'2rem',
          color:'var(--ink)', margin:'32px 0 36px' }}>My Profile</h1>

        <div style={{ background:'white', borderRadius:10, padding:36, boxShadow:'var(--s1)', marginBottom:18 }}>
          {/* Avatar strip */}
          <div style={{ display:'flex', alignItems:'center', gap:18, marginBottom:30,
            padding:'18px', background:'var(--parchment)', borderRadius:8 }}>
            <div style={{ width:58, height:58, borderRadius:'50%', background:'var(--ink)',
              display:'flex', alignItems:'center', justifyContent:'center',
              fontFamily:'Cormorant Garamond,serif', fontWeight:700, fontSize:22, color:'white' }}>
              {user.name[0].toUpperCase()}
            </div>
            <div>
              <div style={{ fontFamily:'Cormorant Garamond,serif', fontSize:'1.2rem', color:'var(--ink)' }}>
                {user.name}
              </div>
              <div style={{ fontSize:12.5, color:'var(--mist)' }}>{user.email}</div>
              <span style={{ display:'inline-block', padding:'2px 10px', marginTop:5, borderRadius:20,
                fontSize:10.5, fontWeight:700, textTransform:'uppercase', letterSpacing:'.5px',
                background: user.role==='admin' ? 'var(--gold)' : 'var(--success)', color:'white' }}>
                {user.role}
              </span>
            </div>
          </div>

          <form onSubmit={save}>
            {[['name','Full Name','text'],['phone','Phone Number','tel']].map(([k,l,t])=>(
              <div key={k} className="form-group">
                <label className="form-label">{l}</label>
                <input type={t} className="form-input" value={form[k]}
                  onChange={e=>setForm(p=>({...p,[k]:e.target.value}))}/>
              </div>
            ))}
            <div className="form-group">
              <label className="form-label">Email Address</label>
              <input type="email" className="form-input" value={user.email} disabled
                style={{ opacity:.55, cursor:'not-allowed' }}/>
            </div>
            <div style={{ display:'flex', gap:12, flexWrap:'wrap' }}>
              <button type="submit" className="btn btn-ink" disabled={loading}>
                {loading ? 'Saving…' : 'Save Changes'}
              </button>
              <Link to="/orders" className="btn btn-outline">My Orders</Link>
            </div>
          </form>
        </div>

        <button onClick={()=>{ logout(); navigate('/'); }}
          className="btn btn-outline"
          style={{ borderColor:'var(--error)', color:'var(--error)' }}>
          Logout
        </button>
      </div>
    </div>
  );
}
