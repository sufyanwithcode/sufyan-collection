import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

export default function Register() {
  const [form, setForm]       = useState({ name:'', email:'', password:'', phone:'' });
  const [loading, setLoading] = useState(false);
  const { register }          = useAuth();
  const navigate              = useNavigate();

  const submit = async e => {
    e.preventDefault();
    if (form.password.length < 6) return toast.error('Password must be at least 6 characters');
    setLoading(true);
    try {
      await register(form.name, form.email, form.password, form.phone);
      toast.success('Welcome to Sufyan Collection!'); navigate('/');
    } catch (err) { toast.error(err.response?.data?.message || 'Registration failed'); }
    finally { setLoading(false); }
  };
  const f = (k,v) => setForm(p=>({...p,[k]:v}));

  return (
    <div style={{ minHeight:'100vh', display:'flex', alignItems:'center',
      justifyContent:'center', background:'var(--parchment)', padding:'120px 20px 60px' }}>
      <div style={{ width:'100%', maxWidth:470, background:'white', borderRadius:12,
        padding:'46px', boxShadow:'var(--s3)' }}>
        <Link to="/" style={{ display:'block', textAlign:'center', marginBottom:30 }}>
          <div style={{ fontFamily:'Cormorant Garamond,serif', fontSize:'1.5rem',
            color:'var(--ink)', fontWeight:700 }}>Sufyan Collection</div>
          <div style={{ fontSize:'9px', letterSpacing:'3px', color:'var(--gold)', textTransform:'uppercase' }}>
            by Capra
          </div>
        </Link>
        <h2 style={{ fontFamily:'Cormorant Garamond,serif', fontSize:'1.8rem',
          color:'var(--ink)', marginBottom:6 }}>Create Account</h2>
        <p style={{ color:'var(--mist)', fontSize:13.5, marginBottom:28 }}>
          Join the Sufyan Collection family
        </p>
        <form onSubmit={submit}>
          {[['name','Full Name','Ahmed Khan','text'],['email','Email Address','ahmed@example.com','email'],
            ['phone','Phone Number','+92-300-0000000','tel'],['password','Password','Min 6 characters','password']
          ].map(([k,l,ph,t])=>(
            <div key={k} className="form-group">
              <label className="form-label">{l}{k!=='phone'&&' *'}</label>
              <input type={t} className="form-input" placeholder={ph}
                value={form[k]} onChange={e=>f(k,e.target.value)} required={k!=='phone'}/>
            </div>
          ))}
          <button type="submit" className="btn btn-ink btn-lg"
            style={{ width:'100%', marginTop:6 }} disabled={loading}>
            {loading ? 'Creating Account…' : 'Create Account'}
          </button>
        </form>
        <p style={{ textAlign:'center', marginTop:22, fontSize:13.5, color:'var(--mist)' }}>
          Already have an account?{' '}
          <Link to="/login" style={{ color:'var(--gold)', fontWeight:600 }}>Sign In</Link>
        </p>
      </div>
    </div>
  );
}
