'use client';

import { useState } from 'react';
import Slideshow from '@/components/shared/Slideshow';
import LoginForm from '@/components/features/LoginForm';
import DonationForm from '@/components/features/DonationForm';
import SubmissionsList from '@/components/features/SubmissionsList';
import { useAuth } from '@/components/shared/AuthProvider';
import { Button } from '@/components/ui/button';
import { auth } from '@/lib/firebase/client';

export default function HomePage() {
  const { user, loading } = useAuth();
  const [showSubmissions, setShowSubmissions] = useState(false);

  return (
    <main>
      <Slideshow />
      <div className="container">
        <div className="logo">
          <h1><i className="fas fa-om"></i> Donation Portal</h1>
        </div>
        {loading ? (
          <div className="loader"></div>
        ) : user ? (
          <>
            <div id="top-bar" style={{ display: 'flex', width: '100%', maxWidth: '1000px', margin: '15px auto' }}>
              <div id="userInfo" className="user-info-display">
                <i className="fas fa-user-check"></i>
                <span>{user.email}</span>
              </div>
              <div className="action-buttons">
                <Button onClick={() => setShowSubmissions(!showSubmissions)}>
                  <i className="fas fa-list"></i> {showSubmissions ? 'Hide Submissions' : 'View Submissions'}
                </Button>
                <Button onClick={() => auth.signOut()}>
                  <i className="fas fa-sign-out-alt"></i> Logout
                </Button>
              </div>
            </div>
            {showSubmissions ? <SubmissionsList /> : <DonationForm />}
          </>
        ) : (
          <LoginForm />
        )}
      </div>
      <footer className="site-footer">
        <p>Developed by mvsabhishek96@gmail.com</p>
      </footer>
    </main>
  );
}
