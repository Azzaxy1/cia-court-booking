import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TabsContent } from "@/components/ui/tabs";
import { CourtInfo, CourtReal } from "@/types/court";
import { CheckCircle, Clock, Users } from "lucide-react";
import React from "react";

interface InformationCourtProps {
  courtDetails: CourtInfo;
  court: CourtReal;
}

const InformationCourt = ({ courtDetails, court }: InformationCourtProps) => {
  return (
    <TabsContent value="informasi" className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Deskripsi Lapangan</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-700 mb-6">{court.description}</p>
          <h3 className="text-lg font-semibold mb-3">Fasilitas Unggulan</h3>
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {courtDetails.features.map((feature, index) => (
              <li key={index} className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span>{feature}</span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Jam Operasional
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p>{courtDetails.openHours}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <Users className="h-4 w-4" />
              Kapasitas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p>{court.capacity} Orang</p>
          </CardContent>
        </Card>
      </div>
    </TabsContent>
  );
};

export default InformationCourt;
