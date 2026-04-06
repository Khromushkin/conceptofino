import { POST } from '@/app/api/contact/route'

jest.mock('@/lib/email', () => ({
  sendEmail: jest.fn().mockResolvedValue({ success: true, id: 'mock-id' }),
}))

function makeRequest(body: unknown) {
  return new Request('http://localhost/api/contact', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
}

describe('POST /api/contact', () => {
  it('returns 200 with valid payload', async () => {
    const res = await POST(makeRequest({
      name: 'Ana García',
      email: 'ana@example.com',
      phone: '+34 612 345 678',
      message: 'Me interesa un armario empotrado',
      service: 'wardrobes',
      locale: 'es',
    }))
    expect(res.status).toBe(200)
    const json = await res.json()
    expect(json.success).toBe(true)
  })

  it('returns 400 when required fields are missing', async () => {
    const res = await POST(makeRequest({ name: 'Ana' }))
    expect(res.status).toBe(400)
  })
})
