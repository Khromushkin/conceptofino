interface SendEmailOptions {
  to: string
  subject: string
  html: string
  replyTo?: string
}

interface SendEmailResult {
  success: boolean
  id?: string
  error?: string
}

export async function sendEmail(options: SendEmailOptions): Promise<SendEmailResult> {
  const apiKey = process.env.RESEND_API_KEY

  if (!apiKey) {
    console.log('[Email fallback — set RESEND_API_KEY to enable]', {
      to: options.to,
      subject: options.subject,
      preview: options.html.slice(0, 120),
    })
    return { success: true, id: 'console-fallback' }
  }

  try {
    const { Resend } = await import('resend')
    const resend = new Resend(apiKey)

    const { data, error } = await resend.emails.send({
      from: 'ConceptoFino <noreply@conceptofino.com>',
      to: options.to,
      subject: options.subject,
      html: options.html,
      replyTo: options.replyTo,
    })

    if (error) return { success: false, error: error.message }
    return { success: true, id: data?.id }
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error'
    console.error('[sendEmail error]', message)
    return { success: false, error: message }
  }
}
