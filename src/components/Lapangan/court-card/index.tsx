import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Court } from "@/types/Court";
import { Clock } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const CourtCard = ({
  court,
  type,
}: {
  court: Court;
  type: "futsal" | "badminton" | "tableTennis";
}) => {
  // Map the sport type to a readable Indonesian name
  const sportTypeNames: {
    [key in "futsal" | "badminton" | "tableTennis"]: string;
  } = {
    futsal: "Futsal",
    badminton: "Badminton",
    tableTennis: "Tenis Meja",
  };

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
        {!court.available && (
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <span className="text-white font-bold text-lg">Tidak Tersedia</span>
          </div>
        )}
      </div>
      <CardContent className="p-4">
        <h3 className="text-lg font-semibold">{court.name}</h3>
        <div className="flex items-center text-gray-600 mt-2">
          <Clock className="h-4 w-4 mr-1" />
          <span className="text-sm">{court.price}</span>
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0 flex justify-between">
        {court.available ? (
          <Link
            href={`/lapangan/${type}/${court.id}`}
            className="w-full text-white"
          >
            <Button variant="default" className="w-full text-white">
              Pesan Sekarang
            </Button>
          </Link>
        ) : (
          <Button variant="outline" className="w-full text-gray-700" disabled>
            Tidak Tersedia
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default CourtCard;
