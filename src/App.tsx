/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { AuthGuard } from './components/AuthGuard';
import { useFirebaseSync } from './hooks/useFirebaseSync';
import { Navigation } from './components/Navigation';
import { Dashboard } from './components/Dashboard';
import { Analytics } from './components/Analytics';
import { Social } from './components/Social';
import { ProfileOverlay } from './components/ProfileOverlay';

function MainContent() {
  const [currentTab, setCurrentTab] = useState<'dashboard' | 'analytics' | 'social'>('dashboard');
  
  // Custom hook to sync Zustand with Firestore
  useFirebaseSync();

  return (
    <div className="min-h-screen bg-[#f5f5f0] text-[#3a3a2e] font-serif pb-24">
      <div className="max-w-md mx-auto p-4 sm:p-6">
        <ProfileOverlay />
        
        <main>
          {currentTab === 'dashboard' && <Dashboard />}
          {currentTab === 'analytics' && <Analytics />}
          {currentTab === 'social' && <Social />}
        </main>
      </div>

      <Navigation currentTab={currentTab} onTabChange={setCurrentTab} />
    </div>
  );
}

export default function App() {
  return (
    <AuthGuard>
      <MainContent />
    </AuthGuard>
  );
}
