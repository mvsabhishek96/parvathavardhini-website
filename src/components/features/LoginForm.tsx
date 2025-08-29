import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import AuthButton from "@/components/ui/AuthButton";
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
    <div className="form-container active" id="loginForm">
      <h2>
        <i className={authMode === 'signIn' ? 'fas fa-user-circle' : 'fas fa-user-plus'}></i>
        {authMode === 'signIn' ? ' Committee Member Login' : ' Committee Member Sign Up'}
      </h2>
      
      {authMode === 'signUp' && (
        <>
          <div className="form-group">
            <Label htmlFor="signupName">Your Name:</Label>
            <Input type="text" id="signupName" name="signupName" placeholder="Your Full Name" value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <div className="form-group">
            <Label htmlFor="signupMobile">Your Mobile Number:</Label>
            <Input type="tel" id="signupMobile" name="signupMobile" placeholder="9876543210" value={mobile} onChange={(e) => setMobile(e.target.value)} />
          </div>
        </>
      )}

      <div className="form-group">
        <Label htmlFor="email">Email:</Label>
        <Input type="email" id="email" name="email" required placeholder="your@email.com" value={email} onChange={(e) => setEmail(e.target.value)} />
      </div>
      <div className="form-group">
        <Label htmlFor="password">Password:</Label>
        <Input type="password" id="password" name="password" required value={password} onChange={(e) => setPassword(e.target.value)} />
      </div>

      <AuthButton 
        onClick={handleAuthAction} 
        text={loading ? 'Processing...' : (authMode === 'signIn' ? 'Login' : 'Sign Up')}
        icon={loading ? 'fas fa-spinner fa-spin' : (authMode === 'signIn' ? 'fas fa-sign-in-alt' : 'fas fa-user-plus')}
        disabled={loading}
      />

      <div className="auth-toggle">
        {authMode === 'signIn' ? (
          <>Don&apos;t have an account? <a href="#" onClick={() => toggleAuthMode('signUp')}>Sign up</a></>
        ) : (
          <>Already have an account? <a href="#" onClick={() => toggleAuthMode('signIn')}>Sign in</a></>
        )}
      </div>

      {message && <div className="message error">{message}</div>}

      <Button id="resendVerificationButton" className="secondary-btn" style={{ display: 'none', marginTop: '10px' }}>
        <i className="fas fa-redo"></i> Resend Verification Email
      </Button>
    </div>
  );
};

export default LoginForm;