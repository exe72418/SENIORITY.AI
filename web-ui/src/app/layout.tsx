import type { Metadata } from "next";
import "../core/theme/globals.css";

export const metadata: Metadata = {
  title: "SENIORITY.AI | The Elite Dev Simulator",
  description: "Entrena en proyectos reales con presión de IA.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className="dark" style={{ colorScheme: 'dark' }}>
      <body className="antialiased bg-[#050505] text-white">{children}</body>
    </html>
  );
}
