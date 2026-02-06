import type { Metadata } from "next";
import "../src/app/globals.css";

export const metadata: Metadata = {
    title: "Balix.io - Free Online Tower Defense Game",
    description: "Play Balix.io, an exciting free online tower defense game. Build towers, defend against waves of enemies, and master strategic gameplay. No download required!",
    keywords: ["tower defense", "tower defense game", "online game", "free game", "strategy game", "balix.io", "browser game", "HTML5 game", "defense game", "TD game"],
    authors: [{ name: "Balix.io Team" }],
    creator: "Balix.io",
    publisher: "Balix.io",
    robots: {
        index: true,
        follow: true,
        googleBot: {
            index: true,
            follow: true,
            'max-video-preview': -1,
            'max-image-preview': 'large',
            'max-snippet': -1,
        },
    },
    icons: {
        icon: "/favicon.svg",
    },
    metadataBase: new URL("https://balix.io"),
    alternates: {
        canonical: "/",
    },
    openGraph: {
        type: "website",
        locale: "en_US",
        url: "https://balix.io",
        title: "Balix.io - Free Online Tower Defense Game",
        description: "Play Balix.io, an exciting free online tower defense game. Build towers, defend against waves of enemies, and master strategic gameplay. No download required!",
        siteName: "Balix.io",
        images: [
            {
                url: "/favicon.svg",
                width: 1200,
                height: 630,
                alt: "Balix.io Tower Defense Game",
            },
        ],
    },
    twitter: {
        card: "summary_large_image",
        title: "Balix.io - Free Online Tower Defense Game",
        description: "Play Balix.io, an exciting free online tower defense game. Build towers, defend against waves of enemies, and master strategic gameplay.",
        images: ["/favicon.svg"],
        creator: "@balixio",
    },
    verification: {
        google: "eByBx45u1kUDTWMbuA3mFljCsdj0XNOIvhQtNbrz4gM",
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
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{
                        __html: JSON.stringify({
                            "@context": "https://schema.org",
                            "@type": "VideoGame",
                            "name": "Balix.io",
                            "description": "Play Balix.io, an exciting free online tower defense game. Build towers, defend against waves of enemies, and master strategic gameplay. No download required!",
                            "url": "https://balix.io",
                            "genre": ["Tower Defense", "Strategy", "Action"],
                            "gamePlatform": ["Web Browser", "HTML5"],
                            "applicationCategory": "Game",
                            "operatingSystem": "Any",
                            "offers": {
                                "@type": "Offer",
                                "price": "0",
                                "priceCurrency": "USD",
                                "availability": "https://schema.org/InStock"
                            },
                            "aggregateRating": {
                                "@type": "AggregateRating",
                                "ratingValue": "4.5",
                                "ratingCount": "100",
                                "bestRating": "5",
                                "worstRating": "1"
                            },
                            "author": {
                                "@type": "Organization",
                                "name": "Balix.io Team"
                            },
                            "publisher": {
                                "@type": "Organization",
                                "name": "Balix.io"
                            }
                        })
                    }}
                />
            </head>
            <body className="antialiased overflow-hidden select-none">
                {children}
            </body>
        </html>
    );
}
