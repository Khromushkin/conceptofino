import { POST } from '@/app/api/lead/route'

jest.mock('@/lib/email', () => ({
  sendEmail: jest.fn().mockResolvedValue({ success: true, id: 'mock-id' }),
}))

function makeRequest(body: unknown) {
  return new Request('http://localhost/api/lead', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
}

describe('POST /api/lead', () => {
  it('returns 200 with valid payload', async () => {
    const res = await POST(makeRequest({
      name: 'Carlos',
      email: 'carlos@example.com',
      phone: '+34 666 123 456',
      projectSlug: 'armario-minimalista-blanco',
      locale: 'es',
    }))
    expect(res.status).toBe(200)
  })

  it('returns 400 when name is missing', async () => {
    const res = await POST(makeRequest({ email: 'x@example.com' }))
    expect(res.status).toBe(400)
  })
})
