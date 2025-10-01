import { AuthProvider } from '../lib/AuthProvider';
// import './globals.css';

export const metadata = {
  title: 'Todo • Next + Nest',
  description: 'Sample Todo with Next.js and Nest.js GraphQL',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang='en'>
      <body
        style={{
          margin: 0,
          fontFamily: 'ui-sans-serif, system-ui, -apple-system, sans-serif',
          backgroundColor: '#f9fafb',
          color: '#111827',
        }}
      >
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
