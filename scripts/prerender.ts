/**
 * Build-time static prerendering.
 *
 * This app is a client-only Vite SPA (no SSR/SSG) — `dist/index.html`
 * ships as an empty `<div id="root">`, and every heading, service
 * description, meta tag and JSON-LD block is written in by React after
 * the bundle loads. Search engines that render JavaScript eventually see
 * everything, but crawlers that don't (most AI crawlers, most link
 * unfurlers used by WhatsApp/Facebook/LinkedIn/iMessage) see nothing at
 * all, and even Google's own JS-rendering pass is a slower "second wave".
 *
 * Rather than rewriting the app onto an SSR framework — which would mean
 * making every WebGL/Three.js/animation component (GoldEmblem3D,
 * DepthFlythrough, SmokeCursor, TeamCarousel3D, DollyZoom...) safe to
 * run in Node, a large and risky change for a site whose whole identity
 * is those animations — this script does the same thing tools like
 * react-snap do: boot the already-working, already-tested client app in
 * a real (headless) browser after `vite build`, let it render each
 * route exactly as a visitor's browser would, then save the resulting
 * HTML as that route's static file. Real visitors still get the full
 * interactive client app (main.tsx keeps using createRoot, so it just
 * re-renders on top on load) — only crawlers and link-preview bots
 * benefit from the snapshot.
 *
 * Any single route failing to prerender must never fail the production
 * build, so each route is isolated in its own try/catch; a failed route
 * simply falls back to the existing plain SPA shell + client rendering,
 * i.e. exactly today's behavior for that one route.
 */
