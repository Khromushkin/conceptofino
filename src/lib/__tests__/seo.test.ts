import { buildMetadata, buildLocalBusinessJsonLd } from '@/lib/seo'

describe('buildMetadata', () => {
  it('includes canonical URL and openGraph', () => {
    const meta = buildMetadata({
      title: 'Armarios a medida — ConceptoFino',
      description: 'Muebles personalizados en Valencia',
      path: '/es/proyectos',
      locale: 'es',
    })
    expect(meta.alternates?.canonical).toContain('/es/proyectos')
    expect(meta.openGraph?.title).toBe('Armarios a medida — ConceptoFino')
  })
})

describe('buildLocalBusinessJsonLd', () => {
  it('returns LocalBusiness type with required fields', () => {
    const ld = buildLocalBusinessJsonLd('es')
    expect(ld['@type']).toBe('LocalBusiness')
    expect(ld.name).toBe('ConceptoFino')
    expect(ld.address).toBeDefined()
  })
})
