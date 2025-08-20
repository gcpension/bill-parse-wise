import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

console.log('main.tsx: Starting app...');
const rootElement = document.getElementById("root");
console.log('main.tsx: Root element found:', rootElement);

createRoot(rootElement!).render(<App />);
