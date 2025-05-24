import { Poppins } from "next/font/google";
import "../styles/globals.css";
import ClientProvider from "@/providers/ClientProvider";

const poppins = Poppins({
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
});

export const metadata = {
  title: "CIA Serang",
  description: "CIA Serang adalah website resmi CIA Serang",
  category: "website",
  authors: { name: "Azzaxy" },
  keywords: [
    "CIA Serang",
    "CIA Serang Website",
    "CIA Serang Official",
    "CIA Serang Resmi",
    "Futsal Serang",
    "Badminton Serang",
    "Tenis Meja Serang",
  ],
  creator: "Abdurrohman Azis",
  publisher: "Abdurrohman Azis",
  icons: {
    icon: "/logo.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${poppins.className} antialiased`}
        suppressHydrationWarning
      >
        <ClientProvider>{children}</ClientProvider>
      </body>
    </html>
  );
}

