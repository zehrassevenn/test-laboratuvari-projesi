import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './i18n'; // Dil ayarlarımız burada
import './index.css';
import reportWebVitals from './reportWebVitals';

// O FullCalendar CSS satırlarını SİLDİK.
// Çünkü yeni versiyonlarda otomatik hallediliyor veya bu yollar artık yok.

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

reportWebVitals();