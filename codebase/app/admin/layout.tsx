import type { Metadata } from "next";

// Admin area — never indexed. Auth is enforced client-side in AdminShell
// (localStorage JWT → redirect to /admin/login), since the static export has no
// server middleware; the API itself also protects every write with the bearer token.
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
