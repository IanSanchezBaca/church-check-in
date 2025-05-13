// Layout for temp

// app/layout.js

export const metadata = { // This is the default function
  title: 'Temp Webpage',
  description: 'A Next.js site using the App Router',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
);}
