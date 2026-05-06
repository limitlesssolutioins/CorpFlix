import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Layout from "@/components/Layout";
import { Toaster } from 'sonner';

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "LIDUS",
  description: "Liderazgo, Integración, Desarrollo, Usabilidad y Seguridad",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className={inter.className}>
        <Layout>{children}</Layout>
        <Toaster position="top-right" richColors />
      </body>
    </html>
  );
}