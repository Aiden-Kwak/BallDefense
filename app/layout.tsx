import type { Metadata } from "next";
import "../src/app/globals.css";

export const metadata: Metadata = {
    title: "Balix.io",
    description: "Serverless Tower Defense Game",
    icons: {
        icon: "/favicon.svg",
    },
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <head>
                <meta name="google-site-verification" content="eByBx45u1kUDTWMbuA3mFljCsdj0XNOIvhQtNbrz4gM" />
                <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-5536083857370761"
                    crossOrigin="anonymous"></script>
            </head>
            <body className="antialiased overflow-hidden select-none">
                {children}
            </body>
        </html>
    );
}
