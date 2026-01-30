import type { Metadata } from "next";
import "../src/app/globals.css";

export const metadata: Metadata = {
    title: "Ball Defense",
    description: "Serverless Tower Defense Game",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body className="antialiased overflow-hidden select-none">
                {children}
            </body>
        </html>
    );
}
