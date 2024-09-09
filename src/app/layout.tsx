import type { Metadata } from "next";
import localFont from "next/font/local";
import { HumanVerificationProvider } from "@/components/human-verification/HumanVerificationProvider";
import "./globals.css";
import ShowForm from "@/components/human-verification/ShowForm";
import { ThemeProvider } from "@/components/ui/theme-provider";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 600 500 400 300 900",
});

const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 600 500 400 300 900",
});

export const metadata: Metadata = {
  title: "Meal Meter",
  description:
    "Manage your meals and nutrition with the power of AI using Meal Meter.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <HumanVerificationProvider>
            <ShowForm />
            {children}
          </HumanVerificationProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
