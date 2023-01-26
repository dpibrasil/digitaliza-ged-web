import ReactDOM from 'react-dom/client';
import App from './App';
import './assets/style.css';
import { AuthProvider } from './context/AuthContext';
import ReactGA from 'react-ga4';

const trackingId = process.env.REACT_APP_ANALYTICS_TRACKING_ID
if (trackingId) {
  ReactGA.initialize(trackingId)
}

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement)

root.render(<AuthProvider>
  <App />
</AuthProvider>)
