import { PrismaClient } from "../src/app/generated/prisma/index.js";

const prisma = new PrismaClient();

async function main() {
  // Delete all existing data
  await prisma.transaction.deleteMany();
  await prisma.booking.deleteMany();
  await prisma.schedule.deleteMany();
  await prisma.courtPrice.deleteMany();
  await prisma.court.deleteMany();
  await prisma.session.deleteMany();
  await prisma.account.deleteMany();
  await prisma.user.deleteMany();

  // Seed Users
  const user = await prisma.user.create({
    data: {
      name: "Azis",
      email: "azis@gmail.com",
      password: "azis123",
      phone: "08123456789",
      role: "CUSTOMER",
    },
  });

  const cashier = await prisma.user.create({
    data: {
      name: "Cashier",
      email: "cashier@gmail.com",
      password: "cashier123",
      phone: "08123456790",
      role: "CASHIER",
    },
  });

  const owner = await prisma.user.create({
    data: {
      name: "Owner",
      email: "owner@gmail.com",
      password: "owner123",
      phone: "08123456791",
      role: "OWNER",
    },
  });

  // Seed Futsal Courts
  const futsalCourts = [
    {
      name: "Lapangan Futsal 1",
      type: "Futsal",
      surfaceType: "Rumput",
      image:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTaoIccHsK66ybmwTzSKb8itHVh1WDJcUP3jQ&s",
      description:
        "Lapangan Futsal 1 adalah lapangan futsal dengan permukaan rumput yang nyaman dan berkualitas tinggi.",
      capacity: 10,
      prices: {
        weekday: {
          pagi: 100000,
          siang: 130000,
          malam: 165000,
        },
        weekend: {
          pagi: 130000,
          siang: 160000,
          malam: 165000,
        },
      },
    },
    {
      name: "Lapangan Futsal 2",
      type: "Futsal",
      surfaceType: "Interlok",
      image:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTaoIccHsK66ybmwTzSKb8itHVh1WDJcUP3jQ&s",
      description:
        "Lapangan Futsal 2 adalah lapangan futsal dengan permukaan interlok yang nyaman dan berkualitas tinggi.",
      capacity: 10,
      prices: {
        weekday: {
          pagi: 85000,
          siang: 105000,
          malam: 145000,
        },
        weekend: {
          pagi: 95000,
          siang: 140000,
          malam: 145000,
        },
      },
    },
    {
      name: "Lapangan Futsal 3",
      type: "Futsal",
      surfaceType: "Rumput",
      image:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTaoIccHsK66ybmwTzSKb8itHVh1WDJcUP3jQ&s",
      description:
        "Lapangan Futsal 3 adalah lapangan futsal dengan permukaan rumput yang nyaman dan berkualitas tinggi.",
      capacity: 10,
      prices: {
        weekday: {
          pagi: 90000,
          siang: 115000,
          malam: 155000,
        },
        weekend: {
          pagi: 115000,
          siang: 150000,
          malam: 155000,
        },
      },
    },
    {
      name: "Lapangan Futsal 4",
      type: "Futsal",
      surfaceType: "Semen",
      image:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTaoIccHsK66ybmwTzSKb8itHVh1WDJcUP3jQ&s",
      description:
        "Lapangan Futsal 4 adalah lapangan futsal dengan permukaan semen yang nyaman dan berkualitas tinggi.",
      capacity: 10,
      prices: {
        weekday: {
          pagi: 70000,
          siang: 90000,
          malam: 120000,
        },
        weekend: {
          pagi: 85000,
          siang: 110000,
          malam: 125000,
        },
      },
    },
    {
      name: "Lapangan Futsal 5",
      type: "Futsal",
      surfaceType: "Semen",
      image:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTaoIccHsK66ybmwTzSKb8itHVh1WDJcUP3jQ&s",
      description:
        "Lapangan Futsal 5 adalah lapangan futsal dengan permukaan semen yang nyaman dan berkualitas tinggi.",
      capacity: 10,
      prices: {
        weekday: {
          pagi: 70000,
          siang: 90000,
          malam: 120000,
        },
        weekend: {
          pagi: 85000,
          siang: 110000,
          malam: 125000,
        },
      },
    },
    {
      name: "Lapangan Futsal 6",
      type: "Futsal",
      surfaceType: "Semen",
      image:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTaoIccHsK66ybmwTzSKb8itHVh1WDJcUP3jQ&s",
      description:
        "Lapangan Futsal 6 adalah lapangan futsal dengan permukaan semen yang nyaman dan berkualitas tinggi.",
      capacity: 10,
      prices: {
        weekday: {
          pagi: 70000,
          siang: 90000,
          malam: 120000,
        },
        weekend: {
          pagi: 85000,
          siang: 110000,
          malam: 125000,
        },
      },
    },
  ];

  // Fungsi untuk membuat harga lapangan
  async function createCourtPrices(court, prices) {
    return {
      create: [
        {
          dayType: "Weekday",
          timeSlot: "Pagi",
          price: prices.weekday.pagi,
        },
        {
          dayType: "Weekday",
          timeSlot: "Siang",
          price: prices.weekday.siang,
        },
        {
          dayType: "Weekday",
          timeSlot: "Malam",
          price: prices.weekday.malam,
        },
        {
          dayType: "Weekend",
          timeSlot: "Pagi",
          price: prices.weekend.pagi,
        },
        {
          dayType: "Weekend",
          timeSlot: "Siang",
          price: prices.weekend.siang,
        },
        {
          dayType: "Weekend",
          timeSlot: "Malam",
          price: prices.weekend.malam,
        },
      ],
    };
  }

  // Seed Futsal Courts
  let firstCourt; // Deklarasi variabel untuk menyimpan referensi lapangan pertama
  for (const courtData of futsalCourts) {
    const court = await prisma.court.create({
      data: {
        name: courtData.name,
        type: courtData.type,
        surfaceType: courtData.surfaceType,
        image: courtData.image,
        description: courtData.description,
        capacity: courtData.capacity,
        prices: await createCourtPrices(courtData, courtData.prices),
      },
    });
    console.log(`Created court: ${court.name}`);

    // Simpan referensi ke lapangan pertama
    if (!firstCourt) {
      firstCourt = court;
    }
  }

  // Seed Schedule menggunakan firstCourt.id
  const schedule = await prisma.schedule.create({
    data: {
      courtId: firstCourt.id, // Menggunakan ID dari lapangan pertama yang dibuat
      date: new Date("2024-03-20"),
      timeSlot: "Pagi",
      available: true,
    },
  });

  // Seed Booking menggunakan firstCourt.id
  const booking = await prisma.booking.create({
    data: {
      userId: user.id,
      courtId: firstCourt.id, // Menggunakan ID dari lapangan pertama yang dibuat
      startTime: new Date("2024-03-20T08:00:00"),
      endTime: new Date("2024-03-20T09:00:00"),
      courtType: "Futsal",
      duration: 1,
      date: new Date("2024-03-20"),
      paymentMethod: "BankTransfer",
      isConfirmed: true,
      amount: 100000,
      status: "Paid",
      rescheduleFrom: null,
      rescheduleCount: 0,
      cancelReason: null,
    },
  });

  // Seed Transaction with Midtrans fields
  const transaction = await prisma.transaction.create({
    data: {
      bookingId: booking.id,
      paymentMethod: "BankTransfer",
      transactionId: "TRX123456",
      amount: 100000,
      status: "Paid",
      midtransToken: "midtrans-token-123",
      midtransOrderId: "midtrans-order-123",
      paymentUrl: "https://app.midtrans.com/payment/123",
      expiredAt: new Date("2024-03-21T08:00:00"),
    },
  });

  // Seed Badminton Courts
  for (let i = 1; i <= 7; i++) {
    await prisma.court.create({
      data: {
        name: `Lapangan Badminton ${i}`,
        type: "Badminton",
        image:
          "https://centroflor.id/wp-content/uploads/2023/07/Karpet-Vinyl-Badminton.jpg",
        description: `Lapangan Badminton ${i} adalah lapangan badminton yang nyaman dan berkualitas tinggi.`,
        capacity: 4,
        prices: {
          create: [
            { dayType: "Weekday", timeSlot: "Pagi", price: 20000 },
            { dayType: "Weekday", timeSlot: "Siang", price: 25000 },
            { dayType: "Weekday", timeSlot: "Malam", price: 30000 },
            { dayType: "Weekend", timeSlot: "Pagi", price: 20000 },
            { dayType: "Weekend", timeSlot: "Siang", price: 25000 },
            { dayType: "Weekend", timeSlot: "Malam", price: 30000 },
          ],
        },
      },
    });
  }

  // Seed Table Tennis Courts
  for (let i = 1; i <= 2; i++) {
    await prisma.court.create({
      data: {
        name: `Lapangan Tenis Meja ${i}`,
        type: "TenisMeja",
        image:
          "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRKHRUU9ivOFc3ofK0kfEYAt2aDqOBpl1R08A&s",
        description: `Lapangan Tenis Meja ${i} adalah lapangan tenis meja yang nyaman dan berkualitas tinggi.`,
        capacity: 2,
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
      },
    });
  }

  console.log("Seeding completed successfully!");
  console.log("User:", user);
  console.log("Cashier:", cashier);
  console.log("Owner:", owner);
  console.log("Schedule:", schedule);
  console.log("Booking:", booking);
  console.log("Transaction:", transaction);
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
