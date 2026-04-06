import { NextResponse } from 'next/server'
import { z } from 'zod'
import { sendEmail } from '@/lib/email'

const leadSchema = z.object({
  name: z.string().min(2).max(100),
  email: z.string().email(),
  phone: z.string().optional(),
  projectSlug: z.string().optional(),
  locale: z.enum(['es', 'en', 'ru']).default('es'),
})

export async function POST(request: Request): Promise<NextResponse> {
  let body: unknown
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ success: false, error: 'Invalid JSON' }, { status: 400 })
  }

  const parsed = leadSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json(
      { success: false, error: 'Validation failed', details: parsed.error.flatten() },
      { status: 400 },
    )
  }

  const { name, email, phone, projectSlug, locale } = parsed.data
  const phoneRow = phone
    ? `<tr><td style="padding:8px 0;font-weight:600;">Teléfono</td><td>${phone}</td></tr>`
    : ''
  const projectRow = projectSlug
    ? `<tr><td style="padding:8px 0;font-weight:600;">Proyecto ref.</td><td>${projectSlug}</td></tr>`
    : ''

  const result = await sendEmail({
    to: 'info@conceptofino.com',
    subject: `Lead: ${name} quiere un proyecto similar${projectSlug ? ` a "${projectSlug}"` : ''}`,
    html: `
      <div style="font-family:sans-serif;max-width:600px;margin:0 auto;color:#1a1a1a;">
        <h2 style="color:#b8a088;border-bottom:1px solid #e8e2d9;padding-bottom:12px;">
          Nuevo lead — Quiero un proyecto similar
        </h2>
        <table style="width:100%;border-collapse:collapse;">
          <tr><td style="padding:8px 0;font-weight:600;width:120px;">Nombre</td><td>${name}</td></tr>
          <tr><td style="padding:8px 0;font-weight:600;">Email</td><td>${email}</td></tr>
          ${phoneRow}
          ${projectRow}
          <tr><td style="padding:8px 0;font-weight:600;">Idioma</td><td>${locale}</td></tr>
        </table>
      </div>
    `,
    replyTo: email,
  })

  if (!result.success) {
    return NextResponse.json({ success: false, error: result.error }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}
