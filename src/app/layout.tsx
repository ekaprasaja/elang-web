import type { Metadata } from 'next';
import './globals.css';
import { CMSProvider } from '@/context/CMSContext';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';

export const metadata: Metadata = {
  title: 'Partai Elang Indonesia - Platform Website Member & Kader Resmi',
  description: 'Portal multi-tenant website personal branding anggota dan kader Partai Elang Indonesia.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id" className="dark">
      <body className="min-h-screen bg-[#17171A] text-[#F0ECE2] antialiased selection:bg-[#C9A33D] selection:text-[#17171A]">
        <CMSProvider>
          <div className="min-h-screen flex flex-col">
            <Navbar />
            <main className="flex-1 max-w-7xl w-full mx-auto p-4 md:p-6">
              {children}
            </main>
            <Footer />
          </div>
        </CMSProvider>
      </body>
    </html>
  );
}
