import { SiteFooter } from "@components/common/site-footer";
import { SiteHeader } from "@components/common/site-header";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col bg-ground">
      <SiteHeader />
      <main id="indhold" className="flex-1">
        {children}
      </main>
      <SiteFooter />
    </div>
  );
}
