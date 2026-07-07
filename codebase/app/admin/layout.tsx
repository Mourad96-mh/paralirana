import type { Metadata } from "next";

// Admin area — never indexed. Auth is enforced by middleware.ts.
export const metadata: Metadata = {
  title: "Administration",
  robots: { index: false, follow: false },
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="min-h-screen bg-cream">{children}</div>;
}
