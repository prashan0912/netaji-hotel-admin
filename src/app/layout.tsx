import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Netaji Hotel | Executive Admin & Restaurant Management System",
  description: "Official Admin Panel for Netaji Hotel Raipur - Sales, Production, Recipes, Inventory, Orders, Bulk Catering & Staff Management.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased min-h-screen bg-slate-50 text-slate-900">
        {children}
      </body>
    </html>
  );
}
