export default function Page() {
  return (
    <main className="flex min-h-svh flex-col items-center justify-center gap-2 p-6 text-center">
      <h1 className="text-heading-small text-text-primary">
        s0l design system
      </h1>
      <p className="text-body-medium text-text-secondary">
        Tokens and components are documented in Storybook. Run{" "}
        <code className="font-mono">npm run storybook</code> and open{" "}
        <a
          href="http://localhost:6006"
          className="underline underline-offset-4"
        >
          localhost:6006
        </a>
        .
      </p>
    </main>
  )
}
