import ReactDOM from 'react-dom/client';
import App from './App';
import './assets/style.css';
import { AuthProvider } from './context/AuthContext';
import ReactGA from 'react-ga4';

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then(registration => {
        console.log('Service worker registered: ', registration);
      })
      .catch(registrationError => {
        console.log('Service worker registration failed: ', registrationError);
      });
  });
}

const trackingId = process.env.REACT_APP_ANALYTICS_TRACKING_ID
if (trackingId) {
  ReactGA.initialize(trackingId)
}

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement)

root.render(<AuthProvider>
  <App />
  <input type="hidden" id="document-position" value="0" />
</AuthProvider>)
