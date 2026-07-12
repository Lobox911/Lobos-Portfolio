import type { Metadata } from 'next';
import { ReactNode } from 'react';
import '../index.css';

export const metadata: Metadata = {
  title: 'lobos.dev | Shipped is the Whole Game',
  description: 'Portfolio of Lobos, a full-stack developer specializing end-to-end custom systems.',
};

export default function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
