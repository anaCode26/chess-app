export default function HomePage() {
  return (
    <main className="mx-auto flex min-h-screen max-w-3xl flex-col justify-center gap-4 px-6">
      <p className="text-sm uppercase tracking-[0.2em] text-muted-foreground">
        Chess App
      </p>
      <h1 className="text-4xl font-semibold tracking-tight text-foreground">
        Boilerplate ready
      </h1>
      <p className="max-w-xl text-lg text-muted-foreground">
        Same stack and folder layout as eet1-concordia: Next.js App Router,
        Prisma, Auth.js, Tailwind, and Vitest.
      </p>
    </main>
  );
}
