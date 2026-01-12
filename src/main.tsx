import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { PrivyProvider } from '@privy-io/react-auth';
import './index.css';
import App from './App.tsx';
import { MNEEProvider } from './contexts/MNEEContext';

// Access the environment variable
const PRIVY_APP_ID = import.meta.env.VITE_PRIVY_APP_ID;

if (!PRIVY_APP_ID) {
  throw new Error("Privy App ID is missing! Add VITE_PRIVY_APP_ID to your .env file.");
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <PrivyProvider
      appId={PRIVY_APP_ID}
      config={{
        appearance: {
          theme: 'dark',
          accentColor: '#A855F7',
        },
        loginMethods: ['wallet', 'farcaster', 'email'],
      }}
    >
      <MNEEProvider>
        <App />
      </MNEEProvider>
    </PrivyProvider>
  </StrictMode>
);