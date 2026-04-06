/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL || 'https://conceptofino.com',
  generateRobotsTxt: true,
  exclude: ['/404', '/500'],
  alternateRefs: [
    { href: 'https://conceptofino.com/es', hreflang: 'es-ES' },
    { href: 'https://conceptofino.com/en', hreflang: 'en-GB' },
    { href: 'https://conceptofino.com/ru', hreflang: 'ru-RU' },
  ],
  robotsTxtOptions: {
    policies: [
      { userAgent: '*', allow: '/', disallow: ['/api/', '/studio/'] },
    ],
  },
  transform: async (_config, path) => {
    const isHomepage = path === '/es' || path === '/en' || path === '/ru'
    const isProjectDetail = path.includes('/proyectos/') && !path.endsWith('/proyectos')
    return {
      loc: path,
      changefreq: isHomepage ? 'weekly' : 'monthly',
      priority: isHomepage ? 1.0 : isProjectDetail ? 0.8 : 0.7,
    }
  },
}
