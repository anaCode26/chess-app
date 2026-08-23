import { Label } from "@components/ui/text";

export default function BackofficeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen">
      <header className="border-b border-hairline px-6 py-4">
        <Label size="lg" color="chalk">
          Backoffice
        </Label>
      </header>
      <main className="px-6 py-8">{children}</main>
    </div>
  );
}
