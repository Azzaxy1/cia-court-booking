import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Home, AlertCircle } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background px-4">
      <div className="text-center space-y-5 max-w-md">
        <div className="mx-auto w-24 h-24 rounded-full bg-muted flex items-center justify-center">
          <AlertCircle className="h-12 w-12 text-muted-foreground" />
        </div>

        <h1 className="text-8xl font-bold text-primary">404</h1>

        <h2 className="text-3xl font-semibold tracking-tight">
          Halaman Tidak Ditemukan
        </h2>

        <p className="text-muted-foreground text-lg">
          Maaf, halaman yang Anda cari tidak dapat ditemukan atau telah
          dipindahkan.
        </p>

        <div className="pt-4">
          <Button asChild size="lg" className="text-white">
            <Link href="/">
              <Home className="mr-2 h-4 w-4" />
              Kembali ke Beranda
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
