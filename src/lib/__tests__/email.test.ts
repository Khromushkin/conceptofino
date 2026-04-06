import { sendEmail } from '@/lib/email'

describe('sendEmail', () => {
  it('returns success:true with console.log fallback when RESEND_API_KEY is absent', async () => {
    const originalKey = process.env.RESEND_API_KEY
    delete process.env.RESEND_API_KEY
    const consoleSpy = jest.spyOn(console, 'log').mockImplementation()

    const result = await sendEmail({
      to: 'info@conceptofino.com',
      subject: 'Test',
      html: '<p>test</p>',
    })

    expect(result.success).toBe(true)
    expect(consoleSpy).toHaveBeenCalled()
    consoleSpy.mockRestore()
    if (originalKey) process.env.RESEND_API_KEY = originalKey
  })
})
