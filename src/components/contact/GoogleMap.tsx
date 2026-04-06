// src/components/contact/GoogleMap.tsx
interface Props {
  embedUrl: string
  title?: string
}

export default function GoogleMap({ embedUrl, title = 'ConceptoFino Valencia' }: Props) {
  if (!embedUrl) {
    return (
      <div className="w-full h-[400px] bg-brand-light flex items-center justify-center">
        <p className="font-sans text-sm text-brand-gray">
          Calle Colón 48, 46004 Valencia
        </p>
      </div>
    )
  }
  return (
    <iframe
      src={embedUrl}
      title={title}
      width="100%"
      height="400"
      className="border-0 w-full"
      loading="lazy"
      referrerPolicy="no-referrer-when-downgrade"
      aria-label={title}
    />
  )
}
