import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Capacitor } from '@capacitor/core'
import { SplashScreen } from '@capacitor/splash-screen'
import { StatusBar, Style } from '@capacitor/status-bar'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      refetchOnWindowFocus: false,
    },
  },
})

// Configuration pour les appareils mobiles
if (Capacitor.isNativePlatform()) {
  // Détection du mode sombre/clair automatique
  const isDarkMode = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  
  // Configuration de la barre de statut adaptée au thème
  StatusBar.setStyle({ 
    style: isDarkMode ? Style.Dark : Style.Light 
  });
  
  StatusBar.setBackgroundColor({ 
    color: isDarkMode ? '#000000' : '#FFFFFF' 
  });
  
  // Masquer le splash screen après le chargement
  SplashScreen.hide();
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  </React.StrictMode>
)