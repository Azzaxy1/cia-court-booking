import { images } from "@/assets";
import { CourtReal } from "@/types/court";

export const court = {
  futsal: [
    {
      id: 1,
      name: "Lapangan 1",
      type: "Rumput",
      price: "Rp. 100.000-165.000/jam",
      image: images.Futsal,
      available: true,
    },
    {
      id: 2,
      name: "Lapangan 2",
      type: "Interlok",
      price: "Rp. 85.000-145.000/jam",
      image: images.Futsal,
      available: true,
    },
    {
      id: 3,
      name: "Lapangan 3",
      type: "Rumput",
      price: "Rp. 90.000-155.000/jam",
      image: images.Futsal,
      available: true,
    },
    {
      id: 4,
      name: "Lapangan 4",
      type: "Semen",
      price: "Rp. 70.000-125.000/jam",
      image: images.Futsal,
      available: false,
    },
    {
      id: 5,
      name: "Lapangan 5",
      type: "Semen",
      price: "Rp. 70.000-125.000/jam",
      image: images.Futsal,
      available: true,
    },
    {
      id: 6,
      name: "Lapangan 6",
      type: "Semen",
      price: "Rp. 70.000-125.000/jam",
      image: images.Futsal,
      available: true,
    },
  ],
  badminton: [
    {
      id: 1,
      name: "Lapangan 1",
      price: "Rp. 20.000-30.000/jam",
      image: images.Badminton,
      available: true,
    },
    {
      id: 2,
      name: "Lapangan 2",
      price: "Rp. 20.000-30.000/jam",
      image: images.Badminton,
      available: true,
    },
    {
      id: 3,
      name: "Lapangan 3",
      price: "Rp. 20.000-30.000/jam",
      image: images.Badminton,
      available: true,
    },
    {
      id: 4,
      name: "Lapangan 4",
      price: "Rp. 20.000-30.000/jam",
      image: images.Badminton,
      available: true,
    },
    {
      id: 5,
      name: "Lapangan 5",
      price: "Rp. 20.000-30.000/jam",
      image: images.Badminton,
      available: false,
    },
    {
      id: 6,
      name: "Lapangan 6",
      price: "Rp. 20.000-30.000/jam",
      image: images.Badminton,
      available: true,
    },
    {
      id: 7,
      name: "Lapangan 7",
      price: "Rp. 20.000-30.000/jam",
      image: images.Badminton,
      available: true,
    },
  ],
  tableTennis: [
    {
      id: 1,
      name: "Lapangan 1",
      price: "Rp. 15.000-25.000/jam",
      image: images.TenisMeja,
      available: true,
    },
    {
      id: 2,
      name: "Lapangan 2",
      price: "Rp. 15.000-25.000/jam",
      image: images.TenisMeja,
      available: false,
    },
  ],
};

