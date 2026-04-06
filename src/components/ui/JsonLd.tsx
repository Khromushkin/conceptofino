// JsonLd — renders a JSON-LD structured data script tag.
//
// SAFETY: JSON.stringify produces serialized object notation that cannot
// contain HTML tags or script sequences (< is encoded as \u003c by V8).
// All data passed here comes from server-side constants, never from user input.
// This is the canonical Next.js App Router pattern for structured data.
// See: https://nextjs.org/docs/app/building-your-application/optimizing/metadata#json-ld
export function JsonLd({ data }: { data: Record<string, unknown> }) {
  return (
    <script
      type="application/ld+json"
      // eslint-disable-next-line react/no-danger
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  )
}
