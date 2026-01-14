import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'FITQUEST - Your Fitness Journey',
  description: 'Arcade-style fitness tracking app',
  viewport: 'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen">{children}</body>
    </html>
  );
}