export const courtDummy: CourtReal[] = [
  {
    id: 1,
    name: "Lapangan 1",
    type: "Futsal",
    image: images.Futsal,
    description: "Lapangan Futsal 1 dengan permukaan rumput sintetis",
    surfaceType: "Rumput",
    price: {
      Weekday: {
        Pagi: 100000,
        Siang: 120000,
        Malam: 150000,
      },
      Weekend: {
        Pagi: 120000,
        Siang: 150000,
        Malam: 180000,
      },
    },
    available: true,
  },
  {
    id: 2,
    name: "Lapangan 2",
    type: "Futsal",
    image: images.Futsal,
    description: "Lapangan Futsal 2 dengan permukaan interlok",
    surfaceType: "Interlok",
    price: {
      Weekday: {
        Pagi: 85000,
        Siang: 100000,
        Malam: 130000,
      },
      Weekend: {
        Pagi: 100000,
        Siang: 130000,
        Malam: 160000,
      },
    },
    available: true,
  },
  {
    id: 3,
    name: "Lapangan 3",
    type: "Futsal",
    image: images.Futsal,
    description: "Lapangan Futsal 3 dengan permukaan rumput sintetis",
    surfaceType: "Rumput",
    price: {
      Weekday: {
        Pagi: 90000,
        Siang: 110000,
        Malam: 140000,
      },
      Weekend: {
        Pagi: 110000,
        Siang: 140000,
        Malam: 170000,
      },
    },
    available: true,
  },
  {
    id: 4,
    name: "Lapangan 4",
    type: "Futsal",
    image: images.Futsal,
    description: "Lapangan Futsal 4 dengan permukaan semen",
    surfaceType: "Semen",
    price: {
      Weekday: {
        Pagi: 70000,
        Siang: 90000,
        Malam: 120000,
      },
      Weekend: {
        Pagi: 90000,
        Siang: 120000,
        Malam: 150000,
      },
    },
    available: false,
  },
  {
    id: 5,
    name: "Lapangan 5",
    type: "Futsal",
    image: images.Futsal,
    description: "Lapangan Futsal 5 dengan permukaan semen",
    surfaceType: "Semen",
    price: {
      Weekday: {
        Pagi: 70000,
        Siang: 90000,
        Malam: 120000,
      },
      Weekend: {
        Pagi: 90000,
        Siang: 120000,
        Malam: 150000,
      },
    },
    available: true,
  },
  {
    id: 6,
    name: "Lapangan 6",
    type: "Futsal",
    image: images.Futsal,
    description: "Lapangan Futsal 6 dengan permukaan semen",
    surfaceType: "Semen",
    price: {
      Weekday: {
        Pagi: 70000,
        Siang: 90000,
        Malam: 120000,
      },
      Weekend: {
        Pagi: 90000,
        Siang: 120000,
        Malam: 150000,
      },
    },
    available: true,
  },
  {
    id: 7,
    name: "Lapangan 1",
    type: "Badminton",
    image: images.Badminton,
    description: "Lapangan Badminton 1 dengan permukaan kayu",
    price: {
      Weekday: {
        Pagi: 20000,
        Siang: 25000,
        Malam: 30000,
      },
      Weekend: {
        Pagi: 25000,
        Siang: 30000,
        Malam: 35000,
      },
    },
    available: true,
  },
  {
    id: 8,
    name: "Lapangan 2",
    type: "Badminton",
    image: images.Badminton,
    description: "Lapangan Badminton 2 dengan permukaan kayu",
    price: {
      Weekday: {
        Pagi: 20000,
        Siang: 25000,
        Malam: 30000,
      },
      Weekend: {
        Pagi: 25000,
        Siang: 30000,
        Malam: 35000,
      },
    },
    available: false,
  },
  {
    id: 9,
    name: "Lapangan 3",
    type: "Badminton",
    image: images.Badminton,
    description: "Lapangan Badminton 3 dengan permukaan kayu",
    price: {
      Weekday: {
        Pagi: 20000,
        Siang: 25000,
        Malam: 30000,
      },
      Weekend: {
        Pagi: 25000,
        Siang: 30000,
        Malam: 35000,
      },
    },
    available: true,
  },
  {
    id: 10,
    name: "Lapangan 4",
    type: "Badminton",
    image: images.Badminton,
    description: "Lapangan Badminton 4 dengan permukaan kayu",
    price: {
      Weekday: {
        Pagi: 20000,
        Siang: 25000,
        Malam: 30000,
      },
      Weekend: {
        Pagi: 25000,
        Siang: 30000,
        Malam: 35000,
      },
    },
    available: true,
  },
  {
    id: 11,
    name: "Lapangan 5",
    type: "Badminton",
    image: images.Badminton,
    description: "Lapangan Badminton 5 dengan permukaan kayu",
    price: {
      Weekday: {
        Pagi: 20000,
        Siang: 25000,
        Malam: 30000,
      },
      Weekend: {
        Pagi: 25000,
        Siang: 30000,
        Malam: 35000,
      },
    },
    available: false,
  },
  {
    id: 12,
    name: "Lapangan 6",
    type: "Badminton",
    image: images.Badminton,
    description: "Lapangan Badminton 6 dengan permukaan kayu",
    price: {
      Weekday: {
        Pagi: 20000,
        Siang: 25000,
        Malam: 30000,
      },
      Weekend: {
        Pagi: 25000,
        Siang: 30000,
        Malam: 35000,
      },
    },
    available: true,
  },
  {
    id: 13,
    name: "Lapangan 7",
    type: "Badminton",
    image: images.Badminton,
    description: "Lapangan Badminton 7 dengan permukaan kayu",
    price: {
      Weekday: {
        Pagi: 20000,
        Siang: 25000,
        Malam: 30000,
      },
      Weekend: {
        Pagi: 25000,
        Siang: 30000,
        Malam: 35000,
      },
    },
    available: true,
  },
  {
    id: 14,
    name: "Lapangan 1",
    type: "Tenis Meja",
    image: images.TenisMeja,
    description: "Lapangan Tenis Meja 1 dengan permukaan kayu",
    price: {
      Weekday: {
        Pagi: 15000,
        Siang: 20000,
        Malam: 25000,
      },
      Weekend: {
        Pagi: 20000,
        Siang: 25000,
        Malam: 30000,
      },
    },
    available: true,
  },
  {
    id: 15,
    name: "Lapangan 2",
    type: "Tenis Meja",
    image: images.TenisMeja,
    description: "Lapangan Tenis Meja 2 dengan permukaan kayu",
    price: {
      Weekday: {
        Pagi: 15000,
        Siang: 20000,
        Malam: 25000,
      },
      Weekend: {
        Pagi: 20000,
        Siang: 25000,
        Malam: 30000,
      },
    },
    available: false,
  },
];
