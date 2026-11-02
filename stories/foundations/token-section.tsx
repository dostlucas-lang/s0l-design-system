export function TokenSection({
  title,
  children,
}: {
  title: string
  children: React.ReactNode
}) {
  return (
    <section className="flex flex-col gap-3">
      <h2 className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
        {title}
      </h2>
      <div className="flex flex-wrap items-center gap-4 rounded-lg border border-dashed p-6">
        {children}
      </div>
    </section>
  )
}
