import ClientLayout from './ClientLayout';
import ScriptInjector from "@/components/common/ScriptInjector";

export default async function RootLayout({ children }) {
  let allScripts = [];
  let headerScripts = [];
  let footerScripts = [];

  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/site-scripts`, {
      cache: 'no-store',
    });
    if (res.ok) {
      allScripts = await res.json();
      headerScripts = allScripts.filter(s => s.location === 'header' && s.enabled);
      footerScripts = allScripts.filter(s => s.location === 'footer' && s.enabled);
    }
  } catch (error) {
    console.error('Failed to fetch site scripts:', error);
  }

  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap"
          rel="stylesheet"
        />
        <link href="https://fonts.cdnfonts.com/css/helvetica-neue-55" rel="stylesheet" />

        <ScriptInjector scripts={headerScripts} position="head" />
      </head>
      <body>
        <ClientLayout footerScripts={footerScripts}>
          {children}

          <ScriptInjector scripts={footerScripts} position="body" />
        </ClientLayout>
      </body>
    </html>
  );
}