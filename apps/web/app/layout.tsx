export const metadata = {
  title: 'Todo • Next + Nest',
  description: 'Sample Todo with Next.js and Nest.js GraphQL',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body style={{ margin: 0, fontFamily: 'ui-sans-serif, system-ui' }}>{children}</body>
    </html>
  );
}
