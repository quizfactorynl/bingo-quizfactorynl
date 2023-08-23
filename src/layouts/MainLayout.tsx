import Head from "next/head";
import { DetailedHTMLProps, HTMLAttributes, ReactNode } from "react";

interface MainLayoutProps {
  pageTitle?: string;
  description?: string;
  keywords?: string;
  children: ReactNode;
  mainProps?: DetailedHTMLProps<HTMLAttributes<HTMLElement>, HTMLElement>;
  disableAutoRotate?: boolean;
}

export default function MainLayout({
  pageTitle,
  description,
  keywords,
  children,
  mainProps,
  disableAutoRotate,
}: MainLayoutProps) {
  return (
    <>
      <Head>
        <title>{pageTitle || "Bingo App"}</title>
        {disableAutoRotate && (
          <meta http-equiv="ScreenOrientation" content="autoRotate:disabled" />
        )}
        <meta name="description" content={description || "Bingo App"} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="keywords" content={keywords || "Bingo App"} />
        <link rel="icon" href="/favicon.ico" />

        <!-- Google Tag Manager -->
        <script>(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
         new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
       j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
       'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
        })(window,document,'script','dataLayer','GTM-M2K6Q5FN');</script>
      <!-- End Google Tag Manager -->

      </Head>
      <main {...mainProps}>{children}</main>
    </>
  );
}
