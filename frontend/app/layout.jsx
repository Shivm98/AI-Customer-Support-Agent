import './globals.css';

export const metadata = {
  title: 'AI Customer Support',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-gray-900 text-gray-100">{children}</body>
    </html>
  );
}
