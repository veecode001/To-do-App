import React, { useState } from 'react';
import { supabase } from './supabaseClient';

function Auth({ onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const isValidEmail = (value) => {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailPattern.test(value);
  };

  const handleAuth = async () => {
    setErrorMsg('');

    if (!isValidEmail(email)) {
      setErrorMsg('Please enter a valid email address (e.g. name@gmail.com)');
      return;
    }

  const isValidPassword = (value) => {
    const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
    return passwordPattern.test(value);
  };

  if (!isValidPassword(password)) {
    setErrorMsg('Password must be at least 8 characters, with uppercase, lowercase, and a number');
    return;
  }

  if (isSignUp) {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) {
        setErrorMsg(error.message);
      } else {
        onLogin(data.user);
      }
    } else {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        setErrorMsg(error.message);
      } else {
        onLogin(data.user);
      }
    }
  };

  return (
    <div className="container">
      <h1>{isSignUp ? 'Create Account' : 'Welcome Back'}</h1>

      <div className="input-row" style={{ flexDirection: 'column', gap: '10px' }}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <div style={{ position: 'relative', width: '100%' }}>
          <input
            type={showPassword ? 'text' : 'password'}
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{ width: '100%', paddingRight: '40px' }}
          />
          <span
            onClick={() => setShowPassword(!showPassword)}
            style={{
              position: 'absolute',
              right: '12px',
              top: '50%',
              transform: 'translateY(-50%)',
              cursor: 'pointer',
              fontSize: '16px',
            }}
          >
            {showPassword ? '🙈' : '👁️'}
          </span>
        </div>
      </div>

      {errorMsg && <p style={{ color: 'red', fontSize: '13px' }}>{errorMsg}</p>}

      <button className="add-btn" onClick={handleAuth} style={{ width: '100%' }}>
        {isSignUp ? 'Sign Up' : 'Log In'}
      </button>

      <p style={{ marginTop: '15px', fontSize: '14px', textAlign: 'center' }}>
        {isSignUp ? 'Already have an account?' : "Don't have an account?"}{' '}
        <span
          style={{ color: '#4f46e5', cursor: 'pointer', fontWeight: 'bold' }}
          onClick={() => setIsSignUp(!isSignUp)}
        >
          {isSignUp ? 'Log In' : 'Sign Up'}
        </span>
      </p>
    </div>
  );
}

export default Auth;