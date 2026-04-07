// Middleware disabled for static export (output: 'export')
// Locale routing is handled by .htaccess on static hosting
// Re-enable when deploying to Node.js server / Vercel

export function middleware() {}

export const config = {
  matcher: [],
}
