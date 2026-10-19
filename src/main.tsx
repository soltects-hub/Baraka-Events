import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { captureBootLayout } from './lib/bootScroll'

// Before React replaces the prerendered page: if a slow-phone visitor has already scrolled it, remember where.
captureBootLayout()

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
