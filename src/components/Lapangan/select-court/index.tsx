import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import CourtCard from "../court-card";
import { CourtReal } from "@/types/court";

type Props = {
  courts: CourtReal[];
};

const SelectCourt = ({ courts }: Props) => {
  const courtFutsal = courts.filter((court) => court.type === "Futsal");
  const courtBadminton = courts.filter((court) => court.type === "Badminton");
  const courtTableTennis = courts.filter((court) => court.type === "TenisMeja");

  return (
    <Tabs defaultValue="futsal" className="w-full min-h-screen">
      <TabsList className="grid grid-cols-1 md:grid-cols-3 mb-16 md:mb-8">
        <TabsTrigger value="futsal">Lapangan Futsal</TabsTrigger>
        <TabsTrigger value="badminton">Lapangan Badminton</TabsTrigger>
        <TabsTrigger value="tableTennis">Lapangan Tenis Meja</TabsTrigger>
      </TabsList>

      {/* Futsal Courts */}
      <TabsContent value="futsal">
        <h2 className="text-xl font-semibold mb-4">
          Pilihan Lapangan <span className="text-primary">Futsal</span>
        </h2>
        <div className="grid  grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courtFutsal.length > 0 ? (
            courtFutsal.map((court) => (
              <CourtCard key={court.id} court={court} type="futsal" />
            ))
          ) : (
            <p className="text-gray-500">Tidak ada lapangan futsal tersedia.</p>
          )}
        </div>
      </TabsContent>

      {/* Badminton Courts */}
      <TabsContent value="badminton">
        <h2 className="text-xl font-semibold mb-4">
          Pilihan Lapangan <span className="text-primary">Badminton</span>
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courtBadminton.length > 0 ? (
            courtBadminton.map((court) => (
              <CourtCard key={court.id} court={court} type="badminton" />
            ))
          ) : (
            <p className="text-gray-500">
              Tidak ada lapangan badminton tersedia.
            </p>
          )}
        </div>
      </TabsContent>

      {/* Table Tennis Courts */}
      <TabsContent value="tableTennis">
        <h2 className="text-xl font-semibold mb-4">
          Pilihan Lapangan <span className="text-primary">Tenis Meja</span>
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courtTableTennis.length > 0 ? (
            courtTableTennis.map((court) => (
              <CourtCard key={court.id} court={court} type="tableTennis" />
            ))
          ) : (
            <p className="text-gray-500">
              Tidak ada lapangan tenis meja tersedia.
            </p>
          )}
        </div>
      </TabsContent>
    </Tabs>
  );
};

export default SelectCourt;
