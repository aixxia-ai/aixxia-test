import './globals.css';

export const metadata = {
  title: 'AIXXIA — Klankbordgroep (test)',
  robots: { index: false, follow: false },
};

export default function RootLayout({ children }) {
  return (
    <html lang="nl">
      <body>{children}</body>
    </html>
  );
}
