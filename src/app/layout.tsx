import type { Metadata } from 'next';
import './globals.css';
import './legacy-styles.scss';
import Providers from './providers';
import WsGuard from '@/components/WsGuard';
import { Inter } from 'next/font/google';
import Script from 'next/script';

const geistInter = Inter({
  variable: '--font-geist-inter',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'ishop',
  description: 'ishop — онлайн-меню и заказы',
  icons: {
    icon: '/assets/icons/header-logo.svg',
    shortcut: '/assets/icons/header-logo.svg',
    apple: '/assets/icons/header-logo.svg',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='ru'>
      <body className={`${geistInter.variable} antialiased`}>
        <WsGuard />
        {/* Meta Pixel Code */}
        <Script id='fb-pixel' strategy='afterInteractive'>{`
!function(f,b,e,v,n,t,s)
{if(f.fbq)return;n=f.fbq=function(){n.callMethod?
n.callMethod.apply(n,arguments):n.queue.push(arguments)};
if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
n.queue=[];t=b.createElement(e);t.async=!0;
t.src=v;s=b.getElementsByTagName(e)[0];
s.parentNode.insertBefore(t,s)}(window, document,'script',
'https://connect.facebook.net/en_US/fbevents.js');
fbq('init', '1382338139944414');
fbq('track', 'PageView');
        `}</Script>
        <noscript
          dangerouslySetInnerHTML={{
            __html:
              '<img height="1" width="1" style="display:none" src="https://www.facebook.com/tr?id=1382338139944414&ev=PageView&noscript=1" />',
          }}
        />
        {/* End Meta Pixel Code */}
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
