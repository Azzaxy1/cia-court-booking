import { PrismaClient } from "@/app/generated/prisma";

const prisma = new PrismaClient();

async function main() {
  const CourtFutsal1 = await prisma.court.create({
    data: {
      name: "Lapangan Futsal 1",
      type: "Futsal",
      surfaceType: "Rumput",
      available: true,
      prices: {
        create: [
          {
            dayType: "Weekday",
            timeSlot: "Pagi",
            price: 100000,
          },
          {
            dayType: "Weekday",
            timeSlot: "Siang",
            price: 130000,
          },
          {
            dayType: "Weekday",
            timeSlot: "Malam",
            price: 165000,
          },
          {
            dayType: "Weekend",
            timeSlot: "Pagi",
            price: 130000,
          },
          {
            dayType: "Weekend",
            timeSlot: "Siang",
            price: 160000,
          },
          {
            dayType: "Weekend",
            timeSlot: "Malam",
            price: 165000,
          },
        ],
      },
      description:
        "Lapangan Futsal 1 adalah lapangan futsal dengan permukaan interlok yang nyaman dan berkualitas tinggi. Cocok untuk pertandingan futsal yang seru.",
      capacity: 10,
      image:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTaoIccHsK66ybmwTzSKb8itHVh1WDJcUP3jQ&s",
    },
  });

  const CourtFutsal2 = await prisma.court.create({
    data: {
      name: "Lapangan Futsal 2",
      type: "Futsal",
      surfaceType: "Interlok",
      available: true,
      prices: {
        create: [
          {
            dayType: "Weekday",
            timeSlot: "Pagi",
            price: 85000,
          },
          {
            dayType: "Weekday",
            timeSlot: "Siang",
            price: 105000,
          },
          {
            dayType: "Weekday",
            timeSlot: "Malam",
            price: 145000,
          },
          {
            dayType: "Weekend",
            timeSlot: "Pagi",
            price: 95000,
          },
          {
            dayType: "Weekend",
            timeSlot: "Siang",
            price: 140000,
          },
          {
            dayType: "Weekend",
            timeSlot: "Malam",
            price: 145000,
          },
        ],
      },
      description:
        "Lapangan Futsal 2 adalah lapangan futsal dengan permukaan interlok yang nyaman dan berkualitas tinggi. Cocok untuk pertandingan futsal yang seru.",
      capacity: 10,
      image:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTaoIccHsK66ybmwTzSKb8itHVh1WDJcUP3jQ&s",
    },
  });

  const CourtFutsal3 = await prisma.court.create({
    data: {
      name: "Lapangan Futsal 3",
      type: "Futsal",
      surfaceType: "Rumput",
      available: true,
      prices: {
        create: [
          {
            dayType: "Weekday",
            timeSlot: "Pagi",
            price: 90000,
          },
          {
            dayType: "Weekday",
            timeSlot: "Siang",
            price: 115000,
          },
          {
            dayType: "Weekday",
            timeSlot: "Malam",
            price: 155000,
          },
          {
            dayType: "Weekend",
            timeSlot: "Pagi",
            price: 115000,
          },
          {
            dayType: "Weekend",
            timeSlot: "Siang",
            price: 150000,
          },
          {
            dayType: "Weekend",
            timeSlot: "Malam",
            price: 155000,
          },
        ],
      },
      description:
        "Lapangan Futsal 3 adalah lapangan futsal dengan permukaan rumput yang nyaman dan berkualitas tinggi. Cocok untuk pertandingan futsal yang seru.",
      capacity: 10,
      image:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTaoIccHsK66ybmwTzSKb8itHVh1WDJcUP3jQ&s",
    },
  });

  const CourtFutsal4 = await prisma.court.create({
    data: {
      name: "Lapangan Futsal 4",
      type: "Futsal",
      surfaceType: "Semen",
      available: true,
      prices: {
        create: [
          {
            dayType: "Weekday",
            timeSlot: "Pagi",
            price: 70000,
          },
          {
            dayType: "Weekday",
            timeSlot: "Siang",
            price: 90000,
          },
          {
            dayType: "Weekday",
            timeSlot: "Malam",
            price: 120000,
          },
          {
            dayType: "Weekend",
            timeSlot: "Pagi",
            price: 85000,
          },
          {
            dayType: "Weekend",
            timeSlot: "Siang",
            price: 110000,
          },
          {
            dayType: "Weekend",
            timeSlot: "Malam",
            price: 125000,
          },
        ],
      },
      description:
        "Lapangan Futsal 4 adalah lapangan futsal dengan permukaan semen yang nyaman dan berkualitas tinggi. Cocok untuk pertandingan futsal yang seru.",
      capacity: 10,
      image:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTaoIccHsK66ybmwTzSKb8itHVh1WDJcUP3jQ&s",
    },
  });

  const CourtFutsal5 = await prisma.court.create({
    data: {
      name: "Lapangan Futsal 5",
      type: "Futsal",
      surfaceType: "Semen",
      available: true,
      prices: {
        create: [
          {
            dayType: "Weekday",
            timeSlot: "Pagi",
            price: 70000,
          },
          {
            dayType: "Weekday",
            timeSlot: "Siang",
            price: 90000,
          },
          {
            dayType: "Weekday",
            timeSlot: "Malam",
            price: 120000,
          },
          {
            dayType: "Weekend",
            timeSlot: "Pagi",
            price: 85000,
          },
          {
            dayType: "Weekend",
            timeSlot: "Siang",
            price: 110000,
          },
          {
            dayType: "Weekend",
            timeSlot: "Malam",
            price: 125000,
          },
        ],
      },
      description:
        "Lapangan Futsal 5 adalah lapangan futsal dengan permukaan semen yang nyaman dan berkualitas tinggi. Cocok untuk pertandingan futsal yang seru.",
      capacity: 10,
      image:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTaoIccHsK66ybmwTzSKb8itHVh1WDJcUP3jQ&s",
    },
  });

  const CourtFutsal6 = await prisma.court.create({
    data: {
      name: "Lapangan Futsal 6",
      type: "Futsal",
      surfaceType: "Semen",
      available: true,
      prices: {
        create: [
          {
            dayType: "Weekday",
            timeSlot: "Pagi",
            price: 70000,
          },
          {
            dayType: "Weekday",
            timeSlot: "Siang",
            price: 90000,
          },
          {
            dayType: "Weekday",
            timeSlot: "Malam",
            price: 120000,
          },
          {
            dayType: "Weekend",
            timeSlot: "Pagi",
            price: 85000,
          },
          {
            dayType: "Weekend",
            timeSlot: "Siang",
            price: 110000,
          },
          {
            dayType: "Weekend",
            timeSlot: "Malam",
            price: 125000,
          },
        ],
      },
      description:
        "Lapangan Futsal 6 adalah lapangan futsal dengan permukaan semen yang nyaman dan berkualitas tinggi. Cocok untuk pertandingan futsal yang seru.",
      capacity: 10,
      image:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTaoIccHsK66ybmwTzSKb8itHVh1WDJcUP3jQ&s",
    },
  });

  // Seed data for Badminton courts
  for (let i = 1; i <= 7; i++) {
    await prisma.court.create({
      data: {
        name: `Lapangan Badminton ${i}`,
        type: "Badminton",
        available: true,
        prices: {
          create: [
            { dayType: "Weekday", timeSlot: "Pagi", price: 50000 + i * 2000 },
            { dayType: "Weekday", timeSlot: "Siang", price: 70000 + i * 2000 },
            { dayType: "Weekday", timeSlot: "Malam", price: 90000 + i * 2000 },
            { dayType: "Weekend", timeSlot: "Pagi", price: 60000 + i * 2000 },
            { dayType: "Weekend", timeSlot: "Siang", price: 80000 + i * 2000 },
            { dayType: "Weekend", timeSlot: "Malam", price: 100000 + i * 2000 },
          ],
        },
        description: `Lapangan Badminton ${i} adalah lapangan badminton yang nyaman dan berkualitas tinggi. Cocok untuk pertandingan badminton yang seru.`,
        capacity: 4,
        image:
          "https://centroflor.id/wp-content/uploads/2023/07/Karpet-Vinyl-Badminton.jpg",
      },
    });
  }

  // Seed data for Table Tennis courts
  for (let i = 1; i <= 2; i++) {
    await prisma.court.create({
      data: {
        name: `Lapangan Tenis Meja ${i}`,
        type: "TenisMeja",
        available: true,
        prices: {
          create: [
            { dayType: "Weekday", timeSlot: "Pagi", price: 15000 },
            { dayType: "Weekday", timeSlot: "Siang", price: 20000 },
            { dayType: "Weekday", timeSlot: "Malam", price: 25000 },
            { dayType: "Weekend", timeSlot: "Pagi", price: 15000 },
            { dayType: "Weekend", timeSlot: "Siang", price: 20000 },
            { dayType: "Weekend", timeSlot: "Malam", price: 25000 },
          ],
        },
        description: `Lapangan Tenis Meja ${i} adalah lapangan tenis meja yang nyaman dan berkualitas tinggi. Cocok untuk pertandingan tenis meja yang seru.`,
        capacity: 2,
        image:
          "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRKHRUU9ivOFc3ofK0kfEYAt2aDqOBpl1R08A&s",
      },
    });
  }

  console.log("Seeding completed successfully!");
  console.log(
    "Futsal Courts: ",
    CourtFutsal1,
    CourtFutsal2,
    CourtFutsal3,
    CourtFutsal4,
    CourtFutsal5,
    CourtFutsal6
  );
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
