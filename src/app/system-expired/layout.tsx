import { Poppins } from "next/font/google";
import "../../styles/globals.css";
import { ProgressProvider } from "@/components/BProgressProvider";

const poppins = Poppins({
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
});

export const metadata = {
  title: "Sistem Expired - CIA Serang",
  description: "Sistem telah expired dan tidak dapat diakses",
};

export default function SystemExpiredLayout({
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
        <ProgressProvider>
          {children}
        </ProgressProvider>
      </body>
    </html>
  );
}
