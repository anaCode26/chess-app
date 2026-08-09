export default function BackofficeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen">
      <header className="border-b border-border px-6 py-4">
        <p className="text-sm font-medium">Backoffice</p>
      </header>
      <main className="px-6 py-8">{children}</main>
    </div>
  );
}
