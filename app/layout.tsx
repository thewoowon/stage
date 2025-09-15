import type { Metadata } from "next";
import "./globals.css";
import Providers from "./providers";
import Background from "./background";

export const metadata: Metadata = {
  title: "스테이지",
  description: "나를 보여줄 시간, 스테이지",
  metadataBase: new URL("https://thisismystage.com"),
  openGraph: {
    type: "website",
    locale: "ko_KR",
    url: "https://thisismystage.com",
    siteName: "스테이지",
    images: [
      {
        url: "https://thisismystage.com/og-image.png",
        width: 1200,
        height: 800,
        alt: "스테이지",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@thisismystage",
    siteId: "1467726470533754880",
    creatorId: "1467726470533754880",
    creator: "@stoneslab",
    title: "스테이지",
    description: "나를 보여줄 시간, 스테이지",
    images: {
      url: "https://thisismystage.com/og-image.png",
      alt: "스테이지",
    },
  },
  generator: "스테이지",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link
          rel="apple-touch-icon"
          sizes="57x57"
          href="/apple-icon-57x57.png"
        />
        <link
          rel="apple-touch-icon"
          sizes="60x60"
          href="/apple-icon-60x60.png"
        />
        <link
          rel="apple-touch-icon"
          sizes="72x72"
          href="/apple-icon-72x72.png"
        />
        <link
          rel="apple-touch-icon"
          sizes="76x76"
          href="/apple-icon-76x76.png"
        />
        <link
          rel="apple-touch-icon"
          sizes="114x114"
          href="/apple-icon-114x114.png"
        />
        <link
          rel="apple-touch-icon"
          sizes="120x120"
          href="/apple-icon-120x120.png"
        />
        <link
          rel="apple-touch-icon"
          sizes="144x144"
          href="/apple-icon-144x144.png"
        />
        <link
          rel="apple-touch-icon"
          sizes="152x152"
          href="/apple-icon-152x152.png"
        />
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/apple-icon-180x180.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="192x192"
          href="/android-icon-192x192.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/favicon-32x32.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="96x96"
          href="/favicon-96x96.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/favicon-16x16.png"
        />
        <link rel="manifest" href="/manifest.json" />
        <meta name="msapplication-TileColor" content="#ffffff" />
        <meta name="msapplication-TileImage" content="/ms-icon-144x144.png" />
        <meta name="theme-color" content="#ffffff" />
        <meta
          name="google-site-verification"
          content={process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION}
        />
        <meta
          name="naver-site-verification"
          content={process.env.NEXT_PUBLIC_NAVER_SITE_VERIFICATION}
        />
      </head>
      <body>
        <Background />
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
