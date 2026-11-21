import type { Metadata } from 'next';
import { Space_Grotesk, JetBrains_Mono, Hanken_Grotesk } from 'next/font/google';
import './globals.css';
import { CartProvider } from '@/context/CartContext';
import Header from '@/components/Header';
import CartDrawer from '@/components/CartDrawer';
import BottomNav from '@/components/BottomNav';

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-space',
  display: 'swap',
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-jetbrains',
  display: 'swap',
});

const hankenGrotesk = Hanken_Grotesk({
  subsets: ['latin'],
  variable: '--font-hanken',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'HIVE — Campus Chaos | Denims, Cargos & Streetwear',
  description: 'Archival cuts, heavyweight selvedge denim, and minimal streetwear. Bandra West flagship store, Mumbai.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`dark ${spaceGrotesk.variable} ${jetbrainsMono.variable} ${hankenGrotesk.variable}`}>
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-surface font-body-md text-on-surface flex flex-col min-h-screen selection:bg-primary selection:text-pitch-black">
        <CartProvider>
          <Header />
          <main className="flex flex-col relative w-full pt-20 pb-24 bg-surface min-h-screen">
            {children}
          </main>
          <CartDrawer />
          <BottomNav />
        </CartProvider>
      </body>
    </html>
  );
}