import { spawn, type ChildProcess } from 'node:child_process';
import { mkdirSync, writeFileSync, existsSync, readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { posts } from '../src/lib/posts';
import { routes } from '../src/seo';

const PORT = 4319;
const ORIGIN = `http://localhost:${PORT}`;
const DIST = resolve(process.cwd(), 'dist');

// Vercel's build container is a minimal image missing the shared libraries
// (libnspr4, libnss3, ...) puppeteer's own downloaded Chrome needs, so its
// binary fails to launch there ("error while loading shared libraries").
// @sparticuz/chromium ships a Chromium build compiled specifically to run
// in that kind of minimal serverless environment; use it (via puppeteer-core)
// there, and the full local `puppeteer` package everywhere else (i.e. a
// developer running `npm run build` on their own machine).
async function launchBrowser() {
  const commonArgs = ['--disable-setuid-sandbox', '--no-sandbox'];
  if (process.env.VERCEL) {
    const [{ default: puppeteerCore }, { default: chromium }] = await Promise.all([
      import('puppeteer-core'),
      import('@sparticuz/chromium'),
    ]);
    return puppeteerCore.launch({
      args: [...chromium.args, ...commonArgs],
      executablePath: await chromium.executablePath(),
      headless: true,
    });
  }
  const { default: puppeteer } = await import('puppeteer');
  return puppeteer.launch({
    headless: true,
    args: [...commonArgs, '--use-gl=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'],
  });
}

// Static file name each route is written to, resolved against `vercel.json`'s
// explicit rewrites (so `/about` <-> `dist/about.html`, `/blog/x` <->
// `dist/blog/x.html`). Home is handled separately at the very end so every
// other route's navigation is served the plain, unmodified vite-built shell
// while it's being captured, not a half-finished prerender pass.
function outputPathFor(path: string): string {
  if (path === '/') return resolve(DIST, 'index.html');
  const clean = path.replace(/^\/|\/$/g, '');
  return resolve(DIST, `${clean}.html`);
}

const routePaths: string[] = [
  routes.about,
  routes.experiences,
  routes.portfolio,
  routes.gallery,
  routes.team,
  routes.contact,
  routes.blog,
  ...posts.map((p) => routes.blogPost(p.slug)),
  routes.home, // last — see outputPathFor note above
];

function waitForServer(url: string, timeoutMs = 20000): Promise<void> {
  const start = Date.now();
  return new Promise((resolvePromise, reject) => {
    const attempt = () => {
      fetch(url)
        .then(() => resolvePromise())
        .catch(() => {
          if (Date.now() - start > timeoutMs) reject(new Error(`Static server did not start within ${timeoutMs}ms`));
          else setTimeout(attempt, 250);
        });
    };
    attempt();
  });
}

async function scrollThroughPage(page: import('puppeteer').Page) {
  // LazyMount (src/lib/lazyMountRegistry.ts) mounts its children only once
  // an IntersectionObserver reports them near-viewport — without scrolling,
  // entire below-the-fold sections would be genuinely absent from the
  // captured HTML, not just unanimated.
  await page.evaluate(async () => {
    const height = document.body.scrollHeight;
    const steps = 6;
    for (let i = 1; i <= steps; i++) {
      window.scrollTo(0, Math.round((height * i) / steps));
      await new Promise((r) => setTimeout(r, 250));
    }
    window.scrollTo(0, 0);
  });
}

async function prerenderRoute(browser: import('puppeteer').Browser, path: string): Promise<void> {
  const page = await browser.newPage();
  try {
    await page.setViewport({ width: 1440, height: 900 });
    await page.goto(`${ORIGIN}${path}`, { waitUntil: 'networkidle0', timeout: 30000 });
    // Past the ~2.4s homepage preloader and any lazy chunk fetches, so the
    // useSEO()/applyStructuredData() effects have committed their tags.
    await new Promise((r) => setTimeout(r, 2800));
    await scrollThroughPage(page);
    await new Promise((r) => setTimeout(r, 400));

    const html = await page.evaluate(() => '<!doctype html>\n' + document.documentElement.outerHTML);

    const outPath = outputPathFor(path);
    mkdirSync(dirname(outPath), { recursive: true });
    writeFileSync(outPath, html, 'utf8');
    console.log(`  prerendered ${path} -> ${outPath.replace(DIST, 'dist')}`);
  } finally {
    await page.close();
  }
}

async function main() {
  const shellPath = resolve(DIST, 'index.html');
  if (!existsSync(shellPath)) {
    console.error('dist/index.html not found — run `vite build` before prerendering.');
    process.exit(1);
  }
  // Captured before anything is overwritten. `vercel.json` rewrites every
  // route (including dynamic /blog/:slug ones) straight to its .html file —
  // if a route's prerender ever fails, writing this plain shell there
  // instead means the rewrite destination still exists and that route just
  // falls back to today's normal client-rendered behavior, never a 404.
  const plainShell = readFileSync(shellPath, 'utf8');

  console.log(`Starting static server for dist/ on port ${PORT}...`);
  const server: ChildProcess = spawn('npx', ['--yes', 'serve', '-s', 'dist', '-l', String(PORT)], {
    stdio: 'ignore',
    shell: true,
  });

  let browser: import('puppeteer').Browser | undefined;
  let succeeded = 0;
  let failed = 0;

  try {
    await waitForServer(ORIGIN);

    browser = (await launchBrowser()) as import('puppeteer').Browser;

    for (const path of routePaths) {
      try {
        await prerenderRoute(browser, path);
        succeeded++;
      } catch (err) {
        failed++;
        console.warn(`  ! skipped ${path} (falls back to plain client rendering): ${(err as Error).message}`);
      }
    }
  } catch (err) {
    console.warn(`Prerendering skipped entirely (falls back to plain client rendering for every route): ${(err as Error).message}`);
  } finally {
    if (browser) await browser.close();
    server.kill();
  }

  // Final safety net: `vercel.json` rewrites every one of these paths
  // straight to its .html file, so each one must exist no matter what went
  // wrong above (a route-level failure, or the whole browser/server never
  // starting) — otherwise that route would 404 instead of falling back.
  for (const path of routePaths) {
    const outPath = outputPathFor(path);
    if (!existsSync(outPath)) {
      mkdirSync(dirname(outPath), { recursive: true });
      writeFileSync(outPath, plainShell, 'utf8');
    }
  }

  console.log(`Prerender done: ${succeeded} route(s) prerendered, ${failed} skipped.`);
}

main();
