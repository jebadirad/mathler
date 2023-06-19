import Header from '@/components/Header';
import './globals.css';
import Providers from './providers';

export const metadata = {
  title: 'Mathler',
  description: 'Mathler demo app',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" data-theme="synthwave">
      <body>
        <Providers>
          <Header />
          <main className="container mx-auto max-w-md">{children}</main>
        </Providers>
      </body>
    </html>
  );
}
