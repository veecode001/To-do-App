import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { supabase } from './supabaseClient';

function Auth({ onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [resetSent, setResetSent] = useState(false);

  const isValidEmail = (value) => {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailPattern.test(value);
  };

  const isValidPassword = (value) => {
    const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
    return passwordPattern.test(value);
  };

  const handleForgotPassword = async () => {
    if (!isValidEmail(email)) {
      setErrorMsg('Please enter your email address first, then click Forgot Password');
      return;
    }

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: 'https://task-manager-veecode.vercel.app/',
    });

    if (error) {
      setErrorMsg(error.message);
    } else {
      setResetSent(true);
      setErrorMsg('');
    }
  };

  const handleAuth = async () => {
    setErrorMsg('');
    setResetSent(false);

    if (!isValidEmail(email)) {
      setErrorMsg('Please enter a valid email address (e.g. name@gmail.com)');
      return;
    }

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
        setErrorMsg('Invalid email or password. Please try again.');
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
              display: 'flex',
              alignItems: 'center',
            }}
          >
            {showPassword ? <Eye size={18} color="#666" /> : <EyeOff size={18} color="#666" />}
          </span>
        </div>

        {isSignUp && (
          <p style={{ fontSize: '12px', color: '#888', marginTop: '-4px' }}>
            Min 8 chars, 1 uppercase, 1 lowercase, 1 number
          </p>
        )}

        {!isSignUp && (
          <p
            onClick={handleForgotPassword}
            style={{
              fontSize: '13px',
              color: '#800020',
              cursor: 'pointer',
              textAlign: 'right',
              marginTop: '-4px',
            }}
          >
            Forgot Password?
          </p>
        )}
      </div>

      {resetSent && (
        <p style={{ fontSize: '13px', color: 'green', marginBottom: '10px' }}>
          Password reset link sent! Check your email.
        </p>
      )}

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