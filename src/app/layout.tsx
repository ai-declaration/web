import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/header";
import ErrorBoundary from "@/components/error-boundary";
import ThemeProvider from "@/components/theme-provider";

export const metadata: Metadata = {
  title: "AI Declaration Format | AI Disclosure Dashboard",
  description: "Create, validate, and explore AI Declaration files for transparent AI usage disclosure.",
  openGraph: {
    title: "AI Declaration Format",
    description: "Web tool for creating and validating AI Declaration files.",
    type: "website",
    url: "https://ai-declaration.github.io/web/",
  },
  twitter: {
    card: "summary",
    title: "AI Declaration Format",
    description: "Web tool for creating and validating AI Declaration files.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased" suppressHydrationWarning>
      <body className="min-h-full flex flex-col">
        <ThemeProvider>
          <Header />
          <main id="main-content" className="flex-1">
            <div className="mx-auto max-w-[1400px] px-4 py-6">
              <ErrorBoundary>
                {children}
              </ErrorBoundary>
            </div>
          </main>
          <footer className="border-t border-border py-4 text-center text-xs text-muted-foreground">
            <p>AI Declaration Format v1.0.0 -- All processing is client-side only. No data leaves your browser.</p>
            <p className="mt-1">
              <a href="https://github.com/ai-declaration" className="hover:text-foreground">Contribute</a>
              {" | "}
              <a href="https://github.com/ai-declaration/web/issues" className="hover:text-foreground">Report Issues</a>
            </p>
          </footer>
        </ThemeProvider>
      </body>
    </html>
  );
}
