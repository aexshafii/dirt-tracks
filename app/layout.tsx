import './globals.css';
import { Inter } from 'next/font/google';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

export const metadata = {
  title: 'Dirt Tracks',
  description: 'Curated collection of Bali dirt bike tracks. by @aexshafii.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={inter.variable + ' ' + inter.className}>{children}</body>
    </html>
  );
}
