import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { formatRupiah } from "@/lib/utils";
import { CourtReal } from "@/types/court/Court";
import { Clock } from "lucide-react";
// import { Clock } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

interface Props {
  court: CourtReal;
  type: "futsal" | "badminton" | "tableTennis";
}

const CourtCard = ({ court, type }: Props) => {
  // Map the sport type to a readable Indonesian name
  const sportTypeNames: {
    [key in "futsal" | "badminton" | "tableTennis"]: string;
  } = {
    futsal: "Futsal",
    badminton: "Badminton",
    tableTennis: "Tenis Meja",
  };

  const minPrice = Math.min(
    ...(court?.Schedule ?? []).map((schedule) => schedule?.price)
  );

  const maxPrice = Math.max(
    ...(court?.Schedule ?? []).map((schedule) => schedule?.price)
  );

  const priceRange =
    minPrice === maxPrice
      ? formatRupiah(minPrice)
      : `${formatRupiah(minPrice)} - ${formatRupiah(maxPrice)}`;

  return (
    <Card className="overflow-hidden">
      <div className="relative h-48 w-full">
        <div className="w-full h-full bg-gray-200">
          <Image
            src={court.image}
            alt={`${court.name} - ${sportTypeNames[type]}`}
            width={500}
            height={300}
            className="object-cover object-center w-full h-full"
          />
        </div>
      </div>
      <CardContent className="p-4">
        <h3 className="text-lg font-semibold">
          {court.name}{" "}
          <span className="text-primary">
            {court.surfaceType && `(${court.surfaceType})`}
          </span>
        </h3>
        {Array.isArray(court?.Schedule) && court.Schedule.length > 0 ? (
          <div className="flex items-center text-gray-600 mt-2">
            <Clock className="h-4 w-4 mr-1" />
            <span className="text-sm">{priceRange}</span>
          </div>
        ) : (
          <div className="text-red-700 mt-2 text-sm">
            Harga lapangan belum diatur oleh pemilik.
          </div>
        )}
      </CardContent>
      <CardFooter className="p-4 pt-0 flex justify-between">
        <Link
          href={`/lapangan/${type}/${court.id}`}
          className="w-full text-white"
        >
          <Button variant="default" className="w-full text-white">
            Lihat Detail
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
};

export default CourtCard;
