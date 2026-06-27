import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

export default function Login() {
  const [form,    setForm]    = useState({ email:'', password:'' });
  const [loading, setLoading] = useState(false);
  const { login }             = useAuth();
  const navigate              = useNavigate();

  const submit = async e => {
    e.preventDefault(); setLoading(true);
    try   { await login(form.email, form.password); toast.success('Welcome back!'); navigate('/'); }
    catch (err) { toast.error(err.response?.data?.message || 'Login failed'); }
    finally { setLoading(false); }
  };

  return (
    <div style={{ minHeight:'100vh', display:'flex' }}>
      {/* Left panel */}
      <div style={{ flex:1, background:'linear-gradient(155deg,#0f0f1a 0%,#1a1228 60%,#0c1e2e 100%)',
        display:'flex', alignItems:'center', justifyContent:'center', padding:60 }}>
        <div style={{ textAlign:'center', maxWidth:380 }}>
          <div style={{ fontFamily:'Cormorant Garamond,serif', fontSize:'2rem',
            color:'white', fontWeight:700 }}>Sufyan Collection</div>
          <div style={{ fontSize:'9px', letterSpacing:'3px', color:'#c9a84c',
            textTransform:'uppercase', marginBottom:28 }}>by Capra</div>
          <p style={{ color:'rgba(255,255,255,.6)', fontSize:'1rem', lineHeight:1.8 }}>
            Premium Pakistani fashion crafted with passion and heritage. Sign in to explore our
            exclusive collections.
          </p>
        </div>
      </div>

      {/* Right panel */}
      <div style={{ flex:1, display:'flex', alignItems:'center', justifyContent:'center',
        padding:'60px 40px', background:'var(--cream)' }}>
        <div style={{ width:'100%', maxWidth:400 }}>
          <h2 style={{ fontFamily:'Cormorant Garamond,serif', fontSize:'2rem',
            color:'var(--ink)', marginBottom:6 }}>Welcome Back</h2>
          <p style={{ color:'var(--mist)', marginBottom:32, fontSize:14 }}>
            Sign in to your account
          </p>

          <form onSubmit={submit}>
            <div className="form-group">
              <label className="form-label">Email Address</label>
              <input type="email" className="form-input" placeholder="you@example.com"
                value={form.email} onChange={e=>setForm(f=>({...f,email:e.target.value}))} required/>
            </div>
            <div className="form-group">
              <label className="form-label">Password</label>
              <input type="password" className="form-input" placeholder="••••••••"
                value={form.password} onChange={e=>setForm(f=>({...f,password:e.target.value}))} required/>
            </div>
            <button type="submit" className="btn btn-ink btn-lg"
              style={{ width:'100%', marginTop:8 }} disabled={loading}>
              {loading ? 'Signing in…' : 'Sign In'}
            </button>
          </form>

          <p style={{ textAlign:'center', marginTop:24, fontSize:13.5, color:'var(--mist)' }}>
            Don't have an account?{' '}
            <Link to="/register" style={{ color:'var(--gold)', fontWeight:600 }}>Create one</Link>
          </p>

          <div style={{ marginTop:22, padding:'14px', background:'var(--parchment)',
            borderRadius:7, fontSize:12.5, color:'var(--mist)' }}>
            <strong>Demo — Admin:</strong> admin@sufyan-collection.com / Admin@123
          </div>
        </div>
      </div>
    </div>
  );
}
