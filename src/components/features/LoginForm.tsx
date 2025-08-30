import { useState } from 'react';
// Removed legacy UI imports
import { auth, db } from '@/lib/firebase/client';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, sendEmailVerification, signOut } from 'firebase/auth';
import { setDoc, doc, serverTimestamp } from 'firebase/firestore';

const LoginForm = () => {
  const [authMode, setAuthMode] = useState('signIn'); // 'signIn' or 'signUp'
  const [name, setName] = useState('');
  const [mobile, setMobile] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const getFriendlyErrorMessage = (error: { code?: string; message: string }) => {
    if (!error || !error.message) return 'An unknown error occurred.';

    switch (error.code) {
        case 'auth/email-already-in-use': return 'This email is already registered. Please sign in.';
        case 'auth/invalid-email': return 'Please enter a valid email address.';
        case 'auth/weak-password': return 'Password should be at least 6 characters.';
        case 'auth/user-not-found': return 'No account found with this email. Please sign up.';
        case 'auth/wrong-password': return 'Incorrect password. Please try again.';
        case 'auth/too-many-requests': return 'Too many attempts. Please try again later.';
        default: return `Authentication failed: ${error.message}`;
    }
  }

  const handleAuthAction = async () => {
    setLoading(true);
    setMessage('');
    try {
      if (authMode === 'signUp') {
        if (!name || !mobile || !email || !password) {
          throw new Error('Please fill all fields');
        }
        if (!/^[6-9]\d{9}$/.test(mobile)) {
          throw new Error('Please enter a valid 10-digit Indian mobile number');
        }
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        await sendEmailVerification(userCredential.user);
        await setDoc(doc(db, 'CommitteeMembers', email), {
            email: email,
            name: name,
            mobile: mobile,
            timestamp: serverTimestamp()
        });
        setMessage('Account created! Please verify your email.');
        await signOut(auth);
        toggleAuthMode('signIn');
      } else {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        if (!user.emailVerified) {
            throw new Error('Please verify your email first');
        }
        // The rest of the logic to show the donation form will be handled in the parent component
      }
    } catch (error) {
      let errorMessage = 'An unknown error occurred.';
      if (error && typeof error === 'object' && 'code' in error && 'message' in error) {
        errorMessage = getFriendlyErrorMessage(error as { code: string; message: string });
      } else if (error instanceof Error) {
        errorMessage = error.message; // For generic JavaScript errors
      }
      setMessage(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const toggleAuthMode = (mode: string) => {
    setAuthMode(mode);
    setMessage('');
  };

  return (
    <div className="form-container active relative" id="loginForm">
      {/* Loading overlay */}
      {loading && (
        <div className="absolute inset-0 bg-white/70 flex flex-col items-center justify-center z-20 rounded-xl" style={{backdropFilter: 'blur(2px)'}}>
          <div className="loader" style={{ borderTopColor: '#b9935a', width: 48, height: 48, borderWidth: 6 }} />
          <span className="mt-4 text-amber-900 font-semibold text-lg animate-pulse">Processing...</span>
        </div>
      )}
      <h2>
        <i className={authMode === 'signIn' ? 'fas fa-user-circle' : 'fas fa-user-plus'}></i>
        {authMode === 'signIn' ? ' Committee Member Login' : ' Committee Member Sign Up'}
      </h2>
      {authMode === 'signUp' && (
        <>
          <div className="form-group">
            <label htmlFor="signupName">Your Name:</label>
            <input type="text" id="signupName" name="signupName" placeholder="Your Full Name" value={name} onChange={(e) => setName(e.target.value)} className="rounded-lg border border-yellow-700/30 focus:border-yellow-700 focus:ring-2 focus:ring-yellow-200" />
          </div>
          <div className="form-group">
            <label htmlFor="signupMobile">Your Mobile Number:</label>
            <input type="tel" id="signupMobile" name="signupMobile" placeholder="9876543210" value={mobile} onChange={(e) => setMobile(e.target.value)} className="rounded-lg border border-yellow-700/30 focus:border-yellow-700 focus:ring-2 focus:ring-yellow-200" />
          </div>
        </>
      )}
      <div className="form-group">
  <label htmlFor="email">Email:</label>
  <input type="email" id="email" name="email" required placeholder="your@email.com" value={email} onChange={(e) => setEmail(e.target.value)} className="rounded-lg border border-yellow-700/30 focus:border-yellow-700 focus:ring-2 focus:ring-yellow-200" />
      </div>
      <div className="form-group">
  <label htmlFor="password">Password:</label>
  <input type="password" id="password" name="password" required value={password} onChange={(e) => setPassword(e.target.value)} className="rounded-lg border border-yellow-700/30 focus:border-yellow-700 focus:ring-2 focus:ring-yellow-200" />
      </div>
      <button
        type="button"
        onClick={handleAuthAction}
        disabled={loading}
        className="w-full py-2 rounded-lg bg-yellow-800 hover:bg-yellow-700 text-white font-semibold transition-colors duration-200 shadow-md focus:outline-none focus:ring-2 focus:ring-yellow-400"
        aria-busy={loading}
      >
        {loading ? (
          <>
            <i className="fas fa-spinner fa-spin"></i> Processing...
          </>
        ) : authMode === 'signIn' ? (
          <>
            <i className="fas fa-sign-in-alt"></i> Login
          </>
        ) : (
          <>
            <i className="fas fa-user-plus"></i> Sign Up
          </>
        )}
      </button>
      <div className="auth-toggle">
        {authMode === 'signIn' ? (
          <>Don&apos;t have an account? <a href="#" onClick={() => toggleAuthMode('signUp')}>Sign up</a></>
        ) : (
          <>Already have an account? <a href="#" onClick={() => toggleAuthMode('signIn')}>Sign in</a></>
        )}
      </div>
      {message && <div className="message error">{message}</div>}
      <button id="resendVerificationButton" className="secondary-btn" style={{ display: 'none', marginTop: '10px' }} aria-hidden="true">
        <i className="fas fa-redo"></i> Resend Verification Email
      </button>
    </div>
  );
};

export default LoginForm;