import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { captureBootLayout } from './lib/bootScroll'
import { preloadRoute } from './lib/routePages'

// Before React replaces the prerendered page: if a slow-phone visitor has already scrolled it, remember where.
captureBootLayout()

const boot = () =>
  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <App />
    </StrictMode>,
  )

// The prerendered page stays on screen until this page's code has arrived, so React never swaps it for a blank fallback.
preloadRoute(window.location.pathname).then(boot, boot)
