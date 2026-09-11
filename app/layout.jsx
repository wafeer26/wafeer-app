import './globals.css';

export const metadata = {
  title: 'Wafeer - وَفير | منصة التسوق الفلسطينية',
  description: 'Wafeer - منصة متجر إلكترونية للمستلزمات العائلية في ضواحي القدس',
};

export default function RootLayout({ children }) {
  return (
    <html lang="ar" dir="rtl">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body className="bg-gray-50">{children}</body>
    </html>
  );
}
