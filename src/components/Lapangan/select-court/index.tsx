import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Court } from "@/types/Court";
import CourtCard from "../court-card";

interface SelectCourtProps {
  court: {
    futsal: Court[];
    badminton: Court[];
    tableTennis: Court[];
  };
}

const SelectCourt = ({ court }: SelectCourtProps) => {
  return (
    <Tabs defaultValue="futsal" className="w-full" onValueChange={() => {}}>
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
          {court.futsal.map((court) => (
            <CourtCard key={court.id} court={court} type="futsal" />
          ))}
        </div>
      </TabsContent>

      {/* Badminton Courts */}
      <TabsContent value="badminton">
        <h2 className="text-xl font-semibold mb-4">
          Pilihan Lapangan <span className="text-primary">Badminton</span>
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {court.badminton.map((court) => (
            <CourtCard key={court.id} court={court} type="badminton" />
          ))}
        </div>
      </TabsContent>

      {/* Table Tennis Courts */}
      <TabsContent value="tableTennis">
        <h2 className="text-xl font-semibold mb-4">
          Pilihan Lapangan <span className="text-primary">Tenis Meja</span>
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {court.tableTennis.map((court) => (
            <CourtCard key={court.id} court={court} type="tableTennis" />
          ))}
        </div>
      </TabsContent>
    </Tabs>
  );
};

export default SelectCourt;
