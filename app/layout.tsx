import type { Metadata, Viewport } from 'next';
import './globals.css';

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  title: 'Reyansha Fabric Creation Bhopal | Ethnic Wear & Fabrics',
  description: 'Explore Reyansha Fabric Creation in Bhopal for ethnic wear and fabric collections. Discover visual catalogues and enquire through Instagram or WhatsApp.',
  keywords: ['Reyansha Fabric Creation', 'Fabric shop Bhopal', 'Ethnic wear Bhopal', 'Fabric boutique Bhopal', 'Designer fabric Bhopal'],
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
