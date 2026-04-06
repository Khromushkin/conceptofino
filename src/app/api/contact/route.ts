import { NextResponse } from 'next/server'
import { z } from 'zod'
import { sendEmail } from '@/lib/email'

const contactSchema = z.object({
  name: z.string().min(2).max(100),
  email: z.string().email(),
  phone: z.string().optional(),
  message: z.string().min(10).max(2000),
  service: z.string().optional(),
  locale: z.enum(['es', 'en', 'ru']).default('es'),
})

function buildContactEmailHtml(data: z.infer<typeof contactSchema>): string {
  const phoneRow = data.phone
    ? `<tr><td style="padding:8px 0;font-weight:600;">Teléfono</td><td>${data.phone}</td></tr>`
    : ''
  const serviceRow = data.service
    ? `<tr><td style="padding:8px 0;font-weight:600;">Servicio</td><td>${data.service}</td></tr>`
    : ''
  return `
    <div style="font-family:sans-serif;max-width:600px;margin:0 auto;color:#1a1a1a;">
      <h2 style="color:#b8a088;border-bottom:1px solid #e8e2d9;padding-bottom:12px;">
        Nueva consulta — ConceptoFino
      </h2>
      <table style="width:100%;border-collapse:collapse;">
        <tr><td style="padding:8px 0;font-weight:600;width:120px;">Nombre</td><td>${data.name}</td></tr>
        <tr><td style="padding:8px 0;font-weight:600;">Email</td><td>${data.email}</td></tr>
        ${phoneRow}
        ${serviceRow}
        <tr><td style="padding:8px 0;font-weight:600;vertical-align:top;">Mensaje</td><td>${data.message}</td></tr>
        <tr><td style="padding:8px 0;font-weight:600;">Idioma</td><td>${data.locale}</td></tr>
      </table>
    </div>
  `
}

export async function POST(request: Request): Promise<NextResponse> {
  let body: unknown
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ success: false, error: 'Invalid JSON' }, { status: 400 })
  }

  const parsed = contactSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json(
      { success: false, error: 'Validation failed', details: parsed.error.flatten() },
      { status: 400 },
    )
  }

  const result = await sendEmail({
    to: 'info@conceptofino.com',
    subject: `Nueva consulta de ${parsed.data.name}`,
    html: buildContactEmailHtml(parsed.data),
    replyTo: parsed.data.email,
  })

  if (!result.success) {
    return NextResponse.json({ success: false, error: result.error }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}
