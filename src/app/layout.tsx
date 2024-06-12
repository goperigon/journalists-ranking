import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "next-themes";
import { ModeToggle } from "@/components/ui/modeToggle";
import SettingsDialog from "@/components/settingsDialog";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Journalist Explorer | Perigon",
  description:
    "Rank journalists by their reach based on what sources they post on - Powered by Perigon",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem={false}
          disableTransitionOnChange
        >
          <div className="flex px-7 py-5 gap-x-4 flex-row-reverse">
            <ModeToggle />
            <SettingsDialog />
          </div>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
