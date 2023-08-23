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

      </Head>
      <main {...mainProps}>{children}</main>
    </>
  );
}
